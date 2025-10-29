# Deployment Guide

## Environment Variables

When deploying to Dokploy, set these environment variables in the Dokploy dashboard:

### Required Variables:
- `VITE_API_URL`: The full API URL with path (e.g., `http://your-backend-domain.com/api/v1`)
- `VITE_BACKEND_URL`: The backend base URL without path (e.g., `http://your-backend-domain.com`)

### Example for Dokploy:
```
VITE_API_URL=http://your-backend-domain.traefik.me/api/v1
VITE_BACKEND_URL=http://your-backend-domain.traefik.me
```

### Example for Local Development with Team:
```
VITE_API_URL=http://YOUR_LOCAL_IP:3001/api/v1
VITE_BACKEND_URL=http://YOUR_LOCAL_IP:3001
```

## Building for Production

### Local Build:
```bash
# Set environment variables
export VITE_API_URL=http://your-backend-domain.com/api/v1
export VITE_BACKEND_URL=http://your-backend-domain.com

# Build
pnpm run build
```

### Docker Build:
```bash
# Build with environment variables
docker build \
  --build-arg VITE_API_URL=http://your-backend-domain.com/api/v1 \
  --build-arg VITE_BACKEND_URL=http://your-backend-domain.com \
  -t commerce-app-fe \
  .

# Run
docker run -p 80:80 commerce-app-fe
```

## Dokploy Deployment

1. **Push your code to GitHub** (make sure Dockerfile and nginx.conf are committed)

2. **In Dokploy Dashboard**:
   - Create a new application
   - Connect to your GitHub repository
   - Set the environment variables in the "Environment" tab:
     - `VITE_API_URL`
     - `VITE_BACKEND_URL`
   - Configure domain in the "Domains" tab
   - Deploy!

3. **Important Notes**:
   - The proxy configuration in `vite.config.ts` is ONLY for local development
   - In production (Docker), the app makes direct requests to `VITE_API_URL`
   - Make sure your backend allows CORS from your frontend domain

## Local Development with Team

### For all team members:
1. Get the local network IP from the person hosting the backend
2. Create a `.env` file (never commit this file):
```bash
# Replace YOUR_LOCAL_IP with the actual IP address provided
VITE_BACKEND_URL=http://YOUR_LOCAL_IP:3001
VITE_API_URL=http://YOUR_LOCAL_IP:3001/api/v1
```

3. If using Radmin VPN, connect to the VPN first
4. Run: `pnpm dev`

**Note**: The `.env` file is gitignored and should never be committed to the repository.

## Troubleshooting

### Frontend can't connect to backend:
- Check CORS settings on backend
- Verify environment variables are set correctly
- Check network connectivity (for Radmin VPN users)

### 404 on refresh in production:
- nginx.conf is properly configured with `try_files $uri $uri/ /index.html;`
- This should be automatic with the Dockerfile

### Assets not loading:
- Check that the build completed successfully
- Verify nginx is serving from `/usr/share/nginx/html`
