# Library Management — Monorepo Root

This repository contains a **client** (Vite + React + TypeScript + RTK Query) and an **API** (Express + Mongoose + Zod).

---

## 1) Documentation Links

- **API README:** [`api/README.md`](api/README.md)
- **Client README:** [`client/README.md`](client/README.md)

> If these files don’t exist yet, create them using the content we discussed for each folder.

---

## 2) Deployment Instructions (Vercel)

This project is set up to deploy both the **client** and **API** from the **root** using Vercel. The client is served as a static site, and the API runs under `/api` (serverless/edge function). URL rewrites route requests accordingly.

### A. Project Layout & Expectations

- **Monorepo workspaces:** `api`, `client`
- **Single Vercel project** at the **root**
- **Build command (root):** `npm run build`  
  (builds both workspaces)
- **Static output directory:** `client/dist`
- **Rewrites:** Route `GET /api/*` to the API entry, and all other routes to the SPA.

Example `vercel.json` (in the repository root):

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

> **Client → API base URL tip**  
> In the client’s RTK Query slices, prefer:
> ```ts
> baseUrl: import.meta.env.DEV ? "http://localhost:3000/api/" : "/api/"
> ```
> This treats both **Preview** and **Production** deployments as same-origin `/api/`, and **Dev** as `localhost`. It avoids misrouting in preview environments.

---

### B. Deploy via Vercel UI

1. **Import your Git repository** into Vercel.
2. **Root Directory:** repository **root** (where `vercel.json` lives).
3. **Framework Preset:** *Other* (or *Vite* for client — both work when you set the output).
4. **Install Command:** `npm i` (or `pnpm i`, `yarn install` depending on your setup).
5. **Build Command:** `npm run build`
6. **Output Directory:** `client/dist`
7. **Environment Variables:** none required by default.
8. **Save & Deploy.**

On successful deployment:
- Visiting `/` serves the built client.
- Client requests to `/api/...` are routed to the API function(s).
- Direct routes like `/books/123` load correctly thanks to the SPA rewrite.

---

### C. Deploy via Vercel CLI

> Requires Node.js and the Vercel CLI: `npm i -g vercel`

1. **Login & link:**
   ```bash
   vercel login
   vercel link
   ```
2. **Build & deploy (interactive):**
   ```bash
   vercel
   ```
   - Accept **root** as the project directory.
   - Set **Build Command** to `npm run build`.
   - Set **Output Directory** to `client/dist`.
3. **Promote to production:**
   ```bash
   vercel --prod
   ```
   Or use the convenience script if present:
   ```bash
   npm run deploy
   ```

---

### D. Post-Deploy Checks

- **Client loads:** navigate to the deployed domain root.
- **API alive:** open `/api/books`, `/api/borrow`, `/api/books/latest` etc.
- **CORS:** not needed, as the client and API are same-origin in Preview/Production.
- **SPA Routing:** verify deep links (e.g., `/books/abcdef`) refresh correctly.

---

### E. (Optional) Custom Domains & Rollbacks

- Add your custom domain in the Vercel dashboard and assign it to the project.
- Use the Vercel dashboard to rollback to any previous deployment instantly.

---

If you want, I can also include a small checklist for **staging** vs **production** envs (e.g., different MongoDB URIs) and how to inject them as Vercel Environment Variables.
