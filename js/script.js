//Slides de Imagens dinâmicas de fundo
const slides = document.querySelectorAll(".bg-slide");
let atual = 0;

setInterval(() => {
    slides[atual].classList.remove("active");

    atual = (atual + 1) % slides.length;

    slides[atual].classList.add("active");
}, 5000);


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

//carregadores
function filtrarCarregadores(filtro, botaoClicado) {
    // Atualiza os botões
    document.querySelectorAll(".filtro-btn").forEach(btn =>
        btn.classList.remove("active")
    );

    botaoClicado.classList.add("active");

    // Filtra os cards
    document.querySelectorAll(".station-card").forEach(card => {
        const status = card.dataset.status;

        if (filtro === "todos" || status === filtro) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });

    atualizarContadores();
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

    // Renderiza os cards...
    atualizarContadores();
}

//Contadores
function atualizarContadores() {
    const cards = document.querySelectorAll(".station-card");

    const total = 24; // Total fixo de carregadores
    let emUso = 0;

    cards.forEach(card => {
        if (card.dataset.status === "em uso") {
            emUso++;
        }
    });

    const livres = total - emUso;

    // Contadores
    document.getElementById("contadorLivres").textContent =
        `Livres: ${livres}`;

    document.getElementById("contadorEmuso").textContent =
        `Em uso: ${emUso}`;

    document.getElementById("contadorTodos").textContent =
        `Todas: ${total}`;

    // KPIs
    document.getElementById("kpiLivres").textContent = livres;
    document.getElementById("kpiEmUso").textContent = emUso;
}

//kpis
function atualizarKPIs() {
    // Data de hoje
    const hoje = new Date();

    document.getElementById("kpiHoje").textContent = hoje.getDate();

    // Contagem das estações
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
    const btnTodos = document.querySelector(".filtro-btn");
    filtrarCarregadores("todos", btnTodos);
});

 
//Botão nova estação (Futuramente terá uma funcionalidade)

// document.querySelector(".btn-new").addEventListener("click", () => {

//     Swal.fire({

//         icon: "info",

//         title: "Em desenvolvimento",

//         text: "Esta funcionalidade será implementada futuramente."

//     });

// });

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

// dia da semana
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

//botão registar
function registrarRecarga() {
  const estacaoSelecionada = document.getElementById("estacao").value;
  const prismaSelecionado = document.getElementById("prisma").value;

  const placa = document.getElementById("placa").value;

  const proprietario = 
  document.getElementById("nomeVeiculo").textContent.trim();

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

  // Atualiza status do card
  card.dataset.status = "em uso";
  card.classList.add("em-uso");

  // Ícone principal verde
  const icone = card.querySelector(".station-icon");
  icone.className = "station-icon verde";
  icone.innerHTML = '<i class="fa-solid fa-charging-station"></i><i class="bi bi-ev-front-fill"></i>';

  // Badge verde “Em uso ⚡”
  const status = card.querySelector(".status");
  status.className = "status uso";
  status.innerHTML = 'Em uso <i class="bi bi-lightning-charge"></i>';

  // Título verde
  const titulo = card.querySelector("h3");
  titulo.style.color = "#0b5e29";

  // Ícones da lista azul‑claro (corrigido)
  const listaItens = card.querySelectorAll("ul li i");
  listaItens.forEach(i => {
    i.classList.remove("status", "livre", "uso");
    i.style.backgroundColor = "#dbeafe"; 
    i.style.color = "#0b5e29";          
    i.style.borderRadius = "50%";
    i.style.padding = "10px";
    i.style.width = "36px";
    i.style.height = "36px";
    i.style.display = "flex";
    i.style.justifyContent = "center";
    i.style.alignItems = "center";
  });

  // Botão verde‑claro
  const botao = card.querySelector("button");
  botao.className = "status uso";
  botao.style.backgroundColor = "#dcfce7";
  botao.style.color = "#0b5e29";
  botao.textContent = "Ver detalhes";

  // Desativa estação e prisma no select
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

    // ================= LIMPAR FORMULÁRIO =================
    // Limpa os campos da operação após registrar
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

    // Atualiza os contadores e KPIs
    atualizarContadores();
}