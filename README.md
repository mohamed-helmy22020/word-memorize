<!-- prettier-ignore -->
<div align="center">

<img src="./public/favicon.ico" alt="Word Memorize" width="80" height="80" />

# Word Memorize

**A bilingual vocabulary trainer with AI-assisted translation, descriptions, and self-paced tests.**

[Overview](#overview) • [Features](#features) • [Stack](#stack) • [Getting started](#getting-started) • [Structure](#project-structure) • [Deploy](#deploy)

</div>

---

## Overview

Word Memorize is a self-hosted web app for building a second-language vocabulary and actually
remembering it. Each account keeps a set of languages, an arbitrarily nested folder tree, and a
list of vocabulary cards. Words can be translated or described by an LLM on the fly, spoken aloud
with the browser speech engine, and turned into a scored test you run against yourself.

Data lives in [Appwrite](https://appwrite.io), authentication runs through Appwrite sessions, and
all AI traffic is proxied through Next.js route handlers so that API keys never reach the browser.

## Features

**Vocabulary management**

- Nested folder tree, with breadcrumb navigation and path-based URLs
- Word cards holding a translation, an optional description and an example sentence
- Edit and delete from a right-click context menu
- Duplicate protection: the same word pair cannot be added twice to the same folder
- Recursive folder deletion (subfolders and their words are removed with the parent)
- Toggle between the current folder only and a flat view of the whole subtree, optionally sorted by path
- Spoken pronunciation for any card via the Web Speech API

**Tests**

- Build a test from the words of a folder, optionally including all subfolders
- Choose what the prompt reveals: first language, second language, or audio only
- A question panel to jump between questions, color-coded by answer correctness
- Automatic scoring, persisted locally so results survive a page reload

**AI assistance**

- One-click translation when adding a word, from either a free provider or an LLM
- One-click description generation for any word
- Bring your own key: each user stores their own Groq API key in settings
- Keys are encrypted with AES-256-CBC before being written to the database, and are only ever
  decrypted inside a server route

**Accounts and settings**

- Email/password sign-up and sign-in backed by Appwrite sessions in an `httpOnly` cookie
- Multiple languages per account, each with its own independent folder tree
- Settings tabs for account, translation backend, and AI key
- Locale-prefixed routing through `next-intl`; adding a locale is a one-line change in `i18n/routing.ts`
  (the locale layout already flips to RTL for Arabic)
- Ten built-in languages to pick from (English, Spanish, French, German, Chinese, Japanese, Russian, Arabic, Portuguese, Italian)

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org) (App Router, Server Actions) |
| UI | [React 18](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) on [Radix UI](https://www.radix-ui.com) |
| Backend | [Appwrite](https://appwrite.io) (auth + database) via `node-appwrite` |
| AI | [Vercel AI SDK](https://sdk.vercel.ai) with the [Groq](https://console.groq.com) provider |
| State | [Zustand](https://zustand-demo.pmnd.rs) with `persist` and `immer` |
| i18n | [next-intl](https://next-intl.dev) |
| Motion | [Framer Motion](https://www.framer.com/motion/), [Lottie](https://lottiefiles.com) |
| Forms | [react-hook-form](https://react-hook-form.com) + [Zod](https://zod.dev) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or newer (20 LTS recommended)
- An [Appwrite](https://appwrite.io) project — either [Appwrite Cloud](https://cloud.appwrite.io)
  or a self-hosted instance
- A [Groq](https://console.groq.com) API key, to be entered per user from the app's settings page

### 1. Create the Appwrite database

Create a database with the three collections below, then paste their IDs into `.env.local`.
All string attributes should be sized generously (`path` in particular) and indexed where the app
queries them: `userId` and `languageId` on every collection, and `path` on `folders` and `words`.

| Collection | Attributes |
| --- | --- |
| `users` | `id` (Appwrite account ID), `email`, `name`, `language` (code), `languages` (JSON array of `{ name, code }`), `translationType` (`ai` or `provider`), `ai_key` (encrypted) |
| `folders` | `name`, `path`, `userId`, `languageId` |
| `words` | `firstLang`, `secondLang`, `desc`, `example`, `path`, `userId`, `languageId` |

Enable email/password authentication in the Appwrite console, then create an API key with
`users.read`, `users.write`, `databases.read`, `databases.write` and `account.*` scopes.

### 2. Configure the environment

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=<your-project-id>

APPWRITE_DATABASE_ID=<database-id>
APPWRITE_USER_COLLECTION_ID=<users-collection-id>
APPWRITE_FOLDERS_COLLECTION_ID=<folders-collection-id>
APPWRITE_WORDS_COLLECTION_ID=<words-collection-id>
NEXT_APPWRITE_KEY=<server-api-key>

# Passphrase the user's AI key is encrypted with. Pick a long random string and keep it safe:
# changing it makes every stored key undecryptable.
ENCRYPTION_PASSWORD=<long-random-passphrase>
```

> [!IMPORTANT]
> `NEXT_APPWRITE_KEY` is a server-side key with broad database permissions. It is read only inside
> server code, but never prefix it with `NEXT_PUBLIC_` and never commit it.

> [!NOTE]
> There is no project-wide AI key. Each user pastes their own Groq key into **Settings → AI**, which
> is what the translation and description routes decrypt and use.

### 3. Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root path redirects to the default locale
at `/en`; sign up, add a language, then start creating folders and words.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  [locale]/            Locale-scoped routes: auth, main app, settings, tests
  api/
    generate-desc/     LLM description for a word (authenticated)
    translate/         Free translation provider (unauthenticated)
    translate/ai/      LLM translation (authenticated)
components/            Feature components; components/ui/ is shadcn/ui
i18n/                  next-intl routing config
lib/
  actions/             Server Actions: the entire data access layer
  appwrite.ts          Session and admin Appwrite clients
  encryption.ts        AES-256-CBC helpers for the user's AI key
store/                 Zustand stores (languages, sidebar, path, tests)
messages/              Translation catalogs per locale
```

A few conventions worth knowing before changing things:

- **All database access goes through `lib/actions/user.actions.ts`**, which is a `"use server"`
  module. Components call server actions directly; no API routes exist for CRUD.
- **Folders are paths, not a tree.** A folder is a name plus its full path (`/verbs/irregular/`),
  and words store that same path. Nesting, breadcrumbs, and recursive deletes all fall out of
  string prefixes, which is why `showAllWords` and "include subdirectories" are a single
  `Query.startsWith` call.
- **Tests never touch the database.** They are built from words already loaded, then kept in
  `localStorage` through the persisted Zustand store, so an in-progress test survives navigation.
- **`middleware.ts` handles locale negotiation only**; it is generated by `next-intl` and excludes
  `/api`, `/_next` and static files.

## Deploy

The app runs anywhere Next.js 14 does — [Vercel](https://vercel.com) is the path of least
resistance, and the build needs no extra configuration.

1. Provision Appwrite and create the three collections as described above.
2. Import the repository into your host and add every variable from `.env.local` to the project's
   environment settings.
3. Deploy, then open the app and complete sign-up.

Self-host Appwrite or not, serve the app over HTTPS: the sign-up session cookie is set with
`secure: true`, so plain HTTP will not keep a session alive in most browsers. If you host Appwrite
yourself, remember that the browser only needs the public endpoint and project ID; the API key is
used server-side.

## Security notes

- User AI keys are encrypted with `ENCRYPTION_PASSWORD` before storage and decrypted only inside
  `/api/translate/ai` and `/api/generate-desc`, both of which require a session.
- The authenticated routes return `401` without a valid session and `400` when no AI key is set.
- Deletes verify document ownership before removing anything.
- `.env` and `.env*.local` are git-ignored. Keep it that way.
