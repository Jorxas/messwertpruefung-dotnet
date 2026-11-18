$ErrorActionPreference = 'Stop'
$env:DOTNET_CLI_HOME = Join-Path $PWD 'ausgabe/dotnet-benutzer'
$env:NUGET_PACKAGES = Join-Path $PWD 'ausgabe/nuget-pakete'
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE = '1'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'
$env:DOTNET_CLI_UI_LANGUAGE = 'de'
$env:DOTNET_NOLOGO = '1'
$env:DOTNET_ADD_GLOBAL_TOOLS_TO_PATH = '0'
$kodierung = [System.Text.UTF8Encoding]::new($false)

$sdkAusgabe = dotnet --info
[System.IO.File]::WriteAllLines((Join-Path $PWD 'nachweise/P05-T02_dotnet-umgebung.txt'), [string[]]$sdkAusgabe, $kodierung)
$abnahmeAusgabe = dotnet run --project nachweise/P05-T02_abnahme.csproj
$abnahmeCode = $LASTEXITCODE
[System.IO.File]::WriteAllLines((Join-Path $PWD 'nachweise/P05-T02_abnahmeausgabe.txt'), [string[]]$abnahmeAusgabe, $kodierung)
$abnahmeAusgabe
if ($abnahmeCode -ne 0) { throw "C#-Abnahme fehlgeschlagen: Exitcode $abnahmeCode" }

[System.IO.File]::WriteAllText((Join-Path $PWD 'ausgabe/abnahme/gueltig.csv'), "messung_id,wert,einheit`nG01,9.5,mm`nG02,10.6,mm`n", $kodierung)
$protokoll = [System.Collections.Generic.List[string]]::new()
foreach ($fall in @(
    @{ Datei = $null; Erwartet = 1 },
    @{ Datei = 'ausgabe/abnahme/gueltig.csv'; Erwartet = 0 },
    @{ Datei = 'ausgabe/abnahme/nicht-vorhanden.csv'; Erwartet = 2 }
)) {
    $argumente = @('run', '--no-restore', '--project', 'src/Messungen.csproj')
    if ($fall.Datei) { $argumente += @('--', $fall.Datei) }
    $protokoll.Add("Befehl: dotnet $($argumente -join ' ')")
    # Getrennte Streams erfassen, auch unter Windows PowerShell 5.1.
    # Die festgelegten Argumente enthalten keine Leerzeichen oder Benutzereingaben.
    $prozess = [System.Diagnostics.Process]::new()
    $prozess.StartInfo.FileName = 'dotnet'
    $prozess.StartInfo.Arguments = $argumente -join ' '
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
    $protokoll.Add($ausgabeAufgabe.GetAwaiter().GetResult().TrimEnd())
    $fehlertext = $fehlerAufgabe.GetAwaiter().GetResult().TrimEnd()
    if ($fehlertext) { $protokoll.Add($fehlertext) }
    $code = $prozess.ExitCode
    $prozess.Dispose()
    $protokoll.Add("Exitcode: $code; erwartet: $($fall.Erwartet)")
    if ($code -ne $fall.Erwartet) { throw "Unerwarteter Konsolen-Exitcode: $code" }
}
[System.IO.File]::WriteAllLines((Join-Path $PWD 'nachweise/P05-T02_konsolenausgabe.txt'), $protokoll, $kodierung)
$protokoll
git diff --check -- .
if ($LASTEXITCODE -ne 0) { throw 'git diff --check meldet einen Befund.' }
Write-Output 'BESTANDEN: C#-Abnahme, drei Konsolenläufe und git diff --check.'
