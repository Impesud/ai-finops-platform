#!/bin/bash

set -e

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found. Aborting."
  exit 1
fi

# Check mandatory variables
if [ -z "$CLUSTER_NAME" ] || [ -z "$REGION" ] || [ -z "$RELEASE_NAME" ] || [ -z "$POLICY_NAME" ]; then
  echo "❌ Missing environment variables in .env"
  exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)

# Read latest build tag
if [[ ! -f .current_build_tag ]]; then
  echo "❌ Build tag file (.current_build_tag) not found. Please run build-push.sh first."
  exit 1
fi
TAG=$(cat .current_build_tag)
echo "📦 Deploying version with tag: ${TAG}"

# --- Check prerequisites ---
check_prerequisites() {
  echo "🔎 Checking prerequisites..."
  for cmd in aws kubectl eksctl helm; do
    if ! command -v $cmd &> /dev/null; then
      echo "❌ $cmd is not installed"
      exit 1
    fi
  done
  echo "✅ All prerequisites are installed"
}

# --- Create EKS cluster if needed ---
create_eks_cluster() {
  if eksctl get cluster --region $REGION --name $CLUSTER_NAME &> /dev/null; then
    echo "✅ EKS cluster $CLUSTER_NAME already exists."
  else
    echo "🚀 Creating EKS cluster..."
    eksctl create cluster --name "$CLUSTER_NAME" --region "$REGION" --nodes 2
  fi
}

# --- Create LB Controller IAM Policy ---
create_lb_policy() {
  echo "🔐 Ensuring LB IAM Policy exists..."
  if aws iam get-policy --policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/$POLICY_NAME &> /dev/null; then
    echo "✅ IAM policy $POLICY_NAME already exists."
  else
    curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
    aws iam create-policy \
      --policy-name "$POLICY_NAME" \
      --policy-document file://iam-policy.json
  fi
}

# --- Create IAM Service Account for LB Controller ---
create_iam_service_account() {
  echo "🔐 Creating IAM Service Account..."
  eksctl create iamserviceaccount \
    --region "$REGION" \
    --name aws-load-balancer-controller \
    --namespace kube-system \
    --cluster "$CLUSTER_NAME" \
    --attach-policy-arn arn:aws:iam::$AWS_ACCOUNT_ID:policy/$POLICY_NAME \
    --override-existing-serviceaccounts \
    --approve
}

# --- Install AWS LB Controller ---
install_lb_controller() {
  echo "📦 Installing AWS Load Balancer Controller..."
  helm repo add eks https://aws.github.io/eks-charts
  helm repo update

  VPC_ID=$(aws eks describe-cluster --name "$CLUSTER_NAME" --region "$REGION" --query "cluster.resourcesVpcConfig.vpcId" --output text)

  helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \
    -n kube-system \
    --set clusterName="$CLUSTER_NAME" \
    --set region="$REGION" \
    --set vpcId="$VPC_ID" \
    --set serviceAccount.create=false \
    --set serviceAccount.name=aws-load-balancer-controller
}

# --- Deploy Helm chart ---
deploy_helm() {
  echo "🚀 Deploying Helm chart with tag: $TAG"
  helm upgrade --install "$RELEASE_NAME" "$CHART_PATH" \
    --set image.tag="$TAG" \
    --set frontendImage.tag="$TAG"
}

# --- Retrieve ALB Ingress URL ---
get_alb_url() {
  echo "🌐 Waiting for ALB URL..."
  sleep 10
  ALB_URL=$(kubectl get ingress ai-finops-ingress -o jsonpath="{.status.loadBalancer.ingress[0].hostname}" 2>/dev/null || echo "")
  if [[ -z "$ALB_URL" ]]; then
    echo "⚠️ ALB Ingress not ready yet."
  else
    echo "🌍 Application accessible at: http://$ALB_URL"
  fi
}

# --- Execute full deployment ---
full_deploy() {
  check_prerequisites
  create_eks_cluster
  create_lb_policy
  create_iam_service_account
  install_lb_controller
  deploy_helm
  get_alb_url
  echo "✅ Deployment fully completed!"
}

full_deploy

