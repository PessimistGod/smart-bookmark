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
│           manifest.json
│           supabaseClient.js
│
├───public
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
3.  Click "New Project"
4.  Enter project name, database and password
5.  Wait for provisioning to complete

------------------------------------------------------------------------

### Step 2: Enable Google Authentication

1.  Go to Supabase Dashboard
2.  Navigate to Authentication -\> Configuration -\> Sign In / Providers
3.  Enable Google

------------------------------------------------------------------------

### Step 3: Get Supabase Credentials

Navigate to:

Settings -\> API

Copy:

-   Project URL
-   anon public key

------------------------------------------------------------------------

### Step 4: Configure Environment Variables

Create a file named `.env.local` in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
```
Restart your development server after adding the variables.

------------------------------------------------------------------------

## Google OAuth Setup

To obtain Google credentials:

1.  Visit https://console.cloud.google.com
2.  Create a new project
3.  Go to APIs & Services -\> Credentials
4.  Create OAuth Client ID
5.  Add the following redirect URI:

https://your-project-id.supabase.co/auth/v1/callback

6.  Copy Client ID and Client Secret into Supabase Google provider
    settings

------------------------------------------------------------------------

## Database Migration

Open Supabase SQL Editor and execute:

supabase.sql

This will:

-   Create bookmarks table
-   Enable Row Level Security
-   Add RLS policies
-   Add indexes
-   Add realtime publication
-   Create analytics RPC function

Optional reset (removes all data):

reset.sql

------------------------------------------------------------------------

## Install and Run Application

Install dependencies:
```
npm install
```
Run development server:
```
npm run dev
```
Application runs at:
```
http://localhost:3000
```
------------------------------------------------------------------------

## Authentication Flow

-   User logs in using Google
-   Supabase creates a secure session
-   Middleware protects dashboard routes
-   RLS ensures users only access their own data

------------------------------------------------------------------------

## Database Security

All queries are protected using:

auth.uid() = user_id

Policies are applied to:

-   SELECT
-   INSERT
-   UPDATE
-   DELETE

This prevents cross-user data access and ensures secure multi-user
architecture.

------------------------------------------------------------------------

## Analytics Implementation

A PostgreSQL RPC function is used:

bookmarks_last_7_days()

This function groups bookmarks by date and returns daily counts for
dashboard visualization.

------------------------------------------------------------------------

## Chrome Extension Setup

Extension source code is located in:

/extension

### Build Extension

Navigate into extension folder:
```
npm install
```
```
npm run build
```
------------------------------------------------------------------------

### Load Extension in Chrome

1.  Open Chrome
2.  Navigate to chrome://extensions/
3.  Enable Developer Mode
4.  Click Load Unpacked
5.  Select:

extension/dist

The extension will appear in the toolbar.

------------------------------------------------------------------------

## Challenges and Learnings

### Learning Supabase

Supabase was new to me when starting this project. I had to learn:

-   Authentication flow
-   Session handling
-   Row Level Security policies
-   PostgreSQL functions
-   Realtime subscriptions
-   Migration-safe SQL practices

Understanding RLS behavior and debugging policy errors was one of the
most valuable learning experiences.

------------------------------------------------------------------------

### Building the Chrome Extension

Developing the Chrome extension introduced challenges such as:

-   Manifest v3 configuration
-   Background service workers
-   Permission management
-   Integrating Supabase with extension context
-   Handling CORS and authentication

Debugging extension-specific errors required inspecting browser logs and
understanding extension architecture.

------------------------------------------------------------------------

### Problem Solving Approach

During development, I actively used:

-   StackOverflow for debugging edge cases
-   YouTube for Supabase and extension tutorials
-   OpenAI tools for understanding SQL, RLS policies, and architecture
    decisions

These resources helped accelerate learning and problem-solving.

------------------------------------------------------------------------

## Supabase Production Checklist

-   RLS enabled on all tables
-   OAuth redirect URLs updated for production domain
-   Realtime publication includes bookmarks table
-   Environment variables configured in hosting provider

------------------------------------------------------------------------

## Troubleshooting

### Login Issues

-   Verify Google OAuth redirect URI
-   Check environment variables
-   Restart development server

### Insert Errors

-   Ensure user_id is included in inserts
-   Confirm RLS policies are properly created

### Realtime Issues

-   Verify bookmarks table is added to supabase_realtime publication

------------------------------------------------------------------------

## Author

Rahul R

Email: rahulramesh0004@gmail.com

Phone: +91 98869 93842
