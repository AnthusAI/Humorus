#!/usr/bin/env bash
# Scans the commits in a range with LeftBlock's shipped gitleaks ruleset
# (secrets, AWS account and resource IDs, personal email addresses, home
# paths). Needs gitleaks and the leftblock Python package on PATH.
# Usage: secret-scan.sh <base-sha> <head-sha>
# A base of all zeros (a new branch) or an unknown commit scans the head commit only.
set -euo pipefail

base="${1:?base sha}"
head="${2:?head sha}"

config="$(python3 -c 'import importlib.resources as r; print(r.files("leftblock") / "data" / "gitleaks.toml")')"

if [[ "$base" =~ ^0+$ ]] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  range="-1 ${head}"
else
  range="${base}..${head}"
fi

echo "gitleaks ruleset: LeftBlock $(python3 -c 'import importlib.metadata as m; print(m.version("leftblock"))')"
echo "scanning: git log ${range}"
gitleaks git --config "$config" --log-opts "$range" --redact --no-banner --verbose .
