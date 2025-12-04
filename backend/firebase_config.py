"""
Firebase Configuration and Connection Module
=============================================

To connect to Firebase:
1. Go to Firebase Console (https://console.firebase.google.com)
2. Create a project or select existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `firebase-credentials.json` in the backend directory
   OR set the FIREBASE_CREDENTIALS environment variable with the JSON content

IMPORTANT: Never commit firebase-credentials.json to version control!
"""

import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Optional

# Global Firestore client
_db: Optional[firestore.Client] = None

def initialize_firebase() -> firestore.Client:
    """
    Initialize Firebase Admin SDK and return Firestore client.
    
    Looks for credentials in this order:
    1. FIREBASE_CREDENTIALS environment variable (JSON string)
    2. GOOGLE_APPLICATION_CREDENTIALS environment variable (file path)
    3. firebase-credentials.json file in the backend directory
    """
    global _db
    
    if _db is not None:
        return _db
    
    # Check if already initialized
    if len(firebase_admin._apps) > 0:
        _db = firestore.client()
        return _db
    
    cred = None
    
    # Option 1: JSON string in environment variable
    firebase_creds_json = os.environ.get('FIREBASE_CREDENTIALS')
    if firebase_creds_json:
        try:
            cred_dict = json.loads(firebase_creds_json)
            cred = credentials.Certificate(cred_dict)
            print("✓ Firebase initialized from FIREBASE_CREDENTIALS env var")
        except json.JSONDecodeError:
            print("⚠ FIREBASE_CREDENTIALS env var is not valid JSON")
    
    # Option 2: File path in environment variable
    if cred is None:
        google_creds_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
        if google_creds_path and os.path.exists(google_creds_path):
            cred = credentials.Certificate(google_creds_path)
            print(f"✓ Firebase initialized from {google_creds_path}")
    
    # Option 3: Local file
    if cred is None:
        local_path = os.path.join(os.path.dirname(__file__), 'firebase-credentials.json')
        if os.path.exists(local_path):
            cred = credentials.Certificate(local_path)
            print(f"✓ Firebase initialized from firebase-credentials.json")
    
    # Initialize the app
    if cred is not None:
        firebase_admin.initialize_app(cred)
        _db = firestore.client()
        return _db
    else:
        print("⚠ Firebase credentials not found. Running in DEMO MODE with mock data.")
        return None

def get_firestore_client() -> Optional[firestore.Client]:
    """Get the Firestore client, initializing if necessary."""
    global _db
    if _db is None:
        _db = initialize_firebase()
    return _db

def is_firebase_configured() -> bool:
    """Check if Firebase is properly configured."""
    return get_firestore_client() is not None

