## Warranty Wallet – Deployment Plan

This document describes a **step‑by‑step, production‑ready deployment plan** for this project:

- **Backend (server)**: Node/Express app in `backend` deployed to **Vercel**
- **Frontend (client)**: React + Vite app in `frontend` deployed to **Firebase Hosting**

Follow the sections in order when setting things up for the first time, then use the shorter “Release workflow” section for ongoing deployments.

---

## 1. Prerequisites

- **Accounts**
  - **Vercel account** (GitHub / GitLab / Bitbucket or email login)
  - **Firebase / Google Cloud account** with billing enabled for production use
  - **MongoDB cluster** (e.g. MongoDB Atlas) for production database
  - **Email provider credentials** for `nodemailer` (e.g. Gmail App Password, SendGrid, etc.)

- **Local tools**
  - **Node.js** LTS (18+ recommended) installed
  - **npm** (bundled with Node)
  - **Vercel CLI** (optional but recommended):
    ```bash
    npm install -g vercel
    ```
  - **Firebase CLI**:
    ```bash
    npm install -g firebase-tools
    ```

- **Codebase layout**
  - Root: `D:\Other Projects\Warrenty-Wallet`
  - Backend: `backend` (Express app, entry: `index.js`, scripts: `npm run dev`, `npm start`)
  - Frontend: `frontend` (Vite app, scripts: `npm run dev`, `npm run build`, `npm run preview`)

---

## 2. Environment Variables & Secrets

Both backend and frontend rely on environment variables. In **development**, these are usually loaded from `.env` files. In **production**, they must be configured in **Vercel** (for the backend) and **build‑time env files** for the frontend.

### 2.1 Backend (Express, Vercel)

Inspect `backend` to identify all environment variables used (examples, adapt to your actual file contents):

- **Typical backend env variables**
  - `PORT` – port Express listens on (Vercel will provide this for serverless; in local dev you may use `5000` or similar)
  - `MONGODB_URI` – MongoDB Atlas connection string
  - `JWT_SECRET` or similar – if you use JWTs
  - `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` – if you derive these from the Firebase service account JSON
  - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, etc. – for `nodemailer`

**Action – local development:**

1. In `backend`, create `.env` (not committed to Git):
   ```dotenv
   PORT=5000
   MONGODB_URI=your-dev-mongodb-uri
   # Firebase admin credentials (one of the patterns below)
   FIREBASE_ADMIN_PROJECT_ID=...
   FIREBASE_ADMIN_CLIENT_EMAIL=...
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

   # Email / SMTP
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your-email-user
   EMAIL_PASS=your-email-password-or-app-password
   ```

2. Ensure `backend/index.js` (or the file where you initialize the server) **uses `dotenv`** in development:
   ```js
   if (process.env.NODE_ENV !== 'production') {
     require('dotenv').config();
   }
   ```

**Action – production on Vercel:**

You will store the **same variable names and values** in Vercel:

1. Go to your Vercel project dashboard → **Settings → Environment Variables**.
2. Add each variable (e.g. `MONGODB_URI`, email settings, Firebase admin values).
3. Set them for **Production** (and optionally for **Preview** / **Development**).

> **Important**: For multiline private keys, either:
> - Store them with literal `\n` characters as shown in the `.env` example, or  
> - Use separate variables for each line (less common).

---

### 2.2 Frontend (Vite, Firebase Hosting)

`frontend/src/Firebase/firebase.config.js` reads configuration from `import.meta.env`:

```12:16:frontend/src/Firebase/firebase.config.js
const firebaseConfig = {
    apiKey: import.meta.env.VITE_apiKey,
    authDomain: import.meta.env.VITE_authDomain,
    projectId: import.meta.env.VITE_projectId,
    storageBucket: import.meta.env.VITE_storageBucket,
    messagingSenderId: import.meta.env.VITE_messagingSenderId,
    appId: import.meta.env.VITE_appId,
};
```

These are **build‑time variables**. For Vite:

- All variables must be prefixed with `VITE_` to be visible in the client.

**Action – local development:**

1. In `frontend`, create `.env`:
   ```dotenv
   VITE_apiKey=your-firebase-api-key
   VITE_authDomain=your-project.firebaseapp.com
   VITE_projectId=your-project-id
   VITE_storageBucket=your-project.appspot.com
   VITE_messagingSenderId=...
   VITE_appId=1:...:web:...

   # API base URL for backend (will point to Vercel in production)
   VITE_API_BASE_URL=http://localhost:5000
   ```

**Action – production build (Firebase Hosting):**

1. In `frontend`, create a **production** env file:
   ```dotenv
   # frontend/.env.production
   VITE_apiKey=your-prod-firebase-api-key
   VITE_authDomain=your-prod.firebaseapp.com
   VITE_projectId=your-prod-project-id
   VITE_storageBucket=your-prod.appspot.com
   VITE_messagingSenderId=...
   VITE_appId=1:...:web:...

   VITE_API_BASE_URL=https://your-backend.vercel.app
   ```
2. **Do not commit** `.env` or `.env.production` – add them to `.gitignore`.

When you run `npm run build` in `frontend`, Vite will use `.env.production` for `NODE_ENV=production` builds (or `.env` if that file is missing).

---

## 3. Backend Deployment – Vercel (Server)

The backend is a Node/Express app in `backend/` with `index.js` as the entry point and `npm start` as the production script.

### 3.1 Prepare the backend for serverless deployment

Vercel runs Node code as **serverless functions**, not as a long‑running server process. The typical pattern is:

- Export a handler that accepts `(req, res)` instead of calling `app.listen` directly, **or**
- Use the Node serverless adapter with a `vercel.json` file that points at your Express entry.

You have two main options:

#### Option A – Wrap Express in a Vercel handler (recommended)

1. In `backend`, refactor your Express app code into a separate module, e.g. `app.js`:
   - `app.js` defines and exports the Express `app`:
     ```js
     const express = require('express');
     const app = express();

     // middleware, routes, etc.
     // app.use(...);

     module.exports = app;
     ```
   - `index.js` is used only for **local development**:
     ```js
     const app = require('./app');
     const PORT = process.env.PORT || 5000;

     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
     ```

2. Create an `api` folder (entrypoint for Vercel functions) inside `backend`:
   ```text
   backend/
     api/
       index.js
     app.js
     index.js
     package.json
   ```

3. In `backend/api/index.js`, export the handler for Vercel:
   ```js
   const app = require('../app');

   module.exports = (req, res) => {
     // Vercel’s Node serverless function signature
     return app(req, res);
   };
   ```

4. In `backend/package.json`, ensure you **do not** rely on `npm start` for Vercel; Vercel will use `api/index.js` automatically.

5. Create a `vercel.json` inside `backend`:
   ```json
   {
     "version": 2,
     "functions": {
       "api/index.js": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

Now your Vercel deployment will expose the Express app at:

- `https://your-backend-project.vercel.app/api/...`

#### Option B – Use `index.js` directly as a serverless function

If you prefer not to split into `app.js`, you can:

1. Move the server logic into a function exported from `index.js` that handles `(req, res)`.
2. Update `vercel.json` to map to `index.js` as a function.

> This can get messy if `index.js` currently calls `app.listen`. Option A is cleaner.

---

### 3.2 Connect backend repository to Vercel

You can deploy **just the `backend` directory** as a separate Vercel project.

**If using GitHub / GitLab / Bitbucket:**

1. Push your repo to your Git provider if you haven’t already.
2. In Vercel dashboard:
   - Click **“New Project”**.
   - Import the repo containing `Warrenty-Wallet`.
   - When asked for the **project root**, select `backend/`.
3. Confirm `root directory` is `backend` (so Vercel runs `npm install` there).
4. Vercel will auto-detect a **Node.js** project.

**If using Vercel CLI manually:**

1. Open a terminal:
   ```bash
   cd "D:\Other Projects\Warrenty-Wallet\backend"
   vercel
   ```
2. Answer prompts:
   - Set project name (e.g. `warrenty-wallet-backend`).
   - Confirm the current directory as the project root.
3. Vercel will build/deploy and print the deployment URL.

---

### 3.3 Set environment variables in Vercel

1. Go to the Vercel project → **Settings → Environment Variables**.
2. Add all required backend env variables (from Section 2.1), e.g.:
   - `MONGODB_URI`
   - `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
3. Hit **Save** and **Redeploy** (from the Deployments tab) so the new env vars take effect.

---

### 3.4 Configure scheduled jobs (cron) on Vercel

Your backend has cron jobs (e.g. `backend/jobs/dailyReminderCheck.js` with `node-cron`). Long‑running cron inside a serverless environment is not ideal.

The typical Vercel‑style solution:

1. Expose an HTTP endpoint that runs the reminder logic once:
   - Example: `GET /api/daily-reminder` executes `dailyReminderCheck`.
2. Configure a **Vercel Cron Job** (if available in your plan) that calls this endpoint on a schedule.

**Steps:**

1. In `backend/app.js` (or a routes file), add a route:
   ```js
   const express = require('express');
   const { runDailyReminderCheck } = require('./jobs/dailyReminderCheck');

   const router = express.Router();

   router.get('/cron/daily-reminder', async (req, res) => {
     try {
       await runDailyReminderCheck();
       res.status(200).send('Daily reminder check executed');
     } catch (err) {
       console.error(err);
       res.status(500).send('Error executing daily reminder check');
     }
   });

   // app.use('/api', router);
   ```

2. In `backend/jobs/dailyReminderCheck.js`, export `runDailyReminderCheck` as a function that performs one cycle of work.
3. In Vercel dashboard → **Settings → Cron Jobs**, create a new cron:
   - URL: `https://your-backend.vercel.app/api/cron/daily-reminder`
   - Schedule: every day at your desired time.

This avoids relying on `node-cron` inside always‑on processes.

---

### 3.5 Test the deployed backend

1. After deploy, get your backend URL from Vercel, e.g.:
   - `https://warrenty-wallet-backend.vercel.app`
2. Test key endpoints using Postman / curl:
   - `GET https://warrenty-wallet-backend.vercel.app/api/health` (if you implement one)
   - `POST /api/auth/login`, `GET /api/products`, etc. (based on your routes)
3. Confirm:
   - Responses look correct
   - MongoDB writes and reads work
   - Emails are sent as expected (if you have email flows)

Once stable, use this URL in the frontend’s `VITE_API_BASE_URL`.

---

## 4. Frontend Deployment – Firebase Hosting (Client)

The frontend is a Vite React app in `frontend/`, using Firebase client SDK and React Router.

### 4.1 Create a Firebase project

1. Go to Firebase console.
2. Click **“Add project”** (or select an existing one).
3. Enable:
   - **Authentication** (Email/Password, Google, etc. as needed).
   - **Firestore / Realtime Database / Storage** as needed by your app.
4. In **Project Settings → General → Your apps**, create a **Web app**:
   - Copy the **Firebase config** values (`apiKey`, `authDomain`, etc.) into your `.env` files as shown earlier.

---

### 4.2 Initialize Firebase Hosting in the frontend folder

You will configure Firebase Hosting to serve the **built Vite app** from `frontend/dist`.

1. Open a terminal:
   ```bash
   cd "D:\Other Projects\Warrenty-Wallet\frontend"
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Hosting:
   ```bash
   firebase init hosting
   ```
4. Answer prompts:
   - **Use an existing project** → select the Firebase project you created.
   - **What do you want to use as your public directory?**
     - Answer: `dist` (Vite’s build output folder).
   - **Configure as a single-page app (rewrite all URLs to /index.html)?**
     - Answer: `Yes` (your app uses React Router).
   - **Set up automatic builds and deploys with GitHub?**
     - Optional: choose `No` for now (you can add CI later).

This will create:

- `firebase.json`
- `.firebaserc`

Verify that `firebase.json` looks like:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

> If `firebase.json` is created at the repo root instead of inside `frontend`, adjust paths or run `firebase init hosting` from inside `frontend` again.

---

### 4.3 Install dependencies and build

1. Install frontend dependencies:
   ```bash
   cd "D:\Other Projects\Warrenty-Wallet\frontend"
   npm install
   ```
2. Ensure `.env.production` has **production** Firebase + API base URL values.
3. Build the app:
   ```bash
   npm run build
   ```
4. Confirm that `frontend/dist` is created and contains the built files.

---

### 4.4 Deploy to Firebase Hosting

From `frontend`:

```bash
firebase deploy --only hosting
```

After deployment:

1. Firebase prints a **Hosting URL**, e.g.:
   - `https://your-project.web.app`
   - or `https://your-project.firebaseapp.com`
2. Open the URL in a browser and verify:
   - App loads without console errors.
   - Auth flows (login, registration, protected routes) work.
   - API calls hit the **Vercel backend** (check Network tab – requests should go to `https://your-backend.vercel.app/...`).

If API requests fail due to CORS, ensure your backend Express app includes proper `cors` configuration allowing the Firebase origin.

---

## 5. Wiring Frontend & Backend Together

### 5.1 Set the API base URL

In `frontend`, you likely have an Axios instance or a custom hook in `src/Hooks/useAxios.jsx` or similar. Ensure it reads from `VITE_API_BASE_URL`.

Example:

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

**Actions:**

1. Set in `.env` (development):
   ```dotenv
   VITE_API_BASE_URL=http://localhost:5000
   ```
2. Set in `.env.production` (production):
   ```dotenv
   VITE_API_BASE_URL=https://warrenty-wallet-backend.vercel.app
   ```

3. Rebuild and redeploy the frontend whenever you change the production API URL.

---

### 5.2 CORS configuration on backend

In your backend (`backend/index.js` or `app.js`), configure `cors` to allow the Firebase Hosting domain.

Example:

```js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // Vite dev
  'https://your-project.web.app',
  'https://your-project.firebaseapp.com'
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you send cookies or auth headers
  })
);
```

After updating CORS:

1. Commit and push changes.
2. Trigger a new Vercel deployment (via git push or `vercel` CLI).

---

## 6. Deployment & Release Workflow

Once everything is set up, use this repeatable workflow for new releases.

### 6.1 Backend release (Vercel)

1. Make code changes in `backend`.
2. Commit and push to the branch connected to Vercel (often `main`).
3. Vercel automatically:
   - Installs dependencies in `backend`.
   - Deploys a new version.
4. Once deployment is marked **Ready**:
   - Test key API endpoints.
   - Confirm logs in Vercel if errors occur.

If you deploy using CLI:

```bash
cd "D:\Other Projects\Warrenty-Wallet\backend"
vercel --prod
```

---

### 6.2 Frontend release (Firebase Hosting)

1. Make UI / client code changes in `frontend`.
2. Ensure `.env.production` is up to date (especially `VITE_API_BASE_URL`).
3. Build and deploy:
   ```bash
   cd "D:\Other Projects\Warrenty-Wallet\frontend"
   npm run build
   firebase deploy --only hosting
   ```

4. Verify:
   - Open the Firebase Hosting URL.
   - Run through the main user flows.

---

## 7. First‑Time End‑to‑End Checklist

Use this checklist the first time you deploy the complete system:

- **Backend on Vercel**
  - [ ] `backend` code refactored for Vercel serverless (`api/index.js` using Express app).
  - [ ] `vercel.json` configured with Node runtime.
  - [ ] All backend env vars set in Vercel.
  - [ ] MongoDB Atlas cluster reachable from Vercel.
  - [ ] HTTP health endpoint returns `200`.
  - [ ] Cron endpoint implemented and Vercel Cron Job configured (if needed).

- **Frontend on Firebase Hosting**
  - [ ] Firebase project created; Web app configured.
  - [ ] `.env` and `.env.production` created with correct Firebase + API config.
  - [ ] `firebase init hosting` completed in `frontend` with `public: "dist"`.
  - [ ] `npm run build` succeeds.
  - [ ] `firebase deploy --only hosting` succeeds.

- **Integration**
  - [ ] `VITE_API_BASE_URL` points to the Vercel backend URL.
  - [ ] CORS allows Firebase Hosting origins.
  - [ ] Auth flows work end‑to‑end (frontend ↔ backend ↔ Firebase Admin / database).
  - [ ] Email notifications/reminders work in production.

Once everything passes this checklist, you have a reliable deployment pipeline:

- **Server**: Vercel (backend API, cron endpoints)
- **Client**: Firebase Hosting (Vite React app)



