# Techorama Team Planner (React + Supabase)

React version of `Techorama Team Planner.html`. Team picks, shrugging-knight "interested" marks and custom excuses are stored in Supabase, so they sync live between every device and teammate. Which name you are, the selected day and filters are remembered per device.

## 1. Set up Supabase (once, ~5 minutes)

1. Create a free project at <https://supabase.com> → **New project**.
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**.
   This creates the `people` table, opens it to the public key ("anyone with the link can edit") and turns on live updates.
3. Go to **Project Settings → API** and copy the **Project URL** and the **anon / public** key.

## 2. Run it locally

Requires Node.js 18+.

```powershell
cd C:\Projects\Techorama\techorama-team-planner
copy .env.example .env.local     # then paste your URL and anon key into .env.local
npm install
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). To test from your phone on the same Wi-Fi, run `npm run dev -- --host` and open the "Network" address.

## 3. Put it online so the team can use it

```powershell
npm run build
```

This creates a static site in `dist/`. Upload that folder to any static host — e.g. Netlify (drag and drop the `dist` folder), Vercel, GitHub Pages, or Azure Static Web Apps. The Supabase URL and key are baked in at build time, so build after `.env.local` is filled in (or set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` as environment variables on the host).

## How it's organised

| File | What it does |
| --- | --- |
| `src/schedule.ts` | The conference schedule (days, slots, sessions, the "not going" excuses) |
| `src/usePeople.ts` | Loads the team from Supabase and keeps it live (realtime + refresh when the tab comes back) |
| `src/App.tsx` | Name picker, day tabs, filters, and saving your picks (one write at a time, coalesced) |
| `src/components/SessionsView.tsx` | The per-slot session list |
| `src/components/GridView.tsx` | The "Who's where" table |
| `supabase/schema.sql` | Database table, access rules and realtime setup |

## Good to know

- **Access:** anyone with the site's address can add names and change picks, same as the original page. The anon key is public by design; the database rules only allow access to the `people` table.
- **Clearing data after the conference:** run `delete from public.people;` in the Supabase SQL Editor.
- Free Supabase projects pause after a week with no activity; open the dashboard and click **Restore** if that happens.
