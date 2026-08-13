// ============================================================
// INTERAÇÃO DA CARGA DA BATERIA
// ============================================================

// function gerarBarra(percentual) {

//     percentual = Number(percentual) || 0;

//     if (percentual > 100) {
//         percentual = 100;
//     }

//     if (percentual < 0) {
//         percentual = 0;
//     }

//     const blocos = Math.round(percentual / 12.5);

//     const barra =
//         "█".repeat(blocos) +
//         "░".repeat(8 - blocos);

//     const cor =
//         percentual === 0
//             ? "#64748b"
//             : "#0b5e29";

//     return `
//         <span style="color:${cor}">
//             22 kW ${barra} ${percentual}%
//         </span>
//     `;
// }

function gerarBarra(percentual) {

    percentual = Number(percentual) || 0;

    percentual = Math.max(0, Math.min(percentual, 100));

    percentual = Math.round(percentual / 5) * 5;

    const blocos = percentual / 5;

    const barra =
        "█".repeat(blocos) +
        "░".repeat(20 - blocos);

    const cor =
        percentual === 0
            ? "#64748b"
            : "#0b5e29";

    return `
        <span style="color:${cor}">
            22 kW ${barra} ${percentual}%
        </span>
    `;
}
// ============================================================
// CARGA INICIAL
// ============================================================

const cargaInicial =
    document.getElementById("cargaInicial");

if (cargaInicial) {

    cargaInicial.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, "");

        if (Number(this.value) > 100) {
            this.value = "100";
        }

        const estacaoSelecionada =
            document.getElementById("estacao").value;

        const card =
            [...document.querySelectorAll(".station-card")]
                .find(c =>
                    c.querySelector("h3")?.textContent.trim() ===
                    estacaoSelecionada
                );

        if (!card) return;

        const infoCarga =
            card.querySelector(".info-carga");

        if (!infoCarga) return;

        infoCarga.innerHTML =
            gerarBarra(this.value);
    });
}

function atualizarEstacaoConcluida(registro) {

    const card = [...document.querySelectorAll(".station-card")]
        .find(c =>
            c.querySelector("h3")?.textContent.trim() ===
            registro.estacao
        );

    if (!card) {
        console.log("CARD NÃO ENCONTRADO:", registro.estacao);
        return;
    }

    // ================= Barra da carga =================

    const infoCarga = card.querySelector(".info-carga");

    if (infoCarga) {
        infoCarga.innerHTML =
            gerarBarra(registro.cargaFinal);
    }

    // ================= Tempo =================

    const infoTempo = card.querySelector(".info-tempo");

    if (infoTempo) {
        infoTempo.textContent = "Disponível";
    }

    // ================= Ícone do tempo =================

    const iconeTempo =
        infoTempo?.previousElementSibling;

    if (iconeTempo) {
        iconeTempo.className =
            "bi bi-clock status livre";
    }
}

// ============================================================
// INTERAÇÃO DO TEMPO
// ============================================================

const horaCargaInicial =
    document.getElementById("horaCargaInicial");

if (horaCargaInicial) {

    horaCargaInicial.addEventListener("change", function () {

        const estacaoSelecionada =
            document.getElementById("estacao").value;

        const card =
            [...document.querySelectorAll(".station-card")]
                .find(c =>
                    c.querySelector("h3")?.textContent.trim() ===
                    estacaoSelecionada
                );

        if (!card) return;

        const infoTempo =
            card.querySelector(".info-tempo");

        if (!infoTempo) return;

        infoTempo.textContent =
            this.value
                ? "Carregando"
                : "Disponível";
    });
}


// ============================================================
// MODAL DE DETALHES
// ============================================================

let registroModalAtual = null;

function editarDetalhes() {

    const registro = registroModalAtual;

    if (!registro) {
        return;
    }

    const dadosDetalhes =
        document.getElementById("dadosDetalhes");

    const botaoEditar =
        document.getElementById("botaoEditarDetalhes");

    if (!dadosDetalhes || !botaoEditar) {
        return;
    }

    dadosDetalhes.innerHTML = `

        <h3>🚗 Chegada</h3>

        <p>
            <strong>⚡ Placa:</strong><br>
            <input
                type="text"
                id="editarPlaca"
                value="${registro.placa || ""}">
        </p>

        <p>
            <strong>👤 Proprietário:</strong><br>
            <input
                type="text"
                id="editarProprietario"
                value="${registro.proprietario || ""}">
        </p>

        <p>
            <strong>🚘 Prisma:</strong><br>
            <input
                type="text"
                id="editarPrisma"
                value="${registro.prisma || ""}">
        </p>

        <p>
            <strong>🔌 Estação:</strong><br>
            <input
                type="text"
                value="${registro.estacao || ""}"
                disabled>
        </p>

        <p>
            <strong>🙋 Manobrista Entrada:</strong><br>
            <input
                type="text"
                id="editarManobristaEntrada"
                value="${registro.manobristaEntrada || ""}">
        </p>

        <p>
            <strong>📅 Data Entrada:</strong><br>
            <input
                type="text"
                id="editarDataEntrada"
                value="${registro.dataEntrada || ""}">
        </p>

        <p>
            <strong>📆 Dia da Semana:</strong><br>
            <input
                type="text"
                id="editarDiaSemana"
                value="${registro.diaSemana || ""}">
        </p>

        <p>
            <strong>🕒 Hora Chegada:</strong><br>
            <input
                type="time"
                id="editarHoraChegada"
                value="${registro.horaChegada || ""}">
        </p>

        <hr>

        <h3>🔋 Início da Carga</h3>

        <p>
            <strong>⚡ Hora Carga Inicial:</strong><br>
            <input
                type="time"
                id="editarHoraCargaInicial"
                value="${registro.horaCargaInicial || ""}">
        </p>

        <p>
            <strong>🔋 Carga Inicial:</strong><br>
            <input
                type="number"
                id="editarCargaInicial"
                min="0"
                max="100"
                value="${registro.cargaInicial || ""}">
        </p>

        <hr>

        <h3>✅ Finalização</h3>

        <p>
            <strong>🙋 Manobrista Saída:</strong><br>
            <input
                type="text"
                id="editarManobristaSaida"
                value="${registro.manobristaSaida || ""}">
        </p>

        <p>
            <strong>🕒 Hora Final:</strong><br>
            <input
                type="time"
                id="editarHoraFinal"
                value="${registro.horaFinal || ""}">
        </p>

        <p>
            <strong>🔋 Carga Final:</strong><br>
            <input
                type="number"
                id="editarCargaFinal"
                min="0"
                max="100"
                value="${registro.cargaFinal || ""}">
        </p>

        <p>
            <strong>⏱️ Tempo de Carga:</strong><br>
            <input
                type="text"
                id="editarTempoCarga"
                value="${registro.tempoCarga || ""}">
        </p>

        <p>
            <strong>📊 Status:</strong><br>
            <input
                type="text"
                id="editarStatus"
                value="${registro.status || ""}">
        </p>
    `;

    botaoEditar.textContent = "💾 Salvar alterações";

    botaoEditar.onclick = salvarDetalhes;
}

function salvarDetalhes() {

    const registro = registroModalAtual;

    if (!registro) {
        return;
    }

    // Atualiza os dados do registro
    registro.placa =
        document.getElementById("editarPlaca").value;

    registro.proprietario =
        document.getElementById("editarProprietario").value;

    registro.prisma =
        document.getElementById("editarPrisma").value;

    registro.manobristaEntrada =
        document.getElementById("editarManobristaEntrada").value;

    registro.dataEntrada =
        document.getElementById("editarDataEntrada").value;

    registro.diaSemana =
        document.getElementById("editarDiaSemana").value;

    registro.horaChegada =
        document.getElementById("editarHoraChegada").value;

    registro.horaCargaInicial =
        document.getElementById("editarHoraCargaInicial").value;

    registro.cargaInicial =
        document.getElementById("editarCargaInicial").value;

    registro.manobristaSaida =
        document.getElementById("editarManobristaSaida").value;

    registro.horaFinal =
        document.getElementById("editarHoraFinal").value;

    registro.cargaFinal =
        document.getElementById("editarCargaFinal").value;

    registro.tempoCarga =
        document.getElementById("editarTempoCarga").value;

    registro.status =
        document.getElementById("editarStatus").value;


    console.log("Registro atualizado:", registro);


    // Volta para o modo de visualização
    mostrarDetalhes(registro);
}

function mostrarDetalhes(registro) {

    const dadosDetalhes =
        document.getElementById("dadosDetalhes");

    const botaoEditar =
        document.getElementById("botaoEditarDetalhes");

    if (!dadosDetalhes || !botaoEditar) {
        return;
    }

    dadosDetalhes.innerHTML = `

        <h3>🚗 Chegada</h3>

        <p>
            <strong>⚡ Placa:</strong>
            ${registro.placa || "-"}
        </p>

        <p>
            <strong>👤 Proprietário:</strong>
            ${registro.proprietario || "-"}
        </p>

        <p>
            <strong>🚘 Prisma:</strong>
            ${registro.prisma || "-"}
        </p>

        <p>
            <strong>🔌 Estação:</strong>
            ${registro.estacao || "-"}
        </p>

        <p>
            <strong>🙋 Manobrista Entrada:</strong>
            ${registro.manobristaEntrada || "-"}
        </p>

        <p>
            <strong>📅 Data Entrada:</strong>
            ${registro.dataEntrada || "-"}
        </p>

        <p>
            <strong>📆 Dia da Semana:</strong>
            ${registro.diaSemana || "-"}
        </p>

        <p>
            <strong>🕒 Hora Chegada:</strong>
            ${registro.horaChegada || "-"}
        </p>

        <hr>

        <h3>🔋 Início da Carga</h3>

        <p>
            <strong>⚡ Hora Carga Inicial:</strong>
            ${registro.horaCargaInicial || "-"}
        </p>

        <p>
            <strong>🔋 Carga Inicial:</strong>
            ${registro.cargaInicial || "-"}%
        </p>

        <hr>

        <h3>✅ Finalização</h3>

        <p>
            <strong>🙋 Manobrista Saída:</strong>
            ${registro.manobristaSaida || "-"}
        </p>

        <p>
            <strong>🕒 Hora Final:</strong>
            ${registro.horaFinal || "-"}
        </p>

        <p>
            <strong>🔋 Carga Final:</strong>
            ${registro.cargaFinal || "-"}%
        </p>

        <p>
            <strong>⏱️ Tempo de Carga:</strong>
            ${registro.tempoCarga || "-"}
        </p>

        <p>
            <strong>📊 Status:</strong>
            ${registro.status || "-"}
        </p>
    `;


    // Volta o botão para Editar
    botaoEditar.textContent = "✏️ Editar";

    botaoEditar.onclick = editarDetalhes;
}

// ============================================================
// ABRIR DETALHES
// ============================================================

function abrirDetalhes(botao) {

    const card =
        botao.closest(".station-card");

    if (!card) return;


    const estacao =
        card.querySelector("h3")?.textContent.trim();

    if (!estacao) return;


    console.log("Estação clicada:", estacao);


    const registro =
        recargas.find(
            r => r.estacao === estacao
        );


    registroModalAtual =
        registro || null;


    const botaoModal =
        document.getElementById(
            "botaoFecharDetalhes"
        );

    const dadosDetalhes =
        document.getElementById(
            "dadosDetalhes"
        );

    const modal =
        document.getElementById(
            "modalDetalhes"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    if (!botaoModal || !dadosDetalhes || !modal) {
        console.error(
            "Elementos do modal não encontrados."
        );

        return;
    }


    // ========================================================
    // ESTADO PADRÃO DO BOTÃO
    // ========================================================

    botaoModal.className =
        "status livre";

    botaoModal.style.backgroundColor =
        "";

    botaoModal.style.color =
        "";


    // ========================================================
    // NENHUMA RECARGA
    // ========================================================

    if (!registro) {

        dadosDetalhes.innerHTML = `
            <p>
                Nenhuma recarga iniciada.
            </p>
        `;

        modal.style.display =
            "block";

        if (overlay) {
            overlay.style.display =
                "block";
        }

        return;
    }


    // ========================================================
    // EXISTE RECARGA
    // ========================================================

    botaoModal.className =
        "status uso";

    botaoModal.style.backgroundColor =
        "#dcfce7";

    botaoModal.style.color =
        "#0b5e29";


    dadosDetalhes.innerHTML = `

        <h3>🚗 Chegada</h3>

        <p>
            <strong>⚡ Placa:</strong>
            ${registro.placa || "-"}
        </p>

        <p>
            <strong>👤 Proprietário:</strong>
            ${registro.proprietario || "-"}
        </p>

        <p>
            <strong>🚘 Prisma:</strong>
            ${registro.prisma || "-"}
        </p>

        <p>
            <strong>🔌 Estação:</strong>
            ${registro.estacao || "-"}
        </p>

        <p>
            <strong>🙋 Manobrista Entrada:</strong>
            ${registro.manobristaEntrada || "-"}
        </p>

        <p>
            <strong>📅 Data Entrada:</strong>
            ${registro.dataEntrada || "-"}
        </p>

        <p>
            <strong>📆 Dia da Semana:</strong>
            ${registro.diaSemana || "-"}
        </p>

        <p>
            <strong>🕒 Hora Chegada:</strong>
            ${registro.horaChegada || "-"}
        </p>

        <hr>

        <h3>🔋 Início da Carga</h3>

        <p>
            <strong>⚡ Hora Carga Inicial:</strong>
            ${registro.horaCargaInicial || "-"}
        </p>

        <p>
            <strong>🔋 Carga Inicial:</strong>
            ${registro.cargaInicial || "-"}%
        </p>

        <hr>

        <h3>✅ Finalização</h3>

        <p>
            <strong>🙋 Manobrista Saída:</strong>
            ${registro.manobristaSaida || "-"}
        </p>

        <p>
            <strong>🕒 Hora Final:</strong>
            ${registro.horaFinal || "-"}
        </p>

        <p>
            <strong>🔋 Carga Final:</strong>
            ${registro.cargaFinal || "-"}%
        </p>

        <p>
            <strong>⏱️ Tempo de Carga:</strong>
            ${registro.tempoCarga || "-"}
        </p>

        <p>
            <strong>📊 Status:</strong>
            ${registro.status || "-"}
        </p>
    `;


    // ========================================================
    // MOSTRAR MODAL
    // ========================================================

    modal.style.display =
        "block";

    if (overlay) {
        overlay.style.display =
            "block";
    }
}


// ============================================================
// FECHAR DETALHES
// ============================================================

function fecharDetalhes() {

    const registro =
        registroModalAtual;


    // ========================================================
    // JOGA RECARGA CONCLUÍDA PARA O HISTÓRICO
    // ========================================================

    if (
        registro &&
        registro.status === "Concluído"
    ) {

        historicoRecargas.push({
            ...registro
        });

        console.table(
            historicoRecargas
        );
    }


    // ========================================================
    // FECHAR MODAL
    // ========================================================

    const modal =
        document.getElementById(
            "modalDetalhes"
        );

    const overlay =
        document.getElementById(
            "overlay"
        );


    if (modal) {
        modal.style.display =
            "none";
    }

    if (overlay) {
        overlay.style.display =
            "none";
    }


    registroModalAtual =
        null;
}
