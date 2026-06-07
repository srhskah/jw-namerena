Set-Location $PSScriptRoot
try { chcp 65001 | Out-Null } catch {}
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Port = 8080
$Bind = "127.0.0.1"
$Url = "http://${Bind}:${Port}/index.html"

function Get-PortListenerPids {
    param([int]$Port)

    $pids = New-Object System.Collections.Generic.HashSet[int]

    try {
        $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop
        foreach ($conn in $conns) {
            if ($conn.LocalAddress -notin @("127.0.0.1", "0.0.0.0", "::", "::1")) { continue }
            if ($conn.OwningProcess -and $conn.OwningProcess -ne $PID) {
                [void]$pids.Add([int]$conn.OwningProcess)
            }
        }
    }
    catch {
        netstat -ano | ForEach-Object {
            if ($_ -match "^\s*TCP\s+127\.0\.0\.1:${Port}\s+0\.0\.0\.0:0\s+LISTENING\s+(\d+)\s*$") {
                $found = [int]$Matches[1]
                if ($found -ne $PID) { [void]$pids.Add($found) }
            }
        }
    }

    return @($pids)
}

function Stop-PortListeners {
    param([int]$Port)

    $targets = Get-PortListenerPids -Port $Port
    if ($targets.Count -eq 0) { return 0 }

    foreach ($procId in $targets) {
        try {
            $proc = Get-Process -Id $procId -ErrorAction Stop
            Write-Host ("清理占用 {0} 端口的进程: {1} (PID {2})" -f $Port, $proc.ProcessName, $procId)
            Stop-Process -Id $procId -Force -ErrorAction Stop
        }
        catch {
            Write-Host ("无法结束 PID {0}: {1}" -f $procId, $_.Exception.Message)
        }
    }

    return $targets.Count
}

function Wait-PortFree {
    param([int]$Port, [int]$TimeoutSec = 5)

    $deadline = (Get-Date).AddSeconds($TimeoutSec)
    while ((Get-Date) -lt $deadline) {
        if ((Get-PortListenerPids -Port $Port).Count -eq 0) { return $true }
        Start-Sleep -Milliseconds 200
    }
    return ((Get-PortListenerPids -Port $Port).Count -eq 0)
}

Write-Host "名字竞技场本地开发服务器"
Write-Host ("正在检查 {0}:{1} ..." -f $Bind, $Port)

$cleared = Stop-PortListeners -Port $Port
if ($cleared -gt 0) {
    if (-not (Wait-PortFree -Port $Port)) {
        Write-Host "警告: 端口仍被占用，F5 刷新可能失败。请手动结束相关 python 进程。" -ForegroundColor Yellow
        exit 1
    }
    Write-Host ("已清理 {0} 个旧进程，端口已释放。" -f $cleared)
}
else {
    Write-Host ("端口 {0} 空闲。" -f $Port)
}

Write-Host ("地址: {0}" -f $Url)
Write-Host "按 Ctrl+C 停止"
Write-Host ""

python -m http.server $Port --bind $Bind
