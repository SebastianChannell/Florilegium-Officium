# Automatic Divinum Officium updates

The `Update Divinum Officium backend` workflow checks the official `master` image every day at 12:17 a.m. and 12:17 p.m. Eastern time. It deploys the image to a zero-traffic Cloud Run candidate, tests all four supported rubrics, and promotes the candidate only after the tests pass.

Google Cloud Run pins a deployed tag to a specific image digest. Merely using the `master` tag does not keep an existing revision current, so a new deployment must be requested whenever upstream changes.

## One-time Google Cloud authorization

The workflow uses short-lived GitHub OIDC credentials through Workload Identity Federation. It does not require a downloadable service-account key.

Open Google Cloud Shell in the project that owns the existing `divinum-officium` service. Replace `YOUR_PROJECT_ID` below with the project ID shown in the Google Cloud project selector, then run the commands once.

```bash
export PROJECT_ID="YOUR_PROJECT_ID"
export PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
export UPDATER_ACCOUNT="do-updater@$PROJECT_ID.iam.gserviceaccount.com"

gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com iamcredentials.googleapis.com

export RUNTIME_ACCOUNT="$(gcloud run services describe divinum-officium \
  --region=us-east1 \
  --format='value(spec.template.spec.serviceAccountName)')"
if [ -z "$RUNTIME_ACCOUNT" ]; then
  export RUNTIME_ACCOUNT="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
fi

gcloud iam service-accounts create do-updater \
  --display-name="Divinum Officium updater"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$UPDATER_ACCOUNT" \
  --role="roles/run.developer"

gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_ACCOUNT" \
  --member="serviceAccount:$UPDATER_ACCOUNT" \
  --role="roles/iam.serviceAccountUser"

gcloud iam workload-identity-pools create florilegium-github \
  --location="global" \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc florilegium-officium \
  --location="global" \
  --workload-identity-pool="florilegium-github" \
  --display-name="Florilegium Officium" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.repository_owner_id=assertion.repository_owner_id" \
  --attribute-condition="assertion.repository_owner_id == '296364913' && assertion.repository == 'SebastianChannell/Florilegium-Officium'"

gcloud iam service-accounts add-iam-policy-binding "$UPDATER_ACCOUNT" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/florilegium-github/attribute.repository/SebastianChannell/Florilegium-Officium"
```

## GitHub repository variables

In **Florilegium-Officium → Settings → Secrets and variables → Actions → Variables**, create:

| Variable | Value |
|---|---|
| `GCP_PROJECT_ID` | The Google Cloud project ID used above |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/florilegium-github/providers/florilegium-officium` |
| `GCP_SERVICE_ACCOUNT` | `do-updater@PROJECT_ID.iam.gserviceaccount.com` |

After saving the variables, open **Actions → Update Divinum Officium backend → Run workflow**. A successful run confirms that automatic daily updates are active.

## Failure behavior

- Candidate tests fail: production remains on the last verified revision.
- Authentication or deployment fails: the workflow is marked failed and production is unchanged.
- Upstream already matches production: Cloud Run can reuse the existing image digest without disturbing the public URL.
