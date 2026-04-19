Write-Host "Checking repository state..." -ForegroundColor Blue
$branch = git rev-parse --abbrev-ref HEAD

if ($branch -eq "HEAD") {
    Write-Host "[Detached HEAD detected] Fixing repository pointer..." -ForegroundColor Yellow
    git branch -f main HEAD
    git checkout main
}

Write-Host "Staging all changes..." -ForegroundColor Cyan
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to stage changes." -ForegroundColor Red
    return
}

Write-Host "Committing all project updates..." -ForegroundColor Cyan
git commit -m "Save all project changes and finalize features"
if ($LASTEXITCODE -ne 0) {
    Write-Host "No new changes to commit (or commit failed)." -ForegroundColor Gray
}

Write-Host "Pushing to origin main..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Please check your internet connection/permissions." -ForegroundColor Red
    return
}

Write-Host "Success! All changes saved and pushed." -ForegroundColor Green
Read-Host "Press Enter to exit..."
