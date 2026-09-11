# Plan: Reorganizare Home și bottom navigation

## Scop
Ajustări UI pe ecranul Home al aplicației Loot Drop: reordonarea butoanelor din bottom navigation și restructurarea secțiunii de loot zilnic sub titlul "Today's Quest", plus separarea vizuală a footer-ului de proof hint.

## Modificări

### 1. Bottom navigation (`src/components/AppShell.tsx`)
Reordonează array-ul `NAV_ITEMS` astfel încât butoanele să apară în ordinea (stânga → dreapta):
1. Explore
2. Loot (Collection)
3. Home
4. Map
5. Profile

Păstrează iconițele, label-urile și stilul activ/inactiv existent.

### 2. Ecranul Home (`src/routes/index.tsx`)
- Elimină butonul mare "START EXPLORING".
- Adaugă o secțiune nouă cu header "TODAY'S QUEST" și subtitlu/timer "Resets in 09:41" (stil similar cu header-ul vechi "TODAY'S LOOT").
- Mută lista de loot zilnic (`TODAYS_LOOT`) sub secțiunea "TODAY'S QUEST", păstrând card-urile existente cu rarități, XP, dificultate și iconițe.
- Secțiunea "RECENT FINDS" rămâne sub quest, neschimbată.
- Footer-ul cu textul "Found one? Snap a photo as proof to claim the XP." devine mai distinct:
  - Adaugă un separator vizual deasupra (linie orizontală plină sau dashed, în culoarea `outline`).
  - Crește spațiul de deasupra footer-ului (`mt-6` sau similar) pentru a-l decupa clar de conținut.
  - Păstrează iconița Camera și textul, eventual într-un container propriu cu border sau fundal secundar.

## Ce nu se schimbă
- Paleta de culori, fonturile pixel, utilitățile de shadow/press și temele dark/light.
- Datele hardcodate (`TODAYS_LOOT`, `RECENT_FINDS`, profilul).
- Celelalte rute rămân placeholder-e.
- Nu se adaugă backend, autentificare sau logică nouă.

## Verificare
După implementare se verifică vizual în preview pe viewport mobil:
- ordinea butoanelor din bottom nav este corectă;
- secțiunea "TODAY'S QUEST" apare în locul butonului "START EXPLORING";
- lista de loot este sub quest;
- footer-ul proof hint este vizibil separat de restul paginii.
