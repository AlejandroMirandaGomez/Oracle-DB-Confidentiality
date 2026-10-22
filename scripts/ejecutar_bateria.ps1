$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$dirSql = Join-Path $raiz 'sql'
$dirEvidencias = Join-Path $raiz 'evidencias'
New-Item -ItemType Directory -Force $dirEvidencias | Out-Null

$env:NLS_LANG = 'SPANISH_COSTA RICA.AL32UTF8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$utf8SinBom = New-Object System.Text.UTF8Encoding($false)

$oracleHome = Split-Path -Parent (Split-Path -Parent (Get-Command sqlplus).Source)
$oracleBase = Split-Path -Parent $oracleHome
$oracleBaseHome = (& (Join-Path $oracleHome 'bin\orabasehome.exe')).Trim()
$dirRed = Join-Path $oracleBaseHome 'network\admin'

$nombreEquipo = $env:COMPUTERNAME
$direccionesLocales = @(Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object { $_.IPAddress -ne '127.0.0.1' } |
    ForEach-Object { $_.IPAddress })

function Get-DirectorioRespaldos {
    $consulta = "SET HEADING OFF FEEDBACK OFF PAGESIZE 0`nSELECT value FROM v`$rman_configuration WHERE name = 'CHANNEL';`nEXIT"
    $salida = $consulta | & sqlplus -s -L '/ as sysdba' 2>&1 | Out-String
    if ($salida -match "FORMAT\s+'([^']+)'") {
        return Split-Path -Parent $Matches[1]
    }
    return $null
}

$dirRespaldos = Get-DirectorioRespaldos

$sustitucionesDeRutas = @(
    @{ Ruta = $oracleBaseHome; Marcador = '<ORACLE_BASE_HOME>' },
    @{ Ruta = $oracleBase; Marcador = '<ORACLE_BASE>' }
)
if ($dirRespaldos) {
    $sustitucionesDeRutas += @{ Ruta = $dirRespaldos; Marcador = '<DIR_RESPALDOS>' }
}

function ConvertTo-EvidenciaPublicable([string]$texto) {
    $resultado = $texto -ireplace [regex]::Escape($nombreEquipo), 'EQUIPO-LOCAL'
    foreach ($direccion in $direccionesLocales) {
        $resultado = $resultado -replace ('(?<![\d.])' + [regex]::Escape($direccion) + '(?![\d.])'), 'IP-LOCAL'
    }
    foreach ($sustitucion in $sustitucionesDeRutas) {
        $resultado = $resultado -ireplace [regex]::Escape($sustitucion.Ruta), $sustitucion.Marcador
    }
    return $resultado
}

function New-ClavePrueba {
    $grupos = @('ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnpqrstuvwxyz', '23456789', '#_')
    $caracteres = foreach ($grupo in $grupos) { 1..4 | ForEach-Object { $grupo[(Get-Random -Maximum $grupo.Length)] } }
    $mezcla = $caracteres | Sort-Object { Get-Random }
    return 'Lg' + (-join $mezcla)
}

function Invoke-Sqlplus([string]$archivo, [string[]]$argumentos = @()) {
    $ruta = Join-Path $dirSql $archivo
    $salida = & sqlplus -s -L '/ as sysdba' "@$ruta" @argumentos 2>&1 | Out-String
    return [pscustomobject]@{ Texto = $salida; Codigo = $LASTEXITCODE }
}

$registro = New-Object System.Collections.ArrayList

function Save-Evidencia([string]$id, [string]$texto, [int]$codigo) {
    $archivo = Join-Path $dirEvidencias "$id.txt"
    [System.IO.File]::WriteAllText($archivo, (ConvertTo-EvidenciaPublicable $texto).TrimEnd() + "`n", $utf8SinBom)
    [void]$registro.Add([pscustomobject]@{ id = $id; archivo = "evidencias/$id.txt"; codigoSalida = $codigo })
    Write-Host ("{0,-24} codigo {1}" -f $id, $codigo)
}

function Get-ArchivoConfiguracion([string]$nombre) {
    $ruta = Join-Path $dirRed $nombre
    if (-not (Test-Path $ruta)) { return "$nombre no existe en $dirRed" }
    $lineas = Get-Content $ruta | Where-Object { $_ -notmatch '^\s*#' -and $_.Trim() -ne '' }
    return "----- $nombre (sin líneas de comentario)`n" + ($lineas -join "`n")
}

$claves = @{ lector = New-ClavePrueba; soporte = New-ClavePrueba; bloqueo = New-ClavePrueba }
$inicio = Get-Date

$preparacion = Invoke-Sqlplus '00_preparar_entorno_prueba.sql' @($claves.lector, $claves.soporte, $claves.bloqueo)
Save-Evidencia '00_preparacion' $preparacion.Texto $preparacion.Codigo
if ($preparacion.Codigo -ne 0) {
    $limpieza = Invoke-Sqlplus '99_eliminar_entorno_prueba.sql'
    Save-Evidencia '99_limpieza' $limpieza.Texto $limpieza.Codigo
    throw 'La preparación del entorno de prueba falló; se ejecutó la limpieza.'
}

try {
    $pruebasSql = @(
        @{ id = 'PR-01'; archivo = 'PR-01_contrasenas_por_defecto.sql' },
        @{ id = 'PR-02'; archivo = 'PR-02_cuentas_oracle_abiertas.sql' },
        @{ id = 'PR-03'; archivo = 'PR-03_titulares_dba_sysdba.sql' },
        @{ id = 'PR-04'; archivo = 'PR-04_privilegios_any.sql' },
        @{ id = 'PR-05'; archivo = 'PR-05_public_canales_extraccion.sql' },
        @{ id = 'PR-06'; archivo = 'PR-06_perfiles_contrasena.sql' },
        @{ id = 'PR-07'; archivo = 'PR-07_bloqueo_intentos_fallidos.sql'; argumentos = @($claves.bloqueo) },
        @{ id = 'PR-08'; archivo = 'PR-08_verificadores_contrasena.sql' },
        @{ id = 'PR-09'; archivo = 'PR-09_minimo_privilegio.sql'; argumentos = @($claves.lector) },
        @{ id = 'PR-10'; archivo = 'PR-10_vpd_restriccion_filas.sql'; argumentos = @($claves.soporte) },
        @{ id = 'PR-11'; archivo = 'PR-11_redaccion_datos.sql'; argumentos = @($claves.soporte) },
        @{ id = 'PR-12'; archivo = 'PR-12_clasificacion_columnas.sql' },
        @{ id = 'PR-13'; archivo = 'PR-13_clon_dev_enmascarado.sql' },
        @{ id = 'PR-14'; archivo = 'PR-14_cifrado_tde.sql' },
        @{ id = 'PR-15'; archivo = 'PR-15_auditoria_unificada.sql' },
        @{ id = 'PR-16'; archivo = 'PR-16_proteccion_rastro_auditoria.sql' },
        @{ id = 'PR-17'; archivo = 'PR-17_respaldos_rman.sql' }
    )
    foreach ($prueba in $pruebasSql) {
        $argumentos = if ($prueba.ContainsKey('argumentos')) { $prueba.argumentos } else { @() }
        $resultado = Invoke-Sqlplus $prueba.archivo $argumentos
        Save-Evidencia $prueba.id $resultado.Texto $resultado.Codigo
    }

    $cabeceraRman = "PR-18 | Validación de la restauración desde los respaldos | A8.13`nEjecutado $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz') | Herramienta RMAN`n"
    $salidaRman = & rman target / cmdfile=(Join-Path $dirSql 'PR-18_validar_restauracion.rman') 2>&1 | Out-String
    Save-Evidencia 'PR-18' ($cabeceraRman + $salidaRman) $LASTEXITCODE

    $resultado = Invoke-Sqlplus 'PR-19_cifrado_red.sql'
    Save-Evidencia 'PR-19' $resultado.Texto $resultado.Codigo

    $cabeceraRed = "PR-20 | Configuración del listener y de Oracle Net | A8.20`nEjecutado $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz') | Herramientas lsnrctl y revisión de archivos`n"
    $estadoListener = & lsnrctl status 2>&1 | Out-String
    $textoRed = $cabeceraRed + "`n----- lsnrctl status`n" + $estadoListener + "`n" + (Get-ArchivoConfiguracion 'sqlnet.ora') + "`n`n" + (Get-ArchivoConfiguracion 'listener.ora')
    Save-Evidencia 'PR-20' $textoRed $LASTEXITCODE

    $resultado = Invoke-Sqlplus 'PR-21_papelera_purga.sql'
    Save-Evidencia 'PR-21' $resultado.Texto $resultado.Codigo

    $resultado = Invoke-Sqlplus 'PR-22_nivel_parches.sql'
    [Console]::OutputEncoding = [System.Text.Encoding]::GetEncoding(1252)
    $opatch = & (Join-Path $oracleHome 'OPatch\opatch.bat') lspatches 2>&1 | Out-String
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Save-Evidencia 'PR-22' ($resultado.Texto + "`n----- opatch lspatches`n" + $opatch) $resultado.Codigo

    $resultado = Invoke-Sqlplus 'PR-23_cuentas_inactivas.sql'
    Save-Evidencia 'PR-23' $resultado.Texto $resultado.Codigo
}
finally {
    $limpieza = Invoke-Sqlplus '99_eliminar_entorno_prueba.sql'
    Save-Evidencia '99_limpieza' $limpieza.Texto $limpieza.Codigo
    $claves.Clear()
}

$resumen = [pscustomobject]@{
    inicio = $inicio.ToString('yyyy-MM-ddTHH:mm:sszzz')
    fin = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
    instancia = 'Oracle Database 21c Express Edition, PDB XEPDB1'
    evidencias = $registro
}
[System.IO.File]::WriteAllText((Join-Path $dirEvidencias 'ejecucion.json'), ($resumen | ConvertTo-Json -Depth 4), $utf8SinBom)
