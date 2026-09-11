# LootDrop 

Creează o aplicație web mobile-first numită "Loot Drop" — o aplicație de

tip real-life exploration/gamification: utilizatorii primesc obiective

concrete de găsit în lumea reală ("loot"), le fotografiază ca dovadă și

primesc XP.

Pentru acum, construiește DOAR ecranul Home, vizual, cu date fake

(hardcodate, fără backend/DB încă) ca să pară populat:

- Header: logo "Loot Drop", iconițe pentru notificări și profil.

- Profile card: avatar placeholder, username fake, level (ex. Level 12),

  progress bar XP (ex. 1,240 / 1,500 XP).

- "Today's Loot": 3-5 carduri de loot fake, fiecare cu titlu, descriere

  scurtă, XP, dificultate (steluțe), și un indicator de raritate — fiecare

  raritate are propria culoare, nu doar text (Common gri, Uncommon verde,

  Rare albastru, Epic mov, Legendary auriu).

- Progres zilnic: loot-uri găsite azi, XP câștigat azi (date fake).

- Preview colecție: ultimele câteva loot-uri "găsite" (fake).

- Buton "Explore" vizibil.

- Bottom navigation pe mobil: Home, Explore, Collection, Map, Profile

  (celelalte pagini pot fi goale/placeholder deocamdată).

Direcție vizuală: retro arcade / pixel-art influence — NU un stil

"premium"/corporate/SaaS generic. Gândește-te la fonturi cu caracter

pixelat sau bold pentru titluri/XP, contururi vizibile în loc de

shadow-uri soft, culori saturate pentru rarități, poate un font

monospace/pixel pentru numere (XP, level). Evită cardurile identice cu

un singur border-radius peste tot și gradient-urile decorative fără rost.

Adaugă un toggle funcțional dark mode / light mode, vizibil în header

sau profil, care schimbă efectiv tema.

Nu conecta încă Supabase, nu face autentificare — doar ecranul Home,

complet vizual și funcțional ca navigare/toggle.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/220fac92-2308-481b-b758-f6b88f9e4a41).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
