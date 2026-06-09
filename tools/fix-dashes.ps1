# Remove all em-dashes (U+2014) and en-dashes (U+2013) from site HTML.
#  - <title> em-dashes  -> " - " (hyphen, conventional separator)
#  - en-dashes (ranges) -> "-"  (e.g. 2025-2029)
#  - clause em-dashes    -> ", " (comma, cleaner prose)
$root = Split-Path -Parent $PSScriptRoot
$files = @(Join-Path $root 'index.html') + (Get-ChildItem (Join-Path $root 'pages') -Filter *.html | ForEach-Object { $_.FullName })
$enc = New-Object System.Text.UTF8Encoding($false)   # UTF-8, no BOM
$em = [char]0x2014
$en = [char]0x2013

foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f)
  # 1) Titles: em-dash -> hyphen
  $c = [regex]::Replace($c, '(<title>[^<]*?)\s*' + $em + '\s*', '$1 - ')
  # 2) en-dash -> hyphen (date/number ranges)
  $c = $c -replace $en, '-'
  # 3) remaining em-dashes (with optional surrounding whitespace) -> comma+space
  $c = [regex]::Replace($c, '\s*' + $em + '\s*', ', ')
  [System.IO.File]::WriteAllText($f, $c, $enc)
  Write-Host ("fixed {0}" -f (Split-Path $f -Leaf)) -ForegroundColor Green
}
Write-Host "Done."
