# Trim transparent padding + resize the white/gold logo lockups for web use.
Add-Type -AssemblyName System.Drawing

$img = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\img\logo'

function Trim-And-Save {
  param([string]$InPath, [string]$OutPath, [int]$TargetW = 560)
  if (-not (Test-Path $InPath)) { Write-Host "MISSING $InPath" -ForegroundColor Red; return }
  $src = New-Object System.Drawing.Bitmap($InPath)
  try {
    $w = $src.Width; $h = $src.Height
    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
    $step = 2
    for ($y = 0; $y -lt $h; $y += $step) {
      for ($x = 0; $x -lt $w; $x += $step) {
        if ($src.GetPixel($x, $y).A -gt 12) {
          if ($x -lt $minX) { $minX = $x }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($y -gt $maxY) { $maxY = $y }
        }
      }
    }
    if ($maxX -le $minX) { Write-Host "No content found in $InPath" -ForegroundColor Red; return }
    $pad = 6
    $minX = [Math]::Max(0, $minX - $pad); $minY = [Math]::Max(0, $minY - $pad)
    $maxX = [Math]::Min($w - 1, $maxX + $pad); $maxY = [Math]::Min($h - 1, $maxY + $pad)
    $cw = $maxX - $minX + 1; $ch = $maxY - $minY + 1
    $scale = $TargetW / $cw
    $nw = [int][Math]::Round($cw * $scale); $nh = [int][Math]::Round($ch * $scale)
    $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $rect = New-Object System.Drawing.Rectangle($minX, $minY, $cw, $ch)
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0,0,$nw,$nh)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $kb = [Math]::Round((Get-Item $OutPath).Length / 1KB)
    Write-Host ("OK {0} -> {1}x{2} {3} KB" -f (Split-Path $OutPath -Leaf), $nw, $nh, $kb) -ForegroundColor Green
  } finally { $src.Dispose() }
}

Trim-And-Save (Join-Path $img 'White 2.png') (Join-Path $img 'logo-white.png') 560
Trim-And-Save (Join-Path $img 'Gold.png')    (Join-Path $img 'logo-gold.png')  560
Trim-And-Save (Join-Path $img 'ACDRM COMPANY Logo 1 png.png') (Join-Path $img 'logo-color.png') 560
Write-Host "Done."
