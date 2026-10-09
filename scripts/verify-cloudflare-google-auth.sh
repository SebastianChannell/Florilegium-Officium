#!/usr/bin/env bash
# Diagnostic only: does not modify Cloud Run, IAM, Cloudflare, or the website.
set -euo pipefail
umask 077
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"; unset CF_ID CF_SECRET CF_ASSERTION STS_TOKEN ID_TOKEN' EXIT

echo "Testing Cloudflare Access -> Google STS -> Cloud Run (no settings will change)."
read -r -p "Cloudflare Service Token Client ID: " CF_ID
read -r -s -p "Cloudflare Service Token Client Secret (hidden): " CF_SECRET
echo

url="https://officium.sacrumflorilegium.com/api/_google-identity"
status=$(curl --silent --show-error --max-time 30 -D "$tmp/access.headers" -o "$tmp/access.body" -w '%{http_code}' \
  -H "CF-Access-Client-Id: $CF_ID" \
  -H "CF-Access-Client-Secret: $CF_SECRET" "$url") || { echo "FAIL: Cloudflare Access endpoint request failed."; exit 1; }
if [ "$status" != "204" ]; then
  echo "FAIL: Cloudflare Access identity endpoint returned HTTP $status (expected 204)."
  echo "Verify the exact Access app path, Service Auth policy, and Production deployment."
  exit 1
fi

CF_ASSERTION=$(awk 'BEGIN{IGNORECASE=1} tolower($0) ~ /^x-officium-access-assertion:/ { sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit }' "$tmp/access.headers")
if [ -z "$CF_ASSERTION" ]; then
  echo "FAIL: Access route returned 204 but no signed assertion header."
  echo "Check that Access injects Cf-Access-Jwt-Assertion into the protected Pages Function."
  exit 1
fi
echo "PASS: Cloudflare Access returned a signed assertion."

AUDIENCE="//iam.googleapis.com/projects/833566975684/locations/global/workloadIdentityPools/officium-cloudflare/providers/cloudflare-access"
status=$(curl --silent --show-error --max-time 30 -o "$tmp/sts.json" -w '%{http_code}' \
  -X POST "https://sts.googleapis.com/v1/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "audience=$AUDIENCE" \
  --data-urlencode 'grant_type=urn:ietf:params:oauth:grant-type:token-exchange' \
  --data-urlencode 'requested_token_type=urn:ietf:params:oauth:token-type:access_token' \
  --data-urlencode 'subject_token_type=urn:ietf:params:oauth:token-type:jwt' \
  --data-urlencode "subject_token=$CF_ASSERTION" \
  --data-urlencode 'scope=https://www.googleapis.com/auth/cloud-platform') || { echo "FAIL: Google STS request failed."; exit 1; }
if [ "$status" != "200" ]; then
  echo "FAIL: Google STS returned HTTP $status."
  jq -r '.error_description // .error.message // .error // "Unknown rejection"' "$tmp/sts.json" 2>/dev/null | head -c 600 || true
  echo
  exit 1
fi
STS_TOKEN=$(jq -r '.access_token // empty' "$tmp/sts.json")
if [ -z "$STS_TOKEN" ]; then echo "FAIL: STS returned no access token."; exit 1; fi
echo "PASS: Google STS accepted the Cloudflare assertion."

SA="officium-proxy@divinum-officium-506200.iam.gserviceaccount.com"
ORIGIN="https://divinum-officium-833566975684.us-east1.run.app"
status=$(curl --silent --show-error --max-time 30 -o "$tmp/identity.json" -w '%{http_code}' \
  -X POST "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/$SA:generateIdToken" \
  -H "Authorization: Bearer $STS_TOKEN" -H "Content-Type: application/json" \
  -d "{\"audience\":\"$ORIGIN\",\"includeEmail\":true}") || { echo "FAIL: Google IAM Credentials request failed."; exit 1; }
if [ "$status" != "200" ]; then
  echo "FAIL: generateIdToken returned HTTP $status."
  jq -r '.error.message // "Unknown rejection"' "$tmp/identity.json" 2>/dev/null | head -c 600 || true
  echo
  exit 1
fi
ID_TOKEN=$(jq -r '.token // empty' "$tmp/identity.json")
if [ -z "$ID_TOKEN" ]; then echo "FAIL: Google returned no Cloud Run ID token."; exit 1; fi
echo "PASS: Google generated an ID token."

status=$(curl --silent --show-error --max-time 40 -o "$tmp/office.html" -w '%{http_code}' \
  -H "X-Serverless-Authorization: Bearer $ID_TOKEN" -G "$ORIGIN/cgi-bin/horas/Pofficium.pl" \
  --data-urlencode 'command=prayLaudes' \
  --data-urlencode 'date1=10-8-2026' \
  --data-urlencode 'version=Divino Afflatu - 1954' \
  --data-urlencode 'lang1=Latin' --data-urlencode 'lang2=English' \
  --data-urlencode 'votive=Hodie' --data-urlencode 'dioecesis=Generale' \
  --data-urlencode 'testmode=regular' --data-urlencode 'content=1') || { echo "FAIL: Cloud Run connection failed."; exit 1; }
if [ "$status" != "200" ]; then echo "FAIL: Cloud Run returned HTTP $status."; exit 1; fi
if ! grep -qi 'Laudes' "$tmp/office.html"; then
  echo "FAIL: Cloud Run returned HTTP 200 but the expected Office text was not found."; exit 1
fi
echo "PASS: Authenticated Cloud Run returned Lauds."
echo "SUCCESS: The entire keyless chain works. Cloud Run public access has NOT been changed."
