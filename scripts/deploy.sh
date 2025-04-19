#!/bin/bash

# Deploy script for The Spirit Nerds
# Usage: ./scripts/deploy.sh [options]
# Options:
#   --help        Show this help message
#   --github      Deploy to GitHub Pages
#   --netlify     Deploy to Netlify
#   --vercel      Deploy to Vercel

# Display help message
if [[ "$1" == "--help" ]] || [[ "$#" -eq 0 ]]; then
  echo "Deploy script for The Spirit Nerds"
  echo "Usage: ./scripts/deploy.sh [options]"
  echo "Options:"
  echo "  --help        Show this help message"
  echo "  --github      Deploy to GitHub Pages"
  echo "  --netlify     Deploy to Netlify"
  echo "  --vercel      Deploy to Vercel"
  exit 0
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Git is installed
if ! command_exists git; then
  echo "Error: Git is not installed. Please install Git and try again."
  exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
  echo "Error: npm is not installed. Please install Node.js and npm and try again."
  exit 1
fi

# Build the project
echo "Building the project..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed. Please fix the errors and try again."
  exit 1
fi
echo "Build completed successfully."

# Deploy based on the option
case "$1" in
  --github)
    echo "Deploying to GitHub Pages..."
    # Check if gh-pages package is installed
    if ! npm list -g gh-pages >/dev/null 2>&1; then
      echo "Installing gh-pages package..."
      npm install -g gh-pages
    fi
    # Deploy using gh-pages
    gh-pages -d build
    echo "Deployed to GitHub Pages successfully!"
    ;;
    
  --netlify)
    echo "Deploying to Netlify..."
    # Check if Netlify CLI is installed
    if ! command_exists netlify; then
      echo "Installing Netlify CLI..."
      npm install -g netlify-cli
    fi
    # Deploy to Netlify
    netlify deploy --prod
    echo "Deployed to Netlify successfully!"
    ;;
    
  --vercel)
    echo "Deploying to Vercel..."
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
      echo "Installing Vercel CLI..."
      npm install -g vercel
    fi
    # Deploy to Vercel
    vercel --prod
    echo "Deployed to Vercel successfully!"
    ;;
    
  *)
    echo "Error: Invalid option. Use --help to see available options."
    exit 1
    ;;
esac

echo "Deployment completed!" 