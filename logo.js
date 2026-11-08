// ===== ANIMACIÓN DE ENTRADA CON EL LOGO ORIGINAL =====
(function () {
  const intro = document.getElementById("intro");
  if (!intro) return;
  if (document.documentElement.classList.contains("no-intro")) {
    intro.remove();
    return;
  }
  document.body.classList.add("intro-lock");

  let done = false;
  function terminar() {
    if (done) return;
    done = true;
    intro.classList.add("intro-out");
    document.body.classList.remove("intro-lock");
    document.body.classList.add("intro-finished");
    try { sessionStorage.setItem("leshoms-intro", "1"); } catch {}
    setTimeout(() => intro.remove(), 1000);
  }
  setTimeout(terminar, 3800);
  intro.addEventListener("click", terminar);
  document.addEventListener("keydown", terminar, { once: true });
})();
