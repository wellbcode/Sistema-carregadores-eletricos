// ================ PRISMA =====================
const prisma = document.getElementById("prisma");
if (prisma) {
    prisma.innerHTML = `
        <option value="">Selecione</option>
    `;

    for (let i = 0; i <= 31; i++) {
        prisma.innerHTML += `
            <option value="${i}">
                Prisma ${i}
            </option>
        `;
    }

    prisma.innerHTML += `
        <option value="rapida">
            ⚡ Carga Rápida
        </option>
    `;
}

// ============== BUSCA DE PLACA ======================
const inputPlaca = document.getElementById("placa");
if (inputPlaca) {
    const inputPlaca = document.getElementById("placa");

    const btnConsultar = document.getElementById("btnConsultar");

    inputPlaca.addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            buscarVeiculo();
        }
    });

    btnConsultar.addEventListener("click", buscarVeiculo);
}

function buscarVeiculo() {
    const placa = inputPlaca.value.trim().toUpperCase();

    if (placa === "") {
        limparCard();
        return;
    }

    const encontrado = base.find(
        item => item[0].toUpperCase() === placa
    );

    if (!encontrado) {
        document.getElementById("nomeVeiculo").innerHTML = `
            <i class="fa-solid fa-user"></i>
            Veículo não encontrado
        `;

        document.getElementById("cargoVeiculo").innerHTML = `
            <i class="fa-solid fa-id-badge"></i>
        `;

        document.getElementById("carroVeiculo").innerHTML = `
            <i class="fa-solid fa-car"></i>
        `;

        document.getElementById("fotoVeiculo").src =
            "img/sem-foto.jpg";
        return;
    }

    const partes = encontrado[1].split(" - Func: ");
    const nome = partes[0];
    const funcional = partes[1] || "";
    const cargo = encontrado[2]

    .replace(" - Itaú Unibanco", "");

    document.getElementById("nomeVeiculo").innerHTML = `
        <i class="fa-solid fa-user"></i>
        ${nome}
    `;

    document.getElementById("cargoVeiculo").innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
        ${cargo} • Funcional ${funcional}
    `;

    document.getElementById("carroVeiculo").innerHTML = `
        <i class="fa-solid fa-car"></i>
        ${encontrado[3]}
    `;

    document.getElementById("fotoVeiculo").src = 

    encontrado[4];
}

// ===============LIMPA CARD======================
function limparCard() {
    document.getElementById("nomeVeiculo").innerHTML = `
        <i class="fa-solid fa-user"></i>
    `;

    document.getElementById("cargoVeiculo").innerHTML = `
        <i class="fa-solid fa-id-badge"></i>
    `;

    document.getElementById("carroVeiculo").innerHTML = `
        <i class="fa-solid fa-car"></i>
    `;
}