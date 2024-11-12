@echo off
cls

IF "%1" == "" (
    SET comment=update %DATE% %TIME%
) ELSE (
    SET comment=%1
)

echo.
echo $ git add --all
echo ----------------------------------------
git add --all

echo.
echo $ git commit -m "%comment%"
echo ----------------------------------------
git commit -m "%comment%"

echo.
echo $ git push origin main
echo ----------------------------------------
git push origin main

echo.
pause
