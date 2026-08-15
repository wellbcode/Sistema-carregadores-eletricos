// ===== Alerta de sincronização =====
function mostrarAlerta(msg, tipo = "sucesso") {
  const alerta = document.createElement("div");
  alerta.className = `alerta-sync ${tipo}`;
  alerta.innerHTML = `
    <span class="icone">${tipo === "sucesso" ? "✅" : tipo === "erro" ? "❌" : "⚠️"}</span>
    <span class="mensagem">${msg}</span>
  `;
  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.classList.add("fade-out");
    setTimeout(() => alerta.remove(), 500);
  }, 3000);
}

// ===== Banner Offline/Online =====
document.addEventListener("DOMContentLoaded", () => {
  // Sons
  const ping = new Audio("audios/success-1-6297.mp3");
  const wah = new Audio("audios/wah-wah-sad-trombone-6347.mp3");

  // Cria ou retorna o banner
  function getBanner() {
    let banner = document.getElementById("banner-offline");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "banner-offline";
      banner.classList.add("banner-conexao");
      document.body.appendChild(banner);
    }
    return banner;
  }

  // Mostra o banner com animação
  function showBanner(bg, text, color = "#000") {
    const banner = getBanner();
    banner.style.backgroundColor = bg;
    banner.style.color = color;
    banner.textContent = text;
    banner.classList.add("show");
  }

  // Esconde o banner suavemente
  function hideBanner() {
    const banner = document.getElementById("banner-offline");
    if (!banner) return;
    banner.classList.remove("show");
    setTimeout(() => (banner.style.display = "none"), 400);
  }

  // Quando ficar offline
  window.addEventListener("offline", () => {
    console.log("📴 Modo offline detectado");
    showBanner(
      "#FFD700",
      "⚠️ Você está offline. As alterações serão salvas localmente e sincronizadas quando a conexão voltar.",
      "#000"
    );
    wah.play().catch(() => {});
  });

  // Quando voltar a conexão
  window.addEventListener("online", () => {
    console.log("📶 Conexão restabelecida, sincronizando dados...");
    showBanner("#32CD32", "✅ Conexão restabelecida! Sincronizando dados...", "#fff");
    ping.play().catch(() => {});
    setTimeout(hideBanner, 4000);
  });
});
