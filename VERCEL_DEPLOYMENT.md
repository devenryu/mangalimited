# Deploying to Vercel

This project is optimized for deployment on Vercel. Follow these steps to deploy:

## Prerequisites

- A [Vercel](https://vercel.com) account
- Git repository with this project

## Deployment Steps

1. Push your project to a Git provider (GitHub, GitLab, or Bitbucket)
2. Login to your Vercel account
3. Click "Add New..." > "Project"
4. Import your Git repository
5. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (automatically detected)
   - Output Directory: `dist` (automatically detected)
   - Install Command: `npm install` (or `pnpm install` if using pnpm)
6. Environment Variables:
   - If needed, add any environment variables with the VITE_ prefix
   - Example: `VITE_API_URL=https://api.mangadex.org`
7. Click "Deploy"

## Custom Domain (Optional)

After deployment, you can add a custom domain in the Vercel project settings.

## Features Enabled

- SPA (Single Page Application) routing
- Cache optimization for static assets
- Automatic HTTPS
- Global CDN distribution

## Troubleshooting

If you encounter any issues with routing, ensure the `vercel.json` file is correctly configured with proper rewrites for client-side routing.

For API-related issues, check your environment variables are correctly set in the Vercel dashboard. 