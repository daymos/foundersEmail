#!/bin/bash

# Mailjet Parse Route Setup
# This creates a parse route to forward incoming emails to your webhook

API_KEY="dcf4fc910de19194ea87f064fa12d36b"
API_SECRET="c5a13b86043a77136c83b9b44b05634e"
WEBHOOK_URL="https://emailer-84818240112.us-central1.run.app/api/inbound"
EMAIL_ADDRESS="support@keywords.chat"

echo "Creating Mailjet Parse Route..."
echo "Email: $EMAIL_ADDRESS"
echo "Webhook: $WEBHOOK_URL"

curl -X POST \
  https://api.mailjet.com/v3/REST/parseroute \
  -u "${API_KEY}:${API_SECRET}" \
  -H 'Content-Type: application/json' \
  -d "{
    \"Email\": \"${EMAIL_ADDRESS}\",
    \"Url\": \"${WEBHOOK_URL}\"
  }"

echo ""
echo "Parse route created! Now configure MX records for keywords.chat:"
echo ""
echo "Add these MX records to your DNS:"
echo "Priority 10: in1-smtp.mailjet.com"
echo "Priority 50: in2-smtp.mailjet.com"
