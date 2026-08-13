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

//carregadores
// function filtrarCarregadores(filtro, botaoClicado) {
//     // Atualiza os botões
//     document.querySelectorAll(".filtro-btn").forEach(btn =>
//         btn.classList.remove("active")
//     );

//     botaoClicado.classList.add("active");

//     // Filtra os cards
//     document.querySelectorAll(".station-card").forEach(card => {
//         const status = card.dataset.status;

//         if (filtro === "todos" || status === filtro) {
//             card.style.display = "";
//         } else {
//             card.style.display = "none";
//         }
//     });

//     atualizarContadores();
// }
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

//<================= Atualizado os números dos botões Contadores =================>
// function atualizarContadores() {
//     const cards = document.querySelectorAll(".station-card");

//     const total = 24; // Total fixo de carregadores

//     let emUso = 0;

//     cards.forEach(card => {
//         if (card.dataset.status === "em uso") {
//             emUso++;
//         }
//     });

//     const livres = total - emUso;

//     //============= Contadores do do botões Livres, Em uso e Total ================
//     document.getElementById("contadorLivres").textContent =
//         `Livres: ${livres}`;

//     document.getElementById("contadorEmuso").textContent =
//         `Em uso: ${emUso}`;

//     document.getElementById("contadorTodos").textContent =
//         `Todas: ${total}`;

//     //==================== KPI's ==========================
//     document.getElementById("kpiLivres").textContent = livres;
//     document.getElementById("kpiEmUso").textContent = emUso;
// }
function atualizarContadores() {

    const cards = document.querySelectorAll(".station-card");

    let total = cards.length;
    let emUso = 0;
    let livres = 0;

    let alfredo = 0;
    let jabaquara = 0;
    let olavo = 0;

    cards.forEach(card => {

        const status = card.dataset.status;
        const torre = card.dataset.torre;

        // ================= STATUS GERAL =================

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

// Atualiza automaticamente a cada minuto
setInterval(atualizarDataHoje, 60000);

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

    // if (registroExistente) {
    //     if (registroExistente.status === "Aberto") {
    //         atualizarEtapa2(registroExistente);
    //     } else if (registroExistente.status === "Carregando") {
    //         atualizarEtapa3(registroExistente);
    //     }

    //     console.table(registroExistente);
    // }

    if (registroExistente) {

        if (registroExistente.status === "Aberto") {

            atualizarEtapa2(registroExistente);

        } else if (registroExistente.status === "Carregando") {

            atualizarEtapa3(registroExistente);

        }

    } else {

        // Só cria uma nova recarga se NÃO existir uma aberta
        const novaRecarga = criarRecarga({
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
    const novaRecarga = criarRecarga({
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
        opcao.disabled = true;
        opcao.text = `${estacaoSelecionada} ⚡`;
    }
  });

  const selectPrisma = document.getElementById("prisma");
  [...selectPrisma.options].forEach(opcao => {
    if (opcao.text.includes(prismaSelecionado)) {
        opcao.disabled = true;
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