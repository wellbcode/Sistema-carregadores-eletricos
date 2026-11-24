
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
            confirmButtonColor: "#28a745",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#dc3545",

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


/* =========================================
   BACKUP E DADOS
   EXPORTAÇÃO DO BACKUP
========================================= */

// Converte arquivos e fotos para Base64
function converterArquivoParaBackup(arquivo) {

    if (!arquivo) return null;

    if (!(arquivo instanceof Blob)) {
        throw new Error("Formato de arquivo não reconhecido no backup.");
    }

    return new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = () => {
            resolve({
                nome: arquivo.name || null,
                tipo: arquivo.type || "application/octet-stream",
                ultimaModificacao: arquivo.lastModified || null,
                dados: leitor.result
            });
        };

        leitor.onerror = () => reject(leitor.error);

        leitor.readAsDataURL(arquivo);
    });
}

// Busca todas as fotos armazenadas no IndexedDB
async function buscarFotosParaBackup() {

    const banco = await abrirBancoFotos();

    return new Promise((resolve, reject) => {

        const transacao = banco.transaction(
            NOME_STORE_FOTOS,
            "readonly"
        );

        const requisicao = transacao
            .objectStore(NOME_STORE_FOTOS)
            .getAll();

        requisicao.onsuccess = () => resolve(requisicao.result);

        requisicao.onerror = () => reject(requisicao.error);

        transacao.oncomplete = () => banco.close();

        transacao.onabort = () => {
            banco.close();
            reject(transacao.error);
        };
    });
}

// Exporta todos os dados do sistema
async function exportarBackup() {

    try {

        // Captura todas as chaves do localStorage
        const dadosLocalStorage = {};

        for (let i = 0; i < localStorage.length; i++) {

            const chave = localStorage.key(i);

            dadosLocalStorage[chave] = localStorage.getItem(chave);
        }

        // Captura as fotos do IndexedDB
        const fotosArmazenadas = await buscarFotosParaBackup();

        const fotosBackup = await Promise.all(
            fotosArmazenadas.map(async (registro) => {

                return {
                    id: registro.id,
                    arquivo: await converterArquivoParaBackup(
                        registro.arquivo
                    )
                };

            })
        );

        // Monta o conteúdo do backup
        const backup = {

            sistema: "Smart Charger",

            versaoBackup: 1,

            dataExportacao: new Date().toISOString(),

            localStorage: dadosLocalStorage,

            indexedDB: {
                banco: NOME_BANCO_FOTOS,
                store: NOME_STORE_FOTOS,
                fotos: fotosBackup
            }
        };

        // Gera o arquivo JSON
        const conteudo = JSON.stringify(backup, null, 4);

        const arquivo = new Blob(
            [conteudo],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(arquivo);

        const link = document.createElement("a");

        const data = new Date().toISOString().slice(0, 10);

        link.href = url;
        link.download = `backup-smart-charger-${data}.json`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        // Confirmação
        Swal.fire({
            icon: "success",
            title: "Backup exportado!",
            text: "Os dados e as fotos dos perfis foram incluídos no arquivo."
        });

    } catch (erro) {

        console.error("Erro ao exportar backup:", erro);

        Swal.fire({
            icon: "error",
            title: "Erro ao exportar backup",
            text: "Não foi possível gerar o arquivo. Consulte o console para mais detalhes."
        });
    }
}

// Evento do botão Exportar Backup
document.addEventListener("DOMContentLoaded", () => {

    const btnExportar = document.getElementById("btnExportarBackup");

    if (btnExportar) {
        btnExportar.addEventListener("click", exportarBackup);
    }

});


/* =========================================
   BACKUP E DADOS
   IMPORTAÇÃO DO BACKUP
========================================= */

// Converte os dados Base64 novamente em Blob
function converterBackupParaArquivo(arquivo) {

    if (
        !arquivo ||
        typeof arquivo.dados !== "string" ||
        !arquivo.dados.startsWith("data:")
    ) {
        throw new Error("Arquivo de foto inválido no backup.");
    }

    const partes = arquivo.dados.match(
        /^data:([^;,]+)?;base64,(.+)$/
    );

    if (!partes) {
        throw new Error("Formato Base64 da foto inválido.");
    }

    const tipo = arquivo.tipo || partes[1] || "application/octet-stream";

    const binario = atob(partes[2]);
    const bytes = new Uint8Array(binario.length);

    for (let i = 0; i < binario.length; i++) {
        bytes[i] = binario.charCodeAt(i);
    }

    return new Blob([bytes], { type: tipo });
}


// Valida a estrutura e prepara os dados do backup
function validarBackup(backup) {

    if (
        !backup ||
        backup.sistema !== "Smart Charger" ||
        backup.versaoBackup !== 1
    ) {
        throw new Error("Arquivo incompatível com o Smart Charger.");
    }

    if (
        !backup.localStorage ||
        typeof backup.localStorage !== "object" ||
        Array.isArray(backup.localStorage)
    ) {
        throw new Error("Os dados do LocalStorage não são válidos.");
    }

    // Validar os valores do LocalStorage
    for (const [chave, valor] of Object.entries(backup.localStorage)) {

        if (
            typeof chave !== "string" ||
            typeof valor !== "string"
        ) {
            throw new Error("Existem dados inválidos no backup.");
        }
    }

    if (
        !backup.indexedDB ||
        backup.indexedDB.banco !== NOME_BANCO_FOTOS ||
        backup.indexedDB.store !== NOME_STORE_FOTOS ||
        !Array.isArray(backup.indexedDB.fotos)
    ) {
        throw new Error("A estrutura das fotos no backup não é válida.");
    }

    const idsFotos = new Set();

    const fotosPreparadas = backup.indexedDB.fotos.map(registro => {

        if (
            !registro ||
            typeof registro.id !== "string" ||
            !registro.id.trim() ||
            idsFotos.has(registro.id)
        ) {
            throw new Error("Existe uma foto com identificador inválido ou duplicado.");
        }

        idsFotos.add(registro.id);

        return {
            id: registro.id,
            arquivo: converterBackupParaArquivo(registro.arquivo)
        };
    });

    return fotosPreparadas;
}


// Substitui as fotos do IndexedDB pelas fotos do backup
async function restaurarFotosBackup(fotos) {

    const banco = await abrirBancoFotos();

    return new Promise((resolve, reject) => {

        const transacao = banco.transaction(
            NOME_STORE_FOTOS,
            "readwrite"
        );

        const store = transacao.objectStore(NOME_STORE_FOTOS);

        store.clear();

        fotos.forEach(registro => {
            store.put(registro);
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


// Importa os dados do arquivo selecionado
async function importarBackup(arquivo) {

    try {

        // Ler o arquivo JSON
        const conteudo = await arquivo.text();
        const backup = JSON.parse(conteudo);

        // Validar antes de modificar os dados
        const fotosPreparadas = validarBackup(backup);

        const dataBackup = new Date(backup.dataExportacao);

        const dataFormatada = Number.isNaN(dataBackup.getTime())
            ? "Data não informada"
            : dataBackup.toLocaleString("pt-BR");

        // Resumo dos dados
        let totalPerfis = 0;

        try {
            const perfis = JSON.parse(
                backup.localStorage.smartChargerPerfis || "[]"
            );

            totalPerfis = Array.isArray(perfis) ? perfis.length : 0;

        } catch {
            throw new Error("Os dados dos perfis no backup não são válidos.");
        }

        let totalPins = 0;

        try {
            const pins = JSON.parse(
                backup.localStorage.smartChargerPins || "{}"
            );

            if (!pins || typeof pins !== "object" || Array.isArray(pins)) {
                throw new Error();
            }

            totalPins = Object.values(pins).filter(
                registro => registro && registro.pin
            ).length;

        } catch {
            throw new Error("Os dados dos PINs no backup não são válidos.");
        }

        const confirmacao = await Swal.fire({

            title: "Importar Backup?",

            icon: "warning",

            html: `
                <div style="
                    text-align: left;
                    padding: 8px 4px;
                ">

                    <p style="color:#64748b;font-size:13px;">
                        Confira os dados antes de continuar:
                    </p>

                    <div style="
                        background:#fff7ed;
                        padding:14px;
                        border-radius:10px;
                        margin-bottom:14px;
                    ">
                        <div><strong>Data:</strong> ${dataFormatada}</div>
                        <div><strong>Perfis:</strong> ${totalPerfis}</div>
                        <div><strong>PINs:</strong> ${totalPins}</div>
                        <div><strong>Fotos:</strong> ${fotosPreparadas.length}</div>
                    </div>

                    <p style="
                        color:#dc2626;
                        font-size:13px;
                        font-weight:600;
                    ">
                        Atenção: os dados atuais do sistema serão
                        substituídos pelos dados deste backup.
                    </p>

                    <p style="font-size:13px;color:#64748b;">
                        Recomendamos exportar um backup dos dados atuais
                        antes de continuar.
                    </p>

                </div>
            `,

            showCancelButton: true,
            confirmButtonText: "Sim, importar backup",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#EC7000",
            cancelButtonColor: "#64748b"

        });

        if (!confirmacao.isConfirmed) return;

        // Guardar estado atual para permitir rollback em caso de erro
        const dadosAtuais = {};

        for (let i = 0; i < localStorage.length; i++) {

            const chave = localStorage.key(i);

            dadosAtuais[chave] = localStorage.getItem(chave);
        }

        const fotosAtuais = await buscarFotosParaBackup();

        try {

            // Restaurar as fotos
            await restaurarFotosBackup(fotosPreparadas);

            // Substituir os dados do LocalStorage
            localStorage.clear();

            for (const [chave, valor] of Object.entries(backup.localStorage)) {
                localStorage.setItem(chave, valor);
            }

        } catch (erroRestauracao) {

            // Restaurar os dados anteriores se algo falhar
            try {

                localStorage.clear();

                for (const [chave, valor] of Object.entries(dadosAtuais)) {
                    localStorage.setItem(chave, valor);
                }

                await restaurarFotosBackup(fotosAtuais);

            } catch (erroRollback) {

                console.error(
                    "Erro ao recuperar os dados anteriores:",
                    erroRollback
                );
            }

            throw erroRestauracao;
        }

        await Swal.fire({

            icon: "success",
            title: "Backup importado!",
            text: "Os dados e as fotos foram restaurados com sucesso.",
            confirmButtonText: "Recarregar sistema",
            confirmButtonColor: "#EC7000",
            allowOutsideClick: false

        });

        // Atualizar a aplicação com os dados restaurados
        window.location.reload();

    } catch (erro) {

        console.error("Erro ao importar backup:", erro);

        Swal.fire({

            icon: "error",
            title: "Falha na importação",
            text: erro.message || "Não foi possível importar o backup.",
            confirmButtonText: "Entendi",
            confirmButtonColor: "#EC7000"

        });
    }
}


// Eventos dos botões de importação
document.addEventListener("DOMContentLoaded", () => {

    const btnImportar = document.getElementById("btnImportarBackup");
    const arquivoBackup = document.getElementById("arquivoBackup");

    if (!btnImportar || !arquivoBackup) return;

    btnImportar.addEventListener("click", () => {
        arquivoBackup.click();
    });

    arquivoBackup.addEventListener("change", async () => {

        const arquivo = arquivoBackup.files[0];

        if (!arquivo) return;

        if (!arquivo.name.toLowerCase().endsWith(".json")) {

            await Swal.fire({
                icon: "error",
                title: "Arquivo inválido",
                text: "Selecione um arquivo de backup no formato JSON.",
                confirmButtonColor: "#EC7000"
            });

            arquivoBackup.value = "";
            return;
        }

        await importarBackup(arquivo);

        arquivoBackup.value = "";
    });

});


/* =========================================
   VERIFICAÇÃO DE INTEGRIDADE DOS DADOS
========================================= */
async function verificarIntegridadeDados() {

    const problemas = [];
    let totalPerfis = 0;
    let totalOperadores = 0;
    let totalPins = 0;
    let totalFotos = 0;

    try {

        // Verificar perfis
        let perfis = [];

        const dadosPerfis = localStorage.getItem("smartChargerPerfis");

        if (dadosPerfis) {

            try {
                perfis = JSON.parse(dadosPerfis);

                if (!Array.isArray(perfis)) {
                    problemas.push("A estrutura dos perfis não é válida.");
                    perfis = [];
                }

            } catch {
                problemas.push("Não foi possível interpretar os dados dos perfis.");
            }

        } else {
            problemas.push("Os dados dos perfis não foram encontrados.");
        }

        totalPerfis = perfis.length;

        // Contar operadores cadastrados em perfis.html
        const resposta = await fetch('perfis.html');
        const htmlPerfis = await resposta.text();

        const documentoPerfis = new DOMParser().parseFromString(
            htmlPerfis,
            'text/html'
        );

        totalOperadores = documentoPerfis.querySelectorAll(
            '.operador-item'
        ).length;

        console.log("Total de operadores:", totalOperadores);

        const idsPerfis = perfis.map(perfil => perfil?.id);

        if (idsPerfis.some(id => !id)) {
            problemas.push("Existe perfil sem identificador.");
        }

        if (new Set(idsPerfis.filter(Boolean)).size !== idsPerfis.filter(Boolean).length) {
            problemas.push("Foram encontrados identificadores duplicados nos perfis.");
        }

        // Verificar PINs
        const dadosPins = localStorage.getItem("smartChargerPins");

        if (dadosPins) {

            try {

                const pins = JSON.parse(dadosPins);

                if (!pins || typeof pins !== "object" || Array.isArray(pins)) {

                    problemas.push("A estrutura dos PINs não é válida.");

                } else {

                    for (const [id, registro] of Object.entries(pins)) {

                        if (!registro || typeof registro !== "object") {
                            problemas.push(`Registro de PIN inválido: ${id}`);
                            continue;
                        }

                        if (
                            registro.pin !== "" &&
                            !/^\d{4}$/.test(registro.pin)
                        ) {
                            problemas.push(`PIN com formato inválido: ${id}`);
                        }

                        if (registro.pin) totalPins++;
                    }
                }

            } catch {
                problemas.push("Não foi possível interpretar os dados dos PINs.");
            }
        }

        // Verificar fotos no IndexedDB
        const fotos = await buscarFotosParaBackup();

        totalFotos = fotos.length;

        const idsFotos = fotos.map(foto => foto?.id);

        if (idsFotos.some(id => !id)) {
            problemas.push("Existe foto sem identificador.");
        }

        if (new Set(idsFotos.filter(Boolean)).size !== idsFotos.filter(Boolean).length) {
            problemas.push("Foram encontrados identificadores duplicados nas fotos.");
        }

        fotos.forEach(foto => {

            if (!(foto.arquivo instanceof Blob)) {
                problemas.push(`Arquivo de foto inválido: ${foto.id}`);
            }

        });

        // Resultado da verificação
        
        const mensagem = `
            <div style="
                display: flex;
                gap: 10px;
                margin: 22px 0;
                flex-wrap: wrap;
            ">

                <div style="
                    flex: 1;
                    min-width: 90px;
                    padding: 16px 8px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">
                    <i class="bi bi-person-badge-fill" style="
                        font-size: 24px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 25px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 6px;
                    ">${totalPerfis}</div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">Administradores</div>
                </div>

                <div style="
                    flex: 1;
                    min-width: 90px;
                    padding: 16px 8px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">
                    <i class="bi bi-people-fill" style="
                        font-size: 24px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 25px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 6px;
                    ">${totalOperadores}</div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">Operadores</div>
                </div>

                <div style="
                    flex: 1;
                    min-width: 90px;
                    padding: 16px 8px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">
                    <i class="bi bi-shield-lock-fill" style="
                        font-size: 24px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 25px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 6px;
                    ">${totalPins}</div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">PINs cadastrados</div>
                </div>

                <div style="
                    flex: 1;
                    min-width: 90px;
                    padding: 16px 8px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">
                    <i class="bi bi-images" style="
                        font-size: 24px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 25px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 6px;
                    ">${totalFotos}</div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">Fotos armazenadas</div>
                </div>

            </div>

            <div style="
                padding: 14px;
                border-radius: 10px;
                background: ${problemas.length ? "#fff7ed" : "#f0fdf4"};
                text-align: left;
            ">

                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: ${problemas.length ? "#c2410c" : "#15803d"};
                    margin-bottom: 6px;
                ">
                    <i class="bi ${problemas.length ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"}"></i>

                    ${problemas.length ? "Atenção: inconsistências encontradas" : "Integridade verificada"}
                </div>

                <div style="
                    font-size: 13px;
                    color: #475569;
                    line-height: 1.5;
                ">
                    ${
                        problemas.length
                            ? problemas.map(item => `<div>• ${item}</div>`).join("")
                            : "Não foram encontradas inconsistências nas verificações realizadas."
                    }
                </div>

            </div>
        `;

        await Swal.fire({
            icon: problemas.length ? "warning" : "success",

            title: problemas.length
                ? "Verificação concluída"
                : "Dados verificados!",

            html: mensagem,

            confirmButtonText: "Entendi",
            confirmButtonColor: "#EC7000",

            width: "540px",

            customClass: {
                popup: "swal-integridade"
            }
        });


    } catch (erro) {

        console.error("Erro ao verificar integridade:", erro);

        Swal.fire({
            icon: "error",
            title: "Erro na verificação",
            text: "Não foi possível verificar todos os dados armazenados."
        });
    }
}

// Evento do botão Verificar Integridade
document.addEventListener("DOMContentLoaded", () => {

    const btnVerificar = document.getElementById("btnVerificarIntegridade");

    if (btnVerificar) {
        btnVerificar.addEventListener("click", verificarIntegridadeDados);
    }

});


/* =========================================
   INFORMAÇÕES DE ARMAZENAMENTO
========================================= */

// Formata bytes para uma leitura mais amigável
function formatarTamanho(bytes) {

    if (bytes === 0) return "0 KB";

    const unidades = ["Bytes", "KB", "MB", "GB"];

    const indice = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const tamanho = bytes / Math.pow(1024, indice);

    return `${tamanho.toFixed(2)} ${unidades[indice]}`;
}


// Exibe informações sobre os dados armazenados
async function exibirInformacoesArmazenamento() {

    try {

        // LOCALSTORAGE
        let totalLocalStorage = 0;
        const totalChaves = localStorage.length;

        for (let i = 0; i < totalChaves; i++) {

            const chave = localStorage.key(i);
            const valor = localStorage.getItem(chave) || "";

            // Estimativa considerando caracteres UTF-16
            totalLocalStorage += (chave.length + valor.length) * 2;
        }


        // INDEXEDDB - FOTOS
        const fotos = await buscarFotosParaBackup();

        let totalFotos = 0;
        let tamanhoFotos = 0;

        fotos.forEach(registro => {

            if (registro.arquivo instanceof Blob) {

                totalFotos++;

                tamanhoFotos += registro.arquivo.size;
            }

        });


        // ARMAZENAMENTO DO NAVEGADOR
        let usoNavegador = null;
        let limiteNavegador = null;
        let percentualUso = null;

        if (navigator.storage?.estimate) {

            const estimativa = await navigator.storage.estimate();

            usoNavegador = estimativa.usage || 0;
            limiteNavegador = estimativa.quota || 0;

            if (limiteNavegador > 0) {

                percentualUso = Math.min(
                    100,
                    (usoNavegador / limiteNavegador) * 100
                );
            }
        }


        // MONTAGEM DO RESULTADO
        // COR DINÂMICA DA BARRA DE ARMAZENAMENTO
        const corBarra = percentualUso === null
            ? "#EC7000"
            : percentualUso < 50
                ? "#16A34A"
                : percentualUso < 80
                    ? "#EAB308"
                    : percentualUso < 95
                        ? "#DC2626"
                        : "#991B1B";

        const corFundoBarra = percentualUso === null
            ? "#ffedd5"
            : percentualUso < 50
                ? "#dcfce7"
                : percentualUso < 80
                    ? "#fef9c3"
                    : percentualUso < 95
                        ? "#fee2e2"
                        : "#fecaca";
                        
        // MONTAGEM DO RESULTADO
        const mensagem = `

            <div style="
                display: flex;
                gap: 10px;
                margin: 22px 0;
                flex-wrap: wrap;
            ">

                <div style="
                    flex: 1;
                    min-width: 130px;
                    padding: 18px 10px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">

                    <i class="bi bi-database-fill" style="
                        font-size: 25px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 21px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 8px;
                    ">
                        ${formatarTamanho(totalLocalStorage)}
                    </div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">
                        LocalStorage
                    </div>

                    <div style="
                        font-size: 11px;
                        color: #94a3b8;
                        margin-top: 5px;
                    ">
                        ${totalChaves} chaves
                    </div>

                </div>


                <div style="
                    flex: 1;
                    min-width: 130px;
                    padding: 18px 10px;
                    background: #fff7ed;
                    border-radius: 12px;
                    text-align: center;
                ">

                    <i class="bi bi-images" style="
                        font-size: 25px;
                        color: #EC7000;
                    "></i>

                    <div style="
                        font-size: 21px;
                        font-weight: 700;
                        color: #334155;
                        margin-top: 8px;
                    ">
                        ${formatarTamanho(tamanhoFotos)}
                    </div>

                    <div style="
                        font-size: 12px;
                        color: #64748b;
                    ">
                        IndexedDB
                    </div>

                    <div style="
                        font-size: 11px;
                        color: #94a3b8;
                        margin-top: 5px;
                    ">
                        ${totalFotos} fotos
                    </div>

                </div>

            </div>


            <div style="
                padding: 16px;
                background: #f8fafc;
                border-radius: 10px;
                text-align: left;
            ">

                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 12px;
                ">
                    <i class="bi bi-hdd-stack" style="color: #EC7000;"></i>
                    Armazenamento do navegador
                </div>

                ${
                    usoNavegador !== null && limiteNavegador > 0
                        ? `
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                gap: 10px;
                                font-size: 13px;
                                margin-bottom: 8px;
                                color: #475569;
                            ">
                                <span>Espaço utilizado</span>
                                <strong>${formatarTamanho(usoNavegador)}</strong>
                            </div>

                            <div style="
                                height: 10px;
                                background: ${corFundoBarra};
                                border-radius: 20px;
                                overflow: hidden;
                            ">
                                <div style="
                                    height: 100%;
                                    width: ${percentualUso}%;
                                    background: ${corBarra};
                                    border-radius: 20px;
                                "></div>
                            </div>

                            <div style="
                                display: flex;
                                justify-content: space-between;
                                gap: 10px;
                                font-size: 11px;
                                color: #64748b;
                                margin-top: 8px;
                            ">
                                <span>${percentualUso.toFixed(2)}% utilizado</span>
                                <span>Limite: ${formatarTamanho(limiteNavegador)}</span>
                            </div>
                        `
                        : `
                            <div style="
                                font-size: 13px;
                                color: #64748b;
                                line-height: 1.5;
                            ">
                                O navegador não disponibilizou informações sobre
                                o limite de armazenamento.
                            </div>
                        `
                }

            </div>


            <p style="
                font-size: 11px;
                color: #94a3b8;
                margin-top: 14px;
                margin-bottom: 0;
            ">
                Os valores de LocalStorage são estimados.
                O uso do navegador pode incluir outros dados além dos exibidos acima.
            </p>

        `;


        // EXIBIR JANELA
        await Swal.fire({

            title: "Informações de Armazenamento",

            html: mensagem,

            confirmButtonText: "Entendi",

            confirmButtonColor: "#EC7000",

            width: "540px",

            customClass: {
                popup: "swal-integridade"
            }

        });

    } catch (erro) {

        console.error(
            "Erro ao consultar armazenamento:",
            erro
        );

        Swal.fire({
            icon: "error",
            title: "Erro ao consultar armazenamento",
            text: "Não foi possível obter as informações dos dados armazenados."
        });

    }
}

// Evento do botão Informações de Armazenamento
document.addEventListener("DOMContentLoaded", () => {

    const btnInformacoes = document.getElementById(
        "btnInformacoesArmazenamento"
    );

    if (btnInformacoes) {

        btnInformacoes.addEventListener(
            "click",
            exibirInformacoesArmazenamento
        );

    }
});
