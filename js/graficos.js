// =====================================================

// PREMISSAS DOS INDICADORES

// =====================================================

 

const CAPACIDADE_BATERIA_KWH = 60;

const PRECO_KWH = 0.85;

const PRECO_COMBUSTIVEL = 6.00;

const KM_POR_KWH = 6;

const FATOR_CO2 = 0.12;

const TOTAL_ESTACOES = 24;


// function atualizarKPIsMovimentacoes() {
//     console.log("ATUALIZANDO KPIs DAS MOVIMENTAÇÕES RECENTES");

//     let movimentacoes = [];

//     try {
//         movimentacoes = JSON.parse(
//             localStorage.getItem("movimentacoesRecentes") || "[]"
//         );

//         if (!Array.isArray(movimentacoes)) {
//             movimentacoes = [];
//         }
//     } catch (erro) {
//         console.error("Erro ao carregar movimentações:", erro);
//     }

//     const normalizarStatus = status =>
//         (status || "").trim().toLowerCase();

//     const total = movimentacoes.length;

//     const concluidas = movimentacoes.filter(
//         r => normalizarStatus(r.status) === "concluído" ||
//              normalizarStatus(r.status) === "concluido"
//     ).length;

//     const emAndamento = movimentacoes.filter(
//         r => normalizarStatus(r.status) === "carregando"
//     ).length;

//     const fila = movimentacoes.filter(
//         r => normalizarStatus(r.status) === "fila"
//     ).length;

//     const indicadores = {
//         relTotal: total,
//         relConcluidas: concluidas,
//         relEmAndamento: emAndamento,
//         relFila: fila
//     };

//     Object.entries(indicadores).forEach(([id, valor]) => {
//         const elemento = document.getElementById(id);

//         if (elemento) {
//             elemento.textContent = valor;
//         } else {
//             console.warn(`Elemento KPI não encontrado: #${id}`);
//         }
//     });

//     console.table(indicadores);
// }

// function atualizarKPIsMovimentacoes() {
//     console.log("ATUALIZANDO KPIs DAS MOVIMENTAÇÕES RECENTES");

//     let movimentacoes = [];
//     let idsCarregando = [];
//     let idsFila = [];

//     try {
//         movimentacoes = JSON.parse(
//             localStorage.getItem("movimentacoesRecentes") || "[]"
//         );

//         idsCarregando = JSON.parse(
//             localStorage.getItem("kpiCarregandoIds") || "[]"
//         );

//         idsFila = JSON.parse(
//             localStorage.getItem("kpiFilaIds") || "[]"
//         );

//         if (!Array.isArray(movimentacoes)) movimentacoes = [];
//         if (!Array.isArray(idsCarregando)) idsCarregando = [];
//         if (!Array.isArray(idsFila)) idsFila = [];

//     } catch (erro) {
//         console.error("Erro ao carregar dados dos KPIs:", erro);
//     }

//     const normalizarStatus = status =>
//         (status || "").trim().toLowerCase();

//     // KPIs atuais: variam conforme o status da movimentação.
//     // const total = movimentacoes.length;

//     // const concluidas = movimentacoes.filter(r => {
//     //     const status = normalizarStatus(r.status);
//     //     return status === "concluído" || status === "concluido";
//     // }).length;
//     const idsTotal = JSON.parse(
//         localStorage.getItem("kpiTotalIds") || "[]"
//     );

//     const idsConcluidas = JSON.parse(
//         localStorage.getItem("kpiConcluidasIds") || "[]"
//     );

//     const total = new Set(
//         idsTotal.map(id => String(id))
//     ).size;

//     const concluidas = new Set(
//         idsConcluidas.map(id => String(id))
//     ).size;

//     const emAndamento = movimentacoes.filter(
//         r => normalizarStatus(r.status) === "carregando"
//     ).length;

//     const fila = movimentacoes.filter(
//         r => normalizarStatus(r.status) === "fila"
//     ).length;

//     // Novos KPIs: contagens acumulativas de veículos únicos.
//     const iniciaramCarga = new Set(
//         idsCarregando.map(id => String(id))
//     ).size;

//     const passaramFila = new Set(
//         idsFila.map(id => String(id))
//     ).size;

//     const indicadores = {
//         relTotal: total,
//         relConcluidas: concluidas,
//         relEmAndamento: emAndamento,
//         relFila: fila,
//         relIniciaramCarga: iniciaramCarga,
//         relPassaramFila: passaramFila
//     };

//     Object.entries(indicadores).forEach(([id, valor]) => {
//         const elemento = document.getElementById(id);

//         if (elemento) {
//             elemento.textContent = valor;
//         } else {
//             console.warn(`Elemento KPI não encontrado: #${id}`);
//         }
//     });

//     console.table(indicadores);
// }


function atualizarKPIsMovimentacoes(registrosFiltrados = null) {
    console.log("ATUALIZANDO KPIs COM FILTROS");

    let movimentacoes = [];
    let idsCarregando = [];
    let idsFila = [];
    let idsTotal = [];
    let idsConcluidas = [];

    try {
        movimentacoes = JSON.parse(
            localStorage.getItem("movimentacoesRecentes") || "[]"
        );

        idsCarregando = JSON.parse(
            localStorage.getItem("kpiCarregandoIds") || "[]"
        );

        idsFila = JSON.parse(
            localStorage.getItem("kpiFilaIds") || "[]"
        );

        idsTotal = JSON.parse(
            localStorage.getItem("kpiTotalIds") || "[]"
        );

        idsConcluidas = JSON.parse(
            localStorage.getItem("kpiConcluidasIds") || "[]"
        );

        if (!Array.isArray(movimentacoes)) movimentacoes = [];
        if (!Array.isArray(idsCarregando)) idsCarregando = [];
        if (!Array.isArray(idsFila)) idsFila = [];
        if (!Array.isArray(idsTotal)) idsTotal = [];
        if (!Array.isArray(idsConcluidas)) idsConcluidas = [];

    } catch (erro) {
        console.error("Erro ao carregar KPIs:", erro);
    }

    // Combina movimentações atuais e histórico sem duplicar IDs.
    const registros = new Map();

    [...(historicoRecargas || []), ...movimentacoes].forEach(registro => {
        if (registro?.id == null) return;
        registros.set(String(registro.id), registro);
    });

    const todosRegistros = [...registros.values()];

    // Utiliza os filtros globais já existentes.
    const filtrados = registrosFiltrados || obterRecargasFiltradas();

    const idsFiltrados = new Set(
        filtrados
            .filter(registro => registro?.id != null)
            .map(registro => String(registro.id))
    );

    const normalizarStatus = status =>
        normalizarTexto(status);

    const contarIdsFiltrados = ids =>
        new Set(
            ids
                .map(id => String(id))
                .filter(id => idsFiltrados.has(id))
        ).size;

    const total = contarIdsFiltrados(idsTotal);

    const concluidas = contarIdsFiltrados(idsConcluidas);

    // const emAndamento = filtrados.filter(
    //     registro => normalizarStatus(registro.status) === "carregando"
    // ).length;

    // const fila = filtrados.filter(
    //     registro => normalizarStatus(registro.status) === "fila"
    // ).length;

    // Movimentações atuais: respeitam os filtros globais.
    const movimentacoesFiltradas = obterRecargasFiltradas
        ? movimentacoes.filter(registro => {
            const data = obterDataRecarga(registro);

            const mesSelecionado =
                document.getElementById("filtroMes")?.value || "";

            const diaSelecionado =
                document.getElementById("filtroDiaSemana")?.value || "";

            const torreSelecionada =
                document.getElementById("filtroTorre")?.value || "";

            const pisoSelecionado =
                document.getElementById("filtroPiso")?.value || "";

            if (mesSelecionado) {
                if (!data) return false;

                const chaveMes =
                    `${data.ano}-${String(data.mes).padStart(2, "0")}`;

                if (chaveMes !== mesSelecionado) return false;
            }

            if (diaSelecionado &&
                normalizarTexto(obterDiaSemanaRegistro(registro)) !==
                normalizarTexto(diaSelecionado)) {
                return false;
            }

            if (torreSelecionada &&
                !normalizarTexto(registro.torre).includes(
                    normalizarTexto(torreSelecionada)
                )) {
                return false;
            }

            if (pisoSelecionado) {
                const normalizarPiso = valor =>
                    normalizarTexto(valor)
                        .replace(/^piso:\s*/, "")
                        .replace(/\s+/g, "");

                if (
                    normalizarPiso(registro.piso) !==
                    normalizarPiso(pisoSelecionado)
                ) {
                    return false;
                }
            }

            return true;
        })
        : movimentacoes;

    const emAndamento = movimentacoesFiltradas.filter(
        registro => normalizarStatus(registro.status) === "carregando"
    ).length;

    const fila = movimentacoesFiltradas.filter(
        registro => normalizarStatus(registro.status) === "fila"
    ).length;
    //fim
    const iniciaramCarga = contarIdsFiltrados(idsCarregando);

    const passaramFila = contarIdsFiltrados(idsFila);

    const indicadores = {
        relTotal: total,
        relConcluidas: concluidas,
        relEmAndamento: emAndamento,
        relFila: fila,
        relIniciaramCarga: iniciaramCarga,
        relPassaramFila: passaramFila
    };

    Object.entries(indicadores).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    });

    console.table(indicadores);
}


window.addEventListener("storage", evento => {
    if (
        evento.key === "movimentacoesRecentes" ||
        evento.key === "kpiCarregandoIds" ||
        evento.key === "kpiFilaIds"
    ) {
        atualizarKPIsMovimentacoes();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    atualizarKPIsMovimentacoes();
});


window.addEventListener("storage", evento => {
    if (evento.key === "movimentacoesRecentes") {
        atualizarKPIsMovimentacoes();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    atualizarKPIsMovimentacoes();
});

// function atualizarIndicativos() {

 

//     const registros = historicoRecargas.filter(

//         r => r.status === "Concluído"

//     );


function atualizarIndicativos(registrosFiltrados = null) {

    const base = registrosFiltrados || obterRecargasFiltradas();

    const registros = base.filter(
        r => normalizarTexto(r.status) === "concluido"
    );
 

    // =====================================================

    // 1. TEMPO MÉDIO DE CARREGAMENTO

    // =====================================================

 

    let totalMinutosCarga = 0;

    let quantidadeCarga = 0;

 

    registros.forEach(r => {

 

        if (!r.tempoCarga || r.tempoCarga === "-") {

            return;

        }

 

        const partes = r.tempoCarga.match(/(\d+)h\s*(\d+)min/);

 

        if (!partes) return;

 

        const horas = Number(partes[1]);

        const minutos = Number(partes[2]);

 

        totalMinutosCarga +=

            (horas * 60) + minutos;

 

        quantidadeCarga++;

 

    });

 

    const mediaCarga = quantidadeCarga > 0

        ? Math.round(totalMinutosCarga / quantidadeCarga)

        : 0;

 

    // =====================================================

    // 2. TEMPO MÉDIO DE ESPERA

    // =====================================================

 

    let totalMinutosEspera = 0;

    let quantidadeEspera = 0;

 

    registros.forEach(r => {

 

        if (

            !r.horaChegada ||

            !r.horaCargaInicial

        ) {

            return;

        }

 

        const [h1, m1] =

            r.horaChegada.split(":").map(Number);

 

        const [h2, m2] =

            r.horaCargaInicial.split(":").map(Number);

 

        const inicio =

            (h1 * 60) + m1;

 

        const fim =

            (h2 * 60) + m2;

 

        const diferenca =

            fim - inicio;

 

        if (diferenca < 0) return;

 

        totalMinutosEspera += diferenca;

        quantidadeEspera++;

 

    });

 

    const mediaEspera = quantidadeEspera > 0

        ? Math.round(totalMinutosEspera / quantidadeEspera)

        : 0;

 

    // =====================================================

    // 3. MÉDIA DE BATERIA NA ENTRADA

    // =====================================================

 

    const bateriasEntrada = registros

        .map(r => Number(r.cargaInicial))

        .filter(valor => !isNaN(valor));

 

    const mediaBateriaEntrada =

        bateriasEntrada.length > 0

            ? bateriasEntrada.reduce(

                (total, valor) => total + valor,

                0

            ) / bateriasEntrada.length

            : 0;

 

    // =====================================================

    // 4. MÉDIA DE BATERIA NA SAÍDA

    // =====================================================

 

    const bateriasSaida = registros

        .map(r => Number(r.cargaFinal))

        .filter(valor => !isNaN(valor));

 

    const mediaBateriaSaida =

        bateriasSaida.length > 0

            ? bateriasSaida.reduce(

                (total, valor) => total + valor,

                0

            ) / bateriasSaida.length

            : 0;

 

    // =====================================================

    // ATUALIZAÇÃO DOS CARDS

    // =====================================================

 

    const indicadorTempoCarga =

        document.getElementById("indicadorTempoCarga");

 

    const indicadorTempoEspera =

        document.getElementById("indicadorTempoEspera");

 

    const indicadorBateriaEntrada =

        document.getElementById("indicadorBateriaEntrada");

 

    const indicadorBateriaSaida =

        document.getElementById("indicadorBateriaSaida");

 

    if (indicadorTempoCarga) {

 

        const horas =

            Math.floor(mediaCarga / 60);

 

        const minutos =

            mediaCarga % 60;

 

        indicadorTempoCarga.textContent =

            `${horas}h ${minutos}min`;

 

    }

 

    if (indicadorTempoEspera) {

 

        const horas =

            Math.floor(mediaEspera / 60);

 

        const minutos =

            mediaEspera % 60;

 

        indicadorTempoEspera.textContent =

            `${horas}h ${minutos}min`;

 

    }

 

    if (indicadorBateriaEntrada) {

 

        indicadorBateriaEntrada.textContent =

            `${mediaBateriaEntrada.toFixed(1).replace(".", ",")}%`;

 

    }

 

    if (indicadorBateriaSaida) {

 

        indicadorBateriaSaida.textContent =

            `${mediaBateriaSaida.toFixed(1).replace(".", ",")}%`;

 

    }

 

    // =====================================================

    // ENERGIA TOTAL CONSUMIDA

    // =====================================================

 

    const indicadorEnergia =

        document.getElementById("indicadorEnergia");

 

    const indicadorEconomia =

        document.getElementById("indicadorEconomia");

 

    const indicadorCo2 =

        document.getElementById("indicadorCo2");

 

    let energiaTotal = 0;

 

    registros.forEach(r => {

 

        const cargaInicial = Number(r.cargaInicial);

        const cargaFinal = Number(r.cargaFinal);

 

        if (

            isNaN(cargaInicial) ||

            isNaN(cargaFinal) ||

            cargaFinal <= cargaInicial

        ) {

            return;

        }

 

        const percentualConsumido =

            cargaFinal - cargaInicial;

 

        const energia =

            (percentualConsumido / 100) *

            CAPACIDADE_BATERIA_KWH;

 

        energiaTotal += energia;

 

    });

 

    // =====================================================

    // ECONOMIA ESTIMADA

    // =====================================================

 

    const custoEnergia =

        energiaTotal * PRECO_KWH;

 

    const kmEquivalentes =

        energiaTotal * KM_POR_KWH;

 

    const litrosEquivalentes =

        kmEquivalentes / 10;

 

    const custoCombustivel =

        litrosEquivalentes * PRECO_COMBUSTIVEL;

 

    const economia =

        custoCombustivel - custoEnergia;

 

    // =====================================================

    // CO₂ EVITADO

    // =====================================================

 

    const co2Evitado =

        energiaTotal * FATOR_CO2;

 

    // =====================================================

    // ATUALIZA OS CARDS

    // =====================================================

 

    if (indicadorEnergia) {

 

        indicadorEnergia.textContent =

            `${energiaTotal.toFixed(1).replace(".", ",")} kWh`;

 

    }

 

    if (indicadorEconomia) {

 

        indicadorEconomia.textContent =

            `R$ ${Math.max(0, economia)

                .toFixed(2)

                .replace(".", ",")}`;

 

    }

 

    if (indicadorCo2) {

 

        indicadorCo2.textContent =

            `${co2Evitado.toFixed(1).replace(".", ",")} kg`;

 

    }

 

    // =====================================================

    // TAXA DE UTILIZAÇÃO DAS ESTAÇÕES

    // =====================================================

 

    let tempoTotalOcupacao = 0;

 

    registros.forEach(r => {

 

        if (!r.horaCargaInicial || !r.horaFinal) {

            return;

        }

 

        const inicio =

            new Date(`1970-01-01T${r.horaCargaInicial}`);

 

        const fim =

            new Date(`1970-01-01T${r.horaFinal}`);

 

        if (fim <= inicio) {

            return;

        }

 

        tempoTotalOcupacao += fim - inicio;

 

    });

 

    // =====================================================

    // PERÍODO ANALISADO

    // =====================================================

 

    // Por enquanto, considera 24 horas

    // para cada dia analisado.

 

    const periodoEmHoras = 24;

 

    const capacidadeTotal =

        TOTAL_ESTACOES *

        periodoEmHoras *

        60 *

        60 *

        1000;

 

    const taxaUtilizacao =

        capacidadeTotal > 0

            ? (tempoTotalOcupacao / capacidadeTotal) * 100

            : 0;

 

    // =====================================================

    // ATUALIZA O CARD

    // =====================================================

 

    const indicadorUtilizacao =

        document.getElementById("indicadorUtilizacao");

 

    if (indicadorUtilizacao) {

 

        indicadorUtilizacao.textContent =

            `${Math.min(100, taxaUtilizacao)

                .toFixed(1)

                .replace(".", ",")}%`;

 

    }

 

}

function obterRecargasPorDia() {
    const recargasPorDia = {};

    obterRecargasFiltradas().forEach(recarga => {
        const data = obterDataRecarga(recarga);

        if (!data) return;

        recargasPorDia[data.chave] =
            (recargasPorDia[data.chave] || 0) + 1;
    });

    return Object.fromEntries(
        Object.entries(recargasPorDia)
            .sort(([dataA], [dataB]) =>
                dataA.localeCompare(dataB)
            )
    );
}

 

function obterDadosGraficoDia() {

 

    const agrupado = obterRecargasPorDia();

 

    const datas = Object.keys(agrupado);

    const valores = Object.values(agrupado);

 

    return {

        datas,

        valores

    };

}

 
function obterTopUsuarios() {

 

    const usuarios = {};

 

    obterRecargasFiltradas().forEach(recarga => {

 

        if (!recarga.proprietario) return;

 

        usuarios[recarga.proprietario] =

            (usuarios[recarga.proprietario] || 0) + 1;

    });

 

    return Object.entries(usuarios)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 5);

}

function renderizarTopUsuarios() {

 

    const lista = document.getElementById("topUsuarios");

 

    if (!lista) return;

 

    const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];

 

    const topUsuarios = obterTopUsuarios();

 

    lista.innerHTML = topUsuarios.map(([nome, quantidade], index) => `

        <div class="ranking-item">

            <span>${index + 1}º ${medalhas[index]} ${nome}</span>

            <strong>${quantidade}</strong>

        </div>

    `).join("");

}


window.addEventListener("load", () => {
    atualizarKPIsMovimentacoes();
    atualizarIndicativos();
    iniciarFiltrosDashboard();
});



function obterTopCargos() {
    const cargos = {};

    obterRecargasFiltradas().forEach(recarga => {
        if (!recarga.cargo) return;

        cargos[recarga.cargo] =
            (cargos[recarga.cargo] || 0) + 1;
    });

    return Object.entries(cargos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
}

 

function renderizarTopCargos() {

 

    const lista = document.getElementById("topCargos");

 

    if (!lista) return;

 

    const medalhas = ["🥇", "🥈", "🥉", "🏅", "🎖️"];

 

    lista.innerHTML = obterTopCargos()

        .map(([cargo, quantidade], index) => `

            <div class="ranking-item">

                <span>

                    ${index + 1}º ${medalhas[index]} ${cargo}

                </span>

                <strong>${quantidade}</strong>

            </div>

        `)

        .join("");

}



function obterUsoPorTorre() {
    const torres = {};

    obterRecargasFiltradas().forEach(recarga => {
        if (!recarga.torre) return;

        torres[recarga.torre] =
            (torres[recarga.torre] || 0) + 1;
    });

    return Object.entries(torres)
        .sort((a, b) => b[1] - a[1]);
}

 

function obterPercentualPorTorre() {

 

    const dados = obterUsoPorTorre();

 

    const total = dados.reduce(

        (soma, [, qtd]) => soma + qtd,

        0

    );

 

    return dados.map(([torre, qtd]) => ({

        torre,

        qtd,

        percentual: Math.round(

            (qtd / total) * 100

        )

    }));

}

 

function renderizarUsoPorTorre() {

 

    const container =

        document.getElementById("usoPorTorre");

 

    if (!container) return;

 

    const dados =

        obterPercentualPorTorre();

 

    container.innerHTML = dados.map((item, index) => `

 

        <div class="barra-horizontal-item">

 

            <div class="barra-horizontal-topo">

                <span>

                    ${item.torre

                        .replace("Torre ", "")}

                </span>

 

                <strong>

                    ${item.percentual}%

                </strong>

            </div>

 

            <div class="barra-horizontal-fundo">

 

                <div

                    class="barra-horizontal-preenchimento torre-${index + 1}"

                    style="width:${item.percentual}%">

                </div>

 

            </div>

 

        </div>

 

    `).join("");

 

}



function obterUsoPorPiso() {
    const pisos = {};

    obterRecargasFiltradas().forEach(recarga => {
        if (!recarga.piso) return;

        pisos[recarga.piso] =
            (pisos[recarga.piso] || 0) + 1;
    });

    return Object.entries(pisos)
        .sort((a, b) => b[1] - a[1]);
}

 

function obterPercentualPorPiso() {

 

    const dados = obterUsoPorPiso();

 

    const total = dados.reduce(

        (soma, [, qtd]) => soma + qtd,

        0

    );

 

    return dados.map(([piso, qtd]) => ({

        piso,

        qtd,

        percentual:

            Math.round((qtd / total) * 100)

    }));

}

 

function renderizarUsoPorPiso() {

 

    const container =

        document.getElementById("usoPorPiso");

 

    if (!container) return;

 

    const dados =

        obterPercentualPorPiso();

 

    container.innerHTML =

        dados.map((item, index) => `

 

        <div class="barra-horizontal-item">

 

            <div class="barra-horizontal-topo">

                <span>${item.piso}</span>

 

                <strong>

                    ${item.percentual}%

                </strong>

            </div>

 

            <div class="barra-horizontal-fundo">

 

                <div

                    class="barra-horizontal-preenchimento torre-${(index % 3) + 1}"

                    style="width:${item.percentual}%">

                </div>

 

            </div>

 

        </div>

 

    `).join("");

 

}

function obterCarregamentosPorDiaSemana() {
    const dias = {
        "Segunda-feira": 0,
        "Terça-feira": 0,
        "Quarta-feira": 0,
        "Quinta-feira": 0,
        "Sexta-feira": 0,
        "Sábado": 0,
        "Domingo": 0
    };

    obterRecargasFiltradas().forEach(recarga => {
        const dia = obterDiaSemanaRegistro(recarga);

        if (Object.prototype.hasOwnProperty.call(dias, dia)) {
            dias[dia]++;
        }
    });

    return dias;
}

 

function renderizarDiaSemana() {

 

    const container =

        document.getElementById(

            "graficoDiaSemana"

        );

 

    if (!container) return;

 

    const dados =

        obterCarregamentosPorDiaSemana();

 

    const dias = [

        ["Seg", "Segunda-feira"],

        ["Ter", "Terça-feira"],

        ["Qua", "Quarta-feira"],

        ["Qui", "Quinta-feira"],

        ["Sex", "Sexta-feira"],

        ["Sáb", "Sábado"],

        ["Dom", "Domingo"]

    ];

 

    const maior = Math.max(

        ...Object.values(dados),

        1

    );

 

    container.innerHTML = dias.map(

        ([sigla, nome], index) => {

 

            const valor = dados[nome];

 

            const altura =

                (valor / maior) * 100;

 

            return `

                <div class="barra-item">

 

                    <span class="barra-valor">

                        ${valor}

                    </span>

 

                    <div

                        class="barra barra-${index + 1}"

                        style="height:${altura}%; min-height:4px;">

                    </div>

 

                    <span class="barra-label">

                        ${sigla}

                    </span>

 

                </div>

            `;

        }

    ).join("");

}


function renderizarRecargasPorDia() {
    const svg = document.getElementById("graficoRecargasDia");

    if (!svg) return;

    const dias = [
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
        "Domingo"
    ];

    const abreviacoes = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const valoresPorDia = Object.fromEntries(dias.map(dia => [dia, 0]));

    obterRecargasFiltradas().forEach(recarga => {
        const dia = obterDiaSemanaRegistro(recarga);

        if (Object.prototype.hasOwnProperty.call(valoresPorDia, dia)) {
            valoresPorDia[dia]++;
        }
    });

    const valores = dias.map(dia => valoresPorDia[dia]);

    const largura = 740;
    const inicioX = 30;
    const espacamento = largura / (dias.length - 1);
    const maxValor = Math.max(...valores, 1);

    const pontos = valores.map((valor, index) => {
        const x = inicioX + index * espacamento;
        const y = 240 - (valor / maxValor) * 180;

        return `${x},${y}`;
    });

    const polyline = pontos.join(" ");
    const polygon = `${polyline} ${inicioX + largura},240 ${inicioX},240`;

    const labels = abreviacoes.map((dia, index) => {
        const x = inicioX + index * espacamento;

        return `
            <text x="${x}" y="265">${dia}</text>
        `;
    }).join("");

    const circles = pontos.map((ponto, index) => {
        const [x, y] = ponto.split(",");

        return `
            <circle
                cx="${x}"
                cy="${y}"
                r="5"
                fill="#0f172a"
                stroke="#ff6b00"
                stroke-width="2">
                <title>${dias[index]}: ${valores[index]} recargas</title>
            </circle>
        `;
    }).join("");

    svg.innerHTML = `
        <defs>
            <linearGradient
                id="gradienteLinha"
                x1="0"
                y1="0"
                x2="0"
                y2="1">
                <stop offset="8%" stop-color="#ff6b00" stop-opacity="0.75"/>
                <stop offset="45%" stop-color="#ff6b00" stop-opacity="0.44"/>
                <stop offset="100%" stop-color="#ff6b00" stop-opacity="0.08"/>
            </linearGradient>
        </defs>

        <polygon
            fill="url(#gradienteLinha)"
            points="${polygon}">
        </polygon>

        <polyline
            fill="none"
            stroke="#ff6b00"
            stroke-width="5"
            points="${polyline}">
        </polyline>

        ${circles}

        <g
            fill="#0f172a"
            font-size="13"
            font-weight="800"
            text-anchor="middle">
            ${labels}
        </g>
    `;
}

function obterRecargasPorMes() {
    const meses = {};

    obterRecargasFiltradas().forEach(recarga => {
        const data = obterDataRecarga(recarga);

        if (!data) return;

        const chave =
            `${data.ano}-${String(data.mes).padStart(2, "0")}`;

        meses[chave] = (meses[chave] || 0) + 1;
    });

    return meses;
}

 

function formatarMesAno(chave) {

 

    if (!chave || chave === "Sem dados") {

        return "Sem dados";

    }

 

    const nomesMeses = [

        "Janeiro",

        "Fevereiro",

        "Março",

        "Abril",

        "Maio",

        "Junho",

        "Julho",

        "Agosto",

        "Setembro",

        "Outubro",

        "Novembro",

        "Dezembro"

    ];

 

    const [ano, mes] = chave.split("-");

 

    return `${nomesMeses[Number(mes) - 1]}/${ano}`;

}

 

function obterComparativoMensal() {

 

    const meses = obterRecargasPorMes();

 

    const lista = Object.entries(meses)

        .sort((a, b) => a[0].localeCompare(b[0]));

 

    if (lista.length === 0) {

        return null;

    }

 

    const atual =

        lista[lista.length - 1];

 

    const anterior =

        lista.length > 1

            ? lista[lista.length - 2]

            : ["Sem dados", 0];

 

    const diferenca =

        atual[1] - anterior[1];

 

    const percentual =

        anterior[1] > 0

            ? ((diferenca / anterior[1]) * 100)

            : 0;

 

    return {

 

        anteriorMes: anterior[0],

 

        anteriorValor: anterior[1],

 

        atualMes: atual[0],

 

        atualValor: atual[1],

 

        diferenca,

 

        percentual:

            percentual.toFixed(1)

    };

}

 

function renderizarComparativoMensal() {

 

    const card =

        document.getElementById("comparativoMensal");

 

    if (!card) return;

 

    const comparativo =

        obterComparativoMensal();

 

    // if (!comparativo) return;
    if (!comparativo) {
        card.innerHTML = "";
        return;
    }
    

    const percentualBarraAnterior =

        comparativo.atualValor > 0

            ? (comparativo.anteriorValor / comparativo.atualValor) * 100

            : 0;

 

    const percentualBarraAtual = 100;

 

    card.innerHTML = `

 

        <div class="comparativo-header">

 

            <div>

                <h3>

                    <i class="bi bi-graph-up-arrow"></i>

                    Comparativo Mensal

                </h3>

 

                <span>

                    Evolução das recargas

                </span>

            </div>

 

            <span class="comparativo-periodo">

                Últimos 2 meses

            </span>

 

        </div>

 

        <div class="comparativo-body">

 

            <div class="comparativo-mes">

 

                <span class="mes-nome">

                    ${comparativo.anteriorMes}

                </span>

 

                <strong>

                    ${comparativo.anteriorValor}

                </strong>

 

                <small>Recargas</small>

 

            </div>

 

            <div class="comparativo-evolucao">

                <i class="bi bi-arrow-right"></i>

            </div>

 

            <div class="comparativo-mes destaque">

 

                <span class="mes-nome">

                    ${formatarMesAno(comparativo.atualMes)}

                </span>

 

                <strong>

                    ${comparativo.atualValor}

                </strong>

 

                <small>Recargas</small>

 

            </div>

 

        </div>

 

        <div class="comparativo-resultado">

 

            <div class="comparativo-diferenca">

 

                <i class="bi bi-arrow-up-right"></i>

 

                <strong>

                    ${comparativo.diferenca >= 0 ? "+" : ""}

                    ${comparativo.diferenca}

                </strong>

 

                <span>recargas</span>

 

            </div>

 

            <div class="comparativo-percentual">

 

                ${comparativo.percentual}%

 

            </div>

 

            <small>

                crescimento no período

            </small>

 

        </div>

 

        <div class="comparativo-barras">

 

            <div class="comparativo-barra">

 

                <div class="barra-info">

                    <span>${formatarMesAno(comparativo.anteriorMes)}</span>

                    <strong>${comparativo.anteriorValor}</strong>

                </div>

 

                <div class="barra-fundo">

                    <div

                        class="barra-preenchimento julho"

                        style="width:${percentualBarraAnterior}%">

                    </div>

                </div>

 

            </div>

 

            <div class="comparativo-barra">

 

                <div class="barra-info">

                    <span>

                        ${formatarMesAno(

                            comparativo.atualMes

                        )}

                    </span>

                    <strong>${comparativo.atualValor}</strong>

                </div>

 

                <div class="barra-fundo">

                    <div

                        class="barra-preenchimento agosto"

                        style="width:${percentualBarraAtual}%">

                    </div>

                </div>

 

            </div>

 

        </div>

 

    `;

}

function classificarCargo(valor) {
    const cargo = normalizarTexto(valor);

    if (!cargo || cargo === "-") return null;

    if (
        cargo.includes("diretor") ||
        /^dir\.?\s/.test(cargo) ||
        cargo === "dir" ||
        cargo.startsWith("ceo") ||
        cargo.includes("conselheiro") ||
        cargo.includes("conselheira") ||
        cargo.includes("presidente") ||
        /\bcons\b/.test(cargo) ||
        /\bpres\b/.test(cargo)
    ) {
        return "Diretores(as)";
    }

    if (cargo.includes("superint")) {
        return "Superintendentes";
    }

    if (
        cargo.includes("gerente") ||
        cargo.includes("gerencia")
    ) {
        return "Gerentes";
    }

    if (cargo.includes("coord")) {
        return "Coordenadores(as)";
    }

    return "Analistas";
}

function obterDistribuicaoCargos(registros = obterRecargasFiltradas()) {
    const categorias = {
        "Analistas": 0,
        "Coordenadores(as)": 0,
        "Gerentes": 0,
        "Superintendentes": 0,
        "Diretores(as)": 0
    };

    registros.forEach(recarga => {
        const categoria = classificarCargo(recarga.cargo);

        if (categoria) {
            categorias[categoria]++;
        }
    });

    return categorias;
}


function renderizarGraficoCargos() {
    const container = document.getElementById("graficoCargos");

    if (!container) return;

    // Quantidade de recargas conforme os filtros selecionados
    const dadosFiltrados = obterDistribuicaoCargos();

    // Total geral de recargas, independentemente dos filtros
    const totalGeral = historicoRecargas.length;

    container.innerHTML = Object.entries(dadosFiltrados)
        .map(([cargo, qtd]) => {
            // Percentual da quantidade filtrada sobre o total geral
            const percentual = totalGeral > 0
                ? (qtd / totalGeral) * 100
                : 0;

            return `
                <div class="cargo-barra">
                    <div class="cargo-barra-topo">
                        <span>${cargo}</span>
                        <strong>
                            ${percentual.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}%
                        </strong>
                    </div>

                    <div class="cargo-barra-fundo">
                        <div
                            class="cargo-barra-preenchimento"
                            style="width:${percentual}%;">
                        </div>
                    </div>
                </div>
            `;
        }).join("");
}

function renderizarCardsCargos() {

 

    const container =

        document.getElementById(

            "cardsCargos"

        );

 

    if (!container) return;

 

    const dados =

        obterDistribuicaoCargos();

 

    const icones = {

        "Analistas":

            "bi-person",

 

        "Coordenadores(as)":

            "bi-people",

 

        "Gerentes":

            "bi-person-badge",

 

        "Superintendentes":

            "bi-person-vcard",

 

        "Diretores(as)":

            "bi-person-workspace"

    };

 

    container.innerHTML =

        Object.entries(dados)

        .map(([cargo, qtd]) => `

 

            <div class="cargo-card">

 

                <div class="cargo-card-icone">

 

                    <i class="

                        bi

                        ${icones[cargo]}

                    "></i>

 

                </div>

 

                <span>${cargo}</span>

 

                <strong>${qtd}</strong>

 

            </div>

 

        `).join("");
}

// =====================================================
// FILTROS GLOBAIS DO DASHBOARD
// =====================================================
function normalizarTexto(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function obterDataRecarga(registro) {
    const data = String(registro.dataEntrada || "").trim();

    // Formato esperado: YYYY-MM-DD
    const correspondencia = data.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (correspondencia) {
        return {
            ano: Number(correspondencia[1]),
            mes: Number(correspondencia[2]),
            dia: Number(correspondencia[3]),
            chave: data
        };
    }

    // Também aceita DD/MM/YYYY
    const brasileira = data.match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (brasileira) {
        return {
            ano: Number(brasileira[3]),
            mes: Number(brasileira[2]),
            dia: Number(brasileira[1]),
            chave: `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`
        };
    }

    return null;
}

function obterDiaSemanaRegistro(registro) {
    const dias = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
    ];

    if (registro.diaSemana) {
        const informado = normalizarTexto(registro.diaSemana);

        const encontrado = dias.find(
            dia => normalizarTexto(dia) === informado
        );

        if (encontrado) return encontrado;
    }

    const data = obterDataRecarga(registro);

    if (!data) return "";

    const dataLocal = new Date(
        data.ano,
        data.mes - 1,
        data.dia
    );

    return dias[dataLocal.getDay()];
}

function obterRecargasFiltradas() {
    const mesSelecionado =
        document.getElementById("filtroMes")?.value || "";

    const diaSelecionado =
        document.getElementById("filtroDiaSemana")?.value || "";

    const torreSelecionada =
        document.getElementById("filtroTorre")?.value || "";

    const pisoSelecionado =
        document.getElementById("filtroPiso")?.value || "";

    return (historicoRecargas || []).filter(registro => {
        const data = obterDataRecarga(registro);

        if (mesSelecionado) {
            if (!data) return false;

            const chaveMes =
                `${data.ano}-${String(data.mes).padStart(2, "0")}`;

            if (chaveMes !== mesSelecionado) return false;
        }

        if (diaSelecionado) {
            if (
                normalizarTexto(obterDiaSemanaRegistro(registro)) !==
                normalizarTexto(diaSelecionado)
            ) {
                return false;
            }
        }

        if (torreSelecionada) {
            const torre = normalizarTexto(registro.torre);
            const filtro = normalizarTexto(torreSelecionada);

            if (!torre.includes(filtro)) return false;
        }

        if (pisoSelecionado) {
            const normalizarPiso = valor =>
                normalizarTexto(valor)
                    .replace(/^piso:\s*/, "")
                    .replace(/\s+/g, "");

            const piso = normalizarPiso(registro.piso);
            const filtro = normalizarPiso(pisoSelecionado);

            if (piso !== filtro) return false;
        }

        return true;
    });
}

function preencherFiltroMes() {
    const select = document.getElementById("filtroMes");

    if (!select) return;

    const valorAtual = select.value;
    const meses = new Set();

    (historicoRecargas || []).forEach(registro => {
        const data = obterDataRecarga(registro);

        if (data) {
            meses.add(
                `${data.ano}-${String(data.mes).padStart(2, "0")}`
            );
        }
    });

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    select.innerHTML =
        '<option value="">Todos os meses</option>';

    [...meses].sort().reverse().forEach(chave => {
        const [ano, mes] = chave.split("-");

        const option = document.createElement("option");

        option.value = chave;
        option.textContent =
            `${nomesMeses[Number(mes) - 1]} de ${ano}`;

        select.appendChild(option);
    });

    if (meses.has(valorAtual)) {
        select.value = valorAtual;
    }
}

function renderizarTabelaUsoPorDia(registros) {
    const corpo = document.getElementById("tabelaUsoPorDia");
    const totalElemento = document.getElementById("totalUsoPorDia");

    if (!corpo) return;

    const contagem = {};

    registros.forEach(registro => {
        const data = obterDataRecarga(registro);

        if (!data) return;

        contagem[data.chave] = (contagem[data.chave] || 0) + 1;
    });

    const datas = Object.keys(contagem).sort();

    if (datas.length === 0) {
        corpo.innerHTML = "<p>Nenhum registro encontrado.</p>";

        if (totalElemento) {
            totalElemento.textContent = "0";
        }

        return;
    }

    corpo.innerHTML = datas.map(dataISO => {
        const [ano, mes, dia] = dataISO.split("-");

        return `
            <div>
                <span>${dia}/${mes}/${ano}</span>
                <strong>${contagem[dataISO]}</strong>
            </div>
        `;
    }).join("");

    if (totalElemento) {
        totalElemento.textContent = registros.length;
    }
}

function atualizarDashboardFiltrado() {
    const registros = obterRecargasFiltradas();

    atualizarIndicativos(registros);

    renderizarTabelaUsoPorDia(registros);

    // Atualiza os seis KPIs com os mesmos filtros.
    atualizarKPIsMovimentacoes(registros);

    // Os gráficos são atualizados usando a mesma seleção.
    renderizarTopUsuarios();
    renderizarTopCargos();
    renderizarUsoPorTorre();
    renderizarUsoPorPiso();
    renderizarDiaSemana();
    renderizarRecargasPorDia();
    renderizarComparativoMensal();
    renderizarGraficoCargos();
    renderizarCardsCargos();
}

function iniciarFiltrosDashboard() {
    preencherFiltroMes();

    [
        "filtroMes",
        "filtroDiaSemana",
        "filtroTorre",
        "filtroPiso"
    ].forEach(id => {
        document.getElementById(id)?.addEventListener(
            "change",
            atualizarDashboardFiltrado
        );
    });

    document.getElementById("limparFiltros")?.addEventListener(
        "click",
        () => {
            [
                "filtroMes",
                "filtroDiaSemana",
                "filtroTorre",
                "filtroPiso"
            ].forEach(id => {
                const elemento = document.getElementById(id);

                if (elemento) elemento.value = "";
            });

            atualizarDashboardFiltrado();
        }
    );

    atualizarDashboardFiltrado();
}


window.addEventListener("storage", evento => {
    if (evento.key !== "historicoRecargas") return;

    try {
        const atualizadas = JSON.parse(evento.newValue || "[]");

        if (!Array.isArray(atualizadas)) return;

        // Atualiza o histórico que os gráficos já utilizam.
        historicoRecargas.splice(
            0,
            historicoRecargas.length,
            ...atualizadas
        );

        // Atualiza os indicadores e os gráficos.
        preencherFiltroMes();
        atualizarIndicativos();
        atualizarDashboardFiltrado();

        console.log("Dashboard atualizado com o novo histórico.");
    } catch (erro) {
        console.error("Erro ao atualizar o dashboard:", erro);
    }
});
