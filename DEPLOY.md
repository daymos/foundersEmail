# Deploying to Google Cloud Run

**Project ID**: `emailer-prod-b48590`
**Repository**: `us-central1-docker.pkg.dev/emailer-prod-b48590/emailer-repo`

## Prerequisites

✅ **Project Created**: `emailer-prod-b48590`
✅ **APIs Enabled**: Cloud Run, Cloud Build, Artifact Registry, Firestore.
✅ **Repo Created**: `emailer-repo`.
✅ **Database Created**: Firestore (Native).

## Deployment Steps

### 1. Build and Submit the Image

Run this command to build your Docker image and push it to the registry:

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/emailer-prod-b48590/emailer-repo/emailer:latest . --project emailer-prod-b48590
```

### 2. Deploy to Cloud Run

Replace the placeholders with your actual Mailgun credentials.

```bash
gcloud run deploy emailer \
    --image us-central1-docker.pkg.dev/emailer-prod-b48590/emailer-repo/emailer:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --project emailer-prod-b48590 \
    --set-env-vars MAILJET_API_KEY=dcf4fc910de19194ea87f064fa12d36b \
    --set-env-vars MAILJET_API_SECRET=c5a13b86043a77136c83b9b44b05634e \
    --set-env-vars SENDER_EMAIL=support@keywords.chat
```

### 3. Configure Permissions (Firestore)

The Cloud Run service uses its default service account. You need to grant it access to Firestore.

1.  **Find the Service Account**:
    ```bash
    gcloud run services describe emailer --region us-central1 --format 'value(spec.template.spec.serviceAccountName)' --project emailer-prod-b48590
    ```

2.  **Grant Permissions**:
    Replace `[SERVICE_ACCOUNT_EMAIL]` with the output from the previous command.
    ```bash
    gcloud projects add-iam-policy-binding emailer-prod-b48590 \
        --member="serviceAccount:[SERVICE_ACCOUNT_EMAIL]" \
        --role="roles/datastore.user"
    ```

## Verification

1.  Get the Service URL:
    ```bash
    gcloud run services describe emailer --region us-central1 --format 'value(status.url)' --project emailer-prod-b48590
    ```
2.  Open the URL in your browser.
