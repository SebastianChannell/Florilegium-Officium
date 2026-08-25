#!/usr/bin/env bash
set -euo pipefail

base_url="${DO_BASE_URL:-${1:-}}"
if [ -z "$base_url" ]; then
  echo "Set DO_BASE_URL or pass the Divinum Officium base URL as the first argument." >&2
  exit 1
fi
base_url="${base_url%/}"

work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

fetch_office() {
  local version="$1"
  local hour="$2"
  local date="$3"
  local output="$4"

  curl --fail --silent --show-error \
    --retry 5 --retry-delay 2 --retry-all-errors \
    --get "$base_url/cgi-bin/horas/Pofficium.pl" \
    --data-urlencode "command=pray${hour}" \
    --data-urlencode "date1=$date" \
    --data-urlencode "version=$version" \
    --data-urlencode "lang1=Latin" \
    --data-urlencode "lang2=English" \
    --data-urlencode "votive=Hodie" \
    --data-urlencode "dioecesis=Generale" \
    --data-urlencode "testmode=regular" \
    --data-urlencode "content=1" \
    --output "$output"

  if grep -Eiq 'Software error|Internal Server Error|Cannot resolve too deeply|versus missing|Ant [123] missing' "$output"; then
    echo "Divinum Officium reported an error for $version / $hour / $date." >&2
    exit 1
  fi

  case "$hour" in
    Laudes) marker="ID='Laudes1'" ;;
    Vesperae) marker="ID='Vespera1'" ;;
    Matutinum) marker="ID='Matutinum1'" ;;
    *) marker="ID='${hour}1'" ;;
  esac

  if ! grep -Fq "$marker" "$output"; then
    echo "Missing $hour content for $version / $date." >&2
    exit 1
  fi
}

versions=(
  "Divino Afflatu - 1939"
  "Divino Afflatu - 1954"
  "Reduced - 1955"
  "Rubrics 1960 - 1960"
)

for version in "${versions[@]}"; do
  slug="$(printf '%s' "$version" | tr '[:upper:] ' '[:lower:]-' | tr -cd '[:alnum:]-')"
  fetch_office "$version" "Laudes" "8-25-2026" "$work_dir/${slug}-laudes.html"
  fetch_office "$version" "Vesperae" "8-25-2026" "$work_dir/${slug}-vespers.html"
done

zephyrinus="$work_dir/divino-afflatu---1954-vespers.html"
if ! grep -Fq 'regem tuum, Pastor ætérne' "$zephyrinus"; then
  echo "Regression: the Latin St. Zephyrinus commemoration prayers are missing." >&2
  exit 1
fi
if ! grep -Fq 'ook forgivingly on thy flock, Eternal Shepherd' "$zephyrinus"; then
  echo "Regression: the English St. Zephyrinus commemoration prayers are missing." >&2
  exit 1
fi
if ! grep -Fq 'Suffragium' "$zephyrinus" || ! grep -Fq 'cunctis nos' "$zephyrinus"; then
  echo "Regression: the suffrage is missing after the Simplex commemoration." >&2
  exit 1
fi
if grep -Fq 'Suffragium{omittitur}' "$zephyrinus"; then
  echo "Regression: the suffrage is incorrectly omitted." >&2
  exit 1
fi

echo "Divinum Officium smoke tests passed for $base_url"
