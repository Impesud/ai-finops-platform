#!/bin/bash

set -e

# Load environment variables from .env file
if [[ -f .env ]]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found! Please create it first."
  exit 1
fi

echo "📡 Associating IAM OIDC provider..."
eksctl utils associate-iam-oidc-provider \
  --region "$REGION" \
  --cluster "$CLUSTER_NAME" \
  --approve

echo "📄 Downloading IAM policy JSON..."
curl -s -o iam-policy.json "$IAM_POLICY_URL"

echo "🔐 Creating IAM policy if not existing..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"

if aws iam get-policy --policy-arn "$POLICY_ARN" &> /dev/null; then
  echo "✅ IAM Policy $POLICY_NAME already exists."
else
  aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document file://iam-policy.json
  echo "✅ IAM Policy $POLICY_NAME created."
fi

echo "🔗 Creating IAM Service Account for AWS Load Balancer Controller..."
eksctl create iamserviceaccount \
  --cluster "$CLUSTER_NAME" \
  --region "$REGION" \
  --namespace kube-system \
  --name "$SA_NAME" \
  --attach-policy-arn "$POLICY_ARN" \
  --approve \
  --override-existing-serviceaccounts

echo "🎯 Adding Helm repository..."
helm repo add eks https://aws.github.io/eks-charts
helm repo update

echo "🌐 Retrieving VPC ID..."
VPC_ID=$(aws eks describe-cluster \
  --name "$CLUSTER_NAME" \
  --region "$REGION" \
  --query "cluster.resourcesVpcConfig.vpcId" \
  --output text)

echo "🚀 Installing AWS Load Balancer Controller via Helm..."
helm upgrade --install "$SA_NAME" eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName="$CLUSTER_NAME" \
  --set region="$REGION" \
  --set vpcId="$VPC_ID" \
  --set serviceAccount.create=false \
  --set serviceAccount.name="$SA_NAME" \
  --set image.repository=602401143452.dkr.ecr.${REGION}.amazonaws.com/amazon/aws-load-balancer-controller

echo "✅ AWS Load Balancer Controller installation complete!"

