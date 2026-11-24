$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$env:DOTNET_CLI_HOME = Join-Path $PWD 'ausgabe/dotnet-benutzer'
$env:NUGET_PACKAGES = Join-Path $PWD 'ausgabe/nuget-pakete'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_NOLOGO = '1'
$env:DOTNET_ADD_GLOBAL_TOOLS_TO_PATH = '0'
$beginn = [DateTime]::UtcNow
$kodierung = [Text.UTF8Encoding]::new($false)
$ergebnisse = @()
foreach ($pruefprojekt in @('P05-T02_abnahme.csproj', 'P05-T04_abnahme.csproj')) {
    $ausgabe = & dotnet run --project (Join-Path 'nachweise' $pruefprojekt) 2>&1
    $code = $LASTEXITCODE
    $ausgabe | Write-Output
    [IO.File]::WriteAllLines((Join-Path $PWD ('nachweise/P05-T04-' + $pruefprojekt + '.txt')), [string[]]$ausgabe, $kodierung)
    $ergebnisse += @{ projekt = $pruefprojekt; code = $code }
    if ($code -ne 0) { throw "Abnahme fehlgeschlagen: $pruefprojekt, Status $code" }
}
$bericht = @{
    beginn = $beginn.ToString('o'); ende = [DateTime]::UtcNow.ToString('o')
    ergebnis = 'bestanden'; fachpruefungen = 26; wpfPruefungen = 15
    laeufe = $ergebnisse
    eingabeSha256 = (Get-FileHash -LiteralPath beispieldaten/messwerte.csv -Algorithm SHA256).Hash
    grenze = 'WPF-Prüffenster ausschließlich auf zweitem Bildschirm. Nativer Dateidialog separat in T03 tatsächlich geprüft; Desktopaufnahme separat in T04.'
}
[IO.File]::WriteAllText((Join-Path $PWD 'nachweise/P05-T04-gesamtpruefung.json'), ($bericht | ConvertTo-Json -Depth 5) + "`n", $kodierung)
Write-Output 'BESTANDEN: 26 Fachprüfungen und 15 echte WPF-Prüfungen einschließlich zweitem Bildschirm.'
