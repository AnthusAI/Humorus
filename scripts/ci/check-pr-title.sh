#!/usr/bin/env bash
# Fails unless the title is a Conventional Commit: type(scope)!: subject.
# Usage: check-pr-title.sh "<title>"
set -euo pipefail

title="${1:-}"
types="feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert"
pattern="^(${types})(\\([a-z0-9._/-]+\\))?!?: [^ ].*$"

if [[ "$title" =~ $pattern ]]; then
  echo "ok: $title"
else
  echo "error: the title must look like 'feat: add a thing' or 'fix(scope): repair a thing'." >&2
  echo "allowed types: ${types//|/, }" >&2
  echo "got: $title" >&2
  exit 1
fi
