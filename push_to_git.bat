@echo off
setlocal

echo Checking repository state...
git rev-parse --abbrev-ref HEAD > temp_head.txt
set /p BRANCH=<temp_head.txt
del temp_head.txt

echo Current branch: %BRANCH%

if "%BRANCH%"=="HEAD" (
    echo [Detached HEAD detected] Fixing repository pointer...
    git branch -f main HEAD
    git checkout main
)

echo Staging all changes (including new files)...
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo Failed to stage changes.
    pause
    exit /b %ERRORLEVEL%
)

echo Committing all project updates...
git commit -m "Save all project changes and finalize features"
if %ERRORLEVEL% NEQ 0 (
    echo No new changes to commit (or commit failed).
)

echo Pushing to origin main...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo Push failed. Please check your internet connection and GitHub permissions.
    pause
    exit /b %ERRORLEVEL%
)

echo Success! All changes saved and pushed.
pause
