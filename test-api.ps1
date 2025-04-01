# Test API script
$apiUrl = "https://bot.fit-track.net/api/"

# Set up request body for OTP
$otpBody = @{
    mdl = "login"
    act = "otp"
    phone = "0524455266"  # Use the phone number you've been using in your app
} | ConvertTo-Json

Write-Host "Sending OTP request..."
try {
    # Use Invoke-WebRequest to get headers
    $otpWebResponse = Invoke-WebRequest -Uri $apiUrl -Method Post -Body $otpBody -ContentType "application/json"
    
    Write-Host "Status Code: $($otpWebResponse.StatusCode)"
    
    # Get and display response headers
    Write-Host "`nResponse Headers:"
    $otpWebResponse.Headers
    
    # Display cookies if any
    Write-Host "`nCookies:"
    $otpWebResponse.Headers["Set-Cookie"]
    
    # Display content
    Write-Host "`nResponse Content:"
    $content = $otpWebResponse.Content | ConvertFrom-Json
    $content | ConvertTo-Json -Depth 3
    
    # If OTP request was successful, prompt for verification code
    if ($content.result -eq $true) {
        Write-Host "`nEnter the OTP code you received:"
        $otpCode = Read-Host
        
        # Create verification request
        $verifyBody = @{
            mdl = "login"
            act = "verify"
            phone = "0524455266"  # Use the phone number you've been using in your app
            code = $otpCode
        } | ConvertTo-Json
        
        Write-Host "`nSending verification request..."
        
        # Create session with cookies from first request
        $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
        $cookie = New-Object System.Net.Cookie
        $cookie.Name = "PHPSESSID"
        $cookie.Value = $otpWebResponse.Headers["Set-Cookie"] -replace "PHPSESSID=([^;]+).*", '$1'
        $cookie.Domain = "bot.fit-track.net"
        $session.Cookies.Add($cookie)
        
        # Send verification request with session cookie
        $verifyResponse = Invoke-WebRequest -Uri $apiUrl -Method Post -Body $verifyBody -ContentType "application/json" -WebSession $session
        
        Write-Host "Verification Status Code: $($verifyResponse.StatusCode)"
        
        # Display verification response headers
        Write-Host "`nVerification Response Headers:"
        $verifyResponse.Headers
        
        # Display verification cookies
        Write-Host "`nVerification Cookies:"
        $verifyResponse.Headers["Set-Cookie"]
        
        # Display verification content
        Write-Host "`nVerification Response Content:"
        $verifyContent = $verifyResponse.Content | ConvertFrom-Json
        $verifyContent | ConvertTo-Json -Depth 3
    }
    
} catch {
    Write-Host "Error occurred: $_"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response content: $responseBody"
    }
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 