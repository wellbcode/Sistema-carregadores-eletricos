
// =====================================================
// PREMISSAS DOS INDICADORES
// =====================================================

const CAPACIDADE_BATERIA_KWH = 60;
const PRECO_KWH = 0.85;
const PRECO_COMBUSTIVEL = 6.00;
const KM_POR_KWH = 6;
const FATOR_CO2 = 0.12;
const TOTAL_ESTACOES = 24;

function atualizarKPIsMovimentacoes() {

    console.log("ATUALIZANDO KPIs:", recargas);

    const total =
    historicoRecargas.length;

    const concluidas =
        historicoRecargas.filter(
            r => r.status === "Concluído"
        ).length;

    const emAndamento =
        historicoRecargas.filter(
            r =>
                r.status === "Aberto" ||
                r.status === "Carregando"
        ).length;

    const fila =
        historicoRecargas.filter(
            r => r.status === "Fila"
        ).length;


    const relTotal =
        document.getElementById("relTotal");

    const relConcluidas =
        document.getElementById("relConcluidas");

    const relEmAndamento =
        document.getElementById("relEmAndamento");

    const relFila =
        document.getElementById("relFila");


    if (relTotal) {
        relTotal.textContent = total;
    }

    if (relConcluidas) {
        relConcluidas.textContent = concluidas;
    }

    if (relEmAndamento) {
        relEmAndamento.textContent = emAndamento;
    }

    if (relFila) {
        relFila.textContent = fila;
    }

}

function atualizarIndicativos() {

    const registros = historicoRecargas.filter(
        r => r.status === "Concluído"
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