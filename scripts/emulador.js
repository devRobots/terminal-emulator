/**
 * @description Emulador de una terminal y varias máquinas en red usando Javascript
 *
 * @author     Luisa Fernanda Cotte Sanchez
 * @email      lfcottes@uqvirtual.edu.co
 * @author     Yesid Shair Rosas Toro
 * @email      ysrosast_1@uqvirtual.edu.co
 * @author     Cristian Camilo Quiceno Laurente
 * @email      ccquicenol@uqvirtual.edu.co
 *
 * @licence    GNU General Public License  Ver. 3.0 (GNU GPL v3)
 * @date       Octubre 2020
 * @version    2.0
 */

/** Contiene la informacion que se va a cargar desde el JSON */
var computadores = []
/** Cola de usuarios logeados */
var usuario = ["luisa"]
/** Cola de hosts logeados */
var hostname = ["PC1"]
/** Prompt que se mostrara en consola*/
var prompt = usuario + "@" + hostname + "$ "
/** Computador actual en el que se encuentra logeado */
var computador = null

/**
 * Proceso de inicio de la terminal
 * Se ejecuta al momento de cargar la pagina
 * 
 * @async Espera a que el archivo JSON cargue
 */
async function procesoInicio() {
    mostrarPrompt()
    const response = await fetch("scripts/computadores.json")
    computadores = await response.json()
    computador = obtenerComputador(hostname)
    entrada.focus()
}

/**
 * Adiciona una texto a la consola de la GUI (Ver HTML)
 * @param texto Texto que se desea adicionar al final de la consola.
 */
function addConsola(texto) {
    document.getElementById("textoImprimir").innerHTML += texto + "<br>"
    var consola = document.getElementById("consola")
    consola.scrollTop = consola.scrollHeight
}

/**
 * Muestra el prompt en la consola
 */
function mostrarPrompt() {
    var i = usuario == "root" ? "#" : "$"
    u = usuario[usuario.length - 1]
    h = hostname[hostname.length - 1]
    prompt = u + "@" + h + i + " "
    document.getElementById("prompt").innerHTML = prompt
}

/**
 * Procesa el evento de teclado. Enter (13) procesa la orden y ESC (27) imprime el JSON
 */
function procesarEntrada(e) {
    if (e.keyCode == 13) {
        procesarComando(document.getElementById("entrada"))
    }
}

/**
 * Procesa el comando enviado como argumento.
 * @param comando a procesar
 */
function procesarComando(entrada_) {
    var entrada = entrada_.value.split(" ")

    var comando = entrada[0]
    var parametros = entrada.slice(1,entrada.length)

    addConsola(prompt + entrada_.value, false)

    switch (comando) {
        case 'clear':   comandoClear(parametros);   break;
        case 'sudo':    sudo(parametros);           break;
        case 'ls':      ls(parametros);             break;
        case 'cat':     cat(parametros);            break;
        // ...
        default:        addConsola("uqsh: comando no reconocido: " + comando)
    }

    mostrarPrompt()
    document.getElementById("entrada").value = ""
}

/**
 * Limpia la consola
 * @param {string[]} parametros Parametros del comando clear
 */
function comandoClear(parametros) {
    if (parametros.length > 1) {
        addConsola("clear: No requiere parámetros.")
    } else {
        document.getElementById("textoImprimir").innerHTML = ""
        document.getElementById("entrada").value = ""
    }
}

/**
 * Ejecuta una instruccion como super usuario
 * @param {string[]} parametros Parametros del comando sudo
 */
function sudo(parametros) {
    if (parametros.length > 0) {
        var comando = parametros[0]
        var subparametros = parametros.slice(1, parametros.length)
        
        switch (comando) {
            case 'sudo':    sudo(subparametros);    break;
            case 'chown':   chown(subparametros);   break;
            default:        addConsola("uqsh: comando no reconocido: " + comando)
        }
    } else {
        addConsola("sudo: Se esperaba un comando")
    }
}

/**
 * Cambia el duenio y grupo de uno o varios archivos en el computador actual
 * @param {parametros} parametros Parametros del comando chown
 */
function chown(parametros) {
    if (parametros.length > 1) {
        var dueniogrupo = parametros[0].split(":")
        var duenio = dueniogrupo[0]
        var nombreGrupo = null
        if (dueniogrupo.hasOwnProperty(1)) {
            nombreGrupo = dueniogrupo[1]
        }

        for (const i in parametros) {
            if (parametros.hasOwnProperty(i) && i > 0) {
                const nombreArchivo = parametros[i]
                var archivo = obtenerArchivo(nombreArchivo)

                if (archivo != null) {
                    archivo.duenio = duenio
                    if (nombreGrupo != null) {
                        archivo.grupo.nombre = grupo
                    }
                } else {
                    addConsola("chown: no se puede acceder a '" + nombreArchivo + "': No existe el fichero")
                }
            }
        }
    }
}

/**
 * Lista los archivos del computador actual
 * @param {string[]} parametros Parametros del comando ls
 */
function ls(parametros) {
    const disco = computador.disco

    if (parametros.length == 0) {
        for (var i in disco) {
            addConsola(disco[i].nombre)
        }
    }
    if (parametros == '-l') {
        for (const i in disco) {
            addConsola(disco[i].permisos + " " + disco[i].duenio + " " + disco[i].grupo + " " +
                disco[i].fecha + " " + disco[i].nombre)
        }
    }
    if (parametros.length > 0 && parametros != '-l') {
        addConsola("ls: opción incorrecta -- " + "«" + parametros[0] + "»")
    }
}

/**
 * Intenta leer el contenido de un archivo
 * @param {string[]} parametros la lista de archivos
 */
function cat(parametros) {
    for (const i in parametros) {
        var archivo = obtenerArchivo(parametros[i])
        if (archivo == null) {
            addConsola("el archivo " + parametros[i] + " no existe")
            return false
        }
        if (verificarPermisosLectura(archivo)) {
            addConsola("Leyendo el contenido del archivo ....")
        } else {
            addConsola("no cuenta con permisos")
        }
    }
}

/**
 * Mira si el usuario activo tiene permisos de lectura en un archivo
 * @param {archivo} archivo un Archivo del disco duro
 */
function verificarPermisosLectura(archivo) {
    var permisos = archivo.permisos
    var propietario = archivo.duenio
    var grupo = archivo.grupo

    if (usuario == propietario) {
        if (permisos[1] == "r") {
            return true
        }
    }
    if (obtenerGrupo(grupo).usuarios.includes(usuario)) {
        if (permisos[4] == "r") {
            return true
        }
    }
    if (permisos[7] == "r") {
        return true
    }
}

/**
 * Verifica que el usuario exista en el computador actual
 * @param {string} usuario Nombre del usuario a verificar
 */
function verificarUsuario(usuario) {
    const usuarios = computador.usuarios
    for (const i in usuarios) {
        if (usuarios.hasOwnProperty(i)) {
            const u = usuarios[i]
            if (u == usuario) {
                return true
            }
        }
    }
    return false
}

/**
 * Obtiene un archivo del computador actual
 * @param {string} archivo Nombre del archivo a obtener
 */
function obtenerArchivo(archivo) {
    const disco = computador.disco
    for (const i in disco) {
        if (disco.hasOwnProperty(i)) {
            const a = disco[i]
            if (a.nombre == archivo) {
                return a
            }
        }
    }
    return null
}

/**
 * Obtiene un grupo del computador actual
 * @param {string} grupo Nombre del grupo a obtener
 */
function obtenerGrupo(grupo) {
    const grupos = computador.grupos
    for (const i in grupos) {
        if (grupos.hasOwnProperty(i)) {
            const g = grupos[i]
            if (g.nombre == grupo) {
                return g
            }
        }
    }
    return null
}

/**
 * Obtiene un computador a partir de su nombre
 * @param {String} nombre El hostname del computador a obtener
 */
function obtenerComputador(nombre) {
    for (const i in computadores) {
        if (computadores.hasOwnProperty(i)) {
            const pc = computadores[i]
            if (pc.hostname == nombre) {
                return pc
            }
        }
    }
    return null
}