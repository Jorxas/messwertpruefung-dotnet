$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$env:DOTNET_CLI_HOME = Join-Path $PWD 'ausgabe/dotnet-benutzer'
$env:NUGET_PACKAGES = Join-Path $PWD 'ausgabe/nuget-pakete'
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = '1'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_CLI_UI_LANGUAGE = 'de'
$env:DOTNET_NOLOGO = '1'
$env:DOTNET_ADD_GLOBAL_TOOLS_TO_PATH = '0'
$kodierung = [System.Text.UTF8Encoding]::new($false)
$prozess = [System.Diagnostics.Process]::new()
$prozess.StartInfo.FileName = 'dotnet'
$prozess.StartInfo.Arguments = 'run --project nachweise/P05-T03_abnahme.csproj'
$prozess.StartInfo.UseShellExecute = $false
$prozess.StartInfo.CreateNoWindow = $true
$prozess.StartInfo.RedirectStandardOutput = $true
$prozess.StartInfo.RedirectStandardError = $true
$prozess.StartInfo.StandardOutputEncoding = $kodierung
$prozess.StartInfo.StandardErrorEncoding = $kodierung
[void]$prozess.Start()
$ausgabeAufgabe = $prozess.StandardOutput.ReadToEndAsync()
$fehlerAufgabe = $prozess.StandardError.ReadToEndAsync()
$prozess.WaitForExit()
$ausgabe = $ausgabeAufgabe.GetAwaiter().GetResult() + $fehlerAufgabe.GetAwaiter().GetResult()
$code = $prozess.ExitCode
$prozess.Dispose()
[System.IO.File]::WriteAllText((Join-Path $PWD 'nachweise/P05-T03_abnahmeausgabe.txt'), $ausgabe + "`nExitcode: $code`n", $kodierung)
$ausgabe
if ($code -ne 0) { throw "WPF-Abnahme fehlgeschlagen: Exitcode $code" }
git diff --check -- .
if ($LASTEXITCODE -ne 0) { throw 'git diff --check meldet einen Befund.' }
Write-Output 'BESTANDEN: WPF-Abnahme und git diff --check. Interaktive Dateiauswahl siehe nachweise/P05-T03_pruefprotokoll.md.'
