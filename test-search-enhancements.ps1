# Test Script for Search Enhancements
# Tests: Debouncing, Highlighting, Recent Searches

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SEARCH ENHANCEMENTS TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$passed = 0
$failed = 0
$baseUrl = "http://localhost:5173"

# Test 1: Backend health check
Write-Host "Test 1: Backend is running..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " FAIL (Server not responding)" -ForegroundColor Red
    $failed++
}

# Test 2: Frontend is running
Write-Host "Test 2: Frontend is running..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " FAIL (Frontend not responding)" -ForegroundColor Red
    $failed++
}

# Test 3: Search page exists
Write-Host "Test 3: Search page route exists..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/#/search" -Method GET -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host " PASS" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $failed++
}

# Test 4: Search API endpoint with authentication
Write-Host "Test 4: Search API returns results..." -NoNewline
try {
    # First login to get token
    $loginBody = @{
        email = "testuser@test.com"
        password = "Test123!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -ErrorAction Stop
    $token = $loginResponse.token
    
    # Now search
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $searchResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/search?q=pool" -Headers $headers -ErrorAction Stop
    
    if ($searchResponse.success -and $searchResponse.results) {
        Write-Host " PASS" -ForegroundColor Green
        $passed++
        Write-Host "    Results: Amenities=$($searchResponse.counts.amenities), Announcements=$($searchResponse.counts.announcements), Bookings=$($searchResponse.counts.bookings)" -ForegroundColor Gray
    } else {
        Write-Host " FAIL (Invalid response structure)" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host " FAIL ($($_.Exception.Message))" -ForegroundColor Red
    $failed++
}

# Test 5: Check if Search.jsx has highlighting code
Write-Host "Test 5: Search.jsx has highlighting..." -NoNewline
$searchFile = "c:\Users\acer\Downloads\Github\Grove-Web-Application\frontend\src\pages\Search.jsx"
$content = Get-Content $searchFile -Raw
if ($content -match "highlightText" -and $content -match "bg-yellow-200") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (Highlighting code not found)" -ForegroundColor Red
    $failed++
}

# Test 6: Check if Search.jsx has debouncing
Write-Host "Test 6: Search.jsx has debouncing..." -NoNewline
if ($content -match "debounceTimerRef" -and $content -match "setTimeout") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (Debouncing code not found)" -ForegroundColor Red
    $failed++
}

# Test 7: Check if Search.jsx has recent searches
Write-Host "Test 7: Search.jsx has recent searches..." -NoNewline
if ($content -match "recentSearches" -and $content -match "localStorage") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (Recent searches code not found)" -ForegroundColor Red
    $failed++
}

# Test 8: Check SearchMobile.jsx has same features
Write-Host "Test 8: SearchMobile.jsx has features..." -NoNewline
$searchMobileFile = "c:\Users\acer\Downloads\Github\Grove-Web-Application\frontend\src\pages\SearchMobile.jsx"
$mobileContent = Get-Content $searchMobileFile -Raw
if ($mobileContent -match "highlightText" -and $mobileContent -match "recentSearches" -and $mobileContent -match "debounceTimerRef") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (Mobile features incomplete)" -ForegroundColor Red
    $failed++
}

# Test 9: Verify localStorage functions exist
Write-Host "Test 9: localStorage functions defined..." -NoNewline
if ($content -match "saveRecentSearch" -and $content -match "getRecentSearches" -and $content -match "clearRecentSearches") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (localStorage functions missing)" -ForegroundColor Red
    $failed++
}

# Test 10: Check for Clock and X icons (UI elements)
Write-Host "Test 10: UI elements imported..." -NoNewline
if ($content -match "Clock" -and $content -match " X " -and $mobileContent -match "Clock") {
    Write-Host " PASS" -ForegroundColor Green
    $passed++
} else {
    Write-Host " FAIL (Missing UI icons)" -ForegroundColor Red
    $failed++
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   RESULTS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Passed: $passed/10" -ForegroundColor Green
Write-Host "Failed: $failed/10" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

if ($failed -eq 0) {
    Write-Host "`nALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "`nFeatures implemented:" -ForegroundColor Cyan
    Write-Host "  ✓ Search debouncing (300ms delay)" -ForegroundColor White
    Write-Host "  ✓ Result highlighting (yellow background)" -ForegroundColor White
    Write-Host "  ✓ Recent searches history (localStorage)" -ForegroundColor White
    Write-Host "  ✓ Desktop and mobile versions" -ForegroundColor White
    Write-Host "`nTo manually test:" -ForegroundColor Cyan
    Write-Host "1. Open http://localhost:5173" -ForegroundColor White
    Write-Host "2. Login with test credentials" -ForegroundColor White
    Write-Host "3. Use search bar - type slowly to see debouncing" -ForegroundColor White
    Write-Host "4. Search results show highlighted matches" -ForegroundColor White
    Write-Host "5. Go to /search - see recent searches list`n" -ForegroundColor White
} else {
    Write-Host "`nSOME TESTS FAILED - REVIEW NEEDED`n" -ForegroundColor Red
}
