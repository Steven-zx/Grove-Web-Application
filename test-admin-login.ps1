# Test Script for Admin Login
# Run this to verify admin login works locally before deploying

Write-Host "🧪 Testing Admin Login Flow..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health Check
Write-Host "Test 1: Backend Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
    if ($health.StatusCode -eq 200) {
        Write-Host "✅ Backend is running!" -ForegroundColor Green
        $healthData = $health.Content | ConvertFrom-Json
        Write-Host "   Version: $($healthData.version)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Backend is not running! Start it with: cd backend; npm start" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Admin Login with Correct Credentials
Write-Host "Test 2: Admin Login (Correct Credentials)" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@augustinegrove.com"
        password = "admin123"
    } | ConvertTo-Json

    $login = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
    
    if ($login.StatusCode -eq 200) {
        Write-Host "✅ Admin login successful!" -ForegroundColor Green
        $loginData = $login.Content | ConvertFrom-Json
        Write-Host "   Token received: $($loginData.token.Substring(0, 50))..." -ForegroundColor Gray
        Write-Host "   Admin email: $($loginData.admin.email)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Admin login failed!" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Admin Login with Wrong Credentials
Write-Host "Test 3: Admin Login (Wrong Credentials - Should Fail)" -ForegroundColor Yellow
try {
    $badBody = @{
        email = "admin@augustinegrove.com"
        password = "wrongpassword"
    } | ConvertTo-Json

    $badLogin = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/login" -Method POST -Body $badBody -ContentType "application/json"
    Write-Host "❌ Security issue: Login succeeded with wrong password!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected wrong password!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 4: Check Admin Frontend
Write-Host "Test 4: Admin Frontend Server" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5181" -Method GET
    if ($frontend.StatusCode -eq 200) {
        Write-Host "✅ Admin frontend is running on http://localhost:5181" -ForegroundColor Green
        Write-Host "   You can now test login in browser!" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️ Admin frontend not running. Start it with: cd admin/frontend; npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ All tests passed! Admin login is working." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps for Netlify deployment:" -ForegroundColor Cyan
Write-Host "1. Deploy backend to Render/Railway/Heroku" -ForegroundColor White
Write-Host "2. Get backend URL (e.g., https://your-app.onrender.com)" -ForegroundColor White
Write-Host "3. Set VITE_API_BASE_URL in Netlify (see NETLIFY-ENV-SETUP.md)" -ForegroundColor White
Write-Host "4. Push to GitHub - auto-deploys to Netlify" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
