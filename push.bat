@echo off
REM push.bat - Local development push script for Windows
REM Usage: push.bat "Your commit message"
REM Set GIT_TOKEN environment variable locally before running

if "%1"=="" (
  echo Usage: push.bat "Your commit message"
  exit /b 1
)

setlocal enabledelayedexpansion
set GITHUB_TOKEN=%GIT_TOKEN%
if "!GITHUB_TOKEN!"=="" (
  echo Error: GIT_TOKEN environment variable not set
  echo Please set your GitHub token: set GIT_TOKEN=your-token
  exit /b 1
)

set REPO_URL=https://!GITHUB_TOKEN!@github.com/vghaiaos-netizen/genesis-kenya.git

echo Staging changes...
git add .

echo Committing: %1
git commit -m "%1" -m "" -m "Assisted-By: Gordon"

if errorlevel 1 (
  echo Commit failed
  exit /b 1
)

echo Pushing to GitHub...
git push "!REPO_URL!" main

if errorlevel 1 (
  echo Push failed
  exit /b 1
)

echo Success! Vercel is auto-deploying...
echo Check status: https://vercel.com/genesis-kenya

endlocal
