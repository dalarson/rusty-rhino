#!/usr/bin/env bash
# Creates the Azure resources for Rusty Rhino (backend on Container Apps, scale-to-zero;
# frontend on Static Web Apps Free). Database and image storage live in Supabase.
# Run once, then configure GitHub secrets/variables as printed at the end.
#
# Prerequisites: az login
# Required env vars: GITHUB_REPO (owner/name), SUPABASE_DB_URL, SUPABASE_DB_USER,
#   SUPABASE_DB_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET,
#   ADMIN_USER_1, ADMIN_PASS_1

set -euo pipefail

RESOURCE_GROUP="rusty-rhino-rg"
LOCATION="centralus"
ENV_NAME="rusty-env"
APP_NAME="rusty-api"
STATIC_WEB_APP_NAME="rusty-rhino"
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
TENANT_ID=$(az account show --query tenantId -o tsv)

az extension add --name containerapp --upgrade --only-show-errors
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait

az group create --name "$RESOURCE_GROUP" --location "$LOCATION" -o none

echo "Creating Static Web App (Free)..."
az staticwebapp create --name "$STATIC_WEB_APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" --sku Free -o none
SWA_TOKEN=$(az staticwebapp secrets list --name "$STATIC_WEB_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" --query properties.apiKey -o tsv)
SWA_URL=$(az staticwebapp show --name "$STATIC_WEB_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" --query defaultHostname -o tsv)

echo "Creating Container Apps environment..."
az containerapp env create --name "$ENV_NAME" --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" -o none

# Placeholder image; the GitHub workflow deploys the real one from GHCR.
echo "Creating Container App (scale to zero)..."
az containerapp create --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --image mcr.microsoft.com/k8se/quickstart:latest \
  --target-port 8080 --ingress external \
  --cpu 0.5 --memory 1.0Gi --min-replicas 0 --max-replicas 1 \
  --secrets "db-password=$SUPABASE_DB_PASSWORD" "supabase-key=$SUPABASE_SERVICE_KEY" \
            "jwt-secret=$JWT_SECRET" "admin-pass-1=$ADMIN_PASS_1" \
  --env-vars "DB_URL=$SUPABASE_DB_URL" "DB_USER=$SUPABASE_DB_USER" \
             "DB_PASSWORD=secretref:db-password" \
             "SUPABASE_URL=$SUPABASE_URL" "SUPABASE_SERVICE_KEY=secretref:supabase-key" \
             "JWT_SECRET=secretref:jwt-secret" \
             "ADMIN_USER_1=$ADMIN_USER_1" "ADMIN_PASS_1=secretref:admin-pass-1" \
             "CORS_ALLOWED_ORIGINS=https://$SWA_URL" -o none
API_FQDN=$(az containerapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Creating Entra ID app registration for GitHub Actions (OIDC)..."
APP_REG=$(az ad app create --display-name "rusty-github-deploy" --query appId -o tsv)
az ad sp create --id "$APP_REG" -o none
az role assignment create --assignee "$APP_REG" --role "Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" -o none
az ad app federated-credential create --id "$APP_REG" --parameters "{
  \"name\": \"rusty-main\",
  \"issuer\": \"https://token.actions.githubusercontent.com\",
  \"subject\": \"repo:${GITHUB_REPO}:ref:refs/heads/main\",
  \"audiences\": [\"api://AzureADTokenExchange\"]
}"

cat <<EOF

=============================================
 Infrastructure setup complete
=============================================
API URL:    https://$API_FQDN
Client URL: https://$SWA_URL

GitHub secrets ($GITHUB_REPO):
  AZURE_CLIENT_ID=$APP_REG
  AZURE_TENANT_ID=$TENANT_ID
  AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID
  AZURE_STATIC_WEB_APPS_API_TOKEN=$SWA_TOKEN
  SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD   (from Supabase dashboard)
GitHub variables:
  SUPABASE_PROJECT_REF
  VITE_RUSTY_API_BASE_URL=https://$API_FQDN
  AZURE_RESOURCE_GROUP=$RESOURCE_GROUP
Also: make the GHCR package public after the first push (or add registry credentials).
=============================================
EOF
