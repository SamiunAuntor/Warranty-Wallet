# Firebase Configuration Checklist

## The "auth/configuration-not-found" Error

This error typically occurs when Firebase Authentication is not properly configured in the Firebase Console. Follow these steps:

### Step 1: Enable Google Sign-In in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **warranty-wallet-ad400**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable it and add your **Support email**
6. Click **Save**

### Step 2: Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Make sure these domains are listed:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (when deployed)

### Step 3: Verify Firebase Project Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Verify your Web App configuration matches:
   - **Project ID**: `warranty-wallet-ad400`
   - **App ID**: `1:130946036572:web:5ff62ab961742e79bd0799`

### Step 4: Check Browser Console

After making changes:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console for Firebase initialization messages
4. Try Google Sign-In again

### Step 5: Verify Environment Variables

Make sure your `.env` file in `frontend/` folder contains:
```
VITE_FIREBASE_API_KEY=AIzaSyDltVjn8QC10pzHFNyFk83toTsVU4qKZHI
VITE_FIREBASE_AUTH_DOMAIN=warranty-wallet-ad400.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=warranty-wallet-ad400
VITE_FIREBASE_STORAGE_BUCKET=warranty-wallet-ad400.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=130946036572
VITE_FIREBASE_APP_ID=1:130946036572:web:5ff62ab961742e79bd0799
```

### Common Issues:

1. **Google Sign-In not enabled**: Most common cause
2. **localhost not in authorized domains**: Add it in Firebase Console
3. **Wrong project configuration**: Double-check API keys match
4. **Browser blocking popups**: Allow popups for localhost
5. **Cached old configuration**: Clear browser cache and restart dev server

### Testing:

After completing the above steps:
1. Restart your frontend dev server: `npm run dev`
2. Try Google Sign-In again
3. Check browser console for any errors

If the error persists, check the browser console for more detailed error messages.

