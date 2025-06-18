#!/bin/bash

set -e

echo "📦 Fetching latest stable version of kubectl..."

KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt)

if [ -z "$KUBECTL_VERSION" ]; then
  echo "❌ Failed to fetch kubectl version."
  exit 1
fi

echo "👉 Latest version: $KUBECTL_VERSION"

echo "⬇️ Downloading kubectl binary..."
curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl"

echo "🔐 Making it executable..."
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

echo "✅ kubectl installed:"
kubectl version --client

# Optional: check for autocompletion already configured
if ! grep -q "kubectl completion" ~/.bashrc; then
  echo "⚙️ Setting up bash autocompletion and alias..."
  {
    echo 'source <(kubectl completion bash)'
    echo 'alias k=kubectl'
    echo 'complete -F __start_kubectl k'
  } >> ~/.bashrc
  source ~/.bashrc
else
  echo "ℹ️ Bash autocompletion already configured."
fi

echo "🎉 kubectl installation completed successfully!"



