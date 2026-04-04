@echo off
REM Backend setup
echo.
echo Setting up backend...
cd backend

if not exist ".env" (
    copy .env.example .env
    echo Created .env file
)

echo Installing Go dependencies...
go mod download

echo Backend setup complete!

REM Frontend setup
echo.
echo Setting up frontend...
cd ..\frontend

if not exist ".env.local" (
    copy .env.example .env.local
    echo Created .env.local file
)

echo Installing Node dependencies...
call npm install

echo Frontend setup complete!

echo.
echo Setup complete!
echo.
echo To start the project:
echo   Backend:  cd backend ^&^& go run main.go
echo   Frontend: cd frontend ^&^& npm run dev
echo.

cd ..
