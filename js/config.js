/* =========================================
   MINHA CONTA
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
        nome.textContent = "Nenhum perfil selecionado";
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
}
