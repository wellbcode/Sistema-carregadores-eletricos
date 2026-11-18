/* =========================================
   GERENCIAMENTO DE PIN DOS PERFIS
   Administradores e operadores
========================================= */

// false = acesso sem exigir PIN
// true  = exigir PIN somente dos perfis protegidos
window.PROTEGER_PERFIS_COM_PIN = true;


// PINs iniciais dos perfis existentes
// PIN vazio = perfil sem proteção
const PINS_INICIAIS = {
    "admin-wellington": {
        usuario: "Wellington",
        pin: "",
        fotoPadrao: "img/charge4.png"
    },

    "admin-ingrid": {
        usuario: "Ingrid",
        pin: "",
        fotoPadrao: "img/charge4.png"
    },

    "admin-weber": {
        usuario: "Weber",
        pin: ""
    },

    "admin-joy": {
        usuario: "Joy",
        pin: ""
    }
};

const CHAVE_PINS_PERFIS = "smartChargerPins";

// =========================================
// CARREGAR PINs SALVOS
// =========================================
// function carregarPinsPerfis() {
//     let pinsSalvos = {};

//     try {
//         pinsSalvos = JSON.parse(
//             localStorage.getItem(CHAVE_PINS_PERFIS) || '{}'
//         );
//     } catch (erro) {
//         console.error("Erro ao carregar PINs:", erro);
//     }

//     return {
//         ...PINS_INICIAIS,
//         ...pinsSalvos
//     };
// }

function carregarPinsPerfis() {
    let pinsSalvos = {};
    let houveMigracao = false;

    try {
        pinsSalvos = JSON.parse(
            localStorage.getItem(CHAVE_PINS_PERFIS) || '{}'
        );
    } catch (erro) {
        console.error("Erro ao carregar PINs:", erro);
    }

    // Transferir registros dos identificadores antigos
    const migracoes = {
        "admin-wheezie": {
            id: "admin-ingrid",
            usuario: "Ingrid"
        },
        "admin-fiona": {
            id: "admin-weber",
            usuario: "Weber"
        },
        "admin-sofia": {
            id: "admin-joy",
            usuario: "Joy"
        }
    };

    for (const [idAntigo, destino] of Object.entries(migracoes)) {

        const registroAntigo = pinsSalvos[idAntigo];

        if (!registroAntigo) continue;

        const registroNovo = pinsSalvos[destino.id];

        if (!registroNovo || (!registroNovo.pin && registroAntigo.pin)) {

            pinsSalvos[destino.id] = {
                ...registroAntigo,
                usuario: destino.usuario
            };

        } else {

            pinsSalvos[destino.id] = {
                ...registroNovo,
                usuario: destino.usuario
            };
        }

        delete pinsSalvos[idAntigo];

        houveMigracao = true;
    }

    // Atualizar o nome de Wellington, que mantém o mesmo ID
    if (pinsSalvos["admin-wellington"]) {
        pinsSalvos["admin-wellington"].usuario = "Wellington";
    }

    // Salvar os registros migrados
    if (houveMigracao) {
        localStorage.setItem(
            CHAVE_PINS_PERFIS,
            JSON.stringify(pinsSalvos)
        );
    }

    return {
        ...PINS_INICIAIS,
        ...pinsSalvos
    };
}


// Lista central de PINs em memória
window.PINS_PERFIS = carregarPinsPerfis();

// =========================================
// SALVAR PINs
// =========================================
function salvarPinsPerfis() {
    localStorage.setItem(
        CHAVE_PINS_PERFIS,
        JSON.stringify(window.PINS_PERFIS)
    );
}

window.salvarPinsPerfis = salvarPinsPerfis;

// =========================================
// CONSULTAR PIN
// =========================================
window.obterPinPerfil = function (id) {
    return window.PINS_PERFIS[id] || null;
};

// =========================================
// CADASTRAR OU ALTERAR PIN
// =========================================
window.definirPinPerfil = function (id, usuario, pin) {

    if (!id || !usuario || !/^\d{4}$/.test(String(pin))) {
        return false;
    }

    const dadosAnteriores = window.PINS_PERFIS[id] || {};

    window.PINS_PERFIS[id] = {
        ...dadosAnteriores,
        usuario: usuario.trim(),
        pin: String(pin)
    };

    window.salvarPinsPerfis();

    return true;
};


// =========================================
// REMOVER PIN
// =========================================
// window.removerPinPerfil = function (id) {

//     const perfil = window.PINS_PERFIS[id];

//     if (!perfil || !perfil.pin) {
//         return false;
//     }

//     perfil.pin = "";

//     window.salvarPinsPerfis();

//     return true;
// };
// =========================================
// REMOVER PIN
// =========================================
window.removerPinPerfil = function (id) {

    const perfil = window.PINS_PERFIS[id];

    if (!perfil || !perfil.pin) {
        return false;
    }

    delete window.PINS_PERFIS[id];

    window.salvarPinsPerfis();

    return true;
};

// =========================================
// VALIDAR PIN
// =========================================
window.validarPinPerfil = function (id, pin) {

    const perfil = window.obterPinPerfil(id);

    return Boolean(
        perfil &&
        perfil.pin &&
        perfil.pin === String(pin)
    );
};

// =========================================
// AUTENTICAR PERFIL E CRIAR SESSÃO
// =========================================
window.autenticarPerfil = function ({
    id,
    nome,
    tipo,
    pin,
    fotoPadrao
}) {

    if (!id || !nome || !tipo) {
        return false;
    }

    const perfil = window.obterPinPerfil(id);

    // Verifica se o perfil possui PIN
    const possuiPin = Boolean(perfil?.pin);

    // Exige PIN somente quando a proteção está ativada
    // e o perfil possui um PIN cadastrado
    if (
        window.PROTEGER_PERFIS_COM_PIN &&
        possuiPin &&
        !window.validarPinPerfil(id, pin)
    ) {
        return false;
    }

    // Cria a sessão autenticada
    const sessao = {
        id,
        nome,
        tipo,
        autenticado: true
    };

    // Mantém a foto quando disponível
    if (fotoPadrao) {
        sessao.fotoPadrao = fotoPadrao;
    }

    sessionStorage.setItem(
        'usuarioLogado',
        JSON.stringify(sessao)
    );

    return true;
};
