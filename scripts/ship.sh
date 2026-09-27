#!/bin/sh
# Build, commit everything, push. Usage: npm run ship -- "commit message"
set -e
msg="${1:-Update site}"
npm run build
git add -A
git commit -m "$msg"
git push
