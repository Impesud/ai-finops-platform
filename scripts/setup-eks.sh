#!/bin/bash

set -e

# Load environment variables from .env file
if [[ -f .env ]]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found! Please create it first."
  exit 1
fi

echo "🔧 Checking and installing eksctl..."
if ! command -v eksctl &> /dev/null; then
  curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
  sudo mv /tmp/eksctl /usr/local/bin
  echo "✅ eksctl installed."
else
  echo "✅ eksctl already installed: $(eksctl version)"
fi

echo "📦 Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
  echo "🔧 Installing AWS CLI..."
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip -q awscliv2.zip
  sudo ./aws/install
  echo "✅ AWS CLI installed."
else
  echo "✅ AWS CLI already installed: $(aws --version)"
fi

echo "⚙️ Validating AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ AWS credentials not configured. Please run: aws configure"
  exit 1
fi

echo "🔍 Checking if EKS cluster '$CLUSTER_NAME' already exists..."
if eksctl get cluster --region "$REGION" --name "$CLUSTER_NAME" &> /dev/null; then
  echo "✅ Cluster '$CLUSTER_NAME' already exists. Skipping creation."
else
  echo "🚀 Creating EKS cluster: $CLUSTER_NAME in region $REGION..."
  eksctl create cluster --name "$CLUSTER_NAME" --region "$REGION" --nodes "$NODE_COUNT" --node-type "$NODE_TYPE"
  echo "✅ Cluster '$CLUSTER_NAME' created successfully."
fi

echo "📄 Updating local kubeconfig..."
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION"

echo "🎉 EKS setup complete! Kubernetes context is ready."


