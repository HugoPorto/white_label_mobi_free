# run-multi.ps1

# Detectar e imprimir IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or ($_.IPAddress -like "172.*" -and $_.IPAddress -notlike "172.17.*")
}).IPAddress | Select-Object -First 1

Write-Host "IP: $localIP"

# Verificar se Metro já está rodando
Write-Host "[CHECK] Verificando se Metro ja esta rodando..." -ForegroundColor Yellow

$metroPort = netstat -ano | findstr :8081 | Where-Object { $_ -like "*LISTENING*" -or $_ -like "*ESTABLISHED*" }
if ($metroPort -and $metroPort.Trim() -ne "") {
    Write-Host "[FOUND] Metro ja esta rodando na porta 8081!" -ForegroundColor Red
    Write-Host $metroPort -ForegroundColor White
    
    # Extrair PID da primeira linha válida (LISTENING ou ESTABLISHED)
    $firstValidLine = $metroPort | Select-Object -First 1
    $processPID = ($firstValidLine -split '\s+')[-1]
    
    if ($processPID -and $processPID -ne "0") {
        Write-Host "[KILL] Finalizando processo PID: $processPID" -ForegroundColor Red
        
        try {
            Stop-Process -Id $processPID -Force
            Write-Host "[OK] Processo Metro finalizado!" -ForegroundColor Green
        } catch {
            Write-Host "[ERROR] Erro ao finalizar processo: $_" -ForegroundColor Red
        }
        
        # Aguardar um pouco para garantir que finalizou
        Start-Sleep -Seconds 2
        
        # Verificar se realmente finalizou
        $checkPort = netstat -ano | findstr :8081 | Where-Object { $_ -like "*LISTENING*" -or $_ -like "*ESTABLISHED*" }
        if ($checkPort -and $checkPort.Trim() -ne "") {
            Write-Host "[ERROR] Falha ao finalizar Metro." -ForegroundColor Red
        } else {
            Write-Host "[CLEAN] Porta 8081 liberada." -ForegroundColor Green
        }
        
        Write-Host "[EXIT] Script finalizado apos matar Metro." -ForegroundColor Yellow
        exit 0
    } else {
        Write-Host "[INFO] Conexoes TIME_WAIT encontradas (normais apos fechar Metro)" -ForegroundColor Yellow
        Write-Host "[OK] Nenhum processo ativo na porta 8081." -ForegroundColor Green
    }
} else {
    Write-Host "[OK] Porta 8081 esta livre." -ForegroundColor Green
}

Write-Host "[METRO] Iniciando Metro Bundler..."
Start-Process powershell -ArgumentList "npx expo start --dev-client" -NoNewWindow

Start-Sleep -Seconds 5

Write-Host "[ADB] Listando dispositivos conectados..."
$devices = adb devices | Select-String "device$" | ForEach-Object {
    Write-Host "[DEVICE] Encontrado: $_"
    ($_ -split "`t")[0]
}

if ($devices.Count -eq 0) {
    Write-Host "[ERROR] Nenhum dispositivo encontrado."
    exit
}

# Write-Host "[REVERSE] Fazendo adb reverse na porta 8081..."
# foreach ($d in $devices) {
#     adb -s $d reverse tcp:8081 tcp:8081
# }

# Caminho do APK (ajuste se necessário)
$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"

if (!(Test-Path $apkPath)) {
    Write-Host "[BUILD] APK nao encontrado, construindo com gradlew assembleDebug..."
    cd android
    ./gradlew assembleDebug
    cd ..
}

Write-Host "[INSTALL] Instalando APK nos dispositivos..."
foreach ($d in $devices) {
    adb -s $d install -r $apkPath
}

# Write-Host "[START] Abrindo app em cada dispositivo..."
# foreach ($d in $devices) {
#     adb -s $d shell monkey -p com.partiu1 1
# }

Write-Host "[OK] Tudo pronto! Metro rodando..."
