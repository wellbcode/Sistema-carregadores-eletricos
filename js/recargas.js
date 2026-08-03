// =======================================
// CONTROLE DAS RECARGAS
// =======================================

console.log("recargas.js carregado!");

const recargas = [];

function criarRecarga(dados) {
    const recarga = {
        id: Date.now(),

        status: "Carregando",

        placa: dados.placa,
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

