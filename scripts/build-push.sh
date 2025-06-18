#!/bin/bash

set -e

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found. Aborting."
  exit 1
fi

# Check mandatory environment variables
if [ -z "$IMAGE_BACKEND" ] || [ -z "$IMAGE_FRONTEND" ]; then
  echo "❌ IMAGE_BACKEND or IMAGE_FRONTEND not set in .env"
  exit 1
fi

# Generate build tag (unique timestamp)
TAG=$(date +"%Y%m%d%H%M")
echo "${TAG}" > .current_build_tag
echo "🚀 Generated build tag: ${TAG}"

# --- Build Backend ---
echo "🔨 Building backend Docker image..."
docker build -t ${IMAGE_BACKEND}:${TAG} -f Dockerfile .

# --- Build Frontend ---
echo "🔨 Building frontend Docker image..."
cd frontend
docker build -t ${IMAGE_FRONTEND}:${TAG} .
cd ..

# --- Push Docker Images ---
echo "📤 Pushing backend image..."
docker push ${IMAGE_BACKEND}:${TAG}

echo "📤 Pushing frontend image..."
docker push ${IMAGE_FRONTEND}:${TAG}

echo "✅ Build & push completed successfully for tag ${TAG}"




