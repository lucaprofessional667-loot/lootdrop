# Plan: Buton Today's Quest + pagina dedicata

## Ce se construieste

1. **Buton CTA pe Home**
   - Inlocuieste sectiunea actuala "TODAY'S QUEST" + lista de loot-uri de pe Home cu un singur buton mare, stil retro-arcade (ca fostul "START EXPLORING").
   - Pe buton apare textul "TODAY'S QUEST" si sub el countdown-ul pana la reset ("Resets in 09:41" sau similar).
   - Butonul navigheaza la `/quest`.

2. **Pagina noua `/quest`**
   - Creeaza fisierul de ruta `src/routes/quest.tsx`.
   - Afiseaza titlul "TODAY'S QUEST" si acelasi countdown ca pe buton.
   - Listeaza cele 5 loot-uri fake (titlu, descriere, XP, dificultate, raritate).
   - Include un buton "BACK TO HOME" sau foloseste header-ul existent.

3. **Countdown reutilizabil**
   - Creeaza un hook/component simplu care calculeaza timpul ramas pana la urmatorul reset (ex. miezul noptii locale).
   - Acelasi component este folosit atat pe butonul din Home, cat si pe pagina `/quest`.

4. **Refactorizare date fake**
   - Muta constantele `TODAYS_LOOT`, `RARITY_STYLES`, `RECENT_FINDS` si helperul `Stars` intr-un modul shared (ex. `src/lib/loot-data.tsx`) ca sa fie importate atat in Home, cat si in `/quest`, fara duplicare.

5. **Navigare si SEO**
   - Adauga `head()` pe ruta `/quest` cu titlu si meta descriere.
   - Asigura ca ruta este generata automat de TanStack Router.

## Ce NU se schimba

- Bottom navigation ramane in ordinea ceruta anterior: Explore | Loot | Home | Map | Profile.
- Profil card, progres zilnic, Recent Finds si footer-ul ramane pe Home.
- Nu se adauga backend / autentificare; datele raman hardcodate.

## Pasi de implementare

```text
1. Creeaza src/lib/loot-data.tsx cu TODAYS_LOOT, RARITY_STYLES, RECENT_FINDS, Stars.
2. Creeaza src/components/QuestCountdown.tsx (countdown pana la reset).
3. Creeaza src/routes/quest.tsx cu layout-ul paginii Today's Quest.
4. Modifica src/routes/index.tsx: importa datele din shared, inlocuieste sectiunea Today's Quest cu buton CTA + countdown.
5. Ruleaza build si verifica vizual pe mobil: butonul, navigarea, countdown pe ambele ecrane.
```
