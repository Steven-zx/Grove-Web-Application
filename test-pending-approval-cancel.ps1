$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PENDING APPROVAL CANCEL BUTTON TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test configuration
$baseUrl = "http://localhost:3000"
$testEmail = "testuser@test.com"
$testPassword = "Test123!"

try {
    # Step 1: Login
    Write-Host "Step 1: Authenticating..." -ForegroundColor Yellow
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    
    $token = $loginResponse.token
    Write-Host "Success: Logged in" -ForegroundColor Green
    
    # Step 2: Get user bookings
    Write-Host "`nStep 2: Fetching user bookings..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $bookings = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method GET -Headers $headers
    
    Write-Host "Success: Found $($bookings.Count) booking(s)" -ForegroundColor Green
    
    # Step 3: Find pending_approval booking
    Write-Host "`nStep 3: Looking for pending_approval booking..." -ForegroundColor Yellow
    $pendingApprovalBooking = $bookings | Where-Object { $_.status -eq "pending_approval" } | Select-Object -First 1
    
    if (-not $pendingApprovalBooking) {
        Write-Host "No pending_approval booking found" -ForegroundColor Yellow
        Write-Host "`nAvailable bookings:" -ForegroundColor Cyan
        foreach ($booking in $bookings) {
            Write-Host "  - ID: $($booking.id) | Status: $($booking.status) | Amenity: $($booking.amenity_type)" -ForegroundColor Gray
        }
        
        Write-Host "`nTest Result: CANNOT TEST - No pending_approval booking exists" -ForegroundColor Yellow
        exit 0
    }
    
    Write-Host "Success: Found pending_approval booking:" -ForegroundColor Green
    Write-Host "  - Booking ID: $($pendingApprovalBooking.id)" -ForegroundColor White
    Write-Host "  - Amenity: $($pendingApprovalBooking.amenity_type)" -ForegroundColor White
    Write-Host "  - Status: $($pendingApprovalBooking.status)" -ForegroundColor White
    
    # Step 4: Test cancel endpoint
    Write-Host "`nStep 4: Testing cancel endpoint..." -ForegroundColor Yellow
    $cancelResponse = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$($pendingApprovalBooking.id)/cancel" -Method PUT -Headers $headers
    
    Write-Host "Success: Cancel request completed" -ForegroundColor Green
    Write-Host "  - New Status: $($cancelResponse.booking.status)" -ForegroundColor White
    
    # Step 5: Verify cancellation
    Write-Host "`nStep 5: Verifying cancellation..." -ForegroundColor Yellow
    $updatedBookings = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method GET -Headers $headers
    
    $cancelledBooking = $updatedBookings | Where-Object { $_.id -eq $pendingApprovalBooking.id } | Select-Object -First 1
    
    if ($cancelledBooking.status -eq "cancelled") {
        Write-Host "Success: Booking successfully cancelled" -ForegroundColor Green
    } else {
        Write-Host "Failed: Cancellation verification failed" -ForegroundColor Red
        Write-Host "  - Expected: cancelled" -ForegroundColor Red
        Write-Host "  - Got: $($cancelledBooking.status)" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  ALL TESTS PASSED" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
} catch {
    Write-Host "`nTEST FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
