//Slides de Imagens dinâmicas de fundo
const slides = document.querySelectorAll(".bg-slide");

let atual = 0;

setInterval(() => {
    slides[atual].classList.remove("active");
    atual = (atual + 1) % slides.length;
    slides[atual].classList.add("active");

}, 5000);

// Abrir e fechar o menu do perfil
const profile = document.querySelector('.profile');
const profileToggle = document.getElementById('profileToggle');
const profileMenu = document.getElementById('profileMenu');

if (profile && profileToggle && profileMenu) {

    profileToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        profileMenu.classList.toggle('active');
    });

    // Fechar ao clicar fora do perfil
    document.addEventListener('click', (event) => {
        if (!profile.contains(event.target)) {
            profileMenu.classList.remove('active');
        }
    });

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            profileMenu.classList.remove('active');
        }
    });

}