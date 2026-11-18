const NOME_BANCO_FOTOS = 'SmartChargerFotos';
const NOME_STORE_FOTOS = 'fotosOperadores';

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
                })
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


async function migrarFotosPerfisAdministradores() {

    const migracoes = {
        'admin-wheezie': 'admin-ingrid',
        'admin-fiona': 'admin-weber',
        'admin-sofia': 'admin-joy'
    };

    for (const [idAntigo, idNovo] of Object.entries(migracoes)) {

        try {
            const fotoAntiga = await buscarFotoOperador(idAntigo);

            if (!fotoAntiga) {
                console.log(`Nenhuma foto antiga encontrada: ${idAntigo}`);
                continue;
            }

            // Não sobrescrever uma foto que já exista no novo ID.
            const fotoNova = await buscarFotoOperador(idNovo);

            if (fotoNova) {
                console.log(`O novo perfil já possui foto: ${idNovo}`);
                continue;
            }

            // Copiar a foto para o novo identificador.
            await salvarFotoOperador(idNovo, fotoAntiga);

            // Confirmar que a cópia foi gravada.
            const fotoVerificada = await buscarFotoOperador(idNovo);

            if (fotoVerificada) {
                await excluirFotoOperador(idAntigo);
                console.log(`Foto migrada com sucesso: ${idAntigo} → ${idNovo}`);
            } else {
                console.error(`Falha ao verificar a cópia: ${idNovo}`);
            }

        } catch (erro) {
            console.error(`Erro ao migrar foto de ${idAntigo}:`, erro);
        }
    }
}
