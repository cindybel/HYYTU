param([switch]$CheckOnly)
$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$pythonPath = 'C:\Users\VJs DMTeam\AppData\Local\Programs\Python\Python310\python.exe'
function Test-GamePage([string]$Address) {
    try {
        $page = Invoke-WebRequest -Uri $Address -UseBasicParsing -TimeoutSec 2
        return $page.Content.Contains('id="studio-entry-button"') -and $page.Content.Contains('VJ')
    } catch { return $false }
}
try {
    $gameAddress = $null
    foreach ($gamePort in 5173..5180) {
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
    if ($CheckOnly) { Write-Output "VJ_SIMULATOR_READY $gameAddress" } else { Start-Process ($gameAddress + '?build=library48-20260914') }
} catch {
    if ($CheckOnly) { throw }
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($_.Exception.Message, 'VJ Simulator') | Out-Null
}
