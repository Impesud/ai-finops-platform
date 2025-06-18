#!/bin/bash

set -e

# Load environment variables from .env file
if [[ -f .env ]]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found! Please create it first."
  exit 1
fi

echo "⚠️ WARNING: This will delete ALL resources (Deployments, Services, Ingresses, ConfigMaps, Secrets, PVCs) in namespace '${NAMESPACE}'!"

read -p "Type 'yes' to confirm: " CONFIRM

if [[ "$CONFIRM" != "yes" ]]; then
  echo "❌ Aborted by user."
  exit 1
fi

echo "🔄 Deleting all Deployments in namespace '${NAMESPACE}'..."
kubectl delete deployment --all -n ${NAMESPACE} --ignore-not-found

echo "🔄 Deleting all Services in namespace '${NAMESPACE}'..."
kubectl delete svc --all -n ${NAMESPACE} --ignore-not-found

echo "🔄 Deleting all Ingresses in namespace '${NAMESPACE}'..."
kubectl delete ingress --all -n ${NAMESPACE} --ignore-not-found

echo "🔄 Deleting all ConfigMaps in namespace '${NAMESPACE}'..."
kubectl delete configmap --all -n ${NAMESPACE} --ignore-not-found

echo "🔄 Deleting all Secrets in namespace '${NAMESPACE}'..."
kubectl delete secret --all -n ${NAMESPACE} --ignore-not-found

echo "🔄 Deleting all PersistentVolumeClaims in namespace '${NAMESPACE}'..."
kubectl delete pvc --all -n ${NAMESPACE} --ignore-not-found

echo "✅ Kubernetes namespace '${NAMESPACE}' fully cleaned."



