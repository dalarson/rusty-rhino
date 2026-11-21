#!/usr/bin/env bash
# Starts the rusty-api backend and rusty-rhino frontend in dev mode.
# Usage: ./dev.sh
#
# Required env vars for the backend (set these in rusty-api/.env.local):
#   SPRING_CLOUD_AZURE_COSMOS_ENDPOINT
#   SPRING_CLOUD_AZURE_COSMOS_DATABASE
#   AZURE_STORAGE_BLOB_ENDPOINT
#
# Optional (have defaults):
#   ADMIN_USER_1, ADMIN_PASS_1, ADMIN_USER_2, ADMIN_PASS_2
#   JWT_SECRET, CORS_ALLOWED_ORIGINS
#
# Requires: az login (for DefaultAzureCredential)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_DIR="$SCRIPT_DIR/rusty-api"

# Load backend env vars
if [ -f "$API_DIR/.env.local" ]; then
    echo "Loading environment from rusty-api/.env.local"
    set -a
    source "$API_DIR/.env.local"
    set +a
fi

# Check required env vars
MISSING=""
for var in SPRING_CLOUD_AZURE_COSMOS_ENDPOINT SPRING_CLOUD_AZURE_COSMOS_DATABASE AZURE_STORAGE_BLOB_ENDPOINT; do
    if [ -z "${!var}" ]; then
        MISSING="$MISSING  $var\n"
    fi
done
if [ -n "$MISSING" ]; then
    echo "ERROR: Missing required environment variables:"
    echo -e "$MISSING"
    echo "Add them to $API_DIR/.env.local"
    exit 1
fi

cleanup() {
    echo ""
    echo "Shutting down..."
    kill $API_PID $UI_PID 2>/dev/null
    wait $API_PID $UI_PID 2>/dev/null
    echo "Done."
}
trap cleanup EXIT INT TERM

# Start backend
echo "Starting rusty-api on http://localhost:8080 ..."
cd "$SCRIPT_DIR/rusty-api"
mvn -q spring-boot:run &
API_PID=$!

# Start frontend
echo "Starting client on http://localhost:5173 ..."
cd "$SCRIPT_DIR"
npm run start &
UI_PID=$!

echo ""
echo "Both services starting. Press Ctrl+C to stop."
wait
