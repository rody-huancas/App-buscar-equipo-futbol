const formulario = document.querySelector("#formulario");
const buscar = document.querySelector("#buscar");
const aplicacion = document.querySelector("#aplicacion");
const resultado = document.querySelector("#equipo");

window.addEventListener("load", () => {
    formulario.addEventListener("submit", buscarEquipo);
});

function buscarEquipo(e) {
    e.preventDefault();
    const buscarInput = document.querySelector("#buscar").value;
    if (buscarInput === '') {
        limpiarHTML()
        mostrarError("Debe ingresar el nombre de un equipo.");
        return;
    }
    consultarApi(buscarInput.trim());
}

function consultarApi(equipo) {
    const key = "f279b10aa5050bd913eb8f8c24e128d2c005b00a55a27839b1ea77a040938a63";
    const url = `https://apiv2.allsportsapi.com/football/?&met=Teams&teamName=${equipo}&APIkey=${key}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {
            limpiarHTML();
            if (!datos.hasOwnProperty("result")) {
                mostrarError("Equipo no encontrado.");
                return;
            }
            const equipo = datos.result.shift();
            mostrarEquipo(equipo);
        });

}

function mostrarEquipo(equipo) {
    const { team_name, team_logo, coaches: [{ coach_name }], players } = equipo;

    // crear un div
    const divContainer = document.createElement("DIV");
    divContainer.classList.add("aplicacion__equipo-contenedor");
    // logo del equipo
    const logo = document.createElement("IMG");
    logo.src = team_logo;
    // crear div
    const divDatos = document.createElement("DIV");
    divContainer.classList.add("aplicacion__equipo-datos");
    // nombre del equipo
    const nombreEquipo = document.createElement("P");
    nombreEquipo.classList.add("aplicacion__equipo-nombre");
    nombreEquipo.textContent = team_name;
    // entrenador 
    const entrenador = document.createElement("P");
    entrenador.classList.add("aplicacion__equipo-entrenador");
    entrenador.innerHTML = `
        <strong>Entrenador: </strong>${coach_name}
    `;
    //-------------------------------------------------------------
    const divJugadores = document.createElement("DIV");
    divJugadores.classList.add("aplicacion__equipo-jugadores");
    players.forEach(jugador => {
        const divCard = document.createElement("DIV");
        divCard.classList.add("aplicacion__equipo-card");

        const { player_name, player_number, player_age } = jugador;
        // nombre del jugador
        const nombreJugador = document.createElement("P");
        nombreJugador.innerHTML =
            `<strong>Nombre: </strong>${player_name}`;
        // nombre del jugador
        const numeroJugador = document.createElement("P");
        numeroJugador.innerHTML =
            `<strong>N° de camiseta: </strong>${player_number}`;
        // edad del jugador
        const edadJugador = document.createElement("P");
        edadJugador.innerHTML =
            `<strong>Edad: </strong>${player_age}`;
        // agregar al divJugadores
        divCard.appendChild(edadJugador);
        divCard.appendChild(nombreJugador);
        divCard.appendChild(numeroJugador);
        // agregar divCard a divJugadores
        divJugadores.appendChild(divCard);
    });
    // agregar al divDatos
    divDatos.appendChild(nombreEquipo);
    divDatos.appendChild(entrenador);
    // agregar al div container
    divContainer.appendChild(logo)
    divContainer.appendChild(divDatos)
    // agregar al html
    resultado.appendChild(divContainer);
    resultado.appendChild(divJugadores);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarError(mensaje) {
    const alertaError = document.querySelector(".alerta__error");
    if (!alertaError) {
        const alerta = document.createElement("DIV");
        alerta.classList.add("alerta__error");
        alerta.innerHTML = `
            <strong class="alerta__error-bold">Error!</strong>
            <span>${mensaje}</span>
        `;
        aplicacion.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
}
