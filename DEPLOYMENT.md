# Deployment Guide for The Spirit Nerds Trivia Quiz

This guide provides instructions for deploying the Spirits Trivia Quiz application to various platforms.

## Prerequisites

Before deploying, ensure you have:

- Node.js and npm installed
- Git installed
- A production build of the application (`npm run build`)
- Appropriate access/accounts for your chosen deployment platform

## Deployment Options

### 1. GitHub Pages

GitHub Pages is a static site hosting service that takes files directly from a GitHub repository.

**Setup:**

1. Install the `gh-pages` package:
   ```
   npm install --save-dev gh-pages
   ```

2. Add these scripts to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Add the homepage field to your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/spirits-trivia-quiz"
   ```

4. Deploy the application:
   ```
   npm run deploy
   ```

### 2. Netlify

Netlify offers continuous deployment with Git, global CDN, and more.

**Setup:**

1. Create an account on [Netlify](https://www.netlify.com/)
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy

**Manual Deployment:**

1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```
   netlify login
   ```

3. Deploy:
   ```
   netlify deploy --prod
   ```

### 3. Vercel

Vercel is optimized for frontend frameworks and static sites.

**Setup:**

1. Create an account on [Vercel](https://vercel.com/)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Login to Vercel:
   ```
   vercel login
   ```

4. Deploy:
   ```
   vercel --prod
   ```

## Using the Deployment Script

We've created a deployment script to simplify the process:

1. Make the script executable:
   ```
   chmod +x scripts/deploy.sh
   ```

2. Run the script with your preferred platform:
   ```
   ./scripts/deploy.sh --github    # For GitHub Pages
   ./scripts/deploy.sh --netlify   # For Netlify
   ./scripts/deploy.sh --vercel    # For Vercel
   ```

## Configuration for SEO

Ensure these files are properly set up before deployment:

- `public/index.html`: Contains all required meta tags
- `public/robots.txt`: Directs search engines how to crawl your site
- `public/sitemap.xml`: Lists all important URLs for search engines
- `public/og-image.png`: Provides a preview image for social media sharing

## Post-Deployment Checklist

After deploying, verify:

- The site loads properly on different devices and browsers
- All links work correctly
- Images and assets load properly
- SEO meta tags are correctly implemented
- Social media sharing shows the correct preview

## Troubleshooting

### Page Not Found (404) Issues
- For single-page applications, ensure your hosting service redirects all requests to `index.html`
- For GitHub Pages, make sure you've configured the custom domain correctly

### Asset Loading Issues
- Check that all paths to assets use relative URLs
- Verify the `homepage` field in `package.json` is set correctly

### Build Failures
- Review build logs for errors
- Ensure all dependencies are properly installed
- Check for environment variables that might be needed

## Custom Domain Setup

### GitHub Pages
1. Add your custom domain in the repository settings
2. Create a CNAME record at your DNS provider pointing to `yourusername.github.io`
3. Add a `CNAME` file in the `public` directory with your domain name

### Netlify
1. Go to Domain settings in your Netlify dashboard
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Netlify

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Follow the verification and DNS configuration steps

## Purchasing a Domain

### Option 1: Namecheap

1. Go to [Namecheap](https://www.namecheap.com)
2. Search for "thespiritnerds.com" or your preferred domain
3. Add to cart and checkout
4. Connect your domain to your hosting:
   - For GitHub Pages, set up custom domain in repository settings
   - For Netlify/Vercel, add domain in their dashboard
   - Update nameservers as instructed by your hosting provider

### Option 2: Google Domains

1. Go to [Google Domains](https://domains.google)
2. Search for your domain and purchase it
3. Configure DNS settings to point to your hosting

### Option 3: GoDaddy

1. Visit [GoDaddy](https://www.godaddy.com)
2. Search and purchase your domain
3. Configure DNS to point to your hosting provider

## Setting Up HTTPS

- GitHub Pages, Netlify, and Vercel provide HTTPS automatically
- For custom domains, you may need to configure SSL:
  - Netlify and Vercel offer free SSL certificates
  - For GitHub Pages, see their documentation on custom domains and SSL

## Costs to Consider

1. **Domain**: $10-20/year for a .com domain
2. **Hosting**:
   - GitHub Pages: Free
   - Netlify: Free for basic use, $19/month for Pro
   - Vercel: Free for hobby, $20/month for Pro
   - AWS Amplify: Free tier available, then pay as you go

3. **SSL Certificate**: Free with Let's Encrypt or hosting providers

## Production Checklist

Before finalizing deployment:

1. Update the meta tags in `public/index.html` for SEO
2. Ensure all links work with your domain structure
3. Test your site on multiple devices and browsers
4. Set up Google Analytics or similar for tracking
5. Consider implementing a cookie consent banner if needed
6. Test load times and optimize if necessary 