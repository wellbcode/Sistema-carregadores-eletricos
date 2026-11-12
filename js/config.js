
/* =========================================
// MINHA CONTA
========================================= */
document.addEventListener("DOMContentLoaded", carregarMinhaConta);

async function carregarMinhaConta() {

    const usuario = JSON.parse(
        sessionStorage.getItem("usuarioLogado") || "null"
    );

    const inicial = document.getElementById("contaInicial");
    const foto = document.getElementById("contaFotoPerfil");
    const nome = document.getElementById("contaNome");
    const tipo = document.getElementById("contaTipo");
    const permissoes = document.getElementById("contaPermissoes");
    const criada = document.getElementById("contaCriada");

    if (!usuario) {
        nome.textContent = "";
        tipo.textContent = "";
        permissoes.textContent = "";
        criada.textContent = "";

        document.getElementById("contaStatusPin").textContent =
            "Nenhum perfil conectado";

        document.getElementById("btnGerenciarPin").hidden = true;
        document.getElementById("btnRemoverPin").hidden = true;

        return;
    }

    // Nome do usuário
    nome.textContent = usuario.nome || "Usuário";

    // Tipo de perfil
    const tipoPerfil = usuario.tipo === "operador"
        ? "Operador"
        : "Administrador";

    tipo.textContent = tipoPerfil;

    // Permissões
    permissoes.textContent = tipoPerfil === "Administrador"
        ? "Acesso total"
        : "Acesso operacional";

    // Data de criação
    const perfis = JSON.parse(
        localStorage.getItem("smartChargerPerfis") || "[]"
    );

    const perfilAtual = perfis.find(
        perfil => perfil.id === usuario.id
    );

    if (perfilAtual?.criadoEm) {

        criada.textContent = new Date(
            perfilAtual.criadoEm
        ).toLocaleDateString("pt-BR");

    } else {
        criada.textContent = "15/10/2026";
    }

    // Foto personalizada ou avatar padrão
    foto.src = usuario.fotoPadrao || "img/charge4.png";

    // Foto ou avatar com inicial do nome
    try {

        const fotoSalva = await buscarFotoOperador(usuario.id);

        if (fotoSalva) {

            foto.src = URL.createObjectURL(fotoSalva);
            foto.hidden = false;
            inicial.hidden = true;

        } else {

            foto.hidden = true;
            inicial.textContent = (usuario.nome || "U").charAt(0).toUpperCase();
            inicial.hidden = false;

        }

    } catch (erro) {

        console.error("Erro ao carregar foto do perfil:", erro);

        foto.hidden = true;
        inicial.textContent = (usuario.nome || "U").charAt(0).toUpperCase();
        inicial.hidden = false;
    }

    // Gerenciamento do PIN
    configurarGerenciamentoPin(usuario);
}


/* =========================================
// GERENCIAMENTO DO PIN DA CONTA
========================================= */
function configurarGerenciamentoPin(usuario) {
    const statusPin = document.getElementById("contaStatusPin");
    const btnGerenciar = document.getElementById("btnGerenciarPin");
    const btnRemover = document.getElementById("btnRemoverPin");

    function atualizarStatusPin() {

        const perfil = window.obterPinPerfil(usuario.id);
        const possuiPin = Boolean(perfil?.pin);

        statusPin.textContent = possuiPin
            ? "PIN cadastrado"
            : "Sem PIN cadastrado";

        btnGerenciar.textContent = possuiPin
            ? "Alterar PIN"
            : "Cadastrar PIN";

        btnRemover.hidden = !possuiPin;
    }

    // Solicitar PIN
    async function solicitarPin(titulo, texto) {

        const resultado = await Swal.fire({
            title: titulo,
            text: texto,
            input: "password",
            inputAttributes: {
                maxlength: 4,
                inputmode: "numeric",
                pattern: "[0-9]{4}",
                autocomplete: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Continuar",
            cancelButtonText: "Cancelar",

            inputValidator: (valor) => {
                if (!/^\d{4}$/.test(valor)) {
                    return "Digite um PIN com 4 números.";
                }
            },

            // Cadeado para mostrar ou ocultar o PIN
            didOpen: () => {

                const campo = Swal.getInput();

                const cadeadoPin = document.createElement('i');

                cadeadoPin.className = 'bi bi-lock-fill';
                cadeadoPin.title = 'Mostrar PIN';

                cadeadoPin.style.cssText = `
                    position: absolute;
                    right: 50px;
                    top: 55%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    font-size: 20px;
                    color: #64748b;
                    z-index: 10;
                `;

                campo.parentElement.style.position = 'relative';
                campo.style.paddingRight = '42px';
                campo.parentElement.appendChild(cadeadoPin);

                cadeadoPin.addEventListener('click', () => {

                    const mostrar = campo.type === 'password';

                    campo.type = mostrar ? 'text' : 'password';

                    cadeadoPin.className = mostrar
                        ? 'bi bi-unlock-fill'
                        : 'bi bi-lock-fill';

                    cadeadoPin.title = mostrar
                        ? 'Ocultar PIN'
                        : 'Mostrar PIN';
                });
            }
        });

        return resultado.isConfirmed ? resultado.value : null;
    }

    // Confirmar novo PIN
    async function cadastrarNovoPin() {

        const novoPin = await solicitarPin(
            "Novo PIN",
            "Digite o novo PIN de 4 números."
        );

        if (!novoPin) return false;

        const confirmarPin = await solicitarPin(
            "Confirmar PIN",
            "Digite novamente o novo PIN."
        );

        if (!confirmarPin) return false;

        if (novoPin !== confirmarPin) {

            await Swal.fire(
                "PINs diferentes",
                "Os PINs informados não coincidem.",
                "error"
            );

            return false;
        }

        const salvo = window.definirPinPerfil(
            usuario.id,
            usuario.nome,
            novoPin
        );

        if (!salvo) {

            await Swal.fire(
                "Erro",
                "Não foi possível salvar o PIN.",
                "error"
            );

            return false;
        }

        await Swal.fire(
            "Sucesso!",
            "Seu PIN foi cadastrado com sucesso.",
            "success"
        );

        atualizarStatusPin();
        return true;
    }

    // Cadastrar ou alterar PIN
    btnGerenciar.addEventListener("click", async () => {

        const perfil = window.obterPinPerfil(usuario.id);
        const possuiPin = Boolean(perfil?.pin);

        // Cadastro inicial
        if (!possuiPin) {
            await cadastrarNovoPin();
            return;
        }

        // Validar PIN atual
        const pinAtual = await solicitarPin(
            "Confirmar identidade",
            "Digite seu PIN atual para continuar."
        );

        if (!pinAtual) return;

        if (!window.validarPinPerfil(usuario.id, pinAtual)) {

            await Swal.fire(
                "PIN incorreto",
                "O PIN informado não está correto.",
                "error"
            );

            return;
        }

        // Alterar PIN
        await cadastrarNovoPin();
    });

    // Remover PIN
    btnRemover.addEventListener("click", async () => {

        const pinAtual = await solicitarPin(
            "Remover PIN",
            "Digite seu PIN atual para confirmar a remoção."
        );

        if (!pinAtual) return;

        if (!window.validarPinPerfil(usuario.id, pinAtual)) {

            await Swal.fire(
                "PIN incorreto",
                "O PIN informado não está correto.",
                "error"
            );

            return;
        }

        const confirmacao = await Swal.fire({
            title: "Remover PIN?",
            text: "Seu perfil ficará sem PIN cadastrado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, remover",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33"
        });

        if (!confirmacao.isConfirmed) return;

        // Limpa somente o PIN e preserva os dados do perfil
        window.PINS_PERFIS[usuario.id].pin = "";

        window.salvarPinsPerfis();

        await Swal.fire(
            "PIN removido",
            "Seu PIN foi removido com sucesso.",
            "success"
        );

        atualizarStatusPin();
    });

    atualizarStatusPin();
}
