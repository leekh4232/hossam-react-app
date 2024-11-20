@echo off
cls

rmdir /q /s .yarn\unplugged
del .yarn\install-state.gz
rmdir /q /s node_modules

pause