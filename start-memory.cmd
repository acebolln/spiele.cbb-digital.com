@echo off
rem ===========================================================
rem  Ayas Memory - local launcher
rem  Opens the game in a chrome-less fullscreen browser window
rem  so a small child cannot wander into tabs or the address bar.
rem  Falls back to the default browser if Edge/Chrome are absent.
rem
rem  The disable-features list suppresses Edge's sign-in and sync
rem  popups. A fresh --user-data-dir triggers them, and a Microsoft
rem  account dialog on top of a toddler's game is not acceptable.
rem  Unknown feature names are ignored by the browser, so the same
rem  list is safe for Chrome.
rem ===========================================================
setlocal

set "GAME=%~dp0games\memory\index.html"
set "PROFILE=%LOCALAPPDATA%\AyaSpiele\browser"

if not exist "%GAME%" (
  echo.
  echo   Spieldatei nicht gefunden:
  echo   %GAME%
  echo.
  pause
  exit /b 1
)

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

set "BROWSER="
if exist "%EDGE%" set "BROWSER=%EDGE%"
if not defined BROWSER if exist "%CHROME%" set "BROWSER=%CHROME%"

if defined BROWSER goto :app

rem No Chromium browser found - hand it to whatever opens .html
start "" "%GAME%"
goto :done

:app
set "QUIET=--no-first-run --no-default-browser-check --disable-sync"
set "QUIET=%QUIET% --disable-features=msImplicitSignIn,msEdgeIdentityFre,EdgeSyncPromo,msEdgeWelcomePage,Translate,msEdgeShoppingAssistant,msSmartScreenSurvey"
set "QUIET=%QUIET% --disable-popup-blocking --disable-background-networking"

start "" "%BROWSER%" --app="file:///%GAME:\=/%" --start-fullscreen --user-data-dir="%PROFILE%" %QUIET%

:done
endlocal
