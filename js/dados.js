document.addEventListener(

    "DOMContentLoaded",

    () => {

 

        renderizarHistorico();

    }

);

 

// window.addEventListener("storage", () => {

 

//     renderizarHistorico();

 

// });

 

// Ativa o pesquisar da lupinha

document.addEventListener("DOMContentLoaded", () => {

    ativarBuscaHistorico();

});

 

// window.addEventListener("storage", () => {

//     renderizarHistorico();

// });

 

window.addEventListener("storage", (event) => {

 

    if (event.key !== "historicoRecargas") {

        return;

    }

 

    historicoRecargas =

        JSON.parse(event.newValue) || [];

 

    console.log(

        "HISTÓRICO ATUALIZADO PELO STORAGE:",

        historicoRecargas

    );

 

    renderizarHistorico();

});

 

function renderizarHistorico() {

     console.log(

 

        "RENDERIZANDO HISTÓRICO",

 

        historicoRecargas.length

 

    );

 

 

 

    const tabela =

 

        document.getElementById("tabelaHistorico");

 

 

 

        console.log("TABELA:", tabela);

 

 

 

    if (!tabela) return;

 

 

 

    tabela.innerHTML = `

 

        <table class="tabela-res">

 

 

 

            <thead>

 

 

 

                <tr>

 

 

 

                    <th>Placa</th>

 

                    <th>Proprietário</th>

                    <th>Cargo</th>

                    <th>Funcional</th>

 

 

                    <th>Entrada</th>

 

                    <th>Saída</th>

 

 

 

                    <th>Prisma</th>

 

                    <th>Estação</th>

 

 

 

                    <th>Torre</th>

 

                    <th>Piso</th>

 

 

 

                    <th>Data</th>

 

                    <th>Dia</th>

 

 

 

                    <th>Hora Chegada</th>

 

                    <th>Tempo Espera</th>

 

 

 

                    <th>Hora Carga</th>

 

                    <th>Carga Inicial</th>

 

 

 

                    <th>Hora Final</th>

 

                    <th>Carga Final</th>

 

 

 

                    <th>Tempo Carga</th>

 

 

 

                    <th>Status</th>

 

 

 

                </tr>

 

 

 

            </thead>

 

 

 

            <tbody>

 

 

 

                ${historicoRecargas

 

                    .slice()

 

                    .reverse()

 

                    .map(r => `

 

 

 

                    <tr>

 

 

 

                        <td>${r.placa}</td>

 

 

 

                        <td>${r.proprietario}</td>

 

                        <td>${r.cargo || "-"}</td>

                        <td>${r.funcional ? String(r.funcional).replace(/^Func:\s*/i, "") : "-"}</td>

 

                        <td>${r.manobristaEntrada || "-"}</td>

 

 

 

                        <td>${r.manobristaSaida || "-"}</td>

 

 

 

                        <td>${r.prisma || "-"}</td>

 

 

 

                        <td>${r.estacao || "-"}</td>

 

 

 

                        <td>${r.torre || "-"}</td>

 

 

 

                        <td>${r.piso || "-"}</td>

 

 

 

                        <td>${formatarDataBR(r.dataEntrada)}</td>

 

 

 

                        <td>${r.diaSemana || "-"}</td>

 

 

 

                        <td>${r.horaChegada || "-"}</td>

 

 

 

                        <td>

 

                           ${calcularTempoEspera(

 

                                r.horaChegada,

 

                                r.horaCargaInicial

 

                            )}

 

                        </td>

 

 

 

                        <td>${r.horaCargaInicial || "-"}</td>

 

 

 

                        <td>

 

                            ${r.cargaInicial

 

                                ? r.cargaInicial + "%"

 

                                : "-"}

 

                        </td>

 

 

 

                        <td>${r.horaFinal || "-"}</td>

 

 

 

                        <td>

 

                            ${r.cargaFinal

 

                                ? r.cargaFinal + "%"

 

                                : "-"}

 

                        </td>

 

 

 

                        <td>${r.tempoCarga || "-"}</td>

 

 

 

                        <td>${r.status || "-"}</td>

 

 

 

                    </tr>

 

 

 

                `).join("")}

 

 

 

            </tbody>

 

 

 

        </table>

 

    `;

     

    atualizarKPIsMovimentacoes();

    atualizarIndicativos();

}

 

function ativarBuscaHistorico() {

 

    const btnBusca = document.getElementById("btnFiltroMov");

    const tabela = document.getElementById("tabelaHistorico");

 

    if (!btnBusca || !tabela) return;

 

    btnBusca.addEventListener("click", () => {

 

        let areaBusca = document.getElementById("areaBuscaHistorico");

 

        // Se ainda não existe, cria a área

        if (!areaBusca) {

 

            areaBusca = document.createElement("div");

            areaBusca.id = "areaBuscaHistorico";

            areaBusca.className = "area-busca-historico";

 

            areaBusca.innerHTML = `

                <i class="bi bi-search"></i>

 

                <input

                    type="text"

                    id="campoBuscaHistorico"

                    placeholder="Pesquisar no histórico..."

                    autocomplete="off"

                >

 

                <button

                    type="button"

                    id="btnFecharBusca"

                    aria-label="Fechar pesquisa"

                    title="Fechar pesquisa"

                >

                    <i class="bi bi-x"></i>

                </button>

            `;

 

            tabela.parentElement.insertBefore(

                areaBusca,

                tabela

            );

 

            const campoBusca =

                document.getElementById("campoBuscaHistorico");

 

            const btnFechar =

                document.getElementById("btnFecharBusca");

 

            campoBusca.focus();

 

            campoBusca.addEventListener("input", () => {

                filtrarHistorico(campoBusca.value);

            });

 

            btnFechar.addEventListener("click", () => {

 

                campoBusca.value = "";

 

                filtrarHistorico("");

 

                areaBusca.classList.add("fechando");

 

                setTimeout(() => {

                    areaBusca.remove();

                }, 200);

 

            });

 

        } else {

 

            const campoBusca =

                document.getElementById("campoBuscaHistorico");

 

            campoBusca.focus();

 

        }

    });

}

 

function filtrarHistorico(texto) {

 

    const busca = texto

        .toLowerCase()

        .trim();

 

    const linhas = document.querySelectorAll(

        "#tabelaHistorico tbody tr"

    );

 

    linhas.forEach(linha => {

 

        const conteudo = linha.textContent

            .toLowerCase();

 

        linha.style.display =

            conteudo.includes(busca)

                ? ""

                : "none";

 

    });

}

 

function calcularTempoEspera(

 

    horaChegada,

 

    horaFinal

 

) {

 

 

 

    if (!horaChegada || !horaFinal) {

 

        return "-";

 

    }

 

 

 

    const [h1, m1] =

 

        horaChegada.split(":").map(Number);

 

 

 

    const [h2, m2] =

 

        horaFinal.split(":").map(Number);

 

 

 

    const inicio =

 

        (h1 * 60) + m1;

 

 

 

    const fim =

 

        (h2 * 60) + m2;

 

 

 

    const diferenca =

 

        fim - inicio;

 

 

 

    if (diferenca < 0) {

 

        return "-";

 

    }

 

 

 

    const horas =

 

        Math.floor(diferenca / 60);

 

 

 

    const minutos =

 

        diferenca % 60;

 

 

 

    return `${horas}h ${minutos}min`;

 

}

 

function calcularTempoCarga(

 

    horaCargaInicial,

 

    horaFinal

 

) {

 

 

 

    if (!horaCargaInicial || !horaFinal) {

 

        return "-";

 

    }

 

 

 

    const [h1, m1] =

 

        horaCargaInicial.split(":").map(Number);

 

 

 

    const [h2, m2] =

 

        horaFinal.split(":").map(Number);

 

 

 

    const inicio =

 

        (h1 * 60) + m1;

 

 

 

    const fim =

 

        (h2 * 60) + m2;

 

 

 

    const diferenca =

 

        fim - inicio;

 

 

 

    if (diferenca < 0) {

 

        return "-";

 

    }

 

 

 

    const horas =

 

        Math.floor(diferenca / 60);

 

 

 

    const minutos =

 

        diferenca % 60;

 

 

 

    return `${horas}h ${minutos}min`;

 

}

 

function formatarDataBR(data) {

    if (!data) return "-";

 

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;

}

 

function exportarExcel() {

 

    const dados = historicoRecargas.map(r => ({

 

        Placa: r.placa,

 

        Proprietario: r.proprietario,

        Cargo: r.cargo || "-",

        Funcional: r.funcional
        ? String(r.funcional).replace(/^Func:\s*/i, "")
        : "-",

        Entrada: r.manobristaEntrada || "-",

 

        Saida: r.manobristaSaida || "-",

 

        Prisma: r.prisma || "-",

 

        Estacao: r.estacao || "-",

 

        Torre: r.torre || "-",

 

        Piso: r.piso || "-",

 

        Data: r.dataEntrada || "-",

 

        Dia: r.diaSemana || "-",

 

        HoraChegada: r.horaChegada || "-",

 

        TempoEspera: calcularTempoEspera(

            r.horaChegada,

            r.horaCargaInicial

        ),

 

        HoraCarga: r.horaCargaInicial || "-",

 

        CargaInicial: r.cargaInicial

            ? r.cargaInicial + "%"

            : "-",

 

        HoraFinal: r.horaFinal || "-",

 

        CargaFinal: r.cargaFinal

            ? r.cargaFinal + "%"

            : "-",

 

        TempoCarga: r.tempoCarga || "-",

 

        Status: r.status || "-"

 

    }));

 

    const ws = XLSX.utils.json_to_sheet(dados);

 

    const wb = XLSX.utils.book_new();

 

    XLSX.utils.book_append_sheet(

        wb,

        ws,

        "RES Geralzao"

    );

 

    XLSX.writeFile(

        wb,

        "RES_Geralzao.xlsx"

    );

}

 

function exportarPDF() {

 

    const { jsPDF } = window.jspdf;

 

    const doc = new jsPDF("landscape");

 

    const linhas = historicoRecargas.map(r => [

 

        r.placa,

        r.proprietario,

        r.cargo || "-",

        r.funcional
        ? String(r.funcional).replace(/^Func:\s*/i, "")
        : "-",

        r.manobristaEntrada || "-",

        r.manobristaSaida || "-",

        r.prisma || "-",

        r.estacao || "-",

        r.torre || "-",

        r.piso || "-",

        r.dataEntrada || "-",

        r.diaSemana || "-",

        r.horaChegada || "-",

 

        calcularTempoEspera(

            r.horaChegada,

            r.horaCargaInicial

        ),

 

        r.horaCargaInicial || "-",

 

        r.cargaInicial

            ? r.cargaInicial + "%"

            : "-",

 

        r.horaFinal || "-",

 

        r.cargaFinal

            ? r.cargaFinal + "%"

            : "-",

 

        r.tempoCarga || "-",

 

        r.status || "-"

 

    ]);

 

    doc.setFontSize(16);

 

    doc.text(

        "RES Geralzao - Historico de Movimentacoes",

        14,

        15

    );

 

    doc.autoTable({

 

        startY: 25,

 

        head: [[

            "Placa",

            "Proprietário",

            "Cargo",

            "Funcional",

            "Entrada",

            "Saída",

            "Prisma",

            "Estação",

            "Torre",

            "Piso",

            "Data",

            "Dia",

            "Hora Chegada",

            "Tempo Espera",

            "Hora Carga",

            "Carga Inicial",

            "Hora Final",

            "Carga Final",

            "Tempo Carga",

            "Status"

        ]],

 

        body: linhas,

 

        styles: {

            fontSize: 7

        },

 

        headStyles: {

            fillColor: [242, 93, 39]

        }

 

    });

 

    doc.save("RES_Geralzao.pdf");

}

 

//============= Botão expandir e fechar do histórico de movimentações =============

document.addEventListener("DOMContentLoaded", () => {

    const btnToggle = document.getElementById("btnToggleMov");

    const historicoBox = document.querySelector(".historico-card");

 

    if (!btnToggle || !historicoBox) return;

 

    btnToggle.addEventListener("click", () => {

 

        const fechado = historicoBox.classList.toggle("fechado");

 

        btnToggle.innerHTML = fechado

            ? "🔼"

            : "🔽";

    });

});
