#!/bin/bash
# push.sh — Local development push script for Genesis Kenya
# Usage: ./push.sh "Your commit message"

if [ -z "$1" ]; then
  echo "❌ Usage: ./push.sh \"Your commit message\""
  exit 1
fi

GITHUB_TOKEN="${GIT_TOKEN:-your-github-token-here}"  # Set GIT_TOKEN env var locally
REPO_URL="https://${GITHUB_TOKEN}@github.com/vghaiaos-netizen/genesis-kenya.git"

echo "📦 Staging changes..."
git add .

echo "💬 Committing with message: $1"
git commit -m "$1" -m "" -m "Assisted-By: Gordon"

if [ $? -ne 0 ]; then
  echo "❌ Commit failed"
  exit 1
fi

echo "🚀 Pushing to GitHub..."
git push "$REPO_URL" main

if [ $? -eq 0 ]; then
  echo "✅ Push successful! Vercel is auto-deploying..."
  echo "📊 Check deployment status: https://vercel.com/genesis-kenya"
else
  echo "❌ Push failed - ensure GIT_TOKEN environment variable is set"
  exit 1
fi
