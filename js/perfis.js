const cardOperadores = document.querySelector('.operadores');
const modalOperadores = document.getElementById('modalOperadores');
const fecharModal = document.getElementById('fecharModal');
const modalSenha = document.getElementById('modalSenha');
const nomeSelecionado = document.getElementById('nomeSelecionado');

// Abrir modal dos operadores
cardOperadores.addEventListener('click', () => {
    modalOperadores.classList.add('active');
});

// Fechar modal dos operadores

fecharModal.addEventListener('click', () => {
    modalOperadores.classList.remove('active');
});


 // Clique em um operador

const operadores = document.querySelectorAll('.operador-item');
const buscarOperador = document.getElementById('buscarOperador');

// Proteção por PIN desativada por enquanto
const PROTEGER_OPERADORES_COM_PIN = false;

// Buscar operadores
buscarOperador.addEventListener('input', () => {
    const pesquisa = buscarOperador.value.toLowerCase().trim();

    operadores.forEach(operador => {
        const nome = operador.querySelector('h4').textContent.toLowerCase();
        const detalhes = operador.querySelector('small').textContent.toLowerCase();

        operador.style.display =
            nome.includes(pesquisa) || detalhes.includes(pesquisa)
                ? ''
                : 'none';
    });
});

operadores.forEach(operador => {
    operador.addEventListener('click', async () => {
        const nome = operador.querySelector('h4').textContent.trim();

        const id = 'operador-' + nome
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Recupera os PINs cadastrados, se houver
        // const pinsOperadores = JSON.parse(
        //     localStorage.getItem('smartChargerPinsOperadores') || '{}'
        // );

        // // Verifica o PIN somente quando a proteção estiver ativada
        // if (PROTEGER_OPERADORES_COM_PIN && pinsOperadores[id]) {
        //     const { value: pin, isConfirmed } = await Swal.fire({
        //         title: 'Acesso do operador',
        //         text: `Digite o PIN de ${nome}.`,
        //         input: 'password',
        //         inputAttributes: {
        //             maxlength: 4,
        //             inputmode: 'numeric',
        //             autocomplete: 'off'
        //         },
        //         showCancelButton: true,
        //         confirmButtonText: 'Entrar',
        //         cancelButtonText: 'Cancelar',
        //         confirmButtonColor: '#ff6b00',
        //         cancelButtonColor: '#64748b',
        //         inputValidator: valor => {
        //             if (!/^\d{4}$/.test(valor || '')) {
        //                 return 'Digite um PIN de 4 números.';
        //             }
        //         }
        //     });

        //     if (!isConfirmed) return;

        //     if (pin !== pinsOperadores[id]) {
        //         await Swal.fire({
        //             icon: 'error',
        //             title: 'PIN incorreto',
        //             confirmButtonColor: '#ff6b00'
        //         });
        //         return;
        //     }
        // }

        
        // Verifica o PIN centralizado no pin.js
        const protecaoAtiva = window.PROTEGER_PERFIS_COM_PIN;
        const pinCadastrado = window.PINS_PERFIS?.[id];

        if (protecaoAtiva && pinCadastrado) {
            const { value: pin, isConfirmed } = await Swal.fire({
                title: 'Acesso do operador',
                text: `Digite o PIN de ${nome}.`,
                input: 'password',
                inputAttributes: {
                    maxlength: 4,
                    inputmode: 'numeric',
                    autocomplete: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Entrar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff6b00',
                cancelButtonColor: '#64748b',
                inputValidator: valor => {
                    if (!/^\d{4}$/.test(valor || '')) {
                        return 'Digite exatamente 4 números.';
                    }
                }
            });

            if (!isConfirmed) return;

            if (pin !== pinCadastrado.pin) {
                await Swal.fire({
                    icon: 'error',
                    title: 'PIN incorreto',
                    text: 'Verifique o PIN e tente novamente.',
                    confirmButtonColor: '#ff6b00'
                });
                return;
            }
        } else if (protecaoAtiva && !pinCadastrado) {
            await Swal.fire({
                icon: 'warning',
                title: 'PIN não cadastrado',
                text: `Não há PIN configurado para ${nome}.`,
                confirmButtonColor: '#ff6b00'
            });
            return;
        }


        // Salva o operador selecionado
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            id: id,
            nome: nome,
            tipo: 'operador'
        }));

        // Fecha os modais
        modalOperadores.classList.remove('active');
        modalSenha.classList.remove('active');

        // Entra no sistema
        window.location.href = 'index.html';
    });
});

// Fecha o modal de senha
const fecharModalSenha =
    document.getElementById('fecharModalSenha');
    fecharModalSenha.addEventListener('click', () => {

 

        modalSenha.classList.remove('active');

 

    });

    modalSenha.addEventListener('click', (e) => {




    if (e.target === modalSenha) {

 

        modalSenha.classList.remove('active');

 

    }




});



/* =========================================

   GERENCIAMENTO DOS PERFIS DE ADMINISTRADOR

   Perfis: localStorage

   Fotos: IndexedDB

   ========================================= */

 

const CHAVE_PERFIS = 'smartChargerPerfis';

const LIMITE_PERFIS = 6; //Limite de perfis adm, se quiser aumentar, basta mudar o número

 

const gradePerfis = document.querySelector('.profiles-grid');

const botaoNovoPerfil = document.querySelector('.add-profile');

 

// Identificador estável para os perfis já existentes

function gerarIdPerfil(nome) {

    return 'admin-' + nome

        .normalize('NFD')

        .replace(/[\u0300-\u036f]/g, '')

        .toLowerCase()

        .replace(/[^a-z0-9]+/g, '-')

        .replace(/^-|-$/g, '');

}

 

// Recupera os perfis ou importa os que já estão no HTML

function carregarPerfis() {

    const dadosSalvos = localStorage.getItem(CHAVE_PERFIS);

 

    if (dadosSalvos !== null) {

        try {

            const perfis = JSON.parse(dadosSalvos);

 

            if (Array.isArray(perfis)) {

                return perfis;

            }

        } catch (erro) {

            console.error('Erro ao ler os perfis:', erro);

        }

    }

 

    const perfisIniciais = [

        ...gradePerfis.querySelectorAll(

            '.profile-item:not(.operadores)'

        )

    ].map(perfil => {

        const nome = perfil.querySelector('h3').textContent.trim();

        const imagem = perfil.querySelector('img');

 

        return {

            id: gerarIdPerfil(nome),

            nome,

            fotoPadrao: imagem.getAttribute('src')

        };

    });

 

    salvarPerfis(perfisIniciais);

 

    return perfisIniciais;

}

 

function salvarPerfis(perfis) {

    localStorage.setItem(CHAVE_PERFIS, JSON.stringify(perfis));

}

 

let perfisAdministradores = carregarPerfis();


let modoEdicao = false;

const btnGerenciar =
    document.getElementById('btnGerenciarPerfis');
    btnGerenciar.addEventListener('click', () => {

    

        modoEdicao = !modoEdicao;

    

        document

            .querySelectorAll('.editar-perfil')

            .forEach(botao => {

    

                botao.style.display =

                    modoEdicao ? 'flex' : 'none';

    

            });

    

        btnGerenciar.innerHTML = modoEdicao

            ? '<i class="bi bi-x-lg"></i> Finalizar Edição'

            : '<i class="bi bi-pencil-square"></i> Gerenciar Perfis';

    

    });
 

// Cria e configura um card de administrador
function criarCardPerfil(perfil) {

    const card = document.createElement('div');

    card.className = 'profile-item';

    card.dataset.usuarioId = perfil.id;

 

    const areaFoto = document.createElement('div');

    areaFoto.className = 'foto-perfil';

 

    const imagem = document.createElement('img');

    imagem.className = 'foto';

    imagem.alt = `Foto de ${perfil.nome}`;

   

    imagem.src = perfil.fotoPadrao || 'img/charge4.png'; //Aqui foto padrão para os novos perfis, depois apenas edite e escolha uma img de preferência

    imagem.alt = `Foto de ${perfil.nome}`;

 

    const editar = document.createElement('i');

    editar.className = 'bi bi-pencil-fill editar-perfil';
    editar.style.display = 'none';
 

    const input = document.createElement('input');

    input.type = 'file';

    input.className = 'inputFoto';

    input.accept = 'image/*';

    input.hidden = true;

 

    areaFoto.append(imagem, editar, input);

 

    const titulo = document.createElement('h3');

    titulo.textContent = perfil.nome;

 

    const cargo = document.createElement('span');

    cargo.textContent = '';

 

           

       const cadeado = document.createElement('i');

        function atualizarCadeado() {
            const possuiPin = Boolean(window.obterPinPerfil(perfil.id));

            cadeado.className = possuiPin
                ? 'bi bi-lock-fill cadeado-perfil'
                : 'bi bi-unlock cadeado-perfil';

            cadeado.title = possuiPin
                ? 'Perfil protegido por PIN'
                : 'Definir PIN do perfil';
        }

        atualizarCadeado();
        cadeado.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
 

        cadeado.style.color = '#ffffff';
        cadeado.style.pointerEvents = 'auto';
        cadeado.style.cursor = 'default';

 

        //card.append(cadeado);

        //cadeado.style.cursor = 'pointer';

 

        // cadeado.addEventListener('click', async (event) => {

        //     event.stopPropagation();

 

        //     const resultado = await Swal.fire({

        //         title: 'PIN do perfil',

        //         text: `Defina um PIN de 4 dígitos para ${perfil.nome}.`,

        //         input: 'password',

        //         inputAttributes: {

        //             maxlength: 4,

        //             inputmode: 'numeric',

        //             autocomplete: 'new-password'

        //         },

        //         showCancelButton: true,

        //         confirmButtonText: 'Salvar PIN',

        //         cancelButtonText: 'Cancelar',

        //         confirmButtonColor: '#ff6b00',

        //         inputValidator: (valor) => {

        //             if (!/^\d{4}$/.test(valor)) {

        //                 return 'Digite exatamente 4 números.';

        //             }

        //         }

        //     });

 

        //     if (!resultado.isConfirmed) return;

 

        //     perfil.pin = resultado.value;

 

        //     const indice = perfisAdministradores.findIndex(

        //         item => item.id === perfil.id

        //     );

 

        //     if (indice !== -1) {

        //         perfisAdministradores[indice].pin = resultado.value;

        //         salvarPerfis(perfisAdministradores);

        //     }

 

        //     cadeado.className = 'bi bi-lock-fill cadeado-perfil';

        //     cadeado.title = 'Perfil protegido por PIN';

 

        //     await Swal.fire({

        //         icon: 'success',

        //         title: 'PIN cadastrado!',

        //         text: 'O PIN foi salvo para este perfil.',

        //         confirmButtonColor: '#ff6b00'

        //     });

        // });

 

 

    card.append(areaFoto, titulo, cargo, cadeado);

    
    // Selecionar perfil e entrar no sistema
    card.addEventListener('click', async () => {
   
        // Impede a seleção durante o gerenciamento dos perfis
        if (modoEdicao) return;

        // Se o perfil tiver PIN, solicitar autenticação
        // if (perfil.pin) {
        //     const { value: pin, isConfirmed } = await Swal.fire({
        //         title: 'Acesso ao perfil',
        //         text: `Digite o PIN de ${perfil.nome}.`,
        //         input: 'password',
        //         inputAttributes: {
        //             maxlength: 4,
        //             inputmode: 'numeric',
        //             autocomplete: 'off'
        //         },
        //         showCancelButton: true,
        //         confirmButtonText: 'Entrar',
        //         cancelButtonText: 'Cancelar',
        //         confirmButtonColor: '#ff6b00',
        //         cancelButtonColor: '#64748b',
        //         inputValidator: (valor) => {
        //             if (!valor) {
        //                 return 'Digite o PIN do perfil.';
        //             }
        //         }
        //     });

        //     if (!isConfirmed) return;

        //     if (pin !== perfil.pin) {
        //         await Swal.fire({
        //             icon: 'error',
        //             title: 'PIN incorreto',
        //             text: 'Verifique o PIN e tente novamente.',
        //             confirmButtonColor: '#ff6b00'
        //         });

        //         return;
        //     }
        // }
        
      
        // Verifica o PIN centralizado no pin.js
        const protecaoAtiva = window.PROTEGER_PERFIS_COM_PIN;
        const pinCadastrado = window.obterPinPerfil(perfil.id);

        if (protecaoAtiva) {
            if (!pinCadastrado) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'PIN não cadastrado',
                    text: `Não há PIN configurado para ${perfil.nome}.`,
                    confirmButtonColor: '#ff6b00'
                });

                return;
            }

            const { value: pin, isConfirmed } = await Swal.fire({
                title: 'Acesso do operador',
                text: `Digite o PIN de ${nome}.`,
                input: 'password',
                inputAttributes: {
                    maxlength: 4,
                    inputmode: 'numeric',
                    autocomplete: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Entrar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff6b00',
                cancelButtonColor: '#64748b',
                inputValidator: valor => {
                    if (!/^\d{4}$/.test(valor || '')) {
                        return 'Digite exatamente 4 números.';
                    }
                }
            });

            if (!isConfirmed) return;

            if (!window.validarPinPerfil(perfil.id, pin)) {
                await Swal.fire({
                    icon: 'error',
                    title: 'PIN incorreto',
                    text: 'Verifique o PIN e tente novamente.',
                    confirmButtonColor: '#ff6b00'
                });

                return;
            }
        }



        // Salva o perfil autenticado para o index.html
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            id: perfil.id,
            nome: perfil.nome,
            fotoPadrao: perfil.fotoPadrao || 'img/charge4.png'
        }));

        // Redireciona para a página inicial
        window.location.href = 'index.html';
    });
  

    editar.addEventListener('click', async (event) => {

       

        event.stopPropagation();

   

        const resultado = await Swal.fire({

            title: 'Editar perfil',

            text: `O que deseja fazer com o perfil de ${perfil.nome}?`,

            input: 'radio',

            inputOptions: {

                foto: 'Trocar foto',

                pin: 'PIN do perfil',

                excluir: 'Excluir perfil'

            },

            inputValidator: (valor) => {

                if (!valor) {

                    return 'Selecione uma opção.';

                }

            },

 

            didOpen: () => {

                const popup = Swal.getPopup();

 

                const opcoes = popup.querySelectorAll(

                    'input[type="radio"], label'

                );

 

                opcoes.forEach(opcao => {

                    opcao.style.cursor = 'pointer';

                    opcao.style.transition = 'transform 0.2s ease';

 

                    opcao.addEventListener('mouseenter', () => {

                        opcao.style.transform = 'translateY(-2px)';

                    });

 

                    opcao.addEventListener('mouseleave', () => {

                        opcao.style.transform = 'translateY(0)';

                    });

                });

            },

            showCancelButton: true,

            confirmButtonText: 'Continuar',

            cancelButtonText: 'Fechar',

            confirmButtonColor: '#ff6b00',

            cancelButtonColor: '#64748b',

            reverseButtons: true

        });

 

        if (!resultado.isConfirmed) return;

 
        if (resultado.value === 'foto') {

 

            editandoFoto = true;

 

            setTimeout(() => {

                input.click();

            }, 100);

 

            return;

        }

     

        // Opção 2: cadastrar ou alterar o PIN

        if (resultado.value === 'pin') {

            const respostaPin = await Swal.fire({

                title: perfil.pin ? 'Alterar PIN' : 'Proteger perfil',

                text: `Digite um PIN de 4 dígitos para ${perfil.nome}.`,

                input: 'password',

                inputAttributes: {

                    maxlength: 4,

                    inputmode: 'numeric',

                    pattern: '[0-9]{4}',

                    autocomplete: 'new-password'

                },

                showCancelButton: true,

                confirmButtonText: 'Salvar PIN',

                cancelButtonText: 'Cancelar',

                confirmButtonColor: '#ff6b00',

                cancelButtonColor: '#64748b',

 

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

                },

 

                inputValidator: (valor) => {

                    if (!/^\d{4}$/.test(valor || '')) {

                        return 'Digite exatamente 4 números.';

                    }

                }

            });

            
            if (!respostaPin.isConfirmed) return;

            const indice = perfisAdministradores.findIndex(
                item => item.id === perfil.id
            );

            if (indice === -1) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Perfil não encontrado',
                    confirmButtonColor: '#ff6b00'
                });
                return;
            }

            const pinSalvo = window.definirPinPerfil(
                perfil.id,
                perfil.nome,
                respostaPin.value
            );

            if (!pinSalvo) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Erro ao salvar PIN',
                    text: 'Não foi possível salvar o PIN deste perfil.',
                    confirmButtonColor: '#ff6b00'
                });
                return;
            }

            // Mantém os dados antigos sincronizados
            perfisAdministradores[indice].pin = respostaPin.value;
            perfil.pin = respostaPin.value;

            salvarPerfis(perfisAdministradores);
            atualizarCadeado();

            await Swal.fire({
                icon: 'success',
                title: 'PIN salvo!',
                text: `O PIN de ${perfil.nome} foi salvo com sucesso.`,
                confirmButtonColor: '#ff6b00'
            });

            return;
        }

 

        // Opção 3: excluir perfil

        if (resultado.value === 'excluir') {

 

            if (perfil.id === 'admin-wellington') {

                await Swal.fire({

                    icon: 'info',

                    title: 'Administrador principal',

                    text: 'Este perfil é protegido e não pode ser excluído.',

                    confirmButtonText: 'Entendi',

                    confirmButtonColor: '#ff6b00'

                });

 

                return;

            }

 

            const confirmacao = await Swal.fire({

                title: 'Excluir este perfil?',

                text: `O perfil de ${perfil.nome} e sua foto salva serão removidos.`,

                icon: 'warning',

                showCancelButton: true,

                confirmButtonText: 'Sim, excluir',

                cancelButtonText: 'Manter perfil',

                confirmButtonColor: '#dc2626',

                cancelButtonColor: '#64748b',

                reverseButtons: true

            });

 

            if (!confirmacao.isConfirmed) return;

 

            try {

                await excluirFotoOperador(perfil.id);

 

                perfisAdministradores = perfisAdministradores.filter(

                    item => item.id !== perfil.id

                );

 

                salvarPerfis(perfisAdministradores);

                renderizarPerfis();

 

                await Swal.fire({

                    icon: 'success',

                    title: 'Perfil excluído!',

                    text: 'O perfil e sua foto foram removidos com sucesso.',

                    confirmButtonColor: '#ff6b00',

                    timer: 2000,

                    showConfirmButton: false

                });

 

            } catch (erro) {

                console.error('Erro ao excluir perfil:', erro);

 

                await Swal.fire({

                    icon: 'error',

                    title: 'Não foi possível excluir',

                    text: 'Ocorreu um erro ao remover a foto ou o perfil. Tente novamente.',

                    confirmButtonText: 'Entendi',

                    confirmButtonColor: '#ff6b00'

                });

            }

        }

    });

   

 

    function gerarIdPerfil(nome) {

        if (nome.trim().toLowerCase() === 'wellington') {

            return 'admin-wellington';

        }

 

        return 'admin-' + nome

            .normalize('NFD')

            .replace(/[\u0300-\u036f]/g, '')

            .toLowerCase()

            .replace(/[^a-z0-9]+/g, '-')

            .replace(/^-|-$/g, '');

    }

 

    // Recuperar a foto persistida no IndexedDB

    buscarFotoOperador(perfil.id)

        .then(arquivo => {

            if (arquivo) {

                imagem.src = URL.createObjectURL(arquivo);

            }

        })

        .catch(erro => {

            console.error('Erro ao recuperar foto:', erro);

        });

 

    input.addEventListener('change', async event => {

        const arquivo = event.target.files[0];

 

        if (!arquivo) return;

 

        if (!arquivo.type.startsWith('image/')) {

           Swal.fire({

                icon: 'error',

                title: 'Arquivo inválido',

                text: 'Selecione uma imagem válida para o perfil.',

                confirmButtonColor: '#ff6b00'

            });

 

                input.value = '';

                return;

        }

 

        try {

            await salvarFotoOperador(perfil.id, arquivo);

 

            imagem.src = URL.createObjectURL(arquivo);

 

            console.log('Foto salva:', perfil.nome);

        } catch (erro) {

            console.error('Erro ao salvar foto:', erro);

            Swal.fire({

                icon: 'error',

                title: 'Ops! Não foi possível salvar',

                text: 'Ocorreu um erro ao salvar a foto. Tente novamente.',

                confirmButtonText: 'Entendi',

                confirmButtonColor: '#ff6b00'

            });

        }

 

        input.value = '';

    });

 

    return card;

}

 

// Renderiza os administradores sem remover os manobristas

function renderizarPerfis() {

    gradePerfis

        .querySelectorAll('.profile-item:not(.operadores)')

        .forEach(card => card.remove());

 

    perfisAdministradores.forEach(perfil => {

        const card = criarCardPerfil(perfil);

        gradePerfis.insertBefore(card, botaoNovoPerfil);

    });

}

 

// Criar um novo perfil
botaoNovoPerfil.addEventListener('click', async () => {

 

    if (perfisAdministradores.length >= LIMITE_PERFIS) {

        Swal.fire({

            icon: 'warning',

            title: 'Limite atingido!',

            text: 'Você já possui os 6 perfis de administradores permitidos.',

            confirmButtonText: 'Entendi',

            confirmButtonColor: '#ff6b00'

        });

 

        return;

    }

 

    const { value: nome } = await Swal.fire({

        title: 'Novo administrador',

        text: 'Cadastre um novo perfil para o Smart Charger.',

        input: 'text',

        inputLabel: 'Nome do administrador',

        inputPlaceholder: 'Digite o nome completo',

        showCancelButton: true,

        confirmButtonText: 'Criar perfil',

        cancelButtonText: 'Cancelar',

        confirmButtonColor: '#ff6b00',

        cancelButtonColor: '#64748b',

        reverseButtons: true,

 

        inputValidator: (valor) => {

            if (!valor || !valor.trim()) {

                return 'Digite o nome do administrador.';

            }

 

            const nomeExiste = perfisAdministradores.some(

                perfil =>

                    perfil.nome.toLowerCase() === valor.trim().toLowerCase()

            );

 

            if (nomeExiste) {

                return 'Já existe um administrador com esse nome.';

            }

        }

    });

 

    if (!nome) return;

 

    const novoPerfil = {

        id: crypto.randomUUID

            ? crypto.randomUUID()

            : `admin-${Date.now()}-${Math.random().toString(36).slice(2)}`,

        nome: nome.trim(),

        fotoPadrao: 'img/charge4.png'

    };

 

    perfisAdministradores.push(novoPerfil);

 

    salvarPerfis(perfisAdministradores);

    renderizarPerfis();

 

    Swal.fire({

        icon: 'success',

        title: 'Perfil criado!',

        text: `O administrador ${novoPerfil.nome} foi cadastrado com sucesso.`,

        confirmButtonText: 'Continuar',

        confirmButtonColor: '#ff6b00',

        timer: 2500,

        timerProgressBar: true

    });

 

});

 

/* =========================================
   FOTOS DOS PERFIS DOS ADMINISTRADORES
   Armazenamento: IndexedDB
========================================= */
function abrirBancoFotos() {

    return new Promise((resolve, reject) => {

        const requisicao = indexedDB.open(NOME_BANCO_FOTOS, 1);

 

        requisicao.onupgradeneeded = (event) => {

            const banco = event.target.result;

 

            if (!banco.objectStoreNames.contains(NOME_STORE_FOTOS)) {

                banco.createObjectStore(NOME_STORE_FOTOS, {

                    keyPath: 'id'

                });

            }

        };

 

        requisicao.onsuccess = () => resolve(requisicao.result);

        requisicao.onerror = () => reject(requisicao.error);

    });

}

 

async function salvarFotoOperador(id, arquivo) {

    const banco = await abrirBancoFotos();

 

    return new Promise((resolve, reject) => {

        const transacao = banco.transaction(

            NOME_STORE_FOTOS,

            'readwrite'

        );

 

        transacao.objectStore(NOME_STORE_FOTOS).put({

            id: id,

            arquivo: arquivo

        });

 

        transacao.oncomplete = () => {

            banco.close();

            resolve();

        };

 

        transacao.onerror = () => {

            banco.close();

            reject(transacao.error);

        };

 

        transacao.onabort = () => {

            banco.close();

            reject(transacao.error);

        };

    });

}

 

async function buscarFotoOperador(id) {

    const banco = await abrirBancoFotos();

 

    return new Promise((resolve, reject) => {

        const transacao = banco.transaction(

            NOME_STORE_FOTOS,

            'readonly'

        );

 

        const requisicao = transacao

            .objectStore(NOME_STORE_FOTOS)

            .get(id);

 

        requisicao.onsuccess = () => {

            resolve(requisicao.result?.arquivo || null);

        };

 

        requisicao.onerror = () => reject(requisicao.error);

 

        transacao.oncomplete = () => banco.close();

        transacao.onabort = () => banco.close();

    });

}

 

async function excluirFotoOperador(id) {

    const banco = await abrirBancoFotos();

 

    return new Promise((resolve, reject) => {

        const transacao = banco.transaction(

            NOME_STORE_FOTOS,

            'readwrite'

        );

 

        transacao.objectStore(NOME_STORE_FOTOS).delete(id);

 

        transacao.oncomplete = () => {

            banco.close();

            resolve();

        };

 

        transacao.onerror = () => {

            banco.close();

            reject(transacao.error);

        };

 

        transacao.onabort = () => {

            banco.close();

            reject(transacao.error);

        };

    });

}

 
// Exibir os perfis salvos

renderizarPerfis();