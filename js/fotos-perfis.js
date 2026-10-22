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