//========= Interação da carga da bateria ===============

function gerarBarra(percentual) {

 

    percentual = Number(percentual) || 0;

 

    if (percentual > 100) {

        percentual = 100;

    }

 

    const blocos =

        Math.round(percentual / 12.5);

 

    const barra =

        "█".repeat(blocos) +

        "░".repeat(8 - blocos);

 

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

 

const cargaInicial =

document.getElementById("cargaInicial");

 

cargaInicial.addEventListener("input", function () {

 

    this.value = this.value.replace(/\D/g, "");

 

    if (Number(this.value) > 100) {

        this.value = "100";

    }

 

    const estacaoSelecionada =

        document.getElementById("estacao").value;

 

    const card = [...document.querySelectorAll(".station-card")]

        .find(c =>

            c.querySelector("h3").textContent.trim() ===

            estacaoSelecionada

        );

 

    if (!card) return;

 

    card.querySelector(".info-carga").innerHTML =

        gerarBarra(this.value);

 

});

 

//========= Interação do tempo ===============

const horaCargaInicial =

document.getElementById("horaCargaInicial");

 

horaCargaInicial.addEventListener("change", function () {

 

    const estacaoSelecionada =

        document.getElementById("estacao").value;

 

    const card = [...document.querySelectorAll(".station-card")]

        .find(c =>

            c.querySelector("h3").textContent.trim() ===

            estacaoSelecionada

        );

 

    if (!card) return;

 

    card.querySelector(".info-tempo").textContent =

        this.value ? "Carregando" : "Disponível";

 

});

 

//========= Interação do botão detalhes ===============
let registroModalAtual = null;//apague se der errado

function abrirDetalhes(botao) {

 

    const card =

        botao.closest(".station-card");

 

    const estacao =

        card.querySelector("h3").textContent.trim();

 

    console.log("Estação clicada:", estacao);

    const registro = recargas.find(

        r => r.estacao === estacao

    );

    registroModalAtual = registro;//apague se der errado

     const botaoModal = 
        document.querySelector("#modalDetalhes button");

    if (!registro) {
        
        

        document.getElementById(

            "dadosDetalhes"

        ).innerHTML = `

            <p>Nenhuma recarga iniciada.</p>

        `;

 

        document.getElementById(

            "modalDetalhes"

        ).style.display = "block";

 

        return;

    }

    // botão verde quando tiver recarga
    botaoModal.className = "status uso";
    botaoModal.style.backgroundColor = "#dcfce7";
    botaoModal.style.color = "#0b5e29";

    document.getElementById(

        "dadosDetalhes"


    ).innerHTML = `
<p><strong>⚡ Placa:</strong> ${registro.placa}</p>

 

        <p><strong>👤 Proprietário:</strong> ${registro.proprietario}</p>

 

        <p><strong>🚘 Prisma:</strong> ${registro.prisma}</p>

 

        <p><strong>🔌 Estação:</strong> ${registro.estacao}</p>

 

        <p><strong>🕒 Hora:</strong> ${registro.horaChegada}</p>

 

        <p><strong>📊 Status:</strong> ${registro.status}</p>

 
 

    `;

 

    document.getElementById(

        "modalDetalhes"

    ).style.display = "block";

}

 

// function fecharDetalhes() {
//     document.getElementById(

//         "modalDetalhes"

//     ).style.display = "none";

// }

//apague se der errado
function fecharDetalhes() {

    const registro = registroModalAtual;

    if (registro && registro.status === "Concluído") {

        historicoRecargas.push({
            ...registro
        });

        console.table(historicoRecargas);
    }

    document.getElementById(
        "modalDetalhes"
    ).style.display = "none";

    registroModalAtual = null;
}




