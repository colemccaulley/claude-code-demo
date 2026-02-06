<#
.SYNOPSIS
    Automated backup script for files and folders

.DESCRIPTION
    This PowerShell script demonstrates file backup capabilities.
    It copies files from a source to a destination with timestamp.

.PARAMETER SourcePath
    The path to backup from

.PARAMETER DestinationPath
    The path to backup to

.EXAMPLE
    .\backup-script.ps1 -SourcePath "C:\Data" -DestinationPath "D:\Backups"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$SourcePath,

    [Parameter(Mandatory=$true)]
    [string]$DestinationPath
)

# Create timestamp for backup folder
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = Join-Path $DestinationPath "Backup_$timestamp"

try {
    # Create backup directory
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    Write-Host "Created backup folder: $backupFolder" -ForegroundColor Green

    # Copy files
    Copy-Item -Path "$SourcePath\*" -Destination $backupFolder -Recurse -Force
    Write-Host "Backup completed successfully!" -ForegroundColor Green

    # Display summary
    $fileCount = (Get-ChildItem -Path $backupFolder -Recurse -File).Count
    Write-Host "`nBackup Summary:" -ForegroundColor Cyan
    Write-Host "  Files backed up: $fileCount"
    Write-Host "  Location: $backupFolder"
}
catch {
    Write-Host "Error during backup: $_" -ForegroundColor Red
    exit 1
}
