#!/bin/bash

set -e

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found. Aborting."
  exit 1
fi

# Check required variables
if [ -z "$RELEASE_NAME" ] || [ -z "$CHART_PATH" ]; then
  echo "❌ Missing RELEASE_NAME or CHART_PATH in .env"
  exit 1
fi

# Retrieve build tag
if [[ ! -f .current_build_tag ]]; then
  echo "❌ Build tag file (.current_build_tag) not found. Please run build-push.sh first."
  exit 1
fi

PROD_TAG=$(cat .current_build_tag)
echo "🚀 Deploying AI FinOps Platform Helm Chart with image tag: ${PROD_TAG}"

# Helm deploy
helm upgrade --install "${RELEASE_NAME}" "${CHART_PATH}" \
  --set image.tag="${PROD_TAG}" \
  --set frontendImage.tag="${PROD_TAG}"

echo "✅ Helm deployment completed successfully for release '${RELEASE_NAME}' with tag '${PROD_TAG}'"



