#!/bin/bash

# Set variables
PROJECT_ID="emailer-prod-b48590"
SA_NAME="github-actions-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🚀 Setting up Service Account for GitHub Actions..."

# 1. Create Service Account
echo "Creating service account..."
gcloud iam service-accounts create $SA_NAME \
    --display-name="GitHub Actions Deployer" \
    --project=$PROJECT_ID

# 2. Grant permissions
echo "Granting permissions..."
# Cloud Run Admin (to deploy)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/run.admin"

# Storage Admin (to push to GCR/Artifact Registry)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/storage.admin"

# Service Account User (to act as the runtime service account)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/iam.serviceAccountUser"

# Artifact Registry Writer
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/artifactregistry.writer"

# 3. Generate Key
echo "Generating JSON key..."
gcloud iam service-accounts keys create gcp-sa-key.json \
    --iam-account=$SA_EMAIL \
    --project=$PROJECT_ID

echo ""
echo "✅ Setup complete!"
echo "🔑 Key saved to: gcp-sa-key.json"
echo ""
echo "Next steps:"
echo "1. Go to your GitHub Repository -> Settings -> Secrets and variables -> Actions"
echo "2. Add New Repository Secret:"
echo "   Name: GCP_PROJECT_ID"
echo "   Value: $PROJECT_ID"
echo "3. Add New Repository Secret:"
echo "   Name: GCP_SA_KEY"
echo "   Value: (Paste the contents of gcp-sa-key.json)"
echo ""
echo "⚠️  IMPORTANT: Delete gcp-sa-key.json after adding it to GitHub!"
