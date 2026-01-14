#!/usr/bin/env python3
"""
Script zum Verknüpfen eines bestehenden Firebase-Users mit Developer-Role
Benötigt: pip install firebase-admin
"""

import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
from firebase_admin import firestore
from datetime import datetime
import sys

# Konfiguration
SERVICE_ACCOUNT_PATH = 'ecosim-751ae-firebase-adminsdk-fbsvc-d2334e8c7b.json'
DEVELOPER_EMAIL = 'mailtomangold@gmail.com'
DEVELOPER_NAME = 'Jonathan Mangold'

def link_developer_account():
    """Verknüpft einen bestehenden User mit Developer-Role"""
    
    try:
        print('🔧 Starte Developer-Account Verknüpfung...\n')
        
        # Firebase Admin SDK initialisieren
        print(f'📂 Lade Service Account Key aus: {SERVICE_ACCOUNT_PATH}')
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred, {
            'projectId': 'ecosim-751ae'
        })
        print('✅ Firebase initialisiert!\n')
        
        # Firebase Services
        db = firestore.client()
        
        # 1. User nach E-Mail suchen
        print(f'🔍 Suche User mit E-Mail: {DEVELOPER_EMAIL}')
        try:
            user_record = auth.get_user_by_email(DEVELOPER_EMAIL)
            print(f'✅ User gefunden!')
            print(f'   UID: {user_record.uid}')
            print(f'   E-Mail: {user_record.email}\n')
        except auth.UserNotFoundError:
            print(f'❌ Kein User mit E-Mail {DEVELOPER_EMAIL} gefunden!')
            print(f'Erstelle bitte zuerst einen User in Firebase Console → Authentication')
            sys.exit(1)
        
        # 2. Firestore User Document erstellen
        print(f'📄 Erstelle Firestore User Document mit Developer-Role...')
        now = datetime.now()
        
        db.collection('users').document(user_record.uid).set({
            'email': DEVELOPER_EMAIL,
            'displayName': DEVELOPER_NAME or user_record.display_name,
            'role': 'developer',
            'createdAt': now,
            'lastLoginAt': now
        })
        print(f'✅ Firestore User Document erstellt!\n')
        
        # Erfolgsmeldung
        print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        print('✨ Developer-Account erfolgreich verknüpft!')
        print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        print(f'\n📧 E-Mail: {DEVELOPER_EMAIL}')
        print(f'👤 Name: {DEVELOPER_NAME}')
        print(f'🆔 UID: {user_record.uid}')
        print(f'\n🌐 Login URL: http://localhost:3000/developer/login')
        print(f'\n💡 Passwort ändern: Firebase Console → Authentication → {DEVELOPER_EMAIL} → Passwort-Reset senden\n')
        
        # App beenden
        firebase_admin.delete_app(firebase_admin.get_app())
        
    except Exception as e:
        print(f'❌ Fehler:')
        print(f'   {str(e)}')
        sys.exit(1)

if __name__ == '__main__':
    link_developer_account()
