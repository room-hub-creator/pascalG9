# Final Push Script for Pascal's Binomial Calculator
# This script consolidates all previous push logic, cleans up clutter, and pushes to the new repo.

$remoteUrl = "https://github.com/room-hub-creator/pascalG9.git"

Write-Host "--- Project Finalization & Push ---" -ForegroundColor Cyan

# 1. Cleanup Clutter
Write-Host "Step 1: Removing temporary scripts..." -ForegroundColor Yellow
Remove-Item "push_to_git.bat" -ErrorAction SilentlyContinue
Remove-Item "push_to_git.ps1" -ErrorAction SilentlyContinue
Remove-Item "setup_new_repo.ps1" -ErrorAction SilentlyContinue
Remove-Item "bun.lock" -ErrorAction SilentlyContinue
Remove-Item "bun.lockb" -ErrorAction SilentlyContinue

# 2. Reconfigure Git
Write-Host "Step 2: Reconfiguring Git remote to $remoteUrl..." -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $remoteUrl

# 3. Stage and Commit
Write-Host "Step 3: Staging all project files..." -ForegroundColor Green
git add -A
git commit -m "Final submission: Optimized and sanitized project files"

# 4. Push
Write-Host "Step 4: Pushing to GitHub (main branch)..." -ForegroundColor Cyan
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSUCCESS! Your project is now live at $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "`nERROR: Push failed. Check your internet connection or repository permissions." -ForegroundColor Red
}

Read-Host "`nPress Enter to exit..."
