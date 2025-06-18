#!/bin/bash

set -e

# Load environment variables from .env file
if [[ -f .env ]]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found! Please create it first."
  exit 1
fi

echo "⚠️ WARNING: This will delete ALL workloads (Deployments, Services, Ingresses, ConfigMaps, Secrets, StatefulSets, PVCs) in namespace '${NAMESPACE}' before redeployment."

read -p "Type 'yes' to confirm and proceed: " CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
  echo "❌ Operation cancelled by user."
  exit 1
fi

echo "🧹 Cleaning Kubernetes resources in namespace '${NAMESPACE}'..."

kubectl delete deployment --all -n ${NAMESPACE} --ignore-not-found
kubectl delete svc --all -n ${NAMESPACE} --ignore-not-found
kubectl delete ingress --all -n ${NAMESPACE} --ignore-not-found
kubectl delete configmap --all -n ${NAMESPACE} --ignore-not-found
kubectl delete secret --all -n ${NAMESPACE} --ignore-not-found
kubectl delete statefulset --all -n ${NAMESPACE} --ignore-not-found
kubectl delete pvc --all -n ${NAMESPACE} --ignore-not-found

echo "✅ Cluster cleaned successfully."

echo "🚀 Starting full deployment pipeline..."

chmod +x ./scripts/build-push.sh && ./scripts/build-push.sh
chmod +x ./scripts/deploy-helm.sh && ./scripts/deploy-helm.sh
chmod +x ./scripts/get-url.sh && ./scripts/get-url.sh

echo "🎉 Safe deployment completed successfully!"




