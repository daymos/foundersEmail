# Email Dashboard

A unified email inbox for managing support emails across multiple domains.

**Live Dashboard**: `https://emailer-84818240112.us-central1.run.app`

## Tech Stack

- **Frontend**: Next.js 16 + React
- **Backend**: Cloud Run (GCP)
- **Database**: Firestore
- **Email Provider**: Mailjet
- **Authentication**: Google OAuth (NextAuth.js)

## Authentication

The dashboard is protected by Google OAuth. Only authorized email addresses can access it.

**Setup Instructions**: See [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) for detailed configuration steps.

## Adding a New Domain

To receive emails for a new domain (e.g., `support@example.com`):

### 1. Create a Parse Route

Run this command (replace `example.com` with your domain):

```bash
curl -X POST https://api.mailjet.com/v3/REST/parseroute \
  -u "dcf4fc910de19194ea87f064fa12d36b:c5a13b86043a77136c83b9b44b05634e" \
  -H 'Content-Type: application/json' \
  -d '{
    "Email": "support@example.com",
    "Url": "https://emailer-84818240112.us-central1.run.app/api/inbound"
  }'
```

### 2. Add MX Records to DNS

Add this record to your domain's DNS settings:

| Host | Type | Priority | Value |
|------|------|----------|-------|
| `@`  | MX   | 10       | `parse.mailjet.com.` |

> **Note**: The trailing dot (`.`) in `parse.mailjet.com.` is important for proper DNS resolution.

### 3. Done!

Emails to `support@example.com` will now appear in your dashboard alongside emails from other domains.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) for deployment instructions.
