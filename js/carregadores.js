//Botões de filltrosCarregadores

const carregadores = [

    {

        id: 1,

        nome: "Estação 01",

        status: "livre",

        potencia: "22 kW"

    },

 

    {

        id: 2,

        nome: "Estação 02",

        status: "em uso",

        potencia: "50 kW"

    },

 

    {

        id: 3,

        nome: "Estação 03",

        status: "livre",

        potencia: "150 kW"

    }

];

 

let filtroStatus = "todos";

let filtroTorreAtual = "todas";

 

function filtrarCarregadores(filtro, botaoClicado) {

 

    filtroStatus = filtro;

 

    // Ativa somente o botão de status

    document.querySelectorAll(".filtro-btn").forEach(btn => {

        btn.classList.remove("active");

    });

 

    botaoClicado.classList.add("active");

 

    // Se clicar em TODOS, remove também o filtro de torre

    if (filtro === "todos") {

        filtroTorreAtual = "todas";

 

        document.querySelectorAll(".torre-btn").forEach(btn => {

            btn.classList.remove("active");

        });

    }

 

    aplicarFiltros();

}

function filtrarTorre(torre, botaoClicado) {

 

    filtroTorreAtual = torre;

 

    // Ativa somente o botão da torre

    document.querySelectorAll(".torre-btn").forEach(btn => {

        btn.classList.remove("active");

    });

 

    botaoClicado.classList.add("active");

 

    aplicarFiltros();

}

 

function aplicarFiltros() {

 

    document.querySelectorAll(".station-card").forEach(card => {

 

        const status = card.dataset.status;

        const torre = card.dataset.torre;

 

        const correspondeStatus =

            filtroStatus === "todos" ||

            status === filtroStatus;

 

        const correspondeTorre =

            filtroTorreAtual === "todas" ||

            torre === filtroTorreAtual;

 

        if (correspondeStatus && correspondeTorre) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}

 

//Renderização

function renderizarCarregadores(filtro) {

    const carregadoresFiltrados = carregadores.filter(c => {

        if (filtro === "livres")

            return c.status === "livre";

        if (filtro === "em uso")

            return c.status === "em uso";

        return true; // todos

    });

 

    //<======================= Renderizando os cards... ==========================>

    atualizarContadores();

}

 

function atualizarContadores() {

 

    const cards = document.querySelectorAll(".station-card");

 

    let total = cards.length;

    let emUso = 0;

    let livres = 0;

    let fila = 0;

 

    let alfredo = 0;

    let jabaquara = 0;

    let olavo = 0;

 

    cards.forEach(card => {

 

        const status = card.dataset.status;

        const torre = card.dataset.torre;

 

        // ================= STATUS GERAL =================

        if (status === "Fila") {

            fila++;

        }

 

        if (status === "em uso") {

            emUso++;

        }

 

        if (status === "livre") {

            livres++;

 

            // ================= TORRES =================

            // Só conta a estação enquanto ela estiver livre

 

            if (torre === "alfredo") {

                alfredo++;

            }

 

            if (torre === "jabaquara") {

                jabaquara++;

            }

 

            if (torre === "olavo") {

                olavo++;

            }

        }

    });

 

    // ================= CONTADORES GERAIS =================

 

    document.getElementById("contadorTodos").textContent =

        `Todas: ${total}`;

 

    document.getElementById("contadorLivres").textContent =

        `Livres: ${livres}`;

 

    document.getElementById("contadorEmuso").textContent =

        `Em uso: ${emUso}`;

 

    document.getElementById("kpiFila").textContent =

        `Fila: ${fila}`;

 

    // ================= CONTADORES DAS TORRES =================

 

    document.getElementById("contadorAlfredo").textContent =

        `Alfredo: ${alfredo}`;

 

    document.getElementById("contadorJabaquara").textContent =

        `Jabaquara: ${jabaquara}`;

 

    document.getElementById("contadorOlavo").textContent =

        `Olavo: ${olavo}`;

 

    // ================= KPIs =================

    document.getElementById("kpiLivres").textContent = livres;

    document.getElementById("kpiEmUso").textContent = emUso;

    document.getElementById("kpiFila").textContent = fila;

}

 

function contarFilaEstacao(estacao) {

    return recargas.filter(

        r =>

            r.estacao === estacao &&

            r.status === "Fila"

    ).length;

}

 

function atualizarDataHoje() {

    const hoje = new Date();

 

    // Dia do mês

    document.getElementById("kpiHoje").textContent =

        String(hoje.getDate()).padStart(2, "0");

 

    // Dia da semana

    const dias = [

        "Domingo",

        "Segunda-feira",

        "Terça-feira",

        "Quarta-feira",

        "Quinta-feira",

        "Sexta-feira",

        "Sábado"

    ];

 

    document.getElementById("kpiDiaSemana").textContent =

        dias[hoje.getDay()];

}

 

// Atualiza agora

atualizarDataHoje();

atualizarComparativoOntem();
 

// Atualiza automaticamente a cada minuto

setInterval(atualizarDataHoje, 60000);

 
// =========  Atualizando os KPI'  <span id="comparativoOntem"  =====================
function atualizarComparativoOntem() {

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const formatarData = data =>
        data.toISOString().split("T")[0];

    const dataHoje = formatarData(hoje);
    const dataOntem = formatarData(ontem);

    const totalHoje = recargas.filter(
        r => r.dataEntrada === dataHoje
    ).length;

    const totalOntem = recargas.filter(
        r => r.dataEntrada === dataOntem
    ).length;

    let percentual = 0;

    if (totalOntem > 0) {
        percentual =
            ((totalHoje - totalOntem) / totalOntem) * 100;
    }

    percentual = Math.round(percentual);

    const sinal = percentual > 0 ? "+" : "";

    document.getElementById("comparativoOntem").textContent =
        `${sinal}${percentual}% quanto a ontem`;
}

// =========  Atualizando os KPI's =====================

function atualizarKPIs() {

    // ================ Data de hoje ====================

    const hoje = new Date();

    document.getElementById("kpiHoje").textContent = hoje.getDate();

 

    //============== Contagem das estações ==============

    const cards = document.querySelectorAll(".station-card");

    let livres = 0;

    let emUso = 0;

 

    cards.forEach(card => {

        const status = card.querySelector(".status").textContent.trim().toLowerCase();

        if (status === "livre") livres++;

        if (status === "em uso") emUso++;

    });

 

    document.getElementById("kpiEmUso").textContent = emUso;

    document.getElementById("kpiLivres").textContent = livres;

}

 

document.addEventListener("DOMContentLoaded", () => {

 

    atualizarContadores();

 

    const btnTodos = document.querySelector(".filtro-btn");

 

    if (btnTodos) {

        filtrarCarregadores("todos", btnTodos);

    }

});

 

window.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");

    const sidebar = document.getElementById("sidebar");

    const overlay = document.getElementById("overlay");

 

    console.log(menuBtn);

    console.log(sidebar);

    console.log(overlay);

 

    if(menuBtn){

        menuBtn.addEventListener("click", () => {

            sidebar.classList.toggle("active");

            overlay.classList.toggle("active");

        });

    }

 

    if(overlay){

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("active");

            overlay.classList.remove("active");

        });

    }

});

//============= dia da semana ================
window.addEventListener("DOMContentLoaded", () => {

    const dataEntrada = document.getElementById("dataEntrada");

    const diaSemana = document.getElementById("diaSemana");

 

    dataEntrada.addEventListener("change", () => {

        const valor = dataEntrada.value;

        if (!valor) return;

        const [ano, mes, dia] = valor.split("-");

        const data = new Date(ano, mes - 1, dia);

 

        const dias = [

            "Domingo",

            "Segunda-feira",

            "Terça-feira",

            "Quarta-feira",

            "Quinta-feira",

            "Sexta-feira",

            "Sábado"

        ];

 

        diaSemana.value = dias[data.getDay()];

    });

});

// ===== KPI Hora e Data =====
function atualizarKpiHoraData() {
    const agora = new Date();

    // Hora
    const hora = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    const kpiHoraMinutos = document.getElementById("kpiHoraMinutos");
    const kpiHoraSegundos = document.getElementById("kpiHoraSegundos");

    if (kpiHoraMinutos) {
        kpiHoraMinutos.textContent = `${hora}:${minutos}`;
    }

    if (kpiHoraSegundos) {
        kpiHoraSegundos.textContent = `:${segundos}`;
    }

    // Data
    const diasSemana = [
        "Dom", "Seg", "Ter", "Qua",
        "Qui", "Sex", "Sáb"
    ];

    const diaSemana = diasSemana[agora.getDay()];
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = String(agora.getFullYear()).slice(-2);

    const kpiData = document.getElementById("kpiData");

    if (kpiData) {
        kpiData.textContent = `${diaSemana} ${dia}/${mes}/${ano}`;
    }
}

// Atualiza imediatamente
atualizarKpiHoraData();

// Atualiza a cada segundo
setInterval(atualizarKpiHoraData, 1000);

// ===== KPI Previsão do Tempo =====
// Localização padrão: São Paulo
const LATITUDE_PADRAO = -23.5505;
const LONGITUDE_PADRAO = -46.6333;

async function atualizarPrevisao(latitude, longitude) {
    const kpiPrevisao = document.getElementById("kpiPrevisao");
    const kpiIcone = document.querySelector(".kpi-footer i");

    if (!kpiPrevisao) return;

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar previsão do tempo");
        }

        const dados = await resposta.json();

        const temperatura = Math.round(dados.current.temperature_2m);
        const maxima = Math.round(dados.daily.temperature_2m_max[0]);
        const minima = Math.round(dados.daily.temperature_2m_min[0]);
        const codigoTempo = dados.current.weather_code;
        const isDia = dados.current.is_day;

        console.log("Código do tempo:", codigoTempo);
        console.log("É dia?", isDia);
        console.log("Temperatura:", temperatura);
        console.log("Máxima:", maxima);
        console.log("Mínima:", minima);

        // Atualiza temperaturas
        kpiPrevisao.innerHTML = `
            ${temperatura}º |
            <span class="temp-max"> Máx: ${maxima}º</span> |
            <span class="temp-min"> Mín: ${minima}º</span>
        `;

        // Atualiza ícone
        if (kpiIcone) {
            kpiIcone.className =
                `bi ${obterIconeTempo(codigoTempo, isDia)}`;
        }

    } catch (erro) {
        console.error("Erro na previsão do tempo:", erro);

        kpiPrevisao.textContent = "Previsão indisponível";
    }
}


// ===== Ícone do clima =====
function obterIconeTempo(codigo, isDia) {

    // Céu limpo
    if (codigo === 0) {
        return isDia
            ? "bi-sun-fill"
            : "bi-moon-stars-fill";
    }

    // Poucas nuvens
    if (codigo === 1 || codigo === 2) {
        return isDia
            ? "bi-cloud-sun-fill"
            : "bi-cloud-moon-fill";
    }

    // Nublado
    if (codigo === 3) {
        return "bi-cloud-fill";
    }

    // Neblina
    if (codigo === 45 || codigo === 48) {
        return "bi-cloud-haze-fill";
    }

    // Garoa
    if ([51, 53, 55, 56, 57].includes(codigo)) {
        return "bi-cloud-drizzle-fill";
    }

    // Chuva
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
        return "bi-cloud-rain-fill";
    }

    // Neve
    if ([71, 73, 75, 77, 85, 86].includes(codigo)) {
        return "bi-snow";
    }

    // Trovoada
    if ([95, 96, 99].includes(codigo)) {
        return "bi-cloud-lightning-rain-fill";
    }

    // Caso não reconheça
    return isDia
        ? "bi-cloud-sun-fill"
        : "bi-cloud-moon-fill";
}


// ===== Localização atual =====
function obterLocalizacao() {

    if (!navigator.geolocation) {
        console.warn("Geolocalização não disponível.");
        
        atualizarPrevisao(
            LATITUDE_PADRAO,
            LONGITUDE_PADRAO
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        // Localização encontrada
        function (posicao) {

            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            atualizarPrevisao(latitude, longitude);
        },

        // Localização recusada ou indisponível
        function (erro) {

            console.warn(
                "Não foi possível obter a localização:",
                erro.message
            );

            console.log("Usando São Paulo como localização padrão.");

            atualizarPrevisao(
                LATITUDE_PADRAO,
                LONGITUDE_PADRAO
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

// ===== Inicialização =====
obterLocalizacao();

// Atualiza a previsão a cada 30 minutos
setInterval(obterLocalizacao, 30 * 60 * 1000);

 
// ================ Botão registar =========================
function registrarRecarga() {

  const estacaoSelecionada = document.getElementById("estacao").value;

  const prismaSelecionado = document.getElementById("prisma").value;

  const placa = document.getElementById("placa").value;

 

  const proprietario =

    document.getElementById("nomeVeiculo").textContent.trim();

 

  const registroExistente = recargas.find(

    r =>

        r.placa.toUpperCase() === placa.toUpperCase() &&

        r.status !== "Concluído"

    );

 

    // const existeCarregando = recargas.find(

    // r =>

    //     r.estacao === estacaoSelecionada &&

    //     r.status === "Carregando"

    // );

 

    const existeCarregando = recargas.find(

    r =>

        r.estacao === estacaoSelecionada &&

        r.status !== "Concluído"

    );

 

    console.log(

    "EXISTE RECARGA NESSA ESTAÇÃO:",

    existeCarregando

    );

 

    if (registroExistente) {

    if (registroExistente.status === "Aberto") {

        atualizarEtapa2(registroExistente);

    } else if (registroExistente.status === "Carregando") {

        atualizarEtapa3(registroExistente);

    }

    } else {

        // Só cria uma nova recarga se NÃO existir uma aberta

        const novaRecarga = criarRecarga({

    status: existeCarregando ? "Fila" : "Aberto",

            placa: placa,

            proprietario: proprietario,

 

            manobristaEntrada:

                document.getElementById("manobristaEntrada").value,

 

            prisma: prismaSelecionado,

            estacao: estacaoSelecionada,

 

            dataEntrada:

                document.getElementById("dataEntrada").value,

 

            diaSemana:

                document.getElementById("diaSemana").value,

 

            horaChegada:

                document.getElementById("horaChegada").value

        });

 

        console.table(novaRecarga);

    }

 

//     const novaRecarga = criarRecarga({

 

//         placa: placa,

//         proprietario: proprietario,

//         manobristaEntrada:

 

//         document.getElementById("manobristaEntrada").value,

//         prisma: prismaSelecionado,

//         estacao: estacaoSelecionada,

//         dataEntrada:

 

//         document.getElementById("dataEntrada").value,

//         diaSemana:

 

//         document.getElementById("diaSemana").value,

//         horaChegada:

 

//         document.getElementById("horaChegada").value

//   });

 

//console.table(novaRecarga);

 

  if (!estacaoSelecionada || !prismaSelecionado) {

    alert("Selecione estação e prisma");

    return;

  }

 

  const card = [...document.querySelectorAll(".station-card")]

    .find(c => c.querySelector("h3").textContent.trim() === estacaoSelecionada);

 

  if (!card) return;

 

  //========== Atualiza status do card ===============

  card.dataset.status = "em uso";

  card.classList.add("em-uso");

 

  //=========== Ícone principal verde ===============

  const icone = card.querySelector(".station-icon");

  icone.className = "station-icon verde";

  icone.innerHTML = '<i class="fa-solid fa-charging-station"></i><i class="bi bi-ev-front-fill"></i>';

 

  //=========== Badge verde “Em uso ⚡” ================

  const status = card.querySelector(".status");

  status.className = "status uso";

  status.innerHTML = 'Em uso <i class="bi bi-lightning-charge"></i>';

 

  //=============== Título verde ===========================

  const titulo = card.querySelector("h3");

  titulo.style.color = "#0b5e29";

 

  //========== Ícones da lista azul claro (corrigido) =========

  const listaItens = card.querySelectorAll("ul li i");

  listaItens.forEach(i => {

    i.classList.remove("status", "livre", "uso");

    i.style.backgroundColor = "#dcfce7";

    i.style.color = "#0b5e29";          

    i.style.borderRadius = "50%";

    i.style.padding = "10px";

    i.style.width = "36px";

    i.style.height = "36px";

    i.style.display = "flex";

    i.style.justifyContent = "center";

    i.style.alignItems = "center";

  });

 

  //========== Botão verde claro =============

  const botao = card.querySelector("button");

  botao.className = "status uso";

  botao.style.backgroundColor = "#dcfce7";

  botao.style.color = "#0b5e29";

  botao.textContent = "Ver detalhes";

 

  //========= Desativa estação e prisma no select ============

  const selectEstacao = document.getElementById("estacao");

  [...selectEstacao.options].forEach(opcao => {

    if (opcao.text.includes(estacaoSelecionada)) {

        opcao.disabled = false;

        opcao.text = `${estacaoSelecionada} ⚡`;

    }

  });

 

  const selectPrisma = document.getElementById("prisma");

  [...selectPrisma.options].forEach(opcao => {

    if (opcao.text.includes(prismaSelecionado)) {

        opcao.disabled = false;

        opcao.text = `${prismaSelecionado} ⚡`;

    }

  });

 

    //========= Limpa os campos da operação após registrar ===========

    document.getElementById("placa").value = "";

    document.getElementById("fotoVeiculo").src = "img/charge1.jpg"

    document.getElementById("manobristaEntrada").value = "";

    document.getElementById("dataEntrada").value = "";

    document.getElementById("diaSemana").value = "";

    document.getElementById("horaChegada").value = "";

    document.getElementById("horaCargaInicial").value = "";

    document.getElementById("cargaInicial").value = "";

    document.getElementById("manobristaSaida").value = "";

    document.getElementById("cargaFinal").value = "";

    document.getElementById("horaFinal").value = "";

    document.getElementById("dataEntrada").value = "";

    document.getElementById("diaSemana").value = "";

    document.getElementById("estacao").selectedIndex = 0;

    document.getElementById("prisma").selectedIndex = 0;

 

    limparCard();

 

    liberarFormulario();

 

    // Atualiza os contadores e KPIs

    atualizarContadores();

}