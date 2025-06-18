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
if [ -z "$CLUSTER_NAME" ] || [ -z "$REGION" ]; then
  echo "❌ Missing CLUSTER_NAME or REGION in .env"
  exit 1
fi

echo "⚠️ WARNING: This will permanently delete the entire EKS cluster: ${CLUSTER_NAME} in region ${REGION}!"
read -p "Type 'yes' to confirm destruction: " CONFIRM

if [ "$CONFIRM" == "yes" ]; then
  echo "🔥 Destroying EKS cluster..."
  eksctl delete cluster --name "${CLUSTER_NAME}" --region "${REGION}"
  echo "✅ EKS cluster '${CLUSTER_NAME}' successfully destroyed."
else
  echo "❌ Operation cancelled."
fi

