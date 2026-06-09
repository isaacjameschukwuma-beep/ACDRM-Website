# Minimal static file server for the ACDRM site (no Node/Python needed).
# Usage:  powershell -ExecutionPolicy Bypass -File tools\serve.ps1 [port]
param([int]$Port = 8080)

$root = Split-Path -Parent $PSScriptRoot
$prefix = "http://localhost:$Port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() }
catch { Write-Host "Could not start on $prefix - $($_.Exception.Message)" -ForegroundColor Red; exit 1 }

Write-Host "ACDRM site serving at $prefix  (root: $root)" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray

$types = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8';
  '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.json'='application/json'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg';
  '.gif'='image/gif'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.webp'='image/webp';
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.ttf'='font/ttf'; '.pdf'='application/pdf'
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
  } catch { break }
  $req = $ctx.Request
  $res = $ctx.Response
  try {
    $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
    $path = Join-Path $root ($rel -replace '/', '\')
    if ((Test-Path $path) -and (Get-Item $path).PSIsContainer) { $path = Join-Path $path 'index.html' }

    if (Test-Path $path -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($path).ToLower()
      $ct = $types[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $res.ContentType = $ct
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("200  /{0}" -f $rel) -ForegroundColor DarkGray
    } else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: /$rel")
      $res.OutputStream.Write($msg, 0, $msg.Length)
      Write-Host ("404  /{0}" -f $rel) -ForegroundColor Yellow
    }
  } catch {
    Write-Host "ERR  $($_.Exception.Message)" -ForegroundColor Red
  } finally {
    $res.OutputStream.Close()
  }
}
