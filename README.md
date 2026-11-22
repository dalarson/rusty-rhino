# Rusty Rhino

This is a react frontend web application for the Rusty Rhino furniture business.

## Repository layout

- `/` – React client (Vite), deployed to Azure Static Web Apps (Free).
- `rusty-api/` – Spring Boot API, deployed to Azure Container Apps (scale to zero) from a GHCR image.
- `supabase/migrations/` – Postgres schema (and the `img` storage bucket); applied by CI with `supabase db push`.

## Local development

Copy `rusty-api/.env.local.example` to `rusty-api/.env.local`, fill it in, then run `./dev.sh`.

## Deployment

`.github/workflows/deploy.yml` tests both apps on PRs. On push to `main` it runs DB migrations, builds and deploys the API, then deploys the client.
One-time Azure setup: `rusty-api/deploy/setup-infrastructure.sh` (prints the required GitHub secrets/variables).
