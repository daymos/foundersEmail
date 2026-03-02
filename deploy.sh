#!/bin/bash

# Email Dashboard Deployment Script
# Builds and deploys to Google Cloud Run

set -e

PROJECT_ID="emailer-prod-b48590"
REGION="us-central1"
SERVICE_NAME="emailer"
IMAGE_NAME="us-central1-docker.pkg.dev/${PROJECT_ID}/emailer-repo/emailer:latest"

echo "🏗️  Building Docker image..."
gcloud builds submit --tag "${IMAGE_NAME}" . --project "${PROJECT_ID}"

echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --project "${PROJECT_ID}"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Service URL: https://emailer-84818240112.us-central1.run.app"
