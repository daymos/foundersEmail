#!/bin/bash
set -e

# Configuration
BILLING_ACCOUNT_ID="010003-DAA3F0-8FB2DB"
RANDOM_SUFFIX=$(openssl rand -hex 3)
PROJECT_ID="emailer-prod-${RANDOM_SUFFIX}"
REGION="us-central1"

echo "🚀 Starting GCP Setup..."
echo "Target Project ID: ${PROJECT_ID}"
echo "Billing Account: ${BILLING_ACCOUNT_ID}"

# 1. Create Project
echo "Creating project..."
gcloud projects create ${PROJECT_ID} --name="Emailer Prod"

# 2. Link Billing
echo "Linking billing..."
gcloud beta billing projects link ${PROJECT_ID} --billing-account=${BILLING_ACCOUNT_ID}

# 3. Enable APIs
echo "Enabling APIs (this may take a minute)..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    firestore.googleapis.com \
    --project ${PROJECT_ID}

# 4. Create Artifact Registry
echo "Creating Artifact Registry repo..."
gcloud artifacts repositories create emailer-repo \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for Emailer app" \
    --project ${PROJECT_ID}

# 5. Create Firestore Database (Native mode)
echo "Creating Firestore database..."
gcloud firestore databases create \
    --location=${REGION} \
    --type=firestore-native \
    --project ${PROJECT_ID}

echo "✅ Setup Complete!"
echo "Project ID: ${PROJECT_ID}"
echo "Repository: ${REGION}-docker.pkg.dev/${PROJECT_ID}/emailer-repo"
