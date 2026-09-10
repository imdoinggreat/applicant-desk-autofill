#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")" && pwd)"
dist_dir="$root_dir/dist"
version="$(node -p "require('$root_dir/extension/manifest.json').version")"

rm -rf "$dist_dir"
mkdir -p "$dist_dir"
(
  cd "$root_dir"
  zip -qr "$dist_dir/applicant-desk-autofill-$version.zip" extension
)
unzip -tq "$dist_dir/applicant-desk-autofill-$version.zip"
printf 'Created %s\n' "$dist_dir/applicant-desk-autofill-$version.zip"
