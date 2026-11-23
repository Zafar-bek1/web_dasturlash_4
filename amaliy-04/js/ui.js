// js/ui.js — barcha sahifalar uchun umumiy komponentlar:
// mobil menyu, sevimlilar (localStorage), modal oyna, forma tekshiruvi, menyu belgilash

/* ===== localStorage yordamchilari ===== */
function saqlash(kalit, qiymat) {
  try {
    localStorage.setItem(kalit, JSON.stringify(qiymat));
  } catch (e) { /* xotira to'la yoki taqiqlangan bo'lsa, jim o'tamiz */ }
}
function oqish(kalit, boshlangich) {
  try {
    const v = localStorage.getItem(kalit);
    return v ? JSON.parse(v) : boshlangich;
  } catch (e) {
    return boshlangich;
  }
}

/* ===== Mobil menyu (hamburger) ===== */
const menyuTugma = document.querySelector("#menu-toggle");
const mobilMenyu = document.querySelector("#mobile-menu");
if (menyuTugma && mobilMenyu) {
  menyuTugma.addEventListener("click", () => {
    const ochiq = mobilMenyu.classList.toggle("open");
    menyuTugma.setAttribute("aria-expanded", ochiq);
  });
  mobilMenyu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobilMenyu.classList.remove("open");
      menyuTugma.setAttribute("aria-expanded", "false");
    })
  );
}

/* ===== Bosh sahifa: scroll bo'yicha aktiv menyu bandi ===== */
if (document.querySelector("#home") && "IntersectionObserver" in window) {
  const havolalar = document.querySelectorAll(".nav a");
  const bolimlar = [...havolalar].map((a) => {
    const h = a.getAttribute("href");
    return h.startsWith("#") ? document.querySelector(h) : null;
  });
  const kuzatuvchi = new IntersectionObserver(
    (yozuvlar) => {
      yozuvlar.forEach((y) => {
        if (!y.isIntersecting) return;
        havolalar.forEach((l) => {
          const yoniq = l.getAttribute("href") === "#" + y.target.id;
          l.classList.toggle("active", yoniq);
          if (yoniq) l.setAttribute("aria-current", "page");
          else l.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  bolimlar.forEach((b) => b && kuzatuvchi.observe(b));
}

/* ===== Sevimli kurslar + hisoblagich (localStorage) ===== */
const sevimliSonEl = document.querySelector("#fav-count");

function sevimlilarOl() {
  return oqish("sevimliKurslar", []);
}
function sevimliSonYangila() {
  if (sevimliSonEl) sevimliSonEl.textContent = sevimlilarOl().length;
}
function sevimliAlmashtir(id) {
  const royxat = sevimlilarOl();
  const i = royxat.indexOf(id);
  if (i === -1) royxat.push(id);
  else royxat.splice(i, 1);
  saqlash("sevimliKurslar", royxat);
  sevimliSonYangila();
}
sevimliSonYangila();

/* ===== Modal oyna ===== */
let modalFon = null;
let oldingiFokus = null;

function elYasash(teg, sinf, matn) {
  const el = document.createElement(teg);
  if (sinf) el.className = sinf;
  if (matn !== undefined) el.textContent = matn;
  return el;
}

function modalYasash() {
  modalFon = elYasash("div", "modal-fon");
  modalFon.hidden = true;

  const oyna = elYasash("div", "modal");
  oyna.setAttribute("role", "dialog");
  oyna.setAttribute("aria-modal", "true");
  oyna.setAttribute("aria-labelledby", "modal-sarlavha");

  const yopish = elYasash("button", "modal-yopish", "×");
  yopish.type = "button";
  yopish.setAttribute("aria-label", "Yopish");

  oyna.append(yopish, elYasash("div", "modal-tana"));
  modalFon.append(oyna);
  document.body.append(modalFon);

  yopish.addEventListener("click", modalYop);            // × tugmasi
  modalFon.addEventListener("click", (e) => {            // fon ustiga bosish
    if (e.target === modalFon) modalYop();
  });
}

function modalSatr(nom, qiymat) {
  const satr = elYasash("div", "modal-satr");
  satr.append(elYasash("span", null, nom), elYasash("b", null, qiymat));
  return satr;
}

function modalOchish(k, ochgan) {
  if (!modalFon) modalYasash();
  oldingiFokus = ochgan || null;

  const tana = modalFon.querySelector(".modal-tana");
  tana.replaceChildren();

  const rasm = document.createElement("img");
  rasm.src = k.rasm;
  rasm.alt = k.nomi + " kursi";

  const sarlavha = elYasash("h2", "headline-md", k.nomi);
  sarlavha.id = "modal-sarlavha";

  const tavsif = elYasash("p", "modal-tavsif", k.tavsif);

  const malumot = elYasash("div", "modal-malumot");
  malumot.append(
    modalSatr("Yo'nalish", k.kategoriya),
    modalSatr("Davomiyligi", k.davomiylik + " oy"),
    modalSatr("Daraja", k.daraja),
    modalSatr("Oylik to'lov", k.narx.toLocaleString("ru-RU") + " so'm"),
    modalSatr("Qabul holati", k.mavjud ? "Ochiq" : "Guruh to'lgan")
  );

  const teglar = elYasash("div", "kat-teglar");
  k.teglar.forEach((t) => teglar.append(elYasash("span", "kat-teg", t)));

  const ariza = elYasash("a", "btn btn-amber", "Ariza qoldirish");
  ariza.href = k.kod ? "aloqa.html?kurs=" + encodeURIComponent(k.kod) : "aloqa.html";

  tana.append(rasm, sarlavha, tavsif, malumot, teglar, ariza);

  modalFon.hidden = false;
  document.body.classList.add("modal-ochiq");
  modalFon.querySelector(".modal-yopish").focus();
}

function modalYop() {
  if (!modalFon || modalFon.hidden) return;
  modalFon.hidden = true;
  document.body.classList.remove("modal-ochiq");
  if (oldingiFokus) oldingiFokus.focus();                // fokusni qaytarish
}

document.addEventListener("keydown", (e) => {            // Escape tugmasi
  if (e.key === "Escape") modalYop();
});

/* ===== Forma tekshiruvi (aloqa.html) ===== */
const forma = document.querySelector("#consultation-form");

if (forma) {
  // har bir maydon uchun qoida: xato matnini qaytaradi, to'g'ri bo'lsa ""
  const qoidalar = {
    fullname: (v) => {
      if (!v) return "Ism-familiyangizni kiriting";
      if (v.length < 3) return "Kamida 3 ta belgi kiriting";
      if (!/^[\p{L}'’ʻ`\- ]+$/u.test(v)) return "Faqat harflardan foydalaning";
      return "";
    },
    phone: (v) => {
      if (!v) return "Telefon raqamini kiriting";
      if (!/^\+998\d{9}$/.test(v)) return "Format: +998 va 9 ta raqam (+998901234567)";
      return "";
    },
    email: (v) => {
      if (!v) return "Elektron pochtani kiriting";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Email formati noto'g'ri (sardor@example.com)";
      return "";
    },
    course: (v) => (v ? "" : "Yo'nalishni tanlang"),
    days: (v) => {
      if (v === "") return "";                           // majburiy emas
      const n = Number(v);
      if (!Number.isInteger(n) || n < 2 || n > 6) return "2 dan 6 gacha butun son kiriting";
      return "";
    },
    message: (v) => {
      if (v === "") return "";                           // majburiy emas
      if (v.length < 10) return "Xabar kamida 10 ta belgidan iborat bo'lsin";
      if (v.length > 500) return "Xabar 500 ta belgidan oshmasin (hozir " + v.length + ")";
      return "";
    }
  };

  function xatoElOl(nom) {
    return forma.querySelector('[data-error="' + nom + '"]');
  }

  function maydonTekshir(maydon) {
    let xato = "";
    if (maydon.name === "agree") {
      xato = maydon.checked ? "" : "Davom etish uchun rozilik kerak";
    } else if (qoidalar[maydon.name]) {
      xato = qoidalar[maydon.name](maydon.value.trim());
    } else {
      return true;
    }
    const xatoEl = xatoElOl(maydon.name);
    if (xatoEl) xatoEl.textContent = xato;
    maydon.classList.toggle("invalid", xato !== "");
    maydon.setAttribute("aria-invalid", xato !== "");
    return xato === "";
  }

  const tekshiriladi = [...forma.querySelectorAll("[name]")].filter(
    (m) => qoidalar[m.name] || m.name === "agree"
  );
  const muvaffaqiyatEl = document.querySelector("#form-success-msg");

  forma.addEventListener("submit", (e) => {
    e.preventDefault(); // brauzerning standart yuborishi va sahifa qayta yuklanishini to'xtatadi
    const natijalar = tekshiriladi.map(maydonTekshir);     // hammasi tekshiriladi, birinchi xatoda to'xtamaydi
    if (natijalar.every(Boolean)) {
      forma.reset();
      tekshiriladi.forEach((m) => m.classList.remove("invalid"));
      muvaffaqiyatEl.classList.add("show");
    } else {
      muvaffaqiyatEl.classList.remove("show");
      const birinchi = tekshiriladi.find((m) => m.classList.contains("invalid"));
      if (birinchi) birinchi.focus();
    }
  });

  // yozish paytida tekshirish (input — matn, change — select/checkbox)
  ["input", "change"].forEach((hodisa) =>
    forma.addEventListener(hodisa, (e) => {
      if (tekshiriladi.includes(e.target)) {
        maydonTekshir(e.target);
        muvaffaqiyatEl.classList.remove("show");
      }
    })
  );

  // katalogdan kelgan kurs: aloqa.html?kurs=frontend
  const kursParam = new URLSearchParams(location.search).get("kurs");
  const kursSelect = forma.querySelector("#course");
  if (kursParam && kursSelect && [...kursSelect.options].some((o) => o.value === kursParam)) {
    kursSelect.value = kursParam;
  }
}
