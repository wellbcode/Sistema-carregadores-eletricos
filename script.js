// ================ BASE =====================
const base = [
    ["ABC1234", "Wellington Bertoso Santos - Func: 0079311986", "Gerente - Itaú Unibanco", "Cadillac Escalade - Preto"],
    ["DOS3345", "Marcia Maria De Lima Zanelato - Func: 000712125", "Secretaria Pres Conselho - Itaú Unibanco", "Honda Civic - Preto"],
    ["EUQ7377", "Marcia Maria De Lima Zanelato - Func: 000712125", "Secretaria Pres Conselho - Itaú Unibanco", "Mitsubishi Pajero - Branco"],
    ["GGK0715", "Nelson Luis De Oliveira Rodrigues Costa - Func: 001548882", "Cons Financas - Itaú Unibanco", "Volkswagen Polo - Prata"],
    ["GBQ2E77", "Nelson Luis De Oliveira Rodrigues Costa - Func: 001548882", "Cons Financas - Itaú Unibanco", "Chevrolet Onix - Preto"],
    ["GET4G71", "Jose Renato Tunes - Func: 001709419", "Gte Financas - Itaú Unibanco", "Kia Niro sx - Cinza"],
    ["FGL8204", "Sandra Regina Clemente Peretti - Func: 001786276", "Cons Remuneracao - Itaú Unibanco", "Hyundai Ix35 - Prata"],
    ["FVE6790", "Ronaldo Natale - Func: 001808393", "Coord Gestao E Plan Ops - Itaú Unibanco", "Fiat Palio - Vermelho"],
    ["EUW0022", "Ronaldo Natale - Func: 001808393", "Coord Gestao E Plan Ops - Itaú Unibanco", "Chevrolet Zafira - Cinza"],
    ["ESP8A11", "ANDRE LUIS TEIXEIRA RODRIGUES - Func: 3890654", "Diretor - Itaú Unibanco", "Porsche Cayenne - Preta"]
];

// ================ PRISMA =====================
const prisma = document.getElementById("prisma");

if (prisma) {
    prisma.innerHTML = `
        <option value="">Selecione</option>
    `;
    for (let i = 0; i <= 31; i++) {
        prisma.innerHTML += `
            <option value="${i}">
                Prisma ${i}
            </option>
        `;
    }
    prisma.innerHTML += `
        <option value="rapida">
            ⚡ Carga Rápida
        </option>
    `;
}

// ============== BUSCA DE PLACA ======================
const inputPlaca = document.getElementById("placa");

if (inputPlaca) {
    const inputPlaca = document.getElementById("placa");
    const btnBuscar = document.getElementById("btnBuscar");

    inputPlaca.addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            buscarVeiculo();
        }
    });

    btnBuscar.addEventListener("click", buscarVeiculo);
}

function buscarVeiculo() {
    const placa = inputPlaca.value.trim().toUpperCase();
    if (placa === "") {
        limparCard();
        return;
    }

    const encontrado = base.find(
        item => item[0].toUpperCase() === placa
    );
    if (!encontrado) {
        document.getElementById("nomeVeiculo").innerHTML = `
            <i class="fa-solid fa-user"></i>
            Veículo não encontrado
        `;
        document.getElementById("cargoVeiculo").innerHTML = `
            <i class="fa-solid fa-id-badge"></i>
        `;
        document.getElementById("carroVeiculo").innerHTML = `
            <i class="fa-solid fa-car"></i>
        `;
        return;
    }

    const partes = encontrado[1].split(" - Func: ");
    const nome = partes[0];
    const funcional = partes[1] || "";
    const cargo = encontrado[2]
        .replace(" - Itaú Unibanco", "");
    document.getElementById("nomeVeiculo").innerHTML = `
        <i class="fa-solid fa-user"></i>
        ${nome}
    `;
    document.getElementById("cargoVeiculo").innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
        ${cargo} • Funcional ${funcional}
    `;
    document.getElementById("carroVeiculo").innerHTML = `
        <i class="fa-solid fa-car"></i>
        ${encontrado[3]}
    `;
}

// ===============LIMPA CARD======================
function limparCard() {
    document.getElementById("nomeVeiculo").innerHTML = `
        <i class="fa-solid fa-user"></i>
    `;
    document.getElementById("cargoVeiculo").innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
    `;
    document.getElementById("carroVeiculo").innerHTML = `
        <i class="fa-solid fa-car"></i>
    `;
}

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


//carreagdores
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

    let livres = 0;
    let emUso = 0;

    cards.forEach(card => {

        if (card.dataset.status === "livres") livres++;
        if (card.dataset.status === "em uso") emUso++;

    });

    // Contadores
    document.getElementById("contadorLivres").textContent =
        `Livres: ${livres}`;

    document.getElementById("contadorEmuso").textContent =
        `Em uso: ${emUso}`;

    document.getElementById("contadorTodos").textContent =
        `Todas: ${cards.length}`;

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