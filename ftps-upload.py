#!/usr/bin/env python3
"""
Owona Media Agency - FTPS Upload Script
Uploads website files using secure FTPS connection
"""

import ftplib
import os
import ssl
from pathlib import Path

# Configuration
FTP_HOST = "owona.de"
FTP_USER = "163544f130388"
FTP_PASS = "Afidi2008!"
REMOTE_DIR = "htdocs"

# Files to upload
FILES_TO_UPLOAD = [
    "index.html",
    "impressum.html", 
    "datenschutz.html",
    "agb.html",
    "widerruf.html",
    "styles.css",
    "favicon.ico",
    ".htaccess"
]

def upload_file(ftps, local_file, remote_file):
    """Upload a single file via FTPS"""
    try:
        with open(local_file, 'rb') as f:
            ftps.storbinary(f'STOR {remote_file}', f)
        size = os.path.getsize(local_file)
        print(f"   ✅ {remote_file} ({size} bytes)")
        return True
    except Exception as e:
        print(f"   ❌ {remote_file} - Error: {e}")
        return False

def main():
    print("🏢 Owona Media Agency - FTPS Upload")
    print("=" * 50)
    
    try:
        # Connect via FTPS
        print("🔐 Connecting to owona.de with FTPS...")
        ftps = ftplib.FTP_TLS()
        ftps.connect(FTP_HOST, 21)
        ftps.auth()
        ftps.prot_p()
        
        # Login
        print("🔑 Logging in...")
        ftps.login(FTP_USER, FTP_PASS)
        
        # Change to htdocs directory
        print("📁 Changing to htdocs directory...")
        ftps.cwd(REMOTE_DIR)
        
        # Upload files
        print("📤 Uploading website files...")
        success_count = 0
        
        for filename in FILES_TO_UPLOAD:
            if os.path.exists(filename):
                if upload_file(ftps, filename, filename):
                    success_count += 1
            else:
                print(f"   ⚠️  {filename} - File not found")
        
        # Close connection
        ftps.quit()
        
        print("\n🎊 UPLOAD COMPLETED!")
        print(f"✅ {success_count}/{len(FILES_TO_UPLOAD)} files uploaded successfully")
        print("\n🌍 Website should now be live at: https://owona.de")
        
    except Exception as e:
        print(f"❌ Upload failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
