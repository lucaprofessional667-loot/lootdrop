# Loot Drop — cont, XP real, poze și verificare AI

Trecem aplicația de la date fixe la un backend real (Lovable Cloud): fiecare utilizator are cont, primește zilnic propriile obiective generate de AI, fotografiază loot-ul, iar o verificare automată cu AI decide dacă poza respectă cerința și acordă XP.

## 1. Cont cu username

- Ecran public `/auth` cu înregistrare și autentificare doar prin **username + parolă** (fără email).
- Username-ul este unic; în spate se generează o adresă tehnică invizibilă pentru utilizator, cu confirmare automată.
- Consecință de acceptat: fără email, **nu există recuperare de parolă**. Putem adăuga mai târziu un email opțional în profil pentru asta.
- Paginile de joc (Home, Quest, Loot, Map, Profile) devin accesibile doar după autentificare; header-ul arată username-ul și opțiunea de deconectare.

## 2. Profil: nume afișat + avatar

- Nume de afișat editabil și poză de profil încărcată de utilizator.
- Profilul ține nivelul, XP total și XP-ul necesar până la nivelul următor.
- Nivel = calculat din XP total (prag crescător per nivel), afișat pe Home ca acum.

## 3. Loot zilnic personal, generat de AI

- La prima intrare din ziua respectivă, AI-ul generează pentru utilizator **5 obiective noi**: titlu, descriere scurtă, dificultate 1–5 și raritate (common → legendary), cu XP corespunzător rarității.
- Setul este salvat pentru acea zi, deci rămâne același la refresh și expiră la miezul nopții (countdown-ul existent rămâne).
- Obiectivele sunt gândite să fie găsibile în orice oraș, fără locuri anume.

## 4. Buton de poză la fiecare loot

- Fiecare card de loot din pagina Quest primește butonul **SNAP PROOF**.
- Pe telefon deschide direct camera din spate; pe desktop deschide selectorul de fișiere.
- Poza se încarcă în stocarea aplicației, privat pentru fiecare utilizator.

## 5. Verificare automată cu AI

- După încărcare, poza + cerința loot-ului merg la un model AI care răspunde: **aprobat / respins**, cu un scor de încredere și o explicație scurtă într-o frază.
- Aprobat → loot marcat ca găsit, XP adăugat la total, progres zilnic și nivel actualizate, animație/feedback de tip arcade.
- Respins → mesaj cu motivul, iar utilizatorul poate încerca din nou cu altă poză.
- În timpul analizei cardul arată o stare „ANALYZING…”.
- XP-ul se acordă o singură dată per loot, verificat pe server (nu se poate păcăli din browser).

## 6. Colecție și progres

- Pagina Loot (colecția) și „Recent finds” de pe Home arată loot-urile chiar găsite, cu poza făcută, raritatea și XP-ul.
- Progresul zilnic (găsite azi / XP azi) se calculează din datele reale.

## Detalii tehnice

- **Lovable Cloud** activat: autentificare, bază de date, stocare fișiere.
- Tabele: `profiles` (user_id, username, display_name, avatar_url, total_xp), `daily_quests` (user_id, quest_date, unic per zi), `quest_items` (quest_id, title, description, rarity, difficulty, xp), `finds` (user_id, quest_item_id, photo_path, status, ai_confidence, ai_reason, xp_awarded). RLS pe toate, scoped pe `auth.uid()`, cu GRANT-uri explicite.
- Bucket privat `loot-proofs`, cu politici per utilizator; citire prin URL semnat.
- Logică pe server prin `createServerFn` + `requireSupabaseAuth`: `ensureTodaysQuest`, `submitProof`, `getProfile`. Fără edge functions.
- AI prin Lovable AI Gateway: generarea quest-ului (ieșire structurată) și verificarea imaginii (model multimodal), ambele apelate doar din server. Erorile de gateway (limită/credite) sunt afișate clar în interfață.
- Componente noi: `LootCard` cu buton de captură (`<input type="file" accept="image/*" capture="environment">`), ecran `/auth`, subarborele protejat `_authenticated`.
- Datele fixe din `src/lib/loot-data.tsx` rămân doar pentru stiluri de raritate; listele hardcodate dispar.
- Se corectează și nepotrivirea de afișare a countdown-ului la prima încărcare a paginii.

## Ce rămâne pe mai târziu

- Harta cu locurile unde au fost găsite loot-uri (pagina Map rămâne placeholder).
- Recuperare parolă / email opțional.
