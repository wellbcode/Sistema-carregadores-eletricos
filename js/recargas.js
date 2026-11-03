// ===================================================================
//                      Controle de recargas
// ==================================================================
console.log("recargas.js carregado!");

//const recargas = [];

const recargasSalvas = JSON.parse(
    localStorage.getItem("movimentacoesRecentes") || "[]"
);

const recargas = Array.isArray(recargasSalvas)
    ? recargasSalvas
    : [];

const historicoRecargas =
    JSON.parse(
        localStorage.getItem("historicoRecargas")
    ) || [];//apague se der errado

// ===================================================================
// Função que salva as movimentações recentes no localStorage
// ==================================================================
function salvarMovimentacoesRecentes() {
    localStorage.setItem(
        "movimentacoesRecentes",
        JSON.stringify(recargas)
    );
}//apague se ramelar

// ==========================================================================
// Função que registra o ID do indicador no localStorage, evitando duplicatas
// ==========================================================================
function registrarIdIndicador(chave, id) {
    let ids = [];
    try {
        ids = JSON.parse(localStorage.getItem(chave) || "[]");
        if (!Array.isArray(ids)) {
            ids = [];
        }
    } catch (erro) {
        console.error(`Erro ao ler ${chave}:`, erro);
    }
    const idTexto = String(id);
    if (!ids.some(idSalvo => String(idSalvo) === idTexto)) {
        ids.push(idTexto);
        localStorage.setItem(chave, JSON.stringify(ids));
    }
}

// ===================================================================
// Função que cria uma nova recarga e adiciona ao array de recargas
// ==================================================================
function criarRecarga(dados) {
    const recarga = {
        id: Date.now(),
        //status: "Aberto",
        status: dados.status || "Aberto",
        placa: dados.placa.toUpperCase(),
        proprietario: dados.proprietario,
        cargo: dados.cargo, // NOVO
        funcional: dados.funcional,
        torre: dados.torre,
        piso: dados.piso,
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
    registrarIdIndicador("kpiTotalIds", recarga.id);// apague se der ruim
    if (recarga.status.trim().toLowerCase() === "fila") {
        registrarIdIndicador("kpiFilaIds", recarga.id);
    }

    salvarMovimentacoesRecentes();

    console.table(recargas);

    return recarga;
}

// ===================================================================
// Variável que consulta a placa do veículo e busca os dados no array
// ===================================================================
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
 
// ====================================================================
// Função que Consulta o veículo no array e preenche os campos do card
// ====================================================================
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
       Swal.fire({
            title: "🚗 Veículo não encontrado",
            html: `
                <div style="font-size:15px;">
                    A placa <b>${placa}</b> ainda não foi cadastrada.<br><br>
                    <span style="color:#6c757d;">
                        Entre em contato com o administrador.
                    </span>
                </div>
            `,
            icon: "info",
            confirmButtonText: "OK",
            confirmButtonColor: "#198754",
            width: 450,
            backdrop: `
                rgba(0,0,0,0.5)
            `
        });

        document.getElementById(
            "nomeVeiculo"
        ).innerHTML = `
        <i class="fa-solid fa-car"></i>
        `;

        document.getElementById(
            "cargoVeiculo"
        ).innerHTML = `
            <i class="fa-solid fa-id-badge"></i>
        `;

        document.getElementById(
            "cifVeiculo"
        ).innerHTML = `
            <i class="bi bi-person-vcard"></i>
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
        ).src = "img/charge1.jpg";

        return;
    }

    const nome = encontrado[1];
    const funcional = encontrado[2];
    const cargo =
    encontrado[3]
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
        ${cargo}
    `;

    document.getElementById(
        "cifVeiculo"
    ).innerHTML = `
        <i class="bi bi-person-vcard"></i>
        ${funcional}
    `;

    document.getElementById(
        "carroVeiculo"
    ).innerHTML = `
        <i class="fa-solid fa-car"></i>
        ${encontrado[4]}
    `;

    document.getElementById(
        "carroMensagem"
    ).innerHTML = `
        <i class="bi bi-chat-quote"></i>
        Por favor me avise quando finalizar 🙏
    `;

    document.getElementById(
        "fotoVeiculo"
    ).src = encontrado[6];

    // MAGICA ACONTECE AQUI
    verificarRecargaAberta(placa);
}

// ====================================================================
// Função que verfica se existe uma recarga em aberto
// ====================================================================
function verificarRecargaAberta(placa) {
    const registro = recargas.find(
        r =>
            r.placa.toUpperCase() === placa.toUpperCase() &&
            r.status !== "Concluído"
    );
    if (!registro) {
    console.error(
        "NENHUM ATENDIMENTO ABERTO"
    );
    console.log("PLACA RECEBIDA:", placa);
    console.table(
        recargas.map(r => ({
            placa: r.placa,
            status: r.status,
            estacao: r.estacao
        }))
    );
    liberarFormulario();
    return;
    }
    console.log(
        "Atendimento encontrado",
        registro
    );
    preencherRecarga(registro);
    controlarEtapa(registro);
}

// ==============================================================
// Função que bloqueia os campos da primeira etapa do formulário 
// ao 1º clique no botão registrar
// ==============================================================
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

// =============================================================
// Função que libera os campos da primeira etapa do formulário,
//etapa 1 de 3 aberto
// ==============================================================
function liberarPrimeiraEtapa() {
    document.getElementById("manobristaEntrada").disabled = false;
    document.getElementById("prisma").disabled = false;
    document.getElementById("estacao").disabled = false;
    document.getElementById("dataEntrada").disabled = false;
    document.getElementById("diaSemana").disabled = false;
    document.getElementById("horaChegada").disabled = false;
}

// ===============================================================
// Atualizando a etapa 2 de 3 carregando!
// Função que atualiza o status da recarga etapa 1 de "aberto"
//  para 2 "carregando"...,
// ===============================================================
function atualizarEtapa2(registro) {
    registro.horaCargaInicial =
        document.getElementById("horaCargaInicial").value;
    registro.cargaInicial =
        document.getElementById("cargaInicial").value;
    registro.status = "Carregando";

    registrarIdIndicador("kpiCarregandoIds", registro.id);

    salvarMovimentacoesRecentes();//apague se ramelar

    console.table(registro);
}

// ===============================================================
// Atualizando a etapa 3 de 3 concluído!
// Função que atualiza o status da recarga etapa 2 de "carregando"
//  para 3 "concluído"...
// ===============================================================
function atualizarEtapa3(registro) {
    registro.manobristaSaida =
        document.getElementById("manobristaSaida").value;
    registro.horaFinal =
        document.getElementById("horaFinal").value;
    registro.cargaFinal =
        document.getElementById("cargaFinal").value;
    registro.tempoCarga =
    calcularTempoCarga(
        registro.horaCargaInicial,
        registro.horaFinal
    );
    registro.status = "Concluído";
        registrarIdIndicador("kpiConcluidasIds", registro.id);// apague se der ruim

        salvarMovimentacoesRecentes();//apague se ramelar

        atualizarEstacaoConcluida(registro);

        console.log("ESTAÇÃO REGISTRO:", registro.estacao);

        console.log("PRISMA REGISTRO:", registro.prisma);

        // Salva a recarga concluída no histórico
        historicoRecargas.push({ ...registro });
        localStorage.setItem(
            "historicoRecargas",
            JSON.stringify(historicoRecargas)
        );

        renderizarTopUsuarios();

        renderizarTopCargos();

        console.table("HISTÓRICO:", historicoRecargas);

    // ================================================ 
    //                  Input da Estação 
    // ================================================
    const selectEstacao =
        document.getElementById("estacao");
    [...selectEstacao.options].forEach(opcao => {
        console.log(
            "ESTACAO OPTION:",
            opcao.value,
            opcao.text
        );
        if (opcao.value === registro.estacao) {
            console.log("ACHEI ESTAÇÃO");
            opcao.disabled = false;
            opcao.textContent = opcao.value;
        }
    });

    // ============================================== 
    //              Input do Prisma 
    // ==============================================
    const selectPrisma =
        document.getElementById("prisma");
    [...selectPrisma.options].forEach(opcao => {
        console.log(
            "PRISMA OPTION:",
            opcao.value,
            opcao.text
        );
        if (opcao.value === registro.prisma) {
            console.log("ACHEI PRISMA");
            opcao.disabled = false;

            // Restaura o número original do prisma
            opcao.textContent = opcao.value;
        }
    });

    // ========================================================
    //                Cards das estações 
    // =========================================================
    const card = [...document.querySelectorAll(".station-card")]
        .find(c =>
            c.querySelector("h3").textContent.trim() ===
            registro.estacao
        );
    console.log("CARD ENCONTRADO:", card);
    const proximoFila = recargas.find(
        r =>
            r.estacao === registro.estacao &&
            r.status === "Fila"
        );
        if (proximoFila) {
            proximoFila.status = "Aberto";
            atualizarBarraEstacao(proximoFila);
            const card = [...document.querySelectorAll(".station-card")]
                .find(c =>
                    c.querySelector("h3")
                        ?.textContent.trim() === proximoFila.estacao
                );
            if (card) {
                const infoCarga =
                    card.querySelector(".info-carga");
                if (infoCarga) {
                    infoCarga.innerHTML = "";
                    infoCarga.innerHTML =
                        gerarBarra(0);
                }
            }
            console.log(
            "PRÓXIMO DA FILA ASSUMIU:",
            proximoFila.placa
        );

        salvarMovimentacoesRecentes();
        } else {
            if (card) {
                card.dataset.status = "livre";
                card.classList.remove("em-uso");
                const status = card.querySelector(".status");
                status.className = "status livre";
                status.textContent = "Disponível";
            }
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
 
// ===============================================================
//  Função que controla a etapa da recarga e habilita/desabilita
//  os campos do formulário, conforme o status da recarga.
// ===============================================================
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

// ====================================================================
// Função que preenche os campos do formulário com os dados da recarga
// ====================================================================
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

// ==========================================================
// função que atualiza a barra carga da bateria  da estação, 
// conforme a carga inicial ou final do registro
// ==========================================================
function atualizarBarraEstacao(registro) {
    const card = [...document.querySelectorAll(".station-card")]
        .find(c =>
            c.querySelector("h3").textContent.trim() ===
            registro.estacao
        );
    if (!card) {
        console.log("CARD NÃO ENCONTRADO:", registro.estacao);
        return;
    }
    const infoCarga = card.querySelector(".info-carga");
    if (!infoCarga) {
        console.log("INFO-CARGA NÃO ENCONTRADO");
        return;
    }

    // Se já existe carga final, usa ela.
    // Caso contrário, usa a carga inicial.
    const carga =
        registro.cargaFinal !== "" &&
        registro.cargaFinal != null
            ? registro.cargaFinal
            : registro.cargaInicial;
    infoCarga.innerHTML = gerarBarra(carga);
    console.log(
        infoCarga.outerHTML
    );
    console.log(
        "BARRA ATUALIZADA:",
        registro.estacao,
        "Carga:",
        carga
    );
}

// ==========================================================
// Função que limpa o input do card que busca os dados
//  do proprietário do vec
// ==========================================================
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
    document.getElementById("cifVeiculo").innerHTML = `
        <i class="bi bi-person-vcard"></i>
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

// ==========================================================
// Função que libera todos os campos do formulário,
//  ao fnalizar a recarga
// ==========================================================
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

// ================================================================== 
// Setinha de expandir dos campos select manobrista, prisma e estação
// ==================================================================
document.querySelectorAll(".campo select").forEach(select => {
    const campo = select.closest(".campo");
    select.addEventListener("mousedown", () => {
        campo.classList.add("select-aberto");
    });
    select.addEventListener("change", () => {
        campo.classList.remove("select-aberto");
    });
    select.addEventListener("blur", () => {
        campo.classList.remove("select-aberto");
    });
    select.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            campo.classList.remove("select-aberto");
        }
    });
});

// ===========================================
// Evento de clicar enter no botão registar 
// ===========================================
document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    // Se estiver no campo placa,
    // deixa a consulta funcionar normalmente
    if (document.activeElement.id === "placa") {
        return;
    }
    document
        .querySelector(".btn-registrar")
        ?.click();
});
