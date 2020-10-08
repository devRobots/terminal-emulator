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
        case 'sudo':
            sudo(parametros)
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
{

    function sudo(parametros) {
        if (parametros.length > 0) {
            var comando = parametros[0]
            var subparametros = []
            for (const i in parametros) {
                if (parametros.hasOwnProperty(i) && i > 0) {
                    const element = parametros[i];
                    subparametros.push(element)
                }
            }
            switch (comando) {
                case 'sudo':
                    sudo(subparametros)
                    break;
                case 'chown':
                    chown(subparametros)
                    break;
                default:
                    addConsola("uqsh: comando no reconocido: " + comando);
                    break;
            }
        } else {
            addConsola("sudo: Se esperaba un comando")
        }
    }

    function verificarUsuario(usuario) {
        const usuarios = computadores.usuarios
        for (const i in usuarios) {
            if (usuarios.hasOwnProperty(i)) {
                const u = usuarios[i];
                if (u == usuario) {
                    return true
                }
            }
        }
        return false
    }
    function obtenerArchivo(archivo) {
        const disco = computadores.disco
        for (const i in disco) {
            if (disco.hasOwnProperty(i)) {
                const a = disco[i];
                if (a.nombre == archivo) {
                    return a
                }
            }
        }
        return null
    }

    function obtenerGrupo(grupo) {
        const grupos = computadores.grupos
        for (const i in grupos) {
            if (grupos.hasOwnProperty(i)) {
                const g = grupos[i];
                if (g.nombre == grupo) {
                    return g
                }
            }
        }
        return null
    }

    function chown(parametros) {
        switch (parametros.length) {
            case 0:
                addConsola("chown: falta un operando")
                break;
            case 1:
                addConsola("chown: falta un operando despues de '" + parametros[0] + "'")
                break;
            default:
                var dueniogrupo = parametros[0].split(":")
                var duenio = dueniogrupo[0]
                var grupo = null
                if (dueniogrupo.hasOwnProperty(i)) {
                    grupo = dueniogrupo[1]
                }

                for (const i in parametros) {
                    if (parametros.hasOwnProperty(i) && i > 0) {
                        const nombreArchivo = parametros[i];
                        var archivo = obtenerArchivo(nombreArchivo).duenio

                        if (archivo != null) {
                            archivo.duenio = duenio
                            if (grupo != null) {
                                archivo.grupo.nombre = grupo
                            }
                        } else {
                            addConsola("chown: no se puede acceder a '" + nombreArchivo + "': No existe el fichero")
                        }
                        archivos.push(element)
                    }
                }
                break;
        }
    }

    function comandoLs(parametros) {

        if (parametrs > 0) {


        }
    }
}