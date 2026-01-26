# Coolify Migration Setup Guide

This document describes the required GitHub secrets and Coolify configuration for the new deployment workflow.

## Required GitHub Secrets

Add the following secrets to your GitHub repository settings:

### Core Coolify Configuration

- `COOLIFY_SERVER` - Your Coolify server URL (e.g., `https://coolify.example.com`)
- `COOLIFY_DEPLOY_API_KEY` - API key for Coolify deployments (generate in Coolify dashboard)

### Service UUIDs (Production)

Each service needs a UUID from Coolify. You can find these in the Coolify dashboard for each service:

- `COOLIFY_FRONTEND_PROD_ID` - Frontend production service UUID
- `COOLIFY_BACKEND_PROD_ID` - Backend production service UUID
- `COOLIFY_PUBLIC_API_ID` - Public API service UUID
- `COOLIFY_TOOLS_API_ID` - Tools API service UUID
- `COOLIFY_TOKEN_BACKEND_ID` - Token Backend service UUID
- `COOLIFY_DISCO_UI_ID` - Discovery UI service UUID

### Optional: Staging Environment UUIDs

If you want to deploy to staging environments, add:

- `COOLIFY_FRONTEND_STAGING_ID` - Frontend staging service UUID
- `COOLIFY_BACKEND_STAGING_ID` - Backend staging service UUID

### Existing Secrets (Already Configured)

These secrets should already exist from your current setup:

- `TURBO_TOKEN` - Turborepo remote cache token
- `TURBO_TEAM` - Turborepo team name (stored as GitHub variable, not secret)

## Coolify Configuration Steps

### 1. Configure Docker Registry

In Coolify dashboard for each service:

1. Go to the service settings
2. Navigate to "Docker Registry" or "Image Source"
3. Configure to pull from GitHub Container Registry:
   - Registry: `ghcr.io`
   - Image: `ghcr.io/l2beat/<service-name>:latest`
   - Authentication: Use a GitHub Personal Access Token (PAT) with `read:packages` permission

### 2. Disable Auto-Builds

Since GitHub Actions will trigger deployments:

1. Go to each service in Coolify
2. Navigate to "Webhooks" or "Build Settings"
3. Disable automatic builds on webhook events
4. Ensure the service is configured to pull the latest image when deployed

### 3. Get Service UUIDs

To find the UUID for each service:

1. Go to the service in Coolify dashboard
2. The UUID is typically visible in the URL or service settings
3. Copy the UUID and add it as a GitHub secret

Alternatively, you can use the Coolify CLI:
```bash
coolify service list
```

## Workflow Behavior

### Automatic Deployments

- **Trigger**: Push to `main` branch
- **Behavior**: 
  1. Runs `turbo-ignore` to detect which packages changed
  2. Only builds and deploys services that have changes
  3. Deploys to production by default

### Manual Deployments

- **Trigger**: `workflow_dispatch` in GitHub Actions
- **Options**: 
  - Choose environment (production/staging)
  - Can force deploy all services or wait for change detection

## Migration Checklist

- [ ] Add all required GitHub secrets
- [ ] Configure Coolify services to pull from GHCR
- [ ] Disable webhook auto-builds in Coolify
- [ ] Test with one service (e.g., tools-api) first
- [ ] Verify deployments work correctly
- [ ] Remove old Heroku workflows after verification
- [ ] Update any documentation referencing Heroku deployments

## Troubleshooting

### turbo-ignore returns false positives

- Ensure `fetch-depth: 0` is set in checkout (already configured)
- Check that git history is available in the workflow
- Verify Turbo cache is accessible (`TURBO_TOKEN` and `TURBO_TEAM` are set)

### Coolify deployment fails

- Verify the UUID is correct
- Check that `COOLIFY_SERVER` and `COOLIFY_DEPLOY_API_KEY` are valid
- Ensure Coolify CLI can authenticate (check workflow logs)

### Docker image not found in GHCR

- Verify the image was pushed successfully (check workflow logs)
- Ensure GHCR authentication is working
- Check that the image name matches: `ghcr.io/l2beat/<service>:latest`
