// ============ Controle de recargas =====================
console.log("recargas.js carregado!");
const recargas = [];
const historicoRecargas = [];//apague se der errado

function criarRecarga(dados) {
    const recarga = {
        id: Date.now(),
        status: "Aberto",
        placa: dados.placa.toUpperCase(),
        proprietario: dados.proprietario,
        manobristaEntrada: dados.manobristaEntrada,
        prisma: dados.prisma,
        estacao: dados.estacao,
        dataEntrada: dados.dataEntrada,
        diaSemana: dados.diaSemana,
        horaChegada: dados.horaChegada,
        horaCargaInicial: "",
        cargaInicial: "",
        manobristaSaida: "",
        horaFinal: "",
        cargaFinal: "",
        tempoCarga: ""
    };

    recargas.push(recarga);
    console.table(recargas);

    return recarga;
}

// ============== Consulta da placa ========================

const inputPlaca = document.getElementById("placa");

if (inputPlaca) {
    const btnConsultar =
        document.getElementById("btnConsultar");
        inputPlaca.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            buscarVeiculo();
        }
    });

    btnConsultar.addEventListener(
        "click",
        buscarVeiculo
    );
}

// =================== Consulta do veículo ===================
function buscarVeiculo() {
    const placa =
        inputPlaca.value.trim().toUpperCase();

    if (placa === "") {
        limparCard();
        return;
    }

    const encontrado = base.find(
        item => item[0].toUpperCase() === placa
    );

    if (!encontrado) {
        document.getElementById(
            "nomeVeiculo"
        ).innerHTML = `
            <i class="fa-solid fa-user"></i>
            Veículo não encontrado
        `;

        document.getElementById(
            "cargoVeiculo"
        ).innerHTML = `
            <i class="fa-solid fa-id-badge"></i>
        `;

        document.getElementById(
            "carroVeiculo"
        ).innerHTML = `
            <i class="fa-solid fa-car"></i>
        `;

        document.getElementById(
            "carroMensagem"
        ).innerHTML = `
            <i class="bi bi-chat-quote"></i>
        `;

        document.getElementById(
            "fotoVeiculo"
        ).src = "";

        return;
    }

    const partes =
    encontrado[1].split(" - Func: ");

    const nome = partes[0];
    const funcional = partes[1] || "";

    const cargo =
    encontrado[2]
    .replace(" - Itaú Unibanco", "");

    document.getElementById(
        "nomeVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-user"></i>
        ${nome}
    `;

    document.getElementById(
        "cargoVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
        ${cargo} • Func: ${funcional}
    `;

    document.getElementById(
        "carroVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-car"></i>
        ${encontrado[3]}
    `;

    document.getElementById(
        "carroMensagem"
    ).innerHTML = `
        <i class="bi bi-chat-quote"></i>
        Por favor me avise quando finalizar 🙏
    `;

    document.getElementById(
        "fotoVeiculo"
    ).src = encontrado[5];

    // MAGICA ACONTECE AQUI
    verificarRecargaAberta(placa);
}

// =============Verificando recarga aberta ==========
function verificarRecargaAberta(placa) {
    const registro = recargas.find(
        r =>
            r.placa.toUpperCase() === placa.toUpperCase() &&
            r.status !== "Concluído"
    );

    if (!registro) {
        liberarFormulario();

        console.log(
            "Nenhum atendimento aberto"
        );

        return;
    }

    console.log(
        "Atendimento encontrado",
        registro
    );

    preencherRecarga(registro);

    controlarEtapa(registro);
}

// ============= Bloqueando a etapa 1 de 3 aberto ===========
function bloquearPrimeiraEtapa() {
    document.getElementById(
        "manobristaEntrada"
    ).disabled = true;

    document.getElementById(
        "prisma"
    ).disabled = true;

    document.getElementById(
        "estacao"
    ).disabled = true;

    document.getElementById(
        "dataEntrada"
    ).disabled = true;

    document.getElementById(
        "diaSemana"
    ).disabled = true;

    document.getElementById(
        "horaChegada"
    ).disabled = true;
}

// ============= liberando a etapa 1 de 3 aberto ===========
function liberarPrimeiraEtapa() {
    document.getElementById("manobristaEntrada").disabled = false;
    document.getElementById("prisma").disabled = false;
    document.getElementById("estacao").disabled = false;
    document.getElementById("dataEntrada").disabled = false;
    document.getElementById("diaSemana").disabled = false;
    document.getElementById("horaChegada").disabled = false;
}

// ============= Atualizando a etapa 2 de 3 carregando... ===========
function atualizarEtapa2(registro) {
    registro.horaCargaInicial =
        document.getElementById("horaCargaInicial").value;

    registro.cargaInicial =
        document.getElementById("cargaInicial").value;

    registro.status = "Carregando";

    console.table(registro);
}

// ============= Atualizando a etapa 3 de 3 concluído! ===========
function atualizarEtapa3(registro) {
    registro.manobristaSaida =
        document.getElementById("manobristaSaida").value;

    registro.horaFinal =
        document.getElementById("horaFinal").value;

    registro.cargaFinal =
        document.getElementById("cargaFinal").value;

    registro.status = "Concluído";
        console.log("ESTAÇÃO REGISTRO:", registro.estacao);
        console.log("PRISMA REGISTRO:", registro.prisma);

    // ================= Input da Estação =================
    const selectEstacao =
        document.getElementById("estacao");

    [...selectEstacao.options].forEach(opcao => {
        console.log(
            "ESTACAO OPTION:",
            opcao.value,
            opcao.text
        );

        if (
            opcao.value === registro.estacao ||
            opcao.text.includes(registro.estacao)
        ) {

            console.log("ACHEI ESTAÇÃO");

            opcao.disabled = false;
            opcao.text = registro.estacao;
        }
    });

    // ================= Input do Prisma =================
    const selectPrisma =
        document.getElementById("prisma");

    [...selectPrisma.options].forEach(opcao => {
        console.log(
            "PRISMA OPTION:",
            opcao.value,
            opcao.text
        );

        if (
            opcao.value === registro.prisma ||
            opcao.text.includes(registro.prisma)
        ) {
            console.log("ACHEI PRISMA");
            opcao.disabled = false;
            opcao.text = registro.prisma;
        }
    });

    // ================= Cards das estações =================
    const card = [...document.querySelectorAll(".station-card")]
        .find(c =>
            c.querySelector("h3").textContent.trim() ===
            registro.estacao
        );
    console.log("CARD ENCONTRADO:", card);

    if (card) {
        card.dataset.status = "livre";
        card.classList.remove("em-uso");

        const status =
            card.querySelector(".status");
        status.className = "status livre";
        status.textContent = "Disponível";
    }

    liberarFormulario();
    console.log(
        "MANOBRISTA:",
        document.getElementById("manobristaEntrada").disabled
    );

    console.log(
        "PRISMA:",
        document.getElementById("prisma").disabled
    );

    console.log(
        "ESTACAO:",
        document.getElementById("estacao").disabled
    );

    console.table(registro);
}

function controlarEtapa(registro) {
    if (registro.status === "Aberto") {
        document.getElementById("horaCargaInicial").disabled = false; //input liberado
        document.getElementById("cargaInicial").disabled = false; //input liberado

        document.getElementById("manobristaSaida").disabled = false; //input liberado
        document.getElementById("horaFinal").disabled = false; //input liberado
        document.getElementById("cargaFinal").disabled = false; //input liberado
    }

    if (registro.status === "Carregando") {
        document.getElementById("horaCargaInicial").disabled = true; //input bloqueado
        document.getElementById("cargaInicial").disabled = true; //input bloqueado

        document.getElementById("manobristaSaida").disabled = false; //input liberado
        document.getElementById("horaFinal").disabled = false; //input liberado
        document.getElementById("cargaFinal").disabled = false; //input liberado
    }

    if (registro.status === "Concluído") {
        document.getElementById("horaCargaInicial").disabled = true; //input bloqueado
        document.getElementById("cargaInicial").disabled = true; //input bloqueado

        document.getElementById("manobristaSaida").disabled = true; //input bloqueado
        document.getElementById("horaFinal").disabled = true; //input bloqueado
        document.getElementById("cargaFinal").disabled = true; //input bloqueado
    }
}

// =================== Preenchendo recargas ==============================
function preencherRecarga(registro) {
    console.log("PRISMA:", registro.prisma);
    console.log("ESTACAO:", registro.estacao);
    console.log("MANOBRISTA:", registro.manobristaEntrada);

    document.getElementById(
        "manobristaEntrada"
    ).value = registro.manobristaEntrada;

    console.log(
        "SELECT MANOBRISTA:",
        document.getElementById("manobristaEntrada").value
    );

    document.getElementById(
        "prisma"
    ).value = registro.prisma;

    console.log(
        "SELECT PRISMA:",
        document.getElementById("prisma").value
    );

    document.getElementById(
        "estacao"
    ).value = registro.estacao;

    console.log(
        "SELECT ESTACAO:",
        document.getElementById("estacao").value
    );

    document.getElementById(
        "dataEntrada"
    ).value = registro.dataEntrada;

    document.getElementById(
        "diaSemana"
    ).value = registro.diaSemana;

    document.getElementById(
        "horaChegada"
    ).value = registro.horaChegada;

    document.getElementById(
        "horaCargaInicial"
    ).value =
        registro.horaCargaInicial || "";

    document.getElementById(
        "cargaInicial"
    ).value =
        registro.cargaInicial || "";

    document.getElementById(
        "manobristaSaida"
    ).value =
        registro.manobristaSaida || "";

    document.getElementById(
        "horaFinal"
    ).value =
        registro.horaFinal || "";

    document.getElementById(
        "cargaFinal"
    ).value =
        registro.cargaFinal || "";

    bloquearPrimeiraEtapa();

    controlarEtapa(registro);
}

// ==============Limpando os cards ======================
function limparCard() {
    document.getElementById(
        "nomeVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-user"></i>
    `;

    document.getElementById(
        "cargoVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
    `;

    document.getElementById(
        "carroVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-car"></i>
    `;

    document.getElementById(
        "carroMensagem"
    ).innerHTML = `
        <i class="bi bi-chat-quote"></i>
    `;
}

function liberarFormulario() {
    document.getElementById("manobristaEntrada").disabled = false;
    document.getElementById("prisma").disabled = false;
    document.getElementById("estacao").disabled = false;
    document.getElementById("dataEntrada").disabled = false;
    document.getElementById("diaSemana").disabled = false;
    document.getElementById("horaChegada").disabled = false;
    document.getElementById("horaCargaInicial").disabled = false;
    document.getElementById("cargaInicial").disabled = false;
    document.getElementById("manobristaSaida").disabled = false;
    document.getElementById("horaFinal").disabled = false;
    document.getElementById("cargaFinal").disabled = false;
}
 

