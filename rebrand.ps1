$files = Get-ChildItem 'C:\Users\ellio\typeflow\*.html'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $content = $content -replace 'TypeFlow', 'SpeedyTyper'
    $content = $content -replace 'typeflow\.com', 'speedytyper.com'
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host ('Updated: ' + $file.Name)
}
