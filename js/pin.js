
/* =========================================
   GERENCIAMENTO DE PIN DOS PERFIS
   Administradores e operadores
   ========================================= */

// false = acesso sem PIN
// true  = exigir PIN nos perfis cadastrados
window.PROTEGER_PERFIS_COM_PIN = false;

// PINs iniciais dos perfis existentes
const PINS_INICIAIS = {
    "admin-wellington": {
        usuario: "Wellington",
        pin: "1234"
    },

    "admin-wheezie": {
        usuario: "Wheezie",
        pin: "2580"
    },

    "admin-fiona": {
        usuario: "Fiona",
        pin: "7391"
    },

    "admin-sofia": {
        usuario: "Sofia",
        pin: "4628"
    }
};

const CHAVE_PINS_PERFIS = "smartChargerPins";

// Carrega os PINs salvos ou inicia com os PINs existentes

function carregarPinsPerfis() {
    let pinsSalvos = {};

    try {
        pinsSalvos = JSON.parse(
            localStorage.getItem(CHAVE_PINS_PERFIS) || '{}'
        );
    } catch (erro) {
        console.error("Erro ao carregar PINs:", erro);
    }

    // Mantém os PINs iniciais e preserva os PINs já cadastrados
    return {
        ...PINS_INICIAIS,
        ...pinsSalvos
    };
}


// Lista central de PINs em memória
window.PINS_PERFIS = carregarPinsPerfis();

// Salva a lista de PINs no localStorage
function salvarPinsPerfis() {
    localStorage.setItem(
        CHAVE_PINS_PERFIS,
        JSON.stringify(window.PINS_PERFIS)
    );
}

window.salvarPinsPerfis = salvarPinsPerfis;

// Consulta o PIN de um perfil
window.obterPinPerfil = function (id) {
    return window.PINS_PERFIS[id] || null;
};

// Cadastra ou altera o PIN de um perfil
window.definirPinPerfil = function (id, usuario, pin) {
    if (!id || !usuario || !/^\d{4}$/.test(String(pin))) {
        return false;
    }

    window.PINS_PERFIS[id] = {
        usuario: usuario.trim(),
        pin: String(pin)
    };

    window.salvarPinsPerfis();
    return true;
};

// Remove o PIN de um perfil
window.removerPinPerfil = function (id) {
    if (!window.PINS_PERFIS[id]) {
        return false;
    }

    delete window.PINS_PERFIS[id];
    window.salvarPinsPerfis();
    return true;
};

// Confere se o PIN informado está correto
window.validarPinPerfil = function (id, pin) {
    const perfil = window.obterPinPerfil(id);

    return Boolean(perfil && perfil.pin === String(pin));
};
