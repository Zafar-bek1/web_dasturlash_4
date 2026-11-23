# 4-amaliy ish — Xorazm Bilim Markazi (JavaScript bilan jonlantirish)

**Loyiha mavzusi:** Urganch shahridagi o'quv markazi (kurslar, narxlar, qabul). 2-amaliy ish saytining davomi.

## Qo'shilgan imkoniyatlar
**A qism — ma'lumotlar**
- `js/data.js`: 12 ta kursdan iborat massiv (id, kod, nomi, kategoriya, narx, mavjud, davomiylik, daraja, rasm, teglar[], tavsif)
- Statistika: jami kurslar, o'rtacha oylik to'lov, eng qimmat kurs, qabul ochiq kurslar soni

**B qism — DOM (`katalog.html`)**
- Kurs kartalari massivdan `createElement` bilan yaratiladi (HTML da qo'lda yozilmagan), matnlar `textContent` orqali
- Nom bo'yicha qidiruv (`input`, katta-kichik harf farqlanmaydi)
- Yo'nalish filtri (`select`, ro'yxati massivdan avtomatik to'ldiriladi)
- Saralash: narx o'sish / kamayish, nom A–Z
- Uchalasi birgalikda ishlaydi; natija bo'lmasa «Hech narsa topilmadi», ko'rsatilayotgan kurslar soni yangilanadi

**C qism — interaktiv komponentlar**
- Modal oyna («Batafsil»): ×, fon ustiga bosish va Escape bilan yopiladi
- Event delegation: kartalardagi tugmalar uchun bitta tinglovchi (`#katalog-konteyner`), `e.target.closest()`
- Forma tekshiruvi (`aloqa.html`): `preventDefault()`, har maydon ostida xato matni (bo'sh maydon, email, telefon `+998XXXXXXXXX`, xabar uzunligi, rozilik), muvaffaqiyatda forma tozalanadi
- Tanlov: mobil menyu (hamburger), sevimli kurslar hisoblagichi (localStorage), FAQ akkordeoni (`batafsil.html`, `<details>`)
- Modaldagi «Ariza qoldirish» tugmasi tanlangan kursni formada oldindan tanlab beradi (`aloqa.html?kurs=...`)

## Massiv metodlari qayerda
| Metod | Fayl / funksiya | Vazifa |
|---|---|---|
| `reduce` | `katalog.js` → `statistikaChiqar` | jami soni, o'rtacha narx, eng katta narx |
| `find` | `katalog.js` → `statistikaChiqar`, delegation | eng qimmat kurs; bosilgan kursni id bo'yicha topish |
| `filter` | `katalog.js` → `yangila`, `statistikaChiqar` | qidiruv va yo'nalish filtri; qabul ochiq kurslar |
| `sort` | `katalog.js` → `yangila` | narx va nom bo'yicha saralash |
| `map` | `katalog.js` → `kategoriyalarToldir`; `ui.js` → forma | yo'nalishlar ro'yxati; maydonlarni tekshirish |
| `forEach` | `katalog.js` → `chiqar`, `kartaYasash` | kartalar va teglarni chiqarish |
| `every` / `some` | `ui.js` | forma to'liq to'g'riligini tekshirish |

## Fayl tuzilmasi
```
amaliy-04/
├── index.html, batafsil.html, aloqa.html
├── katalog.html            ← ma'lumotlar JS orqali chiqadi
├── css/style.css
├── js/
│   ├── data.js             ← ma'lumotlar massivi
│   ├── katalog.js          ← chiqarish, qidiruv, filtr, saralash
│   └── ui.js               ← modal, forma, menyu, sevimlilar
├── rasmlar/
└── README.md
```

## Ishga tushirish
VS Code da Live Server orqali yoki `python -m http.server 8080` bilan oching.
