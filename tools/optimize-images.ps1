# ACDRM image optimizer — resizes + recompresses source images to web-ready files.
# Uses .NET System.Drawing (built into Windows). Originals are never modified.
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$img  = Join-Path $root 'assets\img'

# Ensure output folders exist
foreach ($d in @('projects','team')) {
  $p = Join-Path $img $d
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null }
}

function Get-JpegEncoder {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Save-Resized {
  param(
    [string]$InPath,
    [string]$OutPath,
    [int]$MaxLongSide,
    [int]$Quality = 82,
    [string]$Format = 'jpg'   # 'jpg' or 'png'
  )
  if (-not (Test-Path $InPath)) { Write-Host "  MISSING: $InPath" -ForegroundColor Red; return }
  $src = [System.Drawing.Image]::FromFile($InPath)
  try {
    $w = $src.Width; $h = $src.Height
    $scale = [Math]::Min(1.0, $MaxLongSide / [Math]::Max($w, $h))
    $nw = [int][Math]::Round($w * $scale)
    $nh = [int][Math]::Round($h * $scale)
    $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
    $bmp.SetResolution(96, 96)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    if ($Format -eq 'jpg') {
      # Flatten onto white so any transparency does not turn black in JPEG
      $g.Clear([System.Drawing.Color]::White)
    }
    $g.DrawImage($src, 0, 0, $nw, $nh)
    $g.Dispose()
    if ($Format -eq 'jpg') {
      $enc = Get-JpegEncoder
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
      $bmp.Save($OutPath, $enc, $ep)
    } else {
      $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bmp.Dispose()
    $kb = [Math]::Round((Get-Item $OutPath).Length / 1KB)
    Write-Host ("  OK  {0}  ->  {1}x{2}  {3} KB" -f (Split-Path $OutPath -Leaf), $nw, $nh, $kb) -ForegroundColor Green
  } finally {
    $src.Dispose()
  }
}

Write-Host "== Hero ==" -ForegroundColor Cyan
1..4 | ForEach-Object {
  Save-Resized (Join-Path $img "hero\$_.png") (Join-Path $img "hero\hero-$_.jpg") 1600 82 'jpg'
}

Write-Host "== Projects / Engagements ==" -ForegroundColor Cyan
1..5 | ForEach-Object {
  Save-Resized (Join-Path $img "Project Images\$_.png") (Join-Path $img "projects\project-$_.jpg") 1500 82 'jpg'
}

Write-Host "== Founder ==" -ForegroundColor Cyan
Save-Resized (Join-Path $img 'founder\Director Prof. Pic. .PNG') (Join-Path $img 'founder\founder.jpg') 1000 88 'jpg'

Write-Host "== Team ==" -ForegroundColor Cyan
Save-Resized (Join-Path $img 'Project Manager\IMG_5856.JPG.jpeg') (Join-Path $img 'team\iheoma-job.jpg') 1000 88 'jpg'

Write-Host "== Logo (PNG, keep transparency) ==" -ForegroundColor Cyan
Save-Resized (Join-Path $img 'logo\ACDRM COMPANY Logo 1 png.png') (Join-Path $img 'logo\logo.png') 900 0 'png'

Write-Host "Done." -ForegroundColor Cyan
