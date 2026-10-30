
document.addEventListener("DOMContentLoaded", () => {
    const botoesDiminuir = document.querySelectorAll("#diminuirFonte");
    const botoesAumentar = document.querySelectorAll("#aumentarFonte");
    const botoesRestaurar = document.querySelectorAll("#restaurarFonte");

    const seletoresTexto = [
        "p", "span", "a", "button", "label",
        "input", "select", "textarea", "small",
        "strong", "h1", "h2", "h3", "article"
    ];

    const elementos = [...document.querySelectorAll(seletoresTexto)]
        .filter(elemento => !elemento.closest(".acessibilidade"));

    const tamanhosOriginais = new Map(
        elementos.map(elemento => [
            elemento,
            parseFloat(getComputedStyle(elemento).fontSize)
        ])
    );

    let escala = 1;

    function aplicarTamanho() {
        elementos.forEach(elemento => {
            const tamanhoOriginal = tamanhosOriginais.get(elemento);
            elemento.style.fontSize = `${tamanhoOriginal * escala}px`;
        });
    }

    botoesDiminuir.forEach(botao => {
        botao.addEventListener("click", () => {
            escala = Math.max(0.75, escala - 0.1);
            aplicarTamanho();
        });
    });

    botoesAumentar.forEach(botao => {
        botao.addEventListener("click", () => {
            escala = Math.min(1.5, escala + 0.1);
            aplicarTamanho();
        });
    });

    botoesRestaurar.forEach(botao => {
        botao.addEventListener("click", () => {
            escala = 1;
            elementos.forEach(elemento => {
                elemento.style.fontSize = "";
            });
        });
    });
});

