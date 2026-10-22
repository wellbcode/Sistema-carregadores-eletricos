//Slides de Imagens dinâmicas de fundo
const slides = document.querySelectorAll(".bg-slide");

let atual = 0;

setInterval(() => {
    slides[atual].classList.remove("active");
    atual = (atual + 1) % slides.length;
    slides[atual].classList.add("active");

}, 5000);

// Abrir e fechar o menu do perfil
const profile = document.querySelector('.profile');
const profileToggle = document.getElementById('profileToggle');
const profileMenu = document.getElementById('profileMenu');

if (profile && profileToggle && profileMenu) {

    profileToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        profileMenu.classList.toggle('active');
    });

    // Fechar ao clicar fora do perfil
    document.addEventListener('click', (event) => {
        if (!profile.contains(event.target)) {
            profileMenu.classList.remove('active');
        }
    });

    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            profileMenu.classList.remove('active');
        }
    });

}

//botão entrar
const btnLogin = document.querySelector('.btn-login');
if (btnLogin) {

    btnLogin.addEventListener('click', async () => {
        const { value: senha } =
        await Swal.fire({

            title: '🔒 Acesso ao Sistema',

            text: 'Digite a senha para continuar',

            input: 'password',

            inputPlaceholder: 'Senha do sistema',

            inputAttributes: {

                maxlength: 8,

                autocomplete: 'off'

            },

            confirmButtonText: 'Entrar',

            cancelButtonText: 'Cancelar',

            showCancelButton: true,

    

            background: '#1e293b',

            color: '#ffffff',

    

            confirmButtonColor: '#ff6b00',

            cancelButtonColor: '#475569',

    

            // customClass: {

            //     popup: 'swal-smartcharger'

            // }

    

            didOpen: () => {

    

                const campo = Swal.getInput();

    

                const cadeado = document.createElement('i');

    

                cadeado.className = 'bi bi-lock-fill';

                cadeado.title = 'Mostrar senha';

    

                cadeado.style.cssText = `

                    position:absolute;

                    right:55px;

                    top:56%;

                    transform:translateY(-50%);

                    cursor:pointer;

                    font-size:20px;

                    color:#94a3b8;

                    z-index:10;

                `;

    

                campo.parentElement.style.position = 'relative';

                campo.style.paddingRight = '45px';

    

                campo.parentElement.appendChild(cadeado);

    

                cadeado.addEventListener('click', () => {

    

                    const mostrar = campo.type === 'password';

    

                    campo.type = mostrar ? 'text' : 'password';

    

                    cadeado.className = mostrar

                        ? 'bi bi-unlock-fill'

                        : 'bi bi-lock-fill';

    

                    cadeado.title = mostrar

                        ? 'Ocultar senha'

                        : 'Mostrar senha';

    

                });

            }  

        });

        if (!senha) return;

        if (senha === '@Vec2026') {
            window.location.href = 'perfis.html';
        } else {
            Swal.fire({

                icon: 'error',

                title: 'Acesso Negado',

                html: `

                    <div style="line-height:1.6">

                        A senha informada é inválida.<br>

                        Entre em contato com o administrador do sistema.

                    </div>

                `,

                confirmButtonText: 'Entendi',

                confirmButtonColor: '#ff6b00',

                background: '#1e293b',

                color: '#fff',

                customClass: {

                    popup: 'swal-smartcharger',

                    confirmButton: 'swal-btn-smart'

                }

            });
        }
    });
}

// Botão Sair
const btnLogout = document.querySelector('.btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {

        const resultado = await Swal.fire({
            title: 'Deseja sair do sistema?',
            text: 'Você precisará selecionar um perfil novamente.',
            icon: 'question',

            showCancelButton: true,
            confirmButtonText: 'Sair',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,

            background: '#1e293b',
            color: '#ffffff',

            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#475569'
        });

        if (resultado.isConfirmed) {
            sessionStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html';
        }
    });
}


document.addEventListener('DOMContentLoaded', async () => {
    const usuario = JSON.parse(
        sessionStorage.getItem('usuarioLogado')
    );

    if (!usuario) return;

    const nomeUsuario = document.getElementById('nomeUsuario');

    if (nomeUsuario) {
        nomeUsuario.innerHTML = `Olá, <span>${usuario.nome}</span> 👋`;
    }

    const fotoUsuario = document.getElementById('fotoUsuario');
    const inicialUsuario = document.getElementById('inicialUsuario');

    if (!fotoUsuario || !inicialUsuario) return;

    const ehOperador = usuario.tipo === 'operador';

    inicialUsuario.textContent =
        usuario.nome.trim().charAt(0).toUpperCase();

    // Começa mostrando a inicial até confirmar a imagem
    fotoUsuario.hidden = true;
    inicialUsuario.hidden = false;

    function exibirFoto(src) {
        fotoUsuario.onload = () => {
            fotoUsuario.hidden = false;
            inicialUsuario.hidden = true;
        };

        fotoUsuario.onerror = () => {
            fotoUsuario.hidden = true;
            inicialUsuario.hidden = false;
        };

        fotoUsuario.src = src;
    }

    try {
        // Primeiro tenta carregar a foto personalizada do perfil
        if (typeof buscarFotoOperador === 'function') {
            const arquivo = await buscarFotoOperador(usuario.id);

            if (arquivo instanceof Blob) {
                const urlFoto = URL.createObjectURL(arquivo);
                exibirFoto(urlFoto);
                return;
            }
        }

        // Sem foto personalizada: usa a foto padrão do administrador
        if (!ehOperador) {
            exibirFoto(usuario.fotoPadrao || 'img/charge4.png');
        }
    } catch (erro) {
        console.error('Erro ao carregar foto do perfil:', erro);

        if (!ehOperador) {
            exibirFoto(usuario.fotoPadrao || 'img/charge4.png');
        }
    }
});



