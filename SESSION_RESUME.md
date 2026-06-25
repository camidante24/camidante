# CamiDante — Session Resume

> Generated: 2026-06-24 · Project: `D:\camidante`

## Next session — start here

```powershell
cd D:\camidante
$env:SUPABASE_ACCESS_TOKEN="<REPLACE_WITH_YOUR_PAT>"
npm run dev
```

---

## ✅ What was accomplished this session

### A. Build config
- **Alias** `@ → ./src` fixed in `vite.config.ts` and `tsconfig.json` (was `./`, caused imports like `@/src/...`)
- **`tsconfig.json`**: `strict: true`, `include: ["src"]`, `baseUrl: "."
- **`vercel.json`**: SPA rewrites (`/* → /index.html`) + asset cache headers
- **`manualChunks`** in Rollup: react, supabase, markdown, icons (motion removed)

### B. Migrations applied to Supabase (`tlruvgjpmqcvrxtsapmi`)
All 4 pushed via `supabase db push`:
1. `20250512000000_init.sql` — schema (posts, profiles, bookmarks, triggers)
2. `20250512120000_seed_local_posts.sql` — seed data
3. `20260607120000_fix_profile_policy.sql` — profile RLS fix
4. `20260624000000_toggle_bookmark_rpc.sql` — new atomic bookmark toggle RPC

**Migración 4 critical** — `toggle_bookmark` function created in DB. ✅ Verified via `db query --linked`.

### C. New files created
| File | Purpose |
|------|---------|
| `src/lib/db.ts` | `queryOrFallback`, `queryArrayOrFallback` wrappers |
| `src/components/ErrorBoundary.tsx` | Error boundary per route |
| `src/components/SEO.tsx` | `<Helmet>` + OpenGraph meta tags |
| `src/components/Skeleton.tsx` | Reusable loading skeleton (`animate-pulse`) |
| `src/pages/NotFound.tsx` | Extracted 404 page |
| `vercel.json` | SPA rewrites + asset cache |
| `supabase/migrations/20260624000000_toggle_bookmark_rpc.sql` | `toggle_bookmark` RPC |

### D. Optimizations
- **`getPostById()`** — single `.or()` query instead of two sequential queries
- **`toggleBookmark()`** — replaced client-side check-then-toggle with RPC call (1 query, atomic, no race condition)
- **`listBookmarkedPosts()`** — single join query `post_id, created_at, posts(*)` instead of N+1
- **Removed `motion`** (~14kB) → CSS animations (`fadeInUp`, `fadeIn` keyframes in `index.css`)
- **Replaced `<motion.*>` / `<AnimatePresence>`** with CSS classes in: Home, Article, Login, Profile, Navbar, StatCard
- **Pagination**: `listPosts()` returns `{posts, total, hasMore}`, uses Supabase `.range()` + `{count: 'exact'}`, PAGE_SIZE = 12
- **`Home.tsx`**: "Cargar más artículos" button + page state
- **`PostListFilters`** type: added `page` field
- **Installed `react-helmet-async`** + wrapped `<App>` in `<HelmetProvider>` in `main.tsx`
- **`<SEO>`** added to: Home, Article, Login, Profile, NotFound, Dashboard
- **`<Skeleton>`** replaced inline `animate-pulse` in Home, Article
- **`<ErrorBoundary>`** wraps each `<Route>` individually (not global)
- **`Edit3`** unused import removed from `PostList.tsx`

### E. Verification
- `npm run lint` (tsc --noEmit) → **0 errors** ✅
- `npm run build` → **success, 2.77s** ✅

---

## Key files

| Path | Description |
|------|-------------|
| `src/App.tsx` | Routes, layouts, ErrorBoundary per route |
| `src/main.tsx` | Entry point, HelmetProvider wrapper |
| `src/lib/posts.ts` | listPosts (pagination), getPostById (or), create/update/delete admin |
| `src/lib/bookmarks.ts` | toggleBookmark (RPC), listBookmarkedPosts (join), isBookmarked |
| `src/lib/db.ts` | Safe query wrappers with local fallback |
| `src/lib/config.ts` | SITE_NAME, SITE_DESCRIPTION, CATEGORIES, AUTHOR, SOCIAL_LINKS |
| `src/context/AuthContext.tsx` | Auth state, signIn/signUp/signOut/updateProfile |
| `src/index.css` | CSS animations, Tailwind v4 theme, article typography |
| `supabase/migrations/20260624000000_toggle_bookmark_rpc.sql` | RPC function (already applied) |
| `.env.local` | VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY |
| `vercel.json` | Rewrites + cache headers |

---

## 🔜 Pending / Next steps

1. **Deploy to Vercel**: connect repo, set env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), verify SPA rewrites via `vercel.json`
2. **Test live**: confirm `toggle_bookmark` RPC works, pagination loads, CSS animations, SEO meta tags appear
3. **Known TS edge case**: `sb.rpc` in `bookmarks.ts:25` uses `as any` cast (generated types don't know custom RPC)
4. **Remove .env.local from git**: ensure it's in `.gitignore`
5. **Clean SESSION_RESUME.md** (this file) when no longer needed

---

## Notes
- Supabase ref: `tlruvgjpmqcvrxtsapmi`
- Supabase URL: `https://tlruvgjpmqcvrxtsapmi.supabase.co`
- MCP configured in `C:\Users\Oscar M\.config\opencode\opencode.jsonc`
- Agent skills `supabase/agent-skills` installed
- ⚠ Revoke the PAT at https://supabase.com/dashboard/account/tokens after session
