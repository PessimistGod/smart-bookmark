# Smart Bookmark

Smart Bookmark is a cloud-synced bookmark manager built using Next.js
and Supabase. It allows users to securely save, manage, archive, and
analyze bookmarks with realtime syncing and Google authentication.

This project demonstrates production-ready authentication, database
security using Row Level Security (RLS), realtime subscriptions,
analytics via PostgreSQL RPC functions, and Chrome extension
integration.

------------------------------------------------------------------------

## Features

-   Google OAuth authentication using Supabase Auth
-   Create, edit, archive, and delete bookmarks
-   Personal dashboard with analytics
-   Realtime bookmark synchronization
-   Secure per-user data isolation using RLS
-   Floating bookmarks panel for quick access
-   Chrome extension integration (Manifest v3)
-   Migration-safe SQL setup

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   Next.js 16 (App Router)
-   React 19
-   Tailwind CSS

### Backend

-   Supabase (PostgreSQL)
-   Supabase Authentication
-   Supabase Realtime

### Charts

-   ApexCharts

### Browser Extension

-   Chrome Extension (Manifest v3)
-   Vite (for extension build)

------------------------------------------------------------------------

## Project Structure

smart-bookmark/
```
C:.
│   .env.example
│   .env.local
│   .gitignore
│   eslint.config.mjs
│   jsconfig.json
│   next.config.mjs
│   package-lock.json
│   package.json
│   postcss.config.mjs
│   README.md
│   reset.sql
│   supabase.sql
│
├───extension
│   │   package-lock.json
│   │   package.json
│   │   popup.html
│   │   popup.js
│   │   vite.config.js
│   │
│   └───public
│           background.js
│           dist.crx
│           manifest.json
│           supabaseClient.js
│
├───public
│       dist.pem
│       file.svg
│       globe.svg
│       next.svg
│       vercel.svg
│       window.svg
│
└───src
    ├───app
    │   │   favicon.ico
    │   │   globals.css
    │   │   layout.js
    │   │   middleware.js
    │   │   page.js
    │   │
    │   ├───dashboard
    │   │   │   layout.jsx
    │   │   │   page.js
    │   │   │
    │   │   ├───bookmarks
    │   │   │       page.js
    │   │   │
    │   │   └───components
    │   │           FloatingBookmarks.jsx
    │   │           UserBar.jsx
    │   │
    │   └───login
    │           page.js
    │
    └───lib
            supabaseClient.js
```

------------------------------------------------------------------------

## Supabase Setup

### Step 1: Create Supabase Project

1.  Visit https://supabase.com
2.  Sign in
3.  Click New Project
4.  Enter project name and database password

------------------------------------------------------------------------

### Step 2: Enable Google Authentication

1.  Go to Supabase Dashboard
2.  Navigate to Authentication → Configuration → Sign In / Providers
3.  Enable Google

------------------------------------------------------------------------

### Step 3: Get Supabase Credentials

Supabase Dashboard → Settings → API

Copy:

-   Project URL
-   anon Publishable Key

------------------------------------------------------------------------

### Step 4: Configure Environment Variables

Create `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_publishable_key
```
Restart the development server.

------------------------------------------------------------------------

## Google OAuth Setup

1.  Visit https://console.cloud.google.com
2.  Create a new project
3.  Go to APIs & Services → Credentials
4.  Create OAuth Client ID
5.  Add redirect URI:

https://your-project-id.supabase.co/auth/v1/callback

6.  Add Client ID and Secret in Supabase

------------------------------------------------------------------------

## Database Migration

Run in Supabase SQL Editor:

supabase.sql

Creates: - bookmarks table
- RLS policies
- indexes
- realtime publication
- analytics RPC

Optional reset:

reset.sql

------------------------------------------------------------------------

## Install and Run Application
```
npm install
```
```
npm run dev
```
Open:
```
http://localhost:3000
```
------------------------------------------------------------------------

## Authentication Flow

-   User logs in using Google
-   Supabase creates secure session
-   Middleware protects routes
-   RLS restricts data per user

------------------------------------------------------------------------

## Database Security

All queries enforce:
```
auth.uid() = user_id
```
Applied to SELECT, INSERT, UPDATE, DELETE

------------------------------------------------------------------------

## Analytics

PostgreSQL RPC function:

bookmarks_last_7\_days()

Returns daily bookmark counts.

------------------------------------------------------------------------

## Chrome Extension Setup

Extension code is in:
```
cd ./extension
```
```
npm install
```
```
npm run build
```
------------------------------------------------------------------------

### Load Extension in Chrome

1.  Open chrome://extensions
2.  Enable Developer Mode
3.  Click Load Unpacked
4.  Select extension/dist

------------------------------------------------------------------------

## Chrome Extension OAuth Configuration

After loading the extension:

1.  Go to chrome://extensions
2.  Copy the Extension ID

Add this redirect URL in Supabase:

https://YOUR_EXTENSION_ID.chromiumapp.org/oauth2

Keep the main project callback:

https://your-project-id.supabase.co/auth/v1/callback

This enables Google login inside the extension.

------------------------------------------------------------------------

## Challenges and Learnings

### Learning Supabase

-   Authentication flow
-   Session handling
-   Row Level Security
-   PostgreSQL functions
-   Realtime subscriptions

### Building the Chrome Extension

-   Manifest v3 configuration
-   Supabase integration in extension context
-   Understanding Chrome extension architecture

### Problem Solving

-   StackOverflow
-   YouTube tutorials
-   OpenAI / Chatgpt

------------------------------------------------------------------------

## Supabase Production Checklist

-   RLS enabled
-   OAuth redirect URLs configured
-   Realtime publication enabled
-   Environment variables set

------------------------------------------------------------------------

## Troubleshooting

Login issues: - Verify OAuth redirect URLs
- Restart server

Insert errors: - Ensure user_id is passed
- Check RLS policies

Realtime issues: - Ensure table is in realtime publication

------------------------------------------------------------------------

## Author

Rahul R\
rahulramesh0004@gmail.com\
+91 98869 93842
