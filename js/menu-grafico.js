
(() => {
    "use strict";

    const ESTILO_ID = "estilos-menus-graficos";
    const MODAL_ID = "modalGraficoAmpliado";
    const MENU_CLASS = "grafico-menu-acoes";

    const CONFIGURACOES = [
        {
            seletor: ".grafico-carregamentos",
            titulo: "Carregamentos por dia da semana",
            atualizar: ["renderizarDiaSemana"]
        },
        {
            seletor: ".grafico-linha",
            titulo: "Recargas por dia",
            atualizar: ["renderizarRecargasPorDia"]
        },
        {
            seletor: ".grafico-torre",
            titulo: "Utilização por Torre",
            atualizar: ["renderizarUsoPorTorre"]
        },
        {
            seletor: ".grafico-piso",
            titulo: "Utilização por Piso",
            atualizar: ["renderizarUsoPorPiso"]
        },
        {
            seletor: ".grafico-cargo",
            titulo: "Tipo de Cargo",
            atualizar: [
                "renderizarGraficoCargos",
                "renderizarCardsCargos"
            ]
        }
    ];

    function instalarEstilos() {
        if (document.getElementById(ESTILO_ID)) return;

        const estilo = document.createElement("style");
        estilo.id = ESTILO_ID;

        estilo.textContent = `
            .grafico-card {
                position: relative;
            }

            .${MENU_CLASS} {
                position: absolute;
                top: 48px;
                right: 12px;
                z-index: 1050;
                min-width: 190px;
                padding: 6px;
                background: var(--bs-body-bg, #fff);
                color: var(--bs-body-color, #1e293b);
                border: 1px solid var(--bs-border-color, #dee2e6);
                border-radius: 10px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, .14);
            }

            .${MENU_CLASS} button {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                padding: 10px 12px;
                border: 0;
                border-radius: 6px;
                background: transparent;
                color: inherit;
                text-align: left;
                cursor: pointer;
                font: inherit;
            }

            .${MENU_CLASS} button:hover,
            .${MENU_CLASS} button:focus-visible {
                background: var(--bs-tertiary-bg, #f1f5f9);
                outline: none;
            }

            #${MODAL_ID} .modal-body {
                overflow: auto;
                max-height: 75vh;
            }

            #${MODAL_ID} .grafico-card {
                width: 100%;
                max-width: none;
                margin: 0;
                box-shadow: none;
            }

            .grafico-exportacao-temporaria {
                background: #fff !important;
                color: #1e293b !important;
                padding: 20px !important;
            }
            
                       
            #modalGraficoAmpliado {
                z-index: 1060;
            }

            #modalGraficoAmpliado .modal-dialog {
                width: calc(100% - 32px);
                max-width: 750px;
                margin: 16px auto;
            }

            #modalGraficoAmpliado .modal-content {
                border: 0;
                border-radius: 12px;
                overflow: hidden;
            }

            #modalGraficoAmpliado .modal-body {
                padding: 16px;
                max-height: 70vh;
                overflow-y: auto;
            }

            #modalGraficoAmpliado .grafico-card {
                position: relative;
                width: 100%;
                max-width: none;
                margin: 0;
                padding: 12px;
                border: 0;
                box-shadow: none;
            }


            @media print {
                body * {
                    visibility: hidden !important;
                }

                #areaImpressaoGrafico,
                #areaImpressaoGrafico * {
                    visibility: visible !important;
                }

                #areaImpressaoGrafico {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    background: #fff !important;
                    color: #1e293b !important;
                }

                #areaImpressaoGrafico .grafico-opcoes {
                    display: none !important;
                }
            }
        `;

        document.head.appendChild(estilo);
    }

    function obterConfiguracao(card) {
        return CONFIGURACOES.find(config =>
            card.matches(config.seletor)
        );
    }

    function fecharMenus() {
        document.querySelectorAll(`.${MENU_CLASS}`).forEach(menu => {
            menu.remove();
        });

        document.querySelectorAll(".grafico-opcoes[aria-expanded='true']")
            .forEach(botao => {
                botao.setAttribute("aria-expanded", "false");
            });
    }

    function criarMenu(botao, card, config) {
        fecharMenus();

        const menu = document.createElement("div");
        menu.className = MENU_CLASS;
        menu.setAttribute("role", "menu");

        const opcoes = [
            ["file-pdf", "Exportar PDF", "pdf"],
            ["arrows-fullscreen", "Ampliar gráfico", "ampliar"],
            ["arrow-clockwise", "Atualizar gráfico", "atualizar"],
            ["printer", "Imprimir gráfico", "imprimir"]
        ];

        opcoes.forEach(([icone, texto, acao]) => {
            const item = document.createElement("button");

            item.type = "button";
            item.setAttribute("role", "menuitem");
            item.dataset.acaoGrafico = acao;
            item.innerHTML =
                `<i class="bi bi-${icone}" aria-hidden="true"></i>`;

            const legenda = document.createElement("span");
            legenda.textContent = texto;
            item.appendChild(legenda);

            menu.appendChild(item);
        });

        menu.dataset.seletorGrafico = config.seletor;

        card.appendChild(menu);
        botao.setAttribute("aria-expanded", "true");
    }

    function obterTitulo(card) {
        return card.querySelector("h3")?.textContent.trim()
            || "Gráfico Smart Charger";
    }

    function prepararClone(card) {
        const clone = card.cloneNode(true);

        clone.querySelectorAll(
            `.${MENU_CLASS}, .grafico-opcoes`
        ).forEach(elemento => elemento.remove());

        clone.classList.add("grafico-exportacao-temporaria");
        clone.style.width = "100%";
        clone.style.maxWidth = "none";
        clone.style.height = "auto";

        return clone;
    }


function obterModal() {
    let modal = document.getElementById(MODAL_ID);

    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.className = "modal fade";
    modal.tabIndex = -1;
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Gráfico ampliado</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Fechar">
                    </button>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    return modal;
}

    function ampliarGrafico(card) {
        if (!window.bootstrap?.Modal) {
            throw new Error("O Bootstrap Modal não está disponível.");
        }

        const modal = obterModal();
        const corpo = modal.querySelector(".modal-body");

        modal.querySelector(".modal-title").textContent =
            obterTitulo(card);

        corpo.replaceChildren(prepararClone(card));

        bootstrap.Modal.getOrCreateInstance(modal).show();
    }

    function atualizarGrafico(card, config) {
        if (
            typeof obterRecargasFiltradas !== "function" ||
            typeof historicoRecargas === "undefined"
        ) {
            throw new Error("Os dados das recargas não estão disponíveis.");
        }

        // Sincroniza os dados mais recentes salvos neste navegador.
        const dadosSalvos = localStorage.getItem("historicoRecargas");

        if (dadosSalvos !== null) {
            const registros = JSON.parse(dadosSalvos);

            if (!Array.isArray(registros)) {
                throw new Error("O histórico salvo não é válido.");
            }

            historicoRecargas.splice(
                0,
                historicoRecargas.length,
                ...registros
            );
        }

        if (typeof preencherFiltroMes === "function") {
            preencherFiltroMes();
        }

        config.atualizar.forEach(nome => {
            if (typeof window[nome] !== "function") {
                throw new Error(
                    `A função ${nome} não está disponível.`
                );
            }

            window[nome]();
        });
    }

    async function exportarPDF(card) {
        if (!window.html2canvas || !window.jspdf?.jsPDF) {
            throw new Error(
                "A biblioteca html2canvas ou jsPDF não foi carregada."
            );
        }

        const clone = prepararClone(card);

        const area = document.createElement("div");

        area.style.cssText = [
            "position:fixed",
            "left:-10000px",
            "top:0",
            "width:1100px",
            "padding:20px",
            "background:#fff",
            "z-index:-1"
        ].join(";");

        area.appendChild(clone);
        document.body.appendChild(area);

        try {
            // Aguarda fontes e imagens antes da captura.
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }

            const canvas = await html2canvas(clone, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false
            });

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF({
                orientation:
                    canvas.width > canvas.height ? "landscape" : "portrait",
                unit: "mm",
                format: "a4"
            });

            const margem = 10;
            const larguraPagina =
                pdf.internal.pageSize.getWidth() - margem * 2;

            const alturaPagina =
                pdf.internal.pageSize.getHeight() - margem * 2;

            const proporcao = Math.min(
                larguraPagina / canvas.width,
                alturaPagina / canvas.height
            );

            const largura = canvas.width * proporcao;
            const altura = canvas.height * proporcao;

            const imagem = canvas.toDataURL("image/png");

            pdf.addImage(
                imagem,
                "PNG",
                (pdf.internal.pageSize.getWidth() - largura) / 2,
                margem,
                largura,
                altura
            );

            const nome = obterTitulo(card)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
                .toLowerCase();

            pdf.save(`${nome || "grafico"}-smart-charger.pdf`);
        } finally {
            area.remove();
        }
    }

    function imprimirGrafico(card) {
        const janela = window.open("", "_blank");

        if (!janela) {
            throw new Error(
                "A impressão foi bloqueada pelo navegador. Permita a janela pop-up."
            );
        }

        const clone = prepararClone(card);
        clone.id = "areaImpressaoGrafico";

        const estilos = [
            ...document.querySelectorAll('link[rel="stylesheet"], style')
        ].map(elemento => elemento.outerHTML).join("\n");

        janela.document.open();
        janela.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${obterTitulo(card)}</title>
                ${estilos}
                <style>
                    body {
                        margin: 20px;
                        background: #fff;
                        color: #1e293b;
                        font-family: Arial, sans-serif;
                    }

                    #areaImpressaoGrafico {
                        width: 100%;
                        max-width: none;
                        box-shadow: none;
                    }

                    @page {
                        margin: 12mm;
                    }
                </style>
            </head>
            <body>
                ${clone.outerHTML}
            </body>
            </html>
        `);
        janela.document.close();

        janela.onload = () => {
            janela.focus();
            janela.print();
        };
    }

    function notificar(mensagem, erro = false) {
        if (window.Swal) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: erro ? "error" : "success",
                title: mensagem,
                showConfirmButton: false,
                timer: 3000
            });
        } else {
            alert(mensagem);
        }
    }

    async function executarAcao(acao, card, config) {
        switch (acao) {
            case "pdf":
                await exportarPDF(card);
                break;

            case "ampliar":
                ampliarGrafico(card);
                break;

            case "atualizar":
                atualizarGrafico(card, config);
                notificar("Gráfico atualizado.");
                break;

            case "imprimir":
                imprimirGrafico(card);
                break;

            default:
                return;
        }
    }

    function iniciarMenusGraficos() {
        instalarEstilos();

        document.addEventListener("click", async evento => {
            const botao = evento.target.closest(".grafico-opcoes");

            if (botao) {
                evento.preventDefault();

                const card = botao.closest(".grafico-card");
                const config = card && obterConfiguracao(card);

                if (!card || !config) return;

                const menuExistente =
                    card.querySelector(`.${MENU_CLASS}`);

                if (menuExistente) {
                    fecharMenus();
                } else {
                    criarMenu(botao, card, config);
                }

                return;
            }

            const item = evento.target.closest("[data-acao-grafico]");

            if (item) {
                evento.preventDefault();

                const menu = item.closest(`.${MENU_CLASS}`);
                const card = menu?.closest(".grafico-card");
                const config = card && obterConfiguracao(card);
                const acao = item.dataset.acaoGrafico;

                fecharMenus();

                if (!card || !config) return;

                try {
                    await executarAcao(acao, card, config);
                } catch (erro) {
                    console.error("Erro no menu do gráfico:", erro);
                    notificar(
                        erro.message || "Não foi possível executar a ação.",
                        true
                    );
                }

                return;
            }

            if (!evento.target.closest(`.${MENU_CLASS}`)) {
                fecharMenus();
            }
        });

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape") {
                fecharMenus();
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarMenusGraficos,
            { once: true }
        );
    } else {
        iniciarMenusGraficos();
    }
})();
