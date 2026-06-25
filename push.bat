@echo off
REM push.bat - Local development push script for Windows
REM Usage: push.bat "Your commit message"

if "%1"=="" (
  echo Uh oh Usage: push.bat "Your commit message"
  exit /b 1
)

setlocal enabledelayedexpansion
set GITHUB_TOKEN=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
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
