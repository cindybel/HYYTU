param([switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$expectedIndex = [System.IO.File]::ReadAllText((Join-Path $projectPath 'index.html'))
$expectedMain = [System.IO.File]::ReadAllText((Join-Path $projectPath 'src/main.js'))
$pythonPath = 'C:\Users\VJs DMTeam\AppData\Local\Programs\Python\Python310\python.exe'
function Test-GamePage([string]$Address) {
    try {
        $page = Invoke-WebRequest -Uri $Address -UseBasicParsing -TimeoutSec 2
        # A different VJ project can use the same UI IDs. Compare this build's index.
        if (([System.Text.Encoding]::UTF8.GetString($page.RawContentStream.ToArray())).TrimStart([char]0xFEFF).Replace("`r`n", "`n") -cne $expectedIndex.Replace("`r`n", "`n")) { return $false }
        $main = Invoke-WebRequest -Uri ($Address + 'src/main.js') -UseBasicParsing -TimeoutSec 2
        return ([System.Text.Encoding]::UTF8.GetString($main.RawContentStream.ToArray())).TrimStart([char]0xFEFF).Replace("`r`n", "`n") -ceq $expectedMain.Replace("`r`n", "`n")
    } catch { return $false }
}
try {
    $gameAddress = $null
    $gamePorts = @(5181) + @(5173..5190 | Where-Object { $_ -ne 5181 })
    # Reuse an already running copy before creating another origin (saves are per port).
    foreach ($gamePort in $gamePorts) {
        $candidate = "http://127.0.0.1:$gamePort/"
        $listener = Get-NetTCPConnection -LocalPort $gamePort -State Listen -ErrorAction SilentlyContinue
        if ($listener -and (Test-GamePage $candidate)) { $gameAddress = $candidate; break }
    }
    foreach ($gamePort in $gamePorts) {
        if ($gameAddress) { break }
        $candidate = "http://127.0.0.1:$gamePort/"
        if (Test-GamePage $candidate) { $gameAddress = $candidate; break }
        $listener = Get-NetTCPConnection -LocalPort $gamePort -State Listen -ErrorAction SilentlyContinue
        if ($listener) { continue }
        Start-Process -FilePath $pythonPath -ArgumentList @('-m', 'http.server', "$gamePort", '--bind', '127.0.0.1') -WorkingDirectory $projectPath -WindowStyle Hidden
        for ($attempt = 0; $attempt -lt 20; $attempt++) {
            if (Test-GamePage $candidate) { $gameAddress = $candidate; break }
            Start-Sleep -Milliseconds 250
        }
        if ($gameAddress) { break }
    }
    if (-not $gameAddress) { throw 'Le serveur du jeu ne répond pas. Réessaie dans quelques secondes.' }
    if ($CheckOnly) { Write-Output "VJ_SIMULATOR_READY $gameAddress" } else { Start-Process ($gameAddress + '?build=official-integration') }
} catch {
    if ($CheckOnly) { throw }
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($_.Exception.Message, 'VJ Simulator') | Out-Null
}
