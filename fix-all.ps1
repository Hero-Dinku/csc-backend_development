Write-Host "Fixing syntax issues in all files..." -ForegroundColor Yellow

# Fix utilities/index.js template literals
$utilitiesContent = Get-Content "utilities/index.js" -Raw
$utilitiesContent = $utilitiesContent -replace '\\`', '`' -replace '\\\$', '$'
$utilitiesContent | Out-File "utilities/index.js" -Encoding UTF8 -Force
Write-Host "✓ Fixed utilities/index.js" -ForegroundColor Green

# Fix controllers/accountsController.js template literals
$accountsControllerContent = Get-Content "controllers/accountsController.js" -Raw
$accountsControllerContent = $accountsControllerContent -replace '\\`', '`' -replace '\\\$', '$'
$accountsControllerContent | Out-File "controllers/accountsController.js" -Encoding UTF8 -Force
Write-Host "✓ Fixed controllers/accountsController.js" -ForegroundColor Green

# Fix models/accountModel.js prepared statements
$accountModelContent = Get-Content "models/accountModel.js" -Raw
$accountModelContent = $accountModelContent -replace '\\\$', '$'
$accountModelContent | Out-File "models/accountModel.js" -Encoding UTF8 -Force
Write-Host "✓ Fixed models/accountModel.js" -ForegroundColor Green

Write-Host "All syntax issues fixed!" -ForegroundColor Green
Write-Host "Try running: npm run dev" -ForegroundColor Yellow
