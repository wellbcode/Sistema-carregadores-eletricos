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

let filtroMovimentacao = "todos";

let lembretes = [];


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

      console.log("1");

        atualizarContadores();

 

    console.log("2");

    //     atualizarComparativoOntem();

 

    console.log("3");

        renderizarMovimentacoes();

}

 

function atualizarContadores() {

 

    const cards = document.querySelectorAll(".station-card");

 

    let total = cards.length;

    let emUso = 0;

    let livres = 0;

    //let fila = 0;

 

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

        // ================= FILA =================

    const fila = recargas.filter(
        r => r.status === "Fila"
    ).length;

 

    // ================= CONTADORES GERAIS =================

 

    document.getElementById("contadorTodos").textContent =

        `Todas: ${total}`;

 

    document.getElementById("contadorLivres").textContent =

        `Livres: ${livres}`;

 

    document.getElementById("contadorEmuso").textContent =

        `Em uso: ${emUso}`;

 
    // ================= CONTADOR DA FILA =================
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

 

    console.log("1");

        atualizarContadores();

 

    console.log("2")    

    //     atualizarComparativoOntem();

 

    console.log("3")

        renderizarMovimentacoes();

 

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

        // const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

//         const url =

// `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

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

//============= Movimentação do dia dia da semana ================
function renderizarMovimentacoes() {

 

    const lista =

        document.getElementById("listaMovimentacoes");

 

    if (!lista) return;

 

    let registros = [...recargas];

    if (filtroMovimentacao !== "todos") {

    const torres = [
        "Torre Alfredo Egydio",
        "Torre Olavo Setubal"
    ];

    registros = registros.filter(r => {

        // FILTRO POR TORRE
        if (torres.includes(filtroMovimentacao)) {
            return r.torre === filtroMovimentacao;
        }

        // FILTRO POR TORRE + PISO
        if (filtroMovimentacao.includes("|")) {

            const [torre, piso] = filtroMovimentacao.split("|");

            return r.torre === torre &&
                   r.piso === piso;
        }

        // FILTRO POR STATUS
        return r.status === filtroMovimentacao;

    });

}

    lista.innerHTML = registros

        .slice()

        .reverse()

        .map(registro => `

            <div class="mov-item">

 

                <h4>

                    <i class="bi bi-car-front-fill"></i>

                    ${registro.placa}

                </h4>

 

                <p>

                    <i class="bi bi-person-vcard"></i>

                    ${registro.proprietario}

                </p>

 

                <p>

                    <i class="bi bi-building"></i>

                    ${registro.torre}

                </p>

                <p>

                    <i class="bi bi-geo-alt"></i>

                    ${registro.piso}

                </p>

 

                <p>

                    <i class="bi bi-plugin"></i>

                    ${registro.estacao}

                </p>

 

                <p>

                    <i class="bi bi-reception-4"></i>

                    ${registro.status}

                </p>

 

                <div class="mov-acoes">

 

                    <button
                        class="btn-mov-concluir"
                        onclick="confirmarConclusao(${registro.id})"
                        title="Concluir movimentação">

                        <i class="bi bi-check-circle"></i>

                    </button>

 

                    <button class="btn-mov-agendar" onclick="confirmarNotificacao(${registro.id})">
                        <i class="bi bi-send"></i>
                    </button>

 
                    <button 
                        class="btn-mov-notificar" 
                        onclick="confirmarLembrete(${registro.id})" 
                        title="Criar lembrete">

                        <i class="bi bi-bell-fill"></i>

                    </button>

 

                    <button
                        class="btn-mov-excluir"
                        onclick="confirmarExclusao(${registro.id})"
                        title="Excluir movimentação">

                        <i class="bi bi-trash"></i>

                    </button>

 

                </div>

 

            </div>

        `)

        .join("");

}

function filtrarMovimentacoes(status) {

 

    filtroMovimentacao = status;

 

    menuFiltroMov.classList.remove("ativo");

 

    renderizarMovimentacoes();

 

}

function confirmarNotificacao(id) {

    const registro = recargas.find(r => r.id === id);

    if (!registro) {
        console.log("Recarga não encontrada:", id);
        return;
    }

    const usuario = base.find(
        pessoa => pessoa[0] === registro.placa
    );

    if (!usuario) {
        console.log("Usuário não encontrado:", registro.placa);
        return;
    }

    const email = usuario[4];
    const nome = usuario[1].split(" - Func:")[0];

    console.log("BOTÃO CLICADO:", id);

    Swal.fire({

        title: "Notificar usuário?",

        html: `
            <div class="alerta-conteudo">

                <p>
                    O veículo de <strong>${nome}</strong>
                    já foi carregado.
                </p>

                <p>
                    Deseja enviar uma mensagem pelo
                    <strong>Microsoft Teams</strong>?
                </p>

            </div>
        `,

        icon: "question",

        showCancelButton: true,

        confirmButtonText:
            '<i class="fa-solid fa-paper-plane"></i> Sim, notificar',

        cancelButtonText:
            "Cancelar",

        reverseButtons: true,

        focusCancel: true,

        buttonsStyling: false,

        customClass: {

            popup: "alerta-notificacao",

            title: "alerta-titulo",

            confirmButton: "btn-alerta-confirmar",

            cancelButton: "btn-alerta-cancelar"

        }

    }).then((resultado) => {

        if (!resultado.isConfirmed) {
            return;
        }

        const mensagem =
            "Olá, seu veículo já foi carregado, pode vir buscá-lo assim que puder. :)";

        const urlTeams =
            `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(email)}&text=${encodeURIComponent(mensagem)}`;

        window.open(urlTeams, "_blank");

    });

}

function confirmarConclusao(id) {

    const registro = recargas.find(r => r.id === id);

    if (!registro) {
        console.log("Recarga não encontrada:", id);
        return;
    }

    Swal.fire({
        title: "Concluir movimentação?",
        text: `Deseja concluir o atendimento da placa ${registro.placa}?`,
        icon: "question",

        showCancelButton: true,

        confirmButtonText: "Sim, concluir",
        cancelButtonText: "Cancelar",

        confirmButtonColor: "#16a34a",
        cancelButtonColor: "#64748b",

        reverseButtons: true

    }).then((resultado) => {

        if (!resultado.isConfirmed) return;

        registro.status = "Concluído";

        Swal.fire({
            title: "Movimentação concluída!",
            text: `O atendimento da placa ${registro.placa} foi encerrado.`,
            icon: "success",

            confirmButtonText: "OK",
            confirmButtonColor: "#16a34a",

            timer: 2500,
            timerProgressBar: true
        });

        atualizarContadores();
        renderizarMovimentacoes();

    });

}

function agendarLembrete(registro, dataLembrete, mensagem) {

    const agora = new Date();

    const tempoRestante =
        dataLembrete.getTime() - agora.getTime();

    if (tempoRestante <= 0) {

        Swal.fire({
            title: "Data inválida",
            text: "A data escolhida já passou.",
            icon: "error",
            confirmButtonText: "OK"
        });

        return;
    }

    // Evita dois lembretes para a mesma movimentação
    const jaExiste = lembretes.some(
        lembrete => lembrete.id === registro.id
    );

    if (jaExiste) {

        Swal.fire({
            title: "Lembrete já existe",
            text: `Já existe um lembrete para ${registro.placa}.`,
            icon: "info",
            confirmButtonText: "OK"
        });

        return;
    }

    lembretes.push({
        id: registro.id,
        placa: registro.placa,
        proprietario: registro.proprietario,
        estacao: registro.estacao,
        torre: registro.torre,
        data: dataLembrete,
        mensagem: mensagem
    });

    atualizarLembretes();

    Swal.fire({
        title: "Lembrete definido!",
        text: `Você será lembrado em ${dataLembrete.toLocaleString("pt-BR")}.`,
        icon: "success",
        confirmButtonText: "OK"
    });

    setTimeout(() => {

        mostrarNotificacaoLembrete(
            registro,
            mensagem
        );

}, tempoRestante);
}

function mostrarNotificacaoLembrete(registro, mensagem) {

    const som = new Audio("audios/success-1-6297.mp3");

    som.play().catch(erro => {
        console.log("Não foi possível reproduzir o som:", erro);
    });

    if (Notification.permission === "granted") {

        new Notification("🔔 Lembrete Smart Charger", {
            body:
                mensagem ||
                `Veículo ${registro.placa} — ${registro.estacao}`
        });

    } else {

        Swal.fire({
            title: "🔔 Lembrete",
            text:
                mensagem ||
                `Veículo ${registro.placa} está relacionado à ${registro.estacao}.`,
            icon: "info",
            confirmButtonText: "OK"
        });

    }
}

function confirmarLembrete(id) {

    const registro = recargas.find(r => r.id === id);

    if (!registro) {
        console.log("Recarga não encontrada:", id);
        return;
    }

    Swal.fire({
        title: "🔔 Criar lembrete",

        html: `
            <div style="text-align: left;">
                <p>
                    <strong>🚗 ${registro.placa}</strong>
                </p>

                <p>👤 ${registro.proprietario}</p>

                <p>⚡ ${registro.estacao}</p>

                <p>📍 ${registro.torre}</p>

                <input
                    type="datetime-local"
                    id="lembreteData"
                    class="swal2-input"
                >
                <textarea
                    id="lembreteMensagem"
                    class="swal2-textarea"
                    placeholder="Digite uma mensagem para a notificação..."
                ></textarea>
            </div>
        `,

        showCancelButton: true,

        confirmButtonText: "Salvar lembrete",

        cancelButtonText: "Cancelar",

        reverseButtons: true,

        preConfirm: () => {

            const data =
                document.getElementById("lembreteData").value;

            const mensagem =
                document.getElementById("lembreteMensagem").value.trim();

            if (!data) {

                Swal.showValidationMessage(
                    "Escolha uma data e hora."
                );

                return false;
            }

            return {
                data,
                mensagem
            };
        }
        
    }).then(resultado => {

        if (!resultado.isConfirmed) return;

        const [data, hora] = resultado.value.data.split("T");

        const [ano, mes, dia] = data.split("-").map(Number);
        const [horas, minutos] = hora.split(":").map(Number);

        const dataLembrete = new Date(
            ano,
            mes - 1,
            dia,
            horas,
            minutos
        );

        agendarLembrete(
            registro,
            dataLembrete,
            resultado.value.mensagem
        );

    });
}

function mostrarLembretes() {

    if (lembretes.length === 0) {

        Swal.fire({
            title: "🔔 Lembretes",
            text: "Nenhum lembrete agendado.",
            icon: "info",
            confirmButtonText: "OK"
        });

        return;
    }

    const lista = lembretes.map(lembrete => `

        <div style="
            text-align: left;
            padding: 12px;
            margin-bottom: 10px;
            background: #f8fafc;
            border-radius: 10px;
        ">

            <strong>🚗 ${lembrete.placa}</strong>

            <p>👤 ${lembrete.proprietario}</p>

            <p>⚡ ${lembrete.estacao}</p>

            <p>📍 ${lembrete.torre}</p>

            <p>
                📝 ${lembrete.mensagem || "Sem mensagem"}
            </p>

            <small>
                🕐 ${new Date(lembrete.data).toLocaleString("pt-BR")}
            </small>

        </div>

    `).join("");

    Swal.fire({

        title: "🔔 Meus lembretes",

        html: `
            <div style="
                max-height: 400px;
                overflow-y: auto;
            ">
                ${lista}
            </div>
        `,

        confirmButtonText: "Fechar"

    });
}

window.confirmarLembrete = confirmarLembrete;
function atualizarLembretes() {

    const quantidade = lembretes.length;

    const badgeTopbar =
        document.getElementById("badgeNotificacoes");

    const badgeSidebar =
        document.getElementById("badgeAlertas");


    // ================= TOPBAR =================

    if (badgeTopbar) {

        badgeTopbar.textContent = quantidade;

        badgeTopbar.style.display =
            quantidade > 0 ? "flex" : "none";
    }


    // ================= SIDEBAR =================

    if (badgeSidebar) {

        badgeSidebar.textContent = quantidade;

        badgeSidebar.style.display =
            quantidade > 0 ? "flex" : "none";
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const btnNotificacoes =
        document.getElementById("btnNotificacoes");

    if (btnNotificacoes) {

        btnNotificacoes.addEventListener("click", () => {

            mostrarLembretes();

        });

    }

    const linkAlertas =
        document.getElementById("linkAlertas");

    if (linkAlertas) {

        linkAlertas.addEventListener("click", (event) => {

            event.preventDefault();

            mostrarLembretes();

        });

    }

});

function confirmarExclusao(id) {

    const registro = recargas.find(r => r.id === id);

    if (!registro) {
        console.log("Recarga não encontrada:", id);
        return;
    }

    Swal.fire({

        title: "Excluir movimentação?",

        html: `
            <p>
                Você está prestes a excluir a movimentação da placa
                <strong>${registro.placa}</strong>.
            </p>

            <p style="
                margin-top:10px;
                color:#dc2626;
                font-size:13px;
            ">
                Essa ação não poderá ser desfeita.
            </p>
        `,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",

        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",

        reverseButtons: true

    }).then((resultado) => {

        if (!resultado.isConfirmed) return;

        const indice = recargas.findIndex(
            r => r.id === id
        );

        if (indice === -1) return;

        recargas.splice(indice, 1);

        Swal.fire({

            title: "Movimentação excluída!",
            text: `A movimentação ${registro.placa} foi removida.`,
            icon: "success",

            confirmButtonText: "OK",
            confirmButtonColor: "#dc2626",

            timer: 2500,
            timerProgressBar: true

        });

        atualizarContadores();
        renderizarMovimentacoes();

    });
}

const btnFiltroMov =
    document.getElementById("btnFiltroMov");

    const menuFiltroMov =
        document.getElementById("menuFiltroMov");

    btnFiltroMov.addEventListener("click", () => {

    menuFiltroMov.classList.toggle("ativo");
});

btnFiltroMov.addEventListener("click", () => {

 

    const somenteFila =

        recargas.filter(r => r.status === "Fila");

 

    // renderiza apenas fila

 

});


//============= Botão expandir e guardar ================
const btnToggle =
    document.getElementById("btnToggleMov");
const historicoBox =
    document.getElementById("listaMovimentacoes");

//============= Botão expandir e guardar ================
btnToggle.addEventListener("click", () => {

    const fechado = historicoBox.classList.toggle("fechado");

    btnToggle.innerHTML = fechado
        ? "🔼"
        : "🔽";

});

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

        const card = [...document.querySelectorAll(".station-card")]

    .find(c =>

        c.querySelector("h3").textContent.trim() === estacaoSelecionada

    );

 

    const nomesTorres = {

        alfredo: "Torre Alfredo Egydio",

        jabaquara: "Torre Jabaquara",

        olavo: "Torre Olavo Setubal"

    };

 

    const torre = nomesTorres[card.dataset.torre];

    const opcaoEstacao = document.getElementById("estacao").selectedOptions[0];
const piso = opcaoEstacao.dataset.piso;

 

        // Só cria uma nova recarga se NÃO existir uma aberta

        const novaRecarga = criarRecarga({

    status: existeCarregando ? "Fila" : "Aberto",

            placa: placa,

            proprietario: proprietario,

            torre: torre,

            piso: piso,

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

 

  if (!estacaoSelecionada || !prismaSelecionado) {

    alert("Selecione estação e prisma");

    return;

  }

 

    const card = [...document.querySelectorAll(".station-card")]

        .find(c =>

            c.querySelector("h3").textContent.trim() === estacaoSelecionada

        );

 

    if (!card) {

        console.error("Estação não encontrada:", estacaoSelecionada);

        return;

    }

 

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

 

    console.log("1");

    atualizarContadores();

 

     console.log("2")    

    //     atualizarComparativoOntem();

 

    console.log("3")

        renderizarMovimentacoes();

}

//============= Botão de notificações ================

window.addEventListener("load", function () {

    const btnNotificacoes =
        document.getElementById("btnNotificacoes");

    console.log("🔔 BOTÃO ENCONTRADO:", btnNotificacoes);

    if (!btnNotificacoes) return;

    btnNotificacoes.addEventListener("click", function () {

        console.log("🔔🔔🔔 CLIQUEI NO SINO 🔔🔔🔔");

    });

});