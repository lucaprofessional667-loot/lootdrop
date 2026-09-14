# Cont permanent, poze păstrate și colecție cu stickere

## 1. Contul se face o singură dată

- La prima deschidere a aplicației apare un ecran de start: alegi username și parolă, ori intri în contul existent.
- După asta rămâi conectat permanent pe acel dispozitiv — nu se mai cere nimic la următoarele intrări.
- Ecranul de cont nu mai stă în pagina de quest; devine o poartă pentru toată aplicația (Home, Quest, Collection, Map, Profile).
- În Profile apare username-ul, nivelul, XP-ul și un buton de deconectare (singurul mod de a reveni la ecranul de login).

## 2. Pozele validate se păstrează

- Fotografia rămâne salvată în stocarea privată a aplicației, vizibilă doar pentru autorul ei.
- Dacă verificarea AI respinge poza, fișierul se șterge automat, ca să nu se adune poze inutile.
- Dacă e aprobată, poza rămâne legată de loot-ul găsit și de data găsirii.

## 3. Sticker din poza ta

- După o validare reușită, obiectul cerut este decupat din fotografia ta, fundalul dispare și primește un contur alb gros, ca un sticker de hârtie.
- Stickerul se salvează separat de poza originală, tot privat.
- Dacă decuparea nu reușește (imagine neclară, limită AI), loot-ul rămâne validat și în colecție apare poza originală în ramă albă; se poate reîncerca decuparea din pagina de colecție.

## 4. Pagina Collection (loot history)

- Grilă de stickere pe fundal în stil retro, fiecare cu rama albă și culoarea rarității.
- Sub fiecare sticker: titlul loot-ului, XP-ul primit, raritatea și data găsirii.
- Apăsând pe un sticker se deschide fotografia originală, cerința loot-ului și explicația AI-ului.
- Dacă nu ai încă nimic, un mesaj gol în stil arcade care te trimite la quest-ul zilei.
- „Recent finds” de pe Home folosește aceleași date reale.

## Detalii tehnice

- `loot_claims` primește `sticker_path` (text, nullable) și `sticker_status` (`pending` / `ready` / `failed`), plus politică de update doar prin funcția server.
- Bucket privat nou `loot-stickers` cu aceleași reguli per utilizator (prima parte a căii = `auth.uid()`); citirea în UI se face prin URL semnat generat la cerere.
- Server function `verifyClaim` se extinde: la verdict aprobat descarcă poza, cere modelului de imagine din Lovable AI Gateway (`google/gemini-3.1-flash-image`) decuparea subiectului pe fundal transparent cu contur alb de sticker, urcă PNG-ul rezultat și marchează `sticker_status`. La verdict respins șterge obiectul din `loot-proofs`.
- Server function nouă `retrySticker` pentru reîncercare manuală, și `getCollection` (autentificat) care returnează claim-urile aprobate cu URL-uri semnate pentru poză și sticker.
- Autentificarea: componenta poartă în `AppShell` (client-only) care afișează formularul cât timp nu există sesiune; sesiunea Supabase e deja persistentă, deci nu se mai cere login la reveniri. `src/routes/quest.tsx` scapă de formularul inline.
- `src/routes/collection.tsx` și `src/routes/profile.tsx` se rescriu pe datele reale; `use-loot-drop` expune colecția și acțiunea de deconectare.
