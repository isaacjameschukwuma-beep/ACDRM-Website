# Crop the 2-photo collage project images down to their single best photo,
# so engagement cards show a clean image (no split/letterbox).
# Source = the already-optimised projects/project-N.jpg (regenerable via optimize-images.ps1).
Add-Type -AssemblyName System.Drawing
$dir = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\img\projects'

function Get-JpegEncoder { [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } }

function Crop-Save {
  param([string]$Name, [int]$X, [int]$Y, [int]$W, [int]$H)
  $path = Join-Path $dir $Name
  $src = New-Object System.Drawing.Bitmap($path)
  try {
    $cw = [Math]::Min($W, $src.Width - $X)
    $ch = [Math]::Min($H, $src.Height - $Y)
    $bmp = New-Object System.Drawing.Bitmap($cw, $ch)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $dest = New-Object System.Drawing.Rectangle(0, 0, $cw, $ch)
    $srcR = New-Object System.Drawing.Rectangle($X, $Y, $cw, $ch)
    $g.DrawImage($src, $dest, $srcR, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
  } finally { $src.Dispose() }
  $enc = Get-JpegEncoder
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)
  $bmp.Save($path, $enc, $ep)
  $bmp.Dispose()
  Write-Host ("cropped {0} -> {1}x{2}" -f $Name, $cw, $ch) -ForegroundColor Green
}

# project images are 1200x1500 collages (top photo / bottom photo)
Crop-Save 'project-1.jpg' 0 0   1200 720   # cert presentation (top)
Crop-Save 'project-2.jpg' 0 0   1200 660   # CSEA presentation (top)
Crop-Save 'project-3.jpg' 0 780 1200 720   # Decolonisation panel (bottom)
Crop-Save 'project-4.jpg' 0 0   1200 690   # 7th Leadership Lecture podium (top)
Write-Host "Done. (project-5 left as-is)"
