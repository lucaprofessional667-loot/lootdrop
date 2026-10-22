<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- Cline Rules - Permanent -->
> [!RULES]
> ## 📜 Reguli Permanente pentru LootDrop
> 
> 1. **LUCREAZĂ EXCLUSIV ÎN LOOTDROP** — Nu modifica, crea sau șterge fișiere în afara acestui repository.
> 
> 2. **INSPECȚEZÎNTÂI ORICE MODIFICARE** — Înainte să modifici ceva, inspectează structura și codul existent pentru a înțelege proiectul.
> 
> 3. **PĂSTREAZĂ ARHITECTURA EXISTENTĂ** — Nu rescrie lucruri care nu sunt necesare. Folosește pattern-urile existente.
> 
> 4. **NU FORI PUS ȘI NUȘTERGE COD MANUAL** — Respectă modificările făcute manual și necomitted. Analizează-le înainte de a modifica fișierele respective.
> 
> 5. **VERIFICĂ ȘI COMMIT-UL POST-TASK** După fiecare task pe care îl finalizezi:
>    - verifică modificările;
>    - rulează `pnpm lint` și verifică build-ul cu `pnpm build`;
>    - dacă totul funcționează, fă un **git commit** cu un mesaj clar;
>    - apoi fă **git push** către repository-ul GitHub configurat.
> 
> 6. **NU FORGE PUSH NICIODATĂ** — Protejează istoricul git și evită suprascrierea modificărilor.
> 
> 7. **NU INSTALA DEPENDENȚE INUTILÉ** — Dacă este necesară instalarea unei dependențe, explică-mi înainte ce este și de ce este necesară.
> 
> ## 🛠️ Configurații Proiectului
> 
> ### Development Server
> ```bash
> pnpm dev     # Pornesc aplicația local
> ```
> **URL Preview**: `http://localhost:5173` (sau portul afișat la start)
> 
> ### Build Commands
> ```bash
> pnpm build       # Build production
> pnpm preview     # Preview build-ul local
> ```
> 
> ### Framework & Tech Stack
> - **React 19.2** + **Vite 8.1** (TanStack Start)
> - **TailwindCSS 4**
> - **Supabase** (DB & Auth)
> - **pnpm** (package manager)
> 
> ### Structura Directorului
> ```
> src/
>   ├── components/      # React components
>   ├── lib/             # Utility functions
>   ├── routes/          # TanStack routes
>   └── server.ts        # SSR entry point
> 
> public/                # Static assets
> supabase/              # Database config & migrations
> ```

<!-- End Cline Rules -->
<!-- LOVABLE:END -->
