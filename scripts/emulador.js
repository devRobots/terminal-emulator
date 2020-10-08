/*
 description Emulador de una terminal y varias máquinas en red usando Javascript
 author Julián Esteban Gutiérrez Posada y Carlos Eduardo Gómez Montoya
 email jugutier@uniquindio.edu.co carloseg@uniquindio.edu.co
 licence GNU General Public License  Ver. 3.0 (GNU GPL v3)
 date Octubre 2020
 version 1.1
*/

/**
 * Lee el archivo computadores.json y lo guarda en la variable computadores
 */
var computadores = []
fetch("scripts/computadores.json")
    .then(response => {
        return response.json();
    })
    .then(data => computadores = data);

/**
 * Variables de usuario y computador que se muestran en consola
 */
var usuario = "luisa"
var hostname = "PC1"
var computador = null

/**
 * Obtiene un computador a partir de su nombre
 * @param {String} nombre El hostname del computador a obtener
 */
function obtenerComputador(nombre) {
    for (const i in computadores) {
        if (computadores.hasOwnProperty(i)) {
            const pc = computadores[i];
            if (pc.hostname == nombre) {
                return pc
            }
        }
    }
    return null
}

/**
 * Adiciona una texto a la consola de la GUI (Ver HTML)
 * @param texto Texto que se desea adicionar al final de la consola.
 */
function addConsola(texto) {
    document.getElementById("textoImprimir").innerHTML += texto + "<br>";
    var consola = document.getElementById("consola");
    consola.scrollTop = consola.scrollHeight;
}


/**
 * Proceso de inicio de la terminal
 */
function procesoInicio() {
    computador = obtenerComputador(hostname)
    entrada.focus();
}


/**
 * Procesa el evento de teclado. Enter (13) procesa la orden y ESC (27) imprime el JSON
 */
function procesarEntrada(e) {
    if (e.keyCode == 13) {
        procesarComando(document.getElementById("entrada"));
    }
}

/**
 * Procesa el comando enviado como argumento.
 * @param comando a procesar
 */
function procesarComando(entrada_) {
    var entrada = entrada_.value.split(" ");

    var comando = entrada[0]
    var parametros = []
    for (const i in entrada) {
        if (entrada.hasOwnProperty(i) && i > 0) {
            const element = entrada[i];
            parametros.push(element)
        }
    }

    var prompt = usuario + "@" + hostname + "$ "
    addConsola(prompt);

    switch (comando) {
        case 'clear':
            comandoClear(parametros);
            break;


        // ...

        default:
            addConsola("uqsh: comando no reconocido: " + comando);
    }

    addConsola("");
    document.getElementById("entrada").value = "";
}

/**
 * Procesa el comando (clear)
 */
function comandoClear(comandoParametros) {
    if (comandoParametros.length > 1) {
        addConsola("clear: No requiere parámetros.")
    } else {
        document.getElementById("textoImprimir").innerHTML = ""
        document.getElementById("entrada").value = "";
    }
}

