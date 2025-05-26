@echo off
echo ____________________
echo.
echo  XInputSerialMapper
echo ____________________
echo.

set /p PORT=Enter COM port number (default 23): 
set /p BAUD=Enter baudrate (default 115200): 

if "%PORT%" == "" set PORT=23
if "%BAUD%" == "" set BAUD=115200

echo.
echo Using COM%PORT% @ %BAUD%bps
echo.

node . %PORT% %BAUD%

pause