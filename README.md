<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CamiDante

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7fa60619-f6b2-42bf-ae89-c9a746d6af19

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. In development, the app can use built-in demo posts; in production, set `VITE_ENABLE_LOCAL_FALLBACK="true"` only if you explicitly want that fallback.
3. Run the app:
   `npm run dev`
4. Optional: regenerate demo posts SQL with `npm run db:seed-sql` (overwrites `supabase/migrations/20250512120000_seed_local_posts.sql`; apply in Supabase if you use that seed).
