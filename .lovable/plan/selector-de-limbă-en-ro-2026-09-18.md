# Selector de limbă EN / RO

## Ce construim
- Adăugăm în dreapta sus un buton pătrat, pixelat, identic cu celelalte controale, cu steagul SUA implicit.
- La apăsare, butonul are o animație scurtă, trece la steagul României și schimbă instantaneu limba întregii aplicații; o nouă apăsare revine la engleză.
- Alegerea se păstrează pe dispozitiv, astfel încât aplicația se redeschide în ultima limbă folosită.

## Traducere completă
- Centralizăm textele engleză/română și traducem toate paginile și stările: autentificare, Home, quest, colecție, hartă, profil, navigație, încărcare, erori, butoane și ferestrele cu detalii.
- Datele și orele folosesc formatul limbii active.
- Etichetele de raritate și mesajele de verificare sunt afișate în limba selectată.

## Questuri și loot bilingve
- Fiecare loot zilnic va salva titlul, descrierea și instrucțiunea de verificare atât în engleză, cât și în română.
- Generatorul zilnic va produce ambele versiuni în aceeași operație, astfel încât schimbarea limbii nu regenerează și nu schimbă questul.
- Loot-urile deja existente vor primi versiunea română lipsă, iar istoricul și harta vor folosi limba activă.
- Verificarea fotografiei va salva explicația AI în ambele limbi, pentru a putea fi schimbată împreună cu restul interfeței.

## Detalii tehnice
- Adăugăm un provider local de limbă, fără serviciu extern de traducere la fiecare apăsare.
- Extindem datele loot-urilor și revendicărilor cu câmpuri localizate, păstrând compatibilitatea cu înregistrările existente.
- Verificăm comutarea EN/RO pe mobil, persistența după reîncărcare și afișarea bilingvă în quest, colecție și hartă.
