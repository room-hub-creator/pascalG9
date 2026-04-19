# Setup New GitHub Repository and Push
# This script helps create a new repository on GitHub and push the current project code.

$repoName = Read-Host "Enter the name for your new GitHub repository (default: pascal-s-binomial-calculator)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "pascal-s-binomial-calculator" }

Write-Host "`nStep 1: Checking for GitHub CLI (gh)..." -ForegroundColor Cyan
$ghAvailable = Get-Command gh -ErrorAction SilentlyContinue

if ($ghAvailable) {
    Write-Host "GitHub CLI detected. Creating repository '$repoName'..." -ForegroundColor Green
    gh repo create $repoName --public --source=. --remote=origin --push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nSuccess! Repository created and project pushed to GitHub." -ForegroundColor Green
    } else {
        Write-Host "`nNote: If 'gh repo create' failed, it might be because the repo already exists or you're not logged in." -ForegroundColor Yellow
        Write-Host "Trying manual push to existing/new remote..." -ForegroundColor Blue
    }
} else {
    Write-Host "GitHub CLI not found. You will need to create the repository manually at https://github.com/new" -ForegroundColor Yellow
    $remoteUrl = Read-Host "Once created, paste the SSH or HTTPS URL here (e.g., https://github.com/youruser/$repoName.git)"
    
    if (![string]::IsNullOrWhiteSpace($remoteUrl)) {
        Write-Host "`nStep 2: Reconfiguring Git remote..." -ForegroundColor Cyan
        git remote remove origin 2>$null
        git remote add origin $remoteUrl
        
        Write-Host "Step 3: Committing and Pushing..." -ForegroundColor Cyan
        git add -A
        git commit -m "Initial commit for $repoName - Final Project"
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nSuccess! Project pushed to $remoteUrl" -ForegroundColor Green
        } else {
            Write-Host "`nPush failed. Please check the URL and your permissions." -ForegroundColor Red
        }
    } else {
        Write-Host "No URL provided. Operation cancelled." -ForegroundColor Red
    }
}

Read-Host "`nPress Enter to exit..."
