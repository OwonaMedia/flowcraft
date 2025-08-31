#!/usr/bin/env python3
"""
FlowCraft Automatic FTP Upload Script
Uploads FlowCraft to flowcraft.owona.de
"""

import ftplib
import os
import sys
from pathlib import Path

# FTP Configuration
FTP_HOST = "ftp.goneo.de"
FTP_USER = "163544f130388"
FTP_PASS = "Afidi2008!"
REMOTE_DIR = "/flowcraft"  # Target directory for subdomain

def upload_directory(ftp, local_path, remote_path=""):
    """Upload directory recursively"""
    try:
        for item in os.listdir(local_path):
            local_item = os.path.join(local_path, item)
            remote_item = f"{remote_path}/{item}" if remote_path else item
            
            if os.path.isfile(local_item):
                print(f"📁 Uploading: {item}")
                with open(local_item, 'rb') as f:
                    try:
                        ftp.storbinary(f'STOR {remote_item}', f)
                        print(f"✅ Uploaded: {item}")
                    except Exception as e:
                        print(f"❌ Failed to upload {item}: {e}")
            
            elif os.path.isdir(local_item):
                print(f"📂 Creating directory: {remote_item}")
                try:
                    ftp.mkd(remote_item)
                except ftplib.error_perm:
                    pass  # Directory might already exist
                
                # Recursively upload subdirectory
                upload_directory(ftp, local_item, remote_item)
                
    except Exception as e:
        print(f"❌ Error in directory upload: {e}")

def main():
    print("🚀 FlowCraft FTP Upload gestartet...")
    print(f"📡 Verbinde zu: {FTP_HOST}")
    
    try:
        # Connect to FTP server with TLS
        ftp = ftplib.FTP_TLS(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.prot_p()  # Enable data encryption
        
        print("✅ FTP-Verbindung erfolgreich!")
        print("📋 Server-Info:")
        print(ftp.getwelcome())
        
        # Navigate to target directory
        try:
            ftp.cwd(REMOTE_DIR)
            print(f"✅ Wechsel zu {REMOTE_DIR} erfolgreich")
        except ftplib.error_perm:
            print(f"📁 Erstelle Verzeichnis: {REMOTE_DIR}")
            ftp.mkd(REMOTE_DIR)
            ftp.cwd(REMOTE_DIR)
        
        # Show current directory
        current_dir = ftp.pwd()
        print(f"📍 Aktuelles Verzeichnis: {current_dir}")
        
        # Upload all files and directories
        print("\n🔄 Upload gestartet...")
        
        # Upload static directory
        if os.path.exists("static"):
            print("📁 Uploading static/ directory...")
            try:
                ftp.mkd("static")
            except ftplib.error_perm:
                pass
            upload_directory(ftp, "static", "static")
        
        # Upload server directory  
        if os.path.exists("server"):
            print("📁 Uploading server/ directory...")
            try:
                ftp.mkd("server")
            except ftplib.error_perm:
                pass
            upload_directory(ftp, "server", "server")
        
        # Upload public directory
        if os.path.exists("public"):
            print("📁 Uploading public/ directory...")
            try:
                ftp.mkd("public")
            except ftplib.error_perm:
                pass
            upload_directory(ftp, "public", "public")
        
        # Upload individual files
        files_to_upload = [
            "package.json",
            ".env.template", 
            "README-DEPLOYMENT.md",
            "FLOWCRAFT-DEPLOYMENT-GUIDE.md"
        ]
        
        for filename in files_to_upload:
            if os.path.exists(filename):
                print(f"📄 Uploading: {filename}")
                with open(filename, 'rb') as f:
                    try:
                        ftp.storbinary(f'STOR {filename}', f)
                        print(f"✅ Uploaded: {filename}")
                    except Exception as e:
                        print(f"❌ Failed to upload {filename}: {e}")
        
        # List uploaded files
        print("\n📋 Dateien auf Server:")
        try:
            files = ftp.nlst()
            for file in files:
                print(f"   📄 {file}")
        except Exception as e:
            print(f"❌ Konnte Dateiliste nicht abrufen: {e}")
        
        print("\n🎉 Upload abgeschlossen!")
        print("🌐 FlowCraft sollte verfügbar sein unter:")
        print("   https://flowcraft.owona.de")
        
        ftp.quit()
        
    except ftplib.error_perm as e:
        print(f"❌ FTP Berechtigung-Fehler: {e}")
        print("💡 Prüfe FTP-Zugangsdaten oder Server-Konfiguration")
    except ftplib.error_temp as e:
        print(f"❌ FTP Temporärer Fehler: {e}")
        print("💡 Versuche es in ein paar Minuten erneut")
    except Exception as e:
        print(f"❌ Unerwarteter Fehler: {e}")
        print("💡 Prüfe Internetverbindung und FTP-Server Erreichbarkeit")

if __name__ == "__main__":
    main()
