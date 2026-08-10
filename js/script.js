//Slides de Imagens dinâmicas de fundo
const slides = document.querySelectorAll(".bg-slide");

let atual = 0;

setInterval(() => {
    slides[atual].classList.remove("active");
    atual = (atual + 1) % slides.length;
    slides[atual].classList.add("active");

}, 5000);

