param([int]$Port = 3333, [string]$Root = (Resolve-Path ".").Path)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Web
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".htm"  = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif"  = "image/gif"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".txt"  = "text/plain; charset=utf-8"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
  ".mp4"  = "video/mp4"
  ".m4v"  = "video/mp4"
  ".mov"  = "video/quicktime"
  ".webm" = "video/webm"
  ".ogg"  = "video/ogg"
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    try {
      $path = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)
      if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
      $local = Join-Path $Root ($path.TrimStart("/") -replace "/", "\")
      if ((Test-Path $local -PathType Container)) { $local = Join-Path $local "index.html" }

      if (Test-Path $local -PathType Leaf) {
        $ext  = [System.IO.Path]::GetExtension($local).ToLower()
        $ct   = if ($mime[$ext]) { $mime[$ext] } else { "application/octet-stream" }
        $size = (Get-Item $local).Length

        $res.ContentType = $ct
        $res.AddHeader("Accept-Ranges", "bytes")

        $rangeHeader = $req.Headers["Range"]
        if ($rangeHeader -and $rangeHeader -match "bytes=(\d*)-(\d*)") {
          $start = if ($Matches[1]) { [long]$Matches[1] } else { 0 }
          $end   = if ($Matches[2]) { [long]$Matches[2] } else { $size - 1 }
          if ($end -ge $size) { $end = $size - 1 }
          $len   = $end - $start + 1

          $res.StatusCode = 206
          $res.AddHeader("Content-Range", "bytes $start-$end/$size")
          $res.ContentLength64 = $len

          $fs = [System.IO.File]::OpenRead($local)
          try {
            $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
            $buf = New-Object byte[] 65536
            $rem = $len
            while ($rem -gt 0) {
              $toRead = [Math]::Min($rem, $buf.Length)
              $n = $fs.Read($buf, 0, $toRead)
              if ($n -le 0) { break }
              $res.OutputStream.Write($buf, 0, $n)
              $rem -= $n
            }
          } finally { $fs.Close() }
        } else {
          $res.StatusCode = 200
          $res.ContentLength64 = $size

          $fs = [System.IO.File]::OpenRead($local)
          try {
            $buf = New-Object byte[] 65536
            while ($true) {
              $n = $fs.Read($buf, 0, $buf.Length)
              if ($n -le 0) { break }
              $res.OutputStream.Write($buf, 0, $n)
            }
          } finally { $fs.Close() }
        }
      } else {
        $res.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    } catch {
      $res.StatusCode = 500
      $msg = [System.Text.Encoding]::UTF8.GetBytes("500 Error: $_")
      try { $res.OutputStream.Write($msg, 0, $msg.Length) } catch {}
    } finally {
      try { $res.Close() } catch {}
    }
  }
} finally {
  $listener.Stop()
}
