# Xmedia Magazine

A modern magazine platform built with Next.js App Router, Server Components, and Supabase.

## ✨ Features

- ⚡ Server-Side Rendering (SSR) for articles, comments, and likes
- 🔁 Server Actions for mutations (comments, likes, newsletter)
- 🚀 Optimistic UI for instant interactions
- 🌍 Multi-language support (EN / AR)
- 🧠 Clean and scalable architecture (feature-based)

## 🧰 Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Database)
- Sanity (Headless CMS)
- Tailwind CSS

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```text
src/
  app/
  features/
    comments/
    likes/
    newsletter/
  lib/
    supabase/
    sanity/
  components/
```

## ⚡ Architecture

- **Server Components** → data fetching (SSR)
- **Server Actions** → mutations (comments, likes, newsletter)
- **Client Components** → UI interactions
- **Local Storage** → anonymous session handling

## 📦 Deployment

Deploy easily on Vercel.

## 🧑‍💻 Author

Iheb Saada
