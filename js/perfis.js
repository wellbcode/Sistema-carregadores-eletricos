
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



    operador.addEventListener('click', () => {



        const nome = operador.querySelector('h4').textContent;



        // Fecha o modal de operadores

        modalOperadores.classList.remove('active');



        // Atualiza o nome

        nomeSelecionado.textContent = `Usuário: ${nome}`;



        // Aguarda fechar e abre o modal de senha

        setTimeout(() => {

            modalSenha.classList.add('active');

        }, 100);



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
        cadeado.className = perfil.pin
            ? 'bi bi-lock-fill cadeado-perfil'
            : 'bi bi-unlock cadeado-perfil';

        cadeado.title = perfil.pin
            ? 'Perfil protegido por PIN'
            : 'Definir PIN do perfil';

        cadeado.style.color = '#ffffff';
        cadeado.style.pointerEvents = 'none';

        card.append(cadeado);
        //cadeado.style.cursor = 'pointer';

        cadeado.addEventListener('click', async (event) => {
            event.stopPropagation();

            const resultado = await Swal.fire({
                title: 'PIN do perfil',
                text: `Defina um PIN de 4 dígitos para ${perfil.nome}.`,
                input: 'password',
                inputAttributes: {
                    maxlength: 4,
                    inputmode: 'numeric',
                    autocomplete: 'new-password'
                },
                showCancelButton: true,
                confirmButtonText: 'Salvar PIN',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff6b00',
                inputValidator: (valor) => {
                    if (!/^\d{4}$/.test(valor)) {
                        return 'Digite exatamente 4 números.';
                    }
                }
            });

            if (!resultado.isConfirmed) return;

            perfil.pin = resultado.value;

            const indice = perfisAdministradores.findIndex(
                item => item.id === perfil.id
            );

            if (indice !== -1) {
                perfisAdministradores[indice].pin = resultado.value;
                salvarPerfis(perfisAdministradores);
            }

            cadeado.className = 'bi bi-lock-fill cadeado-perfil';
            cadeado.title = 'Perfil protegido por PIN';

            await Swal.fire({
                icon: 'success',
                title: 'PIN cadastrado!',
                text: 'O PIN foi salvo para este perfil.',
                confirmButtonColor: '#ff6b00'
            });
        });

        card.append(cadeado);

    // card.append(areaFoto, titulo, cargo);

    card.append(areaFoto, titulo, cargo, cadeado);

    // editar.addEventListener('click', async (event) => {
    //     event.stopPropagation();

    //     const resultado = await Swal.fire({
    //         title: 'Editar perfil',
    //         text: `O que deseja fazer com o perfil de ${perfil.nome}?`,
    //         icon: 'question',
    //         showDenyButton: true,
    //         showCancelButton: true,
    //         confirmButtonText: 'Trocar foto',
    //         denyButtonText: 'Excluir perfil',
    //         cancelButtonText: 'Fechar',
    //         confirmButtonColor: '#ff6b00',
    //         denyButtonColor: '#dc2626',
    //         cancelButtonColor: '#64748b',
    //         reverseButtons: true
    //     });

    //     // Opção 1: trocar a foto
    //     if (resultado.isConfirmed) {
    //         input.click();
    //         return;
    //     }

    //     // Opção 2: excluir o perfil
    //     if (resultado.isDenied) {
    //         // Impedir a exclusão do administrador principal
    //         if (perfil.id === 'admin-wellington') {
    //             await Swal.fire({
    //                 icon: 'info',
    //                 title: 'Administrador principal',
    //                 text: 'Este perfil é protegido e não pode ser excluído.',
    //                 confirmButtonText: 'Entendi',
    //                 confirmButtonColor: '#ff6b00'
    //             });

    //             return;
    //         }
    //         const confirmacao = await Swal.fire({
    //             title: 'Excluir este perfil?',
    //             text: `O perfil de ${perfil.nome} e sua foto salva serão removidos.`,
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: 'Sim, excluir',
    //             cancelButtonText: 'Manter perfil',
    //             confirmButtonColor: '#dc2626',
    //             cancelButtonColor: '#64748b',
    //             reverseButtons: true
    //         });

    //         if (!confirmacao.isConfirmed) return;

    //         try {
    //             // Primeiro remove a foto do IndexedDB
    //             await excluirFotoOperador(perfil.id);

    //             // Depois remove o perfil do localStorage
    //             perfisAdministradores = perfisAdministradores.filter(
    //                 item => item.id !== perfil.id
    //             );

    //             salvarPerfis(perfisAdministradores);
    //             renderizarPerfis();

    //             await Swal.fire({
    //                 icon: 'success',
    //                 title: 'Perfil excluído!',
    //                 text: 'O perfil e sua foto foram removidos com sucesso.',
    //                 confirmButtonColor: '#ff6b00',
    //                 timer: 2000,
    //                 showConfirmButton: false
    //             });

    //         } catch (erro) {
    //             console.error('Erro ao excluir perfil:', erro);

    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Não foi possível excluir',
    //                 text: 'Ocorreu um erro ao remover a foto ou o perfil. Tente novamente.',
    //                 confirmButtonText: 'Entendi',
    //                 confirmButtonColor: '#ff6b00'
    //             });
    //         }
    //     }
    // });
    
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

            // didOpen: () => {
            //     const opcoes = Swal.getPopup().querySelectorAll(
            //         'input[type="radio"], label'
            //     );

            //     opcoes.forEach(opcao => {
            //         opcao.style.cursor = 'pointer';
            //     });
            // },
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

        // Opção 1: trocar a foto
        if (resultado.value === 'foto') {
            input.click();
            return;
        }

        // Opção 2: cadastrar ou alterar o PIN
        // if (resultado.value === 'pin') {
        //     const respostaPin = await Swal.fire({
        //         title: perfil.pin ? 'Alterar PIN' : 'Proteger perfil',
        //         text: `Digite um PIN de 4 dígitos para ${perfil.nome}.`,
        //         input: 'password',
        //         inputAttributes: {
        //             maxlength: 4,
        //             inputmode: 'numeric',
        //             pattern: '[0-9]{4}',
        //             autocomplete: 'new-password'
        //         },
        //         showCancelButton: true,
        //         confirmButtonText: 'Salvar PIN',
        //         cancelButtonText: 'Cancelar',
        //         confirmButtonColor: '#ff6b00',
        //         cancelButtonColor: '#64748b',
        //         inputValidator: (valor) => {
        //             if (!/^\d{4}$/.test(valor || '')) {
        //                 return 'Digite exatamente 4 números.';
        //             }
        //         }
        //     });

        //     if (!respostaPin.isConfirmed) return;

        //     const indice = perfisAdministradores.findIndex(
        //         item => item.id === perfil.id
        //     );

        //     if (indice === -1) {
        //         await Swal.fire({
        //             icon: 'error',
        //             title: 'Perfil não encontrado',
        //             confirmButtonColor: '#ff6b00'
        //         });
        //         return;
        //     }

        //     perfisAdministradores[indice].pin = respostaPin.value;
        //     perfil.pin = respostaPin.value;

        //     salvarPerfis(perfisAdministradores);
        //     renderizarPerfis();

        //     await Swal.fire({
        //         icon: 'success',
        //         title: 'PIN salvo!',
        //         text: `O perfil de ${perfil.nome} agora possui um PIN cadastrado.`,
        //         confirmButtonColor: '#ff6b00'
        //     });

        //     return;
        // }
        
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

            perfisAdministradores[indice].pin = respostaPin.value;
            perfil.pin = respostaPin.value;

            salvarPerfis(perfisAdministradores);
            renderizarPerfis();

            await Swal.fire({
                icon: 'success',
                title: 'PIN salvo!',
                text: `O perfil de ${perfil.nome} agora possui um PIN cadastrado.`,
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

    editar.addEventListener('click', () => {
        input.click();
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

const NOME_BANCO_FOTOS = 'SmartChargerFotos';
const NOME_STORE_FOTOS = 'fotosOperadores';

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

// Editar perfil dos administradores
// document.querySelectorAll('.profile-item').forEach((perfil, index) => {
//     const editar = perfil.querySelector('.editar-perfil');
//     const input = perfil.querySelector('.inputFoto');
//     const foto = perfil.querySelector('.foto');

//     if (!editar || !input || !foto) return;

//     // Use um identificador exclusivo e estável para cada perfil.
//     const idPerfil =
//         perfil.dataset.usuarioId ||
//         perfil.id ||
//         input.id ||
//         perfil.dataset.nome ||
//         `perfil-${index}`;

//     let urlTemporaria = null;

//     function exibirFoto(arquivo) {
//         if (urlTemporaria) {
//             URL.revokeObjectURL(urlTemporaria);
//         }

//         urlTemporaria = URL.createObjectURL(arquivo);
//         foto.src = urlTemporaria;
//     }

//     // Recuperar a foto salva ao abrir a página
//     buscarFotoOperador(idPerfil)
//         .then((arquivo) => {
//             if (arquivo) {
//                 exibirFoto(arquivo);
//             }
//         })
//         .catch((erro) => {
//             console.error('Erro ao recuperar foto:', erro);
//         });

//     // Abrir seletor de arquivos
//     editar.addEventListener('click', () => {
//         input.click();
//     });

//     // Selecionar, exibir e salvar a foto
//     input.addEventListener('change', async (event) => {
//         const arquivo = event.target.files[0];

//         if (!arquivo) return;

//         if (!arquivo.type.startsWith('image/')) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Arquivo inválido',
//                 text: 'Selecione uma imagem válida para o perfil.',
//                 confirmButtonColor: '#ff6b00'
//             });
//             input.value = '';
//             return;
//         }

//         try {
//             await salvarFotoOperador(idPerfil, arquivo);

//             exibirFoto(arquivo);

//             console.log('Foto salva com sucesso:', idPerfil);
//         } catch (erro) {
//             console.error('Erro ao salvar foto:', erro);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Ops! Não foi possível salvar',
//                 text: 'Ocorreu um erro ao salvar a foto. Tente novamente.',
//                 confirmButtonText: 'Entendi',
//                 confirmButtonColor: '#ff6b00'
//             });
//         }

//         // Permite selecionar novamente o mesmo arquivo
//         input.value = '';
//     });
// });

