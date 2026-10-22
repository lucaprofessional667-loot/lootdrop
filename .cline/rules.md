# 🔒 Reguli Permanente pentru LootDrop

Aceste reguli vor fi respectate în toate interacțiunile viitoare cu Cline/AI:

## 📍 1. Limitarea la Scope-ul Proiectului
- **LUCREAZĂ EXCLUSIV ÎN LOOTDROP** — Nu modifica, crea sau șterge fișiere în afara acestui repository (`d:\documents\ProiecteCodex\lootdrop`).

## 📋 2. Fluxul de Lucru Standard
### Înainte de a Modifica Ceva:
- Inspectează structura existentă și codul relevant pentru context.
- Verifică fișierele `.env`, `package.json`, `tsconfig.json` pentru configurații.

### După finalizarea unui Task:
1. **Verificare**: Reia modificările făcute și asigură-te că sunt corecte.
2. **Validare**: Rulează `pnpm lint` (și alte comenzi necesare).
3. **Build**: Execută `pnpm build` pentru a verifica compile-ul.
4. **Commit & Push**: Dacă totul e OK:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

## ⚠️ 3. Progresul Manual (Uncommitted)
- **NUNCA** nu șterge sau suprascrie modificări manuale, necomitted dinainte!
- Analizează întotdeauna modificările locale înainte de a interveni.

## 🔨 4. Dependențe & Build Tools
- **Nu instala niciodată dependențe inutile.**
- Dacă o dep endență este necesară: explică-mi **CE** și **DE CE** înainte de a instala.

## 🖥️ 5. Development Server Configuration
### Framework Detectat:
- **React 19.2** + **Vite 8.1** (TanStack Start) + **pnpm**

### Comenzi Disponibile:
```bash
# Development server (cu hot reload)
pnpm dev

# Production build
pnpm build

# Preview build local
pnpm preview
```

### Local URL Preview:
- Port default: `http://localhost:5173`
- După start-ul dev server: verifică ieșirea terminalului pentru portul exact.

## 📁 6. Structura Proiectului (Key Directories)
```
src/
  ├── components/      # React UI components
  ├── lib/             # Utility functions & helpers
  ├── routes/          # TanStack router routes
  └── server.ts        # SSR entry point (TanStack Start)

public/                # Static assets (favicon, images)
supabase/              # DB migrations & config

.env                   # Environment variables
vite.config.ts         # Vite configuration
```

## 🚫 7. Interdicții Clare
- **FORGE PUSH = INTERZIS** — Protejează istoricul git.
- **Modificări în afara proiectului = INTERZIS**.
- **Ștergerea codului manual necommitted = INTERZIS**.

---
Aceste reguli sunt valide pentru toată durata proiectului LootDrop.
