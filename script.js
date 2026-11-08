// Lógica de la página. Los perfumes están en data.js.

// ===== UTILIDADES =====
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmt = (n) => "$" + n.toLocaleString("es-CO");
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

$("#countD").textContent = `${disenador.length} fragancias`;
$("#countA").textContent = `${arabes.length} fragancias`;

// ===== BARRA DE AVISOS =====
(() => {
  const ps = $$("#announce p");
  let i = 0;
  setInterval(() => {
    ps[i].classList.remove("active");
    i = (i + 1) % ps.length;
    ps[i].classList.add("active");
  }, 4000);
})();

// ===== CARRUSEL =====
(() => {
  const slides = $$("#slides .slide");
  const dots = $("#dots");
  let i = 0, timer;
  dots.innerHTML = [...slides].map((_, n) => `<button aria-label="Ir a la diapositiva ${n + 1}"></button>`).join("");
  const dotBtns = dots.querySelectorAll("button");
  function go(n) {
    slides[i].classList.remove("active");
    dotBtns[i].classList.remove("active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("active");
    dotBtns[i].classList.add("active");
    clearInterval(timer);
    timer = setInterval(() => go(i + 1), 6500);
  }
  dotBtns.forEach((b, n) => (b.onclick = () => go(n)));
  $("#prevSlide").onclick = () => go(i - 1);
  $("#nextSlide").onclick = () => go(i + 1);
  // Deslizar con el dedo en el móvil
  let x0 = null;
  const el = $(".slider");
  el.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);
})();

// ===== CATÁLOGO =====
const PASO = 12;
const estado = { filtro: "disenador", marca: null, q: "", visibles: PASO };

// Marcas ordenadas por número de perfumes
const marcas = Object.entries(perfumes.reduce((m, p) => ((m[p.marca] = (m[p.marca] || 0) + 1), m), {}))
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([m]) => m);
$("#brands").innerHTML = marcas.map((m) => `<button data-brand="${esc(m)}">${esc(m)}</button>`).join("");

// Flechas de la franja de marcas
(() => {
  const track = $("#brands"), prev = $("#brandsPrev"), next = $("#brandsNext");
  const paso = () => Math.max(200, track.clientWidth * 0.7);
  function actualizar() {
    const max = track.scrollWidth - track.clientWidth;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }
  prev.onclick = () => track.scrollBy({ left: -paso(), behavior: "smooth" });
  next.onclick = () => track.scrollBy({ left: paso(), behavior: "smooth" });
  track.addEventListener("scroll", actualizar, { passive: true });
  window.addEventListener("resize", actualizar);
  actualizar();
})();

function lista() {
  const q = norm(estado.q);
  return perfumes.filter((p) => {
    if (estado.marca) { if (p.marca !== estado.marca) return false; }
    else if (!q) {
      if (estado.filtro === "disenador" && p.cat !== "disenador") return false;
      if (estado.filtro === "arabes" && p.cat !== "arabes") return false;
      if (estado.filtro === "precio" && !p.precio) return false;
    }
    return !q || norm(p.marca + " " + p.nombre).includes(q);
  });
}

// ===== FICHA DEL PERFUME (notas olfativas de notas.js) =====
const notaDe = (id) => (typeof notas !== "undefined" && notas[id]) || null;
const chips = (arr) => arr.map((n) => `<span>${esc(n)}</span>`).join("");

function abrirFicha(id) {
  const p = byId[id], n = notaDe(id);
  $("#fichaImg").src = `img/${p.id}.jpg`;
  $("#fichaImg").alt = `${p.marca} ${p.nombre}`;
  $("#fichaMarca").textContent = p.marca;
  $("#fichaNombre").textContent = p.nombre;
  $("#fichaPrecio").textContent = p.precio ? fmt(p.precio) : "Precio a consultar";
  $("#fichaPrecio").classList.toggle("ask", !p.precio);
  $("#fichaAcordes").innerHTML = n && n.acordes && n.acordes.length ? `<h4>Acordes principales</h4><div class="chips">${chips(n.acordes)}</div>` : "";
  let pir = "";
  if (n) {
    const niveles = [["Salida", n.salida], ["Corazón", n.corazon], ["Fondo", n.fondo]].filter(([, v]) => v && v.length);
    if (n.notas && n.notas.length) niveles.push(["Notas", n.notas]);
    pir = niveles.map(([t, v]) => `<div class="nivel"><h4>${t}</h4><div class="chips">${chips(v)}</div></div>`).join("");
  }
  $("#fichaPiramide").innerHTML = pir || (n && n.acordes && n.acordes.length
    ? `<p class="sin-notas">Fragrantica no publica la pirámide de notas de este perfume; arriba tienes sus acordes principales. Escríbenos y te contamos más.</p>`
    : `<p class="sin-notas">Pronto añadiremos las notas de este perfume. Escríbenos y te contamos cómo huele.</p>`);
  $("#fichaCtas").innerHTML = p.precio
    ? `<button class="btn" data-add="${p.id}">Añadir al pedido</button>`
    : `<button class="btn" data-ask="${p.id}">Consultar precio</button>`;
  $("#fichaFuente").innerHTML = n && n.url ? `Notas según <a href="${n.url}" target="_blank" rel="noopener">Fragrantica</a>` : "";
  const d = $("#ficha");
  if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
}
function cerrarFicha() { const d = $("#ficha"); if (d.close) d.close(); else d.removeAttribute("open"); }
$("#fichaClose").onclick = cerrarFicha;
$("#ficha").addEventListener("click", (e) => { if (e.target.id === "ficha") cerrarFicha(); });

function tarjeta(p) {
  return `
  <article class="card">
    <div class="art">
      <img src="img/${p.id}.jpg" alt="${esc(p.marca + " " + p.nombre)}" loading="lazy" data-ficha="${p.id}">
      ${p.precio
        ? `<button class="quick" data-add="${p.id}">Añadir al pedido</button>`
        : `<button class="quick" data-ask="${p.id}">Consultar precio</button>`}
    </div>
    <div class="card-body">
      <span class="brand-name">${esc(p.marca)}</span>
      <h3><button class="card-name" data-ficha="${p.id}">${esc(p.nombre)}</button></h3>
      ${p.precio ? `<span class="price">${fmt(p.precio)}</span>` : `<span class="price ask">Precio a consultar</span>`}
      ${notaDe(p.id) ? `<button class="ver-notas" data-ficha="${p.id}">Ver notas</button>` : ""}
    </div>
  </article>`;
}

function render() {
  const l = lista();
  $("#grid").innerHTML = l.slice(0, estado.visibles).map(tarjeta).join("");
  $("#emptySearch").hidden = l.length > 0;
  $(".more-wrap").hidden = l.length <= estado.visibles;
  $("#moreBtn").textContent = `Mostrar más (${l.length - estado.visibles})`;

  const info = $("#activeFilter");
  if (estado.marca || estado.q) {
    info.hidden = false;
    info.innerHTML = `${l.length} resultado${l.length === 1 ? "" : "s"} para <strong>${esc(estado.marca || estado.q)}</strong><button id="clearFilter">Quitar ✕</button>`;
  } else info.hidden = true;

  $$("#filters button").forEach((b) => b.classList.toggle("active", !estado.marca && !estado.q && b.dataset.f === estado.filtro));
  $$("#brands button").forEach((b) => b.classList.toggle("active", b.dataset.brand === estado.marca));
}

function setFiltro(f) {
  Object.assign(estado, { filtro: f, marca: null, q: "", visibles: PASO });
  $("#search").value = "";
  render();
}

function irA(sel) { $(sel).scrollIntoView({ behavior: "smooth" }); }

// ===== CARRITO =====
let carrito = [];
try { carrito = (JSON.parse(localStorage.getItem("leshoms-cart")) || []).filter((it) => byId[it.id]); } catch { carrito = []; }
function guardar() { try { localStorage.setItem("leshoms-cart", JSON.stringify(carrito)); } catch {} }
const total = () => carrito.reduce((s, it) => s + byId[it.id].precio * it.qty, 0);

function renderCart() {
  $("#cartItems").innerHTML = carrito.length
    ? carrito.map((it) => {
        const p = byId[it.id];
        return `<li>
          <img src="img/${p.id}.jpg" alt="">
          <div class="info"><strong>${esc(p.marca)}</strong><br>${esc(p.nombre)}<br><small>${fmt(p.precio)}</small></div>
          <div class="qty">
            <button data-act="-" data-id="${p.id}" aria-label="Quitar uno">−</button>${it.qty}
            <button data-act="+" data-id="${p.id}" aria-label="Añadir uno">+</button>
          </div>
        </li>`;
      }).join("")
    : `<li class="empty">Tu pedido está vacío.</li>`;
  $("#cartTotal").textContent = fmt(total());
  const n = carrito.reduce((s, it) => s + it.qty, 0);
  $("#cartCount").textContent = n;
  $("#cartCount2").textContent = n;
  guardar();
}

function cambiar(id, delta) {
  const it = carrito.find((x) => x.id === id);
  if (it) it.qty += delta; else if (delta > 0) carrito.push({ id, qty: 1 });
  carrito = carrito.filter((x) => x.qty > 0);
  renderCart();
}

function toggleCart(open) {
  $("#cart").classList.toggle("open", open);
  $("#overlay").classList.toggle("show", open);
  $("#cart").setAttribute("aria-hidden", String(!open));
}

function irAContacto(texto) {
  $("#msg").value = texto;
  irA("#contacto");
  setTimeout(() => $("#msg").focus({ preventScroll: true }), 700);
}

// ===== EVENTOS =====
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    cambiar(add.dataset.add, 1);
    const txt = add.textContent;
    add.textContent = "✓ Añadido";
    setTimeout(() => (add.textContent = txt), 1000);
    return;
  }
  const fi = e.target.closest("[data-ficha]");
  if (fi) { abrirFicha(fi.dataset.ficha); return; }
  const ask = e.target.closest("[data-ask]");
  if (ask) {
    if (ask.closest("#ficha")) cerrarFicha();
    const p = byId[ask.dataset.ask];
    irAContacto(`Hola, quisiera saber el precio de ${p.marca} ${p.nombre}.`);
    return;
  }
  const cat = e.target.closest("[data-cat-link]");
  if (cat) { setFiltro(cat.dataset.catLink); $("#mainNav").classList.remove("open"); return; }
  const brand = e.target.closest("[data-brand]");
  if (brand) {
    Object.assign(estado, { marca: brand.dataset.brand, q: "", visibles: PASO });
    $("#search").value = "";
    render();
    irA("#destacados");
    return;
  }
  if (e.target.id === "clearFilter") setFiltro(estado.filtro);
  if (e.target.closest(".main-nav a")) $("#mainNav").classList.remove("open");
});

$$("#filters button").forEach((b) => (b.onclick = () => setFiltro(b.dataset.f)));
$("#moreBtn").onclick = () => { estado.visibles += PASO; render(); };

function abrirBusqueda() {
  const bar = $("#searchBar");
  bar.hidden = !bar.hidden;
  if (!bar.hidden) { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => $("#search").focus(), 300); }
}
$("#searchBtn").onclick = abrirBusqueda;
$("#bottomSearch").onclick = () => { $("#searchBar").hidden = true; abrirBusqueda(); };
let tBusqueda;
$("#search").addEventListener("input", (e) => {
  Object.assign(estado, { q: e.target.value.trim(), marca: null, visibles: PASO });
  render();
  clearTimeout(tBusqueda);
  tBusqueda = setTimeout(() => estado.q && irA("#destacados"), 600);
});

$("#menuBtn").onclick = () => $("#mainNav").classList.toggle("open");

$("#cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-act]");
  if (b) cambiar(b.dataset.id, b.dataset.act === "+" ? 1 : -1);
});
$("#cartBtn").onclick = () => toggleCart(true);
$("#bottomCart").onclick = () => toggleCart(true);
$("#closeCart").onclick = () => toggleCart(false);
$("#overlay").onclick = () => toggleCart(false);
$("#checkout").onclick = () => {
  if (!carrito.length) return;
  const lineas = carrito.map((it) => `- ${it.qty} x ${byId[it.id].marca} ${byId[it.id].nombre} (${fmt(byId[it.id].precio)})`);
  toggleCart(false);
  irAContacto(`Hola, quiero hacer este pedido:\n${lineas.join("\n")}\nTotal: ${fmt(total())}`);
};

$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.reset();
  $("#formMsg").hidden = false;
});

$("#featuredPrice").textContent = fmt(byId.d01.precio);
$("#year").textContent = new Date().getFullYear();
render();
renderCart();
