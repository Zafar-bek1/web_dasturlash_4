// js/katalog.js — kurslar katalogi: statistika, chiqarish, qidiruv, filtr, saralash
const konteyner = document.querySelector("#katalog-konteyner");
const qidiruv = document.querySelector("#qidiruv");
const kategoriyaSelect = document.querySelector("#kategoriya");
const saralashSelect = document.querySelector("#saralash");
const sonEl = document.querySelector("#natija-soni");
const bosh = document.querySelector("#bosh-xabar");

const kategoriyaRang = {
  "IT va dasturlash": "blue",
  "Xorijiy tillar": "amber",
  "Aniq fanlar": "slate"
};

function narxMatni(n) {
  return n.toLocaleString("ru-RU") + " so'm/oy";
}

/* ===== A qism: statistika (reduce / find / filter) ===== */
function statistikaChiqar() {
  const jami = kurslar.reduce((son) => son + 1, 0);
  const ortacha = kurslar.reduce((s, k) => s + k.narx, 0) / jami;
  const maxNarx = kurslar.reduce((max, k) => (k.narx > max ? k.narx : max), 0);
  const engQimmat = kurslar.find((k) => k.narx === maxNarx);
  const ochiq = kurslar.filter((k) => k.mavjud).length;

  document.querySelector("#stat-jami").textContent = jami;
  document.querySelector("#stat-ortacha").textContent = narxMatni(Math.round(ortacha));
  document.querySelector("#stat-qimmat").textContent = engQimmat.nomi;
  document.querySelector("#stat-ochiq").textContent = ochiq;
}

/* ===== Kategoriyalar select'ini massivdan to'ldirish (map + Set) ===== */
function kategoriyalarToldir() {
  const noyob = [...new Set(kurslar.map((k) => k.kategoriya))];
  noyob.forEach((nom) => {
    const opt = document.createElement("option");
    opt.value = nom;
    opt.textContent = nom;
    kategoriyaSelect.append(opt);
  });
}

/* ===== Bitta karta yasash ===== */
function ikonka(nom) {
  const s = document.createElement("span");
  s.className = "material-symbols-outlined i-18";
  s.textContent = nom;
  return s;
}

function kartaYasash(k) {
  const karta = document.createElement("article");
  karta.className = "card kat-card";
  karta.dataset.id = k.id;

  const rasm = document.createElement("img");
  rasm.src = k.rasm;
  rasm.alt = k.nomi + " kursi";
  rasm.loading = "lazy";
  rasm.width = 600;
  rasm.height = 360;

  const tana = document.createElement("div");
  tana.className = "kat-tana";

  const tepa = document.createElement("div");
  tepa.className = "course-top";
  const tag = document.createElement("span");
  tag.className = "tag label-md " + (kategoriyaRang[k.kategoriya] || "blue");
  tag.textContent = k.kategoriya;
  const davomiylik = document.createElement("span");
  davomiylik.className = "duration";
  davomiylik.textContent = k.davomiylik + " oy";
  tepa.append(tag, davomiylik);

  const h3 = document.createElement("h3");
  h3.className = "title-md";
  h3.textContent = k.nomi;

  const teglar = document.createElement("div");
  teglar.className = "kat-teglar";
  k.teglar.forEach((t) => {
    const s = document.createElement("span");
    s.className = "kat-teg";
    s.textContent = t;
    teglar.append(s);
  });

  const narx = document.createElement("p");
  narx.className = "kat-narx";
  narx.textContent = narxMatni(k.narx);

  const holat = document.createElement("p");
  holat.className = "kat-holat " + (k.mavjud ? "ochiq" : "yopiq");
  holat.textContent = k.mavjud ? "Qabul ochiq" : "Hozircha guruh to'lgan";

  const tugmalar = document.createElement("div");
  tugmalar.className = "kat-tugmalar";

  const batafsil = document.createElement("button");
  batafsil.type = "button";
  batafsil.className = "btn btn-navy";
  batafsil.dataset.amal = "batafsil";
  batafsil.textContent = "Batafsil";

  const sevimli = document.createElement("button");
  sevimli.type = "button";
  sevimli.className = "fav-btn";
  sevimli.dataset.amal = "sevimli";
  sevimliTugmaYangila(sevimli, k.id);

  tugmalar.append(batafsil, sevimli);
  tana.append(tepa, h3, teglar, narx, holat, tugmalar);
  karta.append(rasm, tana);
  return karta;
}

function sevimliTugmaYangila(tugma, id) {
  const bor = sevimlilarOl().includes(id);
  tugma.replaceChildren(ikonka("favorite"));
  tugma.classList.toggle("faol", bor);
  tugma.setAttribute("aria-pressed", bor);
  tugma.setAttribute("aria-label", bor ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish");
}

/* ===== B qism: ro'yxatni chiqarish ===== */
function chiqar(royxat) {
  konteyner.innerHTML = ""; // faqat tozalash — kiritilgan matn bu yerga qo'yilmaydi
  royxat.forEach((k) => konteyner.append(kartaYasash(k)));
  sonEl.textContent = royxat.length;
  bosh.hidden = royxat.length !== 0; // «Hech narsa topilmadi»
}

/* ===== Qidiruv + filtr + saralash birgalikda ===== */
function yangila() {
  const matn = qidiruv.value.trim().toLowerCase();
  const kat = kategoriyaSelect.value;

  const natija = kurslar.filter((k) => {
    const nomMos = k.nomi.toLowerCase().includes(matn);
    const katMos = kat === "hammasi" || k.kategoriya === kat;
    return nomMos && katMos;
  });

  switch (saralashSelect.value) {
    case "narx-osish":
      natija.sort((a, b) => a.narx - b.narx);
      break;
    case "narx-kamayish":
      natija.sort((a, b) => b.narx - a.narx);
      break;
    case "nom":
      natija.sort((a, b) => a.nomi.localeCompare(b.nomi, "uz"));
      break;
  }
  chiqar(natija);
}

/* ===== Event delegation: bitta ota konteynerga bitta tinglovchi ===== */
konteyner.addEventListener("click", (e) => {
  const tugma = e.target.closest("button[data-amal]");
  if (!tugma) return;
  const id = Number(tugma.closest(".kat-card").dataset.id);

  if (tugma.dataset.amal === "batafsil") {
    modalOchish(kurslar.find((k) => k.id === id), tugma);
  } else if (tugma.dataset.amal === "sevimli") {
    sevimliAlmashtir(id);
    sevimliTugmaYangila(tugma, id);
  }
});

qidiruv.addEventListener("input", yangila);
kategoriyaSelect.addEventListener("change", yangila);
saralashSelect.addEventListener("change", yangila);

statistikaChiqar();
kategoriyalarToldir();
yangila();
