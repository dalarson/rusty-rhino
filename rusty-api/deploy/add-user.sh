#!/bin/bash
set -euo pipefail

APP_NAME="rusty-api"
RESOURCE_GROUP="rusty-rhino-rg"
PROPS_FILE="$(dirname "$0")/../src/main/resources/application.properties"

if [ $# -ne 2 ]; then
  echo "Usage: $0 <username> <password>"
  exit 1
fi

USERNAME="$1"
PASSWORD="$2"

EXISTING=$(az containerapp show \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.template.containers[0].env[?starts_with(name, 'ADMIN_USER_')].name" \
  -o tsv)

NEXT_INDEX=1
for name in $EXISTING; do
  INDEX=${name#ADMIN_USER_}
  if [ "$INDEX" -ge "$NEXT_INDEX" ]; then
    NEXT_INDEX=$((INDEX + 1))
  fi
done

echo "Adding user '$USERNAME' as ADMIN_USER_${NEXT_INDEX}..."

az containerapp secret set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --secrets "admin-pass-${NEXT_INDEX}=${PASSWORD}" --output none
az containerapp update --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --set-env-vars "ADMIN_USER_${NEXT_INDEX}=${USERNAME}" "ADMIN_PASS_${NEXT_INDEX}=secretref:admin-pass-${NEXT_INDEX}" \
  --output none

# Add property entries if they don't already exist
if ! grep -q "auth.admin.user${NEXT_INDEX}.username" "$PROPS_FILE" 2>/dev/null; then
  # Insert before the CORS line to keep auth properties grouped
  sed -i '' "/^auth.cors.allowed-origins/i\\
auth.admin.user${NEXT_INDEX}.username=\${ADMIN_USER_${NEXT_INDEX}:}\\
auth.admin.user${NEXT_INDEX}.password=\${ADMIN_PASS_${NEXT_INDEX}:}
" "$PROPS_FILE"
  echo "Added properties to application.properties (commit and redeploy to take effect)"
fi

echo "Done. User '$USERNAME' added as admin #${NEXT_INDEX}."
