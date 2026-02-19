@echo off
echo Installing GovPreneurs AI Auto-Proposal Engine...
echo.

echo [1/3] Installing root dependencies...
call npm install

echo.
echo [2/3] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [3/3] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo To start the application, run:
echo npm run dev
echo.
pause
