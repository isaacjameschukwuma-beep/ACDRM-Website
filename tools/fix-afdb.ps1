# Crop the AfDB lockup to just the African Development Bank circle, flatten on white.
Add-Type -AssemblyName System.Drawing
$dir = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\img\partners'
$path = Join-Path $dir 'afdb.png'
$src = New-Object System.Drawing.Bitmap($path)
try {
  $W = $src.Width; $H = $src.Height
  $corner = $src.GetPixel(2,2)
  Write-Host ("afdb.png: {0}x{1}  corner ARGB: {2},{3},{4},{5}" -f $W,$H,$corner.A,$corner.R,$corner.G,$corner.B)

  # Find the green Africa pixels to locate the LEFT mark's horizontal extent
  $minX=$W; $maxX=0; $step=3
  for ($y=0; $y -lt $H; $y+=$step) {
    for ($x=0; $x -lt [int]($W*0.55); $x+=$step) {
      $p=$src.GetPixel($x,$y)
      if ($p.A -gt 40 -and $p.G -gt 110 -and $p.G -gt ($p.R+30) -and $p.G -gt ($p.B+30)) {
        if ($x -lt $minX){$minX=$x}; if ($x -gt $maxX){$maxX=$x}
      }
    }
  }
  Write-Host ("left Africa x-range: {0}..{1}" -f $minX,$maxX)
  # the bank circle ring extends well beyond the Africa shape; use ~ left 49% of width
  $cropW = [int]($W * 0.49)
  $cx = 0
  # vertical: use full height (circle ~ fills height)
  $crop = New-Object System.Drawing.Rectangle($cx, 0, $cropW, $H)

  # flatten onto white, add small padding, square it
  $pad = [int]($H * 0.06)
  $side = [Math]::Max($cropW, $H) + 2*$pad
  $out = New-Object System.Drawing.Bitmap($side, $side)
  $g = [System.Drawing.Graphics]::FromImage($out)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $dx = [int](($side - $cropW)/2); $dy = [int](($side - $H)/2)
  $dest = New-Object System.Drawing.Rectangle($dx, $dy, $cropW, $H)
  $g.DrawImage($src, $dest, $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  # downscale to 320x320 max
  $target = 320
  $final = New-Object System.Drawing.Bitmap($target,$target)
  $g2 = [System.Drawing.Graphics]::FromImage($final)
  $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g2.DrawImage($out, (New-Object System.Drawing.Rectangle(0,0,$target,$target)))
  $g2.Dispose(); $out.Dispose()

  $src.Dispose()   # release lock on the original file before overwriting
  $tmp = Join-Path $dir 'afdb_tmp.png'
  $final.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $final.Dispose()
  Move-Item -Force $tmp $path
  Write-Host ("saved afdb.png -> {0}x{0}  ({1} KB)" -f $target, [math]::Round((Get-Item $path).Length/1KB,1))
} finally { try { $src.Dispose() } catch {} }
