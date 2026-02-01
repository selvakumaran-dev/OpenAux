# OpenAux Setup Script for Windows PowerShell

Write-Host "🎵 OpenAux - Democratic Jukebox Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install server dependencies
Write-Host ""
Write-Host "📦 Installing server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Server dependencies installed" -ForegroundColor Green

# Install client dependencies
Write-Host ""
Write-Host "📦 Installing client dependencies..." -ForegroundColor Yellow
Set-Location ../client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Client installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client dependencies installed" -ForegroundColor Green

# Setup environment files
Set-Location ..
Write-Host ""
Write-Host "⚙️ Setting up environment files..." -ForegroundColor Yellow

# Server .env
if (-not (Test-Path "server/.env")) {
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "✅ Created server/.env (Please update with your credentials)" -ForegroundColor Green
} else {
    Write-Host "⚠️ server/.env already exists" -ForegroundColor Yellow
}

# Client .env
if (-not (Test-Path "client/.env")) {
    Copy-Item "client/.env.example" "client/.env"
    Write-Host "✅ Created client/.env" -ForegroundColor Green
} else {
    Write-Host "⚠️ client/.env already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Get YouTube API Key: https://console.cloud.google.com/apis/credentials" -ForegroundColor White
Write-Host "2. Create MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
Write-Host "3. Update server/.env with your credentials" -ForegroundColor White
Write-Host "4. Run 'npm run dev' in server/ and client/ directories" -ForegroundColor White
Write-Host ""
Write-Host "📖 Read README.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
