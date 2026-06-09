# Rebuild the shield favicon (logo-icon.png) + a root favicon.ico from the color logo.
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$logo = Join-Path $root 'assets\img\logo\logo.png'          # full color lockup (900x506)
$iconPng = Join-Path $root 'assets\img\logo\logo-icon.png'
$icoPath = Join-Path $root 'favicon.ico'

$src = New-Object System.Drawing.Bitmap($logo)
try {
  $W = $src.Width; $H = $src.Height
  # 1) isolate the shield: left portion of the lockup (before the divider/text)
  $leftW = [int]($W * 0.33)
  # 2) find non-transparent bounding box within that left region
  $minX=$leftW; $minY=$H; $maxX=0; $maxY=0; $step=2
  for ($y=0; $y -lt $H; $y+=$step) {
    for ($x=0; $x -lt $leftW; $x+=$step) {
      $p = $src.GetPixel($x,$y)
      # content = visible AND not near-white (isolates the coloured shield on white bg)
      if ($p.A -gt 30 -and -not ($p.R -gt 238 -and $p.G -gt 238 -and $p.B -gt 238)) {
        if ($x -lt $minX){$minX=$x}; if ($x -gt $maxX){$maxX=$x}
        if ($y -lt $minY){$minY=$y}; if ($y -gt $maxY){$maxY=$y}
      }
    }
  }
  if ($maxX -le $minX) { $minX=0; $minY=0; $maxX=$leftW; $maxY=$H }   # fallback
  $sw = $maxX-$minX+1; $sh = $maxY-$minY+1
  Write-Host ("shield bbox: {0},{1} {2}x{3}" -f $minX,$minY,$sw,$sh)

  # 3) draw the shield centered on a 256x256 transparent square, with padding
  $size = 256; $pad = 26
  $scale = [Math]::Min(($size-2*$pad)/$sw, ($size-2*$pad)/$sh)
  $dw = [int]($sw*$scale); $dh = [int]($sh*$scale)
  $dx = [int](($size-$dw)/2); $dy = [int](($size-$dh)/2)
  $canvas = New-Object System.Drawing.Bitmap($size,$size)
  $g = [System.Drawing.Graphics]::FromImage($canvas)
  $g.Clear([System.Drawing.Color]::White)   # clean white square (matches white-bg logo)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $srcR = New-Object System.Drawing.Rectangle($minX,$minY,$sw,$sh)
  $dstR = New-Object System.Drawing.Rectangle($dx,$dy,$dw,$dh)
  $g.DrawImage($src,$dstR,$srcR,[System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $canvas.Save($iconPng,[System.Drawing.Imaging.ImageFormat]::Png)
  Write-Host "saved logo-icon.png 256x256"

  # 4) build favicon.ico embedding a 64x64 PNG
  $small = New-Object System.Drawing.Bitmap(64,64)
  $g2 = [System.Drawing.Graphics]::FromImage($small)
  $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g2.DrawImage($canvas, (New-Object System.Drawing.Rectangle(0,0,64,64)))
  $g2.Dispose()
  $pngMs = New-Object System.IO.MemoryStream
  $small.Save($pngMs,[System.Drawing.Imaging.ImageFormat]::Png)
  $pngBytes = $pngMs.ToArray(); $pngMs.Dispose(); $small.Dispose()

  $ms = New-Object System.IO.MemoryStream
  $bw = New-Object System.IO.BinaryWriter($ms)
  $bw.Write([UInt16]0); $bw.Write([UInt16]1); $bw.Write([UInt16]1)      # ICONDIR
  $bw.Write([Byte]64); $bw.Write([Byte]64); $bw.Write([Byte]0); $bw.Write([Byte]0)
  $bw.Write([UInt16]1); $bw.Write([UInt16]32)
  $bw.Write([UInt32]$pngBytes.Length); $bw.Write([UInt32]22)            # size + offset
  $bw.Write($pngBytes); $bw.Flush()
  [System.IO.File]::WriteAllBytes($icoPath, $ms.ToArray())
  $ms.Dispose()
  Write-Host ("saved favicon.ico ({0} KB)" -f [math]::Round((Get-Item $icoPath).Length/1KB,1))
  $canvas.Dispose()
} finally { $src.Dispose() }