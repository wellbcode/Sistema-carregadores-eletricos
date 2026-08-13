// ===== Banner Offline/Online =====
document.addEventListener("DOMContentLoaded", () => {

    // Sons
    const ping = new Audio("./assets/audios/success-1-6297.mp3");
    const wah = new Audio("./assets/audios/wah-wah-sad-trombone-6347.mp3");

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

    // Mostra o banner
    function showBanner(bg, text, color = "#000") {
        const banner = getBanner();

        banner.style.backgroundColor = bg;
        banner.style.color = color;
        banner.style.display = "block";
        banner.textContent = text;
        banner.classList.add("show");
    }

    // Esconde o banner
    function hideBanner() {
        const banner = document.getElementById("banner-offline");

        if (!banner) return;

        banner.classList.remove("show");

        setTimeout(() => {
            banner.style.display = "none";
        }, 400);
    }

    // ================= OFFLINE =================
    window.addEventListener("offline", () => {

        console.log("📴 Conexão perdida");

        showBanner(
            "#FFD700",
            "⚠️ Conexão perdida. Aguarde o restabelecimento.",
            "#000"
        );

        wah.play().catch(() => {});
    });

    // ================= ONLINE =================
    window.addEventListener("online", () => {

        console.log("📶 Conexão restabelecida");

        showBanner(
            "#32CD32",
            "✅ Conexão restabelecida!",
            "#fff"
        );

        ping.play().catch(() => {});

        setTimeout(hideBanner, 4000);
    });
});