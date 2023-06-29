$parentPath = Split-Path -Parent $PSScriptRoot
$dirsToDelete = @("img", "static")
foreach ($dir in $dirsToDelete) {
    $dirPath = Join-Path -Path $parentPath -ChildPath $dir
    if (Test-Path -Path $dirPath) {
        Remove-Item -Path $dirPath -Force -Recurse
    }
}


$buildPath = Join-Path -Path $PSScriptRoot -ChildPath 'build'
if (Test-Path -Path $buildPath) {
    Remove-Item -Path $buildPath -Force -Recurse
}

npm run build

$buildPath = Join-Path -Path $PSScriptRoot -ChildPath 'build'
$parentPath = Split-Path -Parent $PSScriptRoot

Get-ChildItem -Path $buildPath | ForEach-Object {
    $srcPath = $_.FullName
    $destPath = Join-Path -Path $parentPath -ChildPath $_.Name
    Move-Item -Path $srcPath -Destination $destPath -Force
}
