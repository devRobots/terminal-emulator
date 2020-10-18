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

/** Nombre del shell */
const shell = "jylsh"
/** Cola de usuarios logeados */
var usuarios = []
/** Cola de hosts logeados */
var hostname = ["PC1"]
/** Usuario actual loggeado al computador */
var usuario = null
/** Prompt que se mostrara en consola*/
var prompt = usuario + "@" + hostname + "$ "
/** Computador actual en el que se encuentra logeado */
var computador = null
/** Indica si existe algun usuario loggeado */
var loggedIn = false
/** Historial de comandos hacia atras */
var backwardHistory = []
/** Historial de comandos hacia adelante */
var fordwardHistory = []

/**
 * Proceso de inicio de la terminal
 * Se ejecuta al momento de cargar la pagina
 * 
 * @async Espera a que el archivo JSON cargue
 */
async function procesoInicio() {
    mostrarPrompt()
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
    var out = "Login: "
    if (loggedIn == true) {
        var i = usuario == "root" ? "#" : "$ "
        u = usuario
        host = hostname[hostname.length - 1]
        prompt = usuario + "@" + host + i + " "
        out = prompt
    }
    document.getElementById("prompt").innerHTML = out
}

/**
 * Procesa el evento de teclado. Enter (13) procesa la orden y ESC (27) imprime el JSON
 */
function procesarEntrada(e) {
    if (e.keyCode == 13) {
        if (loggedIn) {
            procesarComando(document.getElementById("entrada"))
        } else {
            login(document.getElementById("entrada").value.trim())
        }
    }
}

function navegar(e) {
    if (e.keyCode == 38) {
        var command = backwardHistory.pop()
        if (command) {
            fordwardHistory.push(command)
            document.getElementById("entrada").value = command
        }
    } else if (e.keyCode == 40) {
        var command = fordwardHistory.pop()
        if (command) {
            backwardHistory.push(command)
            document.getElementById("entrada").value = command
        } else {
            document.getElementById("entrada").value = ""
        }
    }
}

/**
 * Procesa el comando enviado como argumento.
 * @param comando a procesar
 */
function procesarComando(entrada_) {
    var entrada = entrada_.value.trim().split(" ")

    var comando = entrada[0]
    var parametros = entrada.slice(1, entrada.length)

    var flag = true;
    addConsola(prompt + entrada_.value)

    switch (comando) {
        case 'clear': comandoClear(parametros); break;
        case 'sudo': sudo(parametros); break;
        case 'ls': ls(parametros); break;
        case 'cat': cat(parametros); break;
        case 'rm': rm(parametros); break;
        case 'nano': nano(parametros); break;
        case 'lsgroup': lsgroup(parametros); break;
        case 'hostname': comandoHostname(parametros); break;
        case 'logout': logout(parametros); break;
        case 'exit': logout(parametros); break;
        case 'chmod': chmod(parametros); break;
        case 'touch': touch(parametros); break;
        case 'ssh': ssh(parametros); break;
        case 'scp': scp(parametros); break;
        case '':  break;
        // ...
        default:
            if (comando[0] == ".") {
                ejecutar(comando)
            } else {
                addConsola(shell + ": comando no reconocido: " + comando)
                flag = false;
            }
    }

    if (flag == true) {
        backwardHistory.push(entrada_.value)
    }

    mostrarPrompt()
    document.getElementById("entrada").value = ""
}

/**
 * Inicia sesion con una cuenta valida de usuario del computador actual
 * @param {string} usuario 
 */
function login(username) {
    comandoClear([])
    if (verificarUsuario(username)) {
        usuarios.push(username)
        usuario = username
        loggedIn = true;
        addConsola("Login: " + username)
        backwardHistory = []
        fordwardHistory = []
    }
    mostrarPrompt()
}

/**
 * Cierra la sesion actual de un usuario
 */
function logout() {
    if (usuarios.length > 1) {
        usuarios.pop()
        usuario = usuarios[usuarios.length - 1]
        hostname.pop()
        computador = obtenerComputador(hostname)
    } else {
        usuarios = []
        usuario = ""
        loggedIn = false
        comandoClear([])
    }
    mostrarPrompt()
}

/**
 * Lista los grupos del computador actual
 * Si se le indica tambien listara los usuarios que contiene un grupo
 * @param {parametros} parametros Parametros del comando lsgroup
 */
function lsgroup(parametros) {
    if (parametros.length == 0) {
        var grupos = computador.grupos
        var salida = []
        for (const i in grupos) {
            if (grupos.hasOwnProperty(i)) {
                const grupo = grupos[i];
                salida.push(grupo.nombre)
            }
        }
        addConsola("(" + salida + ")")
    } else {
        for (const i in parametros) {
            if (parametros.hasOwnProperty(i)) {
                const nombreGrupo = parametros[i];
                var grupo = obtenerGrupo(nombreGrupo)
                if (grupo) {
                    addConsola(nombreGrupo + ": (" + grupo.usuarios + ")")
                } else {
                    addConsola("lsgroup: grupo invalido '" + nombreGrupo + "'")
                }
            }
        }
    }
}

/**
 * Muestra el hostname y la direccion IP
 * @param {string[]} parametros Parametros del comando hostname
 */
function comandoHostname(parametros) {
    if (parametros.length == 0) {
        addConsola(hostname)
    } else if (parametros.length == 1) {
        if (parametros[0] == "-I") {
            addConsola(obtenerComputador(hostname).IP)
        } else {
            addConsola("hostname: invalid option -- '" + parametros[0] + "'")
            addConsola("Uso: hostname [-I]")
        }
    } else {
        addConsola("hostname: invalid options -- '" + parametros + "'")
        addConsola("Uso: hostname [-I]")
    }
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
            case 'sudo': sudo(subparametros); break;
            case 'chown': chown(subparametros); break;
            default: addConsola(shell + ": comando no reconocido: " + comando)
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
                    if (duenio) {
                        if (verificarUsuario(duenio)) {
                            archivo.duenio = duenio
                        } else {
                            addConsola("chown: usuario invalido: '" + duenio + "'")
                        }
                    }
                    if (nombreGrupo) {
                        if (obtenerGrupo(nombreGrupo)) {
                            archivo.grupo = nombreGrupo
                        } else {
                            addConsola("chown: grupo invalido: '" + nombreGrupo + "'")
                        }
                    }
                    if (!duenio && !nombreGrupo) {
                        addConsola("chown: usuario invalido: '" + duenio + "'")
                    }
                } else {
                    addConsola("chown: no se puede acceder a '" +
                        nombreArchivo + "': No existe el fichero")
                }
            }
        }
    }
}

/**
 * Editor de texto de archivos, permite escribir en ellos si es posible
 * @param {string[]} parametros Parametros del comando nano
 */
function nano(parametros) {
    if (parametros.length > 0) {
        for (const i in parametros) {
            if (parametros.hasOwnProperty(i)) {
                const nombreArchivo = parametros[i];
                var archivo = obtenerArchivo(nombreArchivo)
                if (archivo) {
                    if (verificarPermisosEscritura(archivo)) {
                        addConsola("Escribiendo en el archivo ...")
                    } else {
                        addConsola("Permiso denegado: " + nombreArchivo)
                    }
                } else {
                    touch([nombreArchivo])
                    addConsola("Escribiendo en el archivo ...")
                }
            }
        }
    } else {
        addConsola("nano: falta un operando")
        addConsola("Uso: nano [FILE]...")
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
            addConsola(disco[i].permisos + " " + disco[i].duenio + " " +
                disco[i].grupo + " " + disco[i].fecha + " " + disco[i].nombre)
        }
    }
    if (parametros.length > 0 && parametros != '-l') {
        addConsola("ls: opción incorrecta -- " + "«" + parametros[0] + "»")
    }
}

/**
 * Intenta borrar un archivo especifico
 * @param {string[]} parametros Parametros del comando rm 
 */
function rm(parametros) {
    if (parametros.length == 0) {
        addConsola("rm: falta un operando")
    } else {

        for (const i in parametros) {
            var archivo = obtenerArchivo(parametros[i])

            if (archivo == null) {
                addConsola("rm: no se puede borrar '" + parametros[i] +
                    "': no existe el archivo o el directorio")
                return false
            }
            if (archivo != null && verificarPermisosEscritura(archivo)) {
                var pos = computador.disco.indexOf(archivo)
                computador.disco.splice(pos, 1)
            } else {
                addConsola("Permiso denegado:" + parametros[i])
            }
        }
    }
}

/**
 * Intenta crear un	“archivo” en “disco” de	la máquina actual
 * @param {string[]} parametros Parametros del comando touch
 */
function touch(parametros) {

    if (parametros.length == 0) {
        addConsola("touch: falta un archivo como argumento")
    } else {

        for (const i in parametros) {
            var archivo = obtenerArchivo(parametros[i])

            if (archivo == null) {

                var nuevo = {
                    "nombre": parametros[0], "duenio": usuario, "grupo": usuario,
                    "fecha": "oct 09 2020 22:54:00", "permisos": "-rw-r--r--"
                }
                computador.disco.push(nuevo)
                console.log(computador.disco)
            }
            if (archivo != null && verificarPermisosEscritura(archivo)) {
                var aux = archivo
                aux.fecha = "oct 09 2020 22:54:00"
                console.log(computador.disco)

            }
            if (archivo != null && !verificarPermisosEscritura(archivo)) {
                addConsola("touch: no se puede efectuar `touch' sobre '" + parametros[i] +
                    "': Permiso denegado")
            }
        }
    }
}

/**
 * Intenta conectarse a una maquina remota
 * @param {string} parametros Parametros del comando ssh 
 */
function ssh(parametros) {

    if (parametros.length > 1) {
        addConsola("ssh: too many arguments")
    }
    if (parametros.length == 0) {
        addConsola("usage: ssh usuario@ip")

    } else  {
        var nombre = parametros[0].split("@")[0]
        var ip = parametros[0].split("@")[1]
        var comp = obtenerComputador(ip)

        if (comp != null) {

            for (const i in comp.usuarios) {
                if (comp.usuarios[i] == nombre) {
                    hostname.push(comp.hostname)
                    computador = comp
                    login(nombre)
                    return false
                }
            }
            addConsola(parametros[0] + ": Permission denied (publickey,password).")

        } else {
            addConsola("ssh: connect to host " + parametros[0].split("@")[0] +
                " port 22: No route to host")
        }
    }
}

/**
 * Procesa el comando (cat)
 * Intenta leer el contenido de un archivo
 * @param {string[]} parametros la lista de archivos
 */
function cat(parametros) {
    if (parametros.length == 0) {
        addConsola("cat: falta un archivo como argumento")
        return false;
    }
    for (const i in parametros) {
        var archivo = obtenerArchivo(parametros[i])
        if (archivo == null) {
            addConsola("cat: " + parametros[i] + ": No existe el archivo o directorio");
            return false;
        }
        if (verificarPermisosLectura(archivo)) {
            addConsola("Leyendo el contenido del archivo ....")
        } else {
            addConsola("cat: " + parametros[i] + ": Permiso denegado")
        }
    }
}

/**
 * Mira si el usuario activo tiene permisos de lectura en un archivo
 * @param {archivo} archivo Archivo del disco duro a verificar permisos
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
 * Mira si el usuario activo tiene permisos de escritura en un archivo
 * @param {archivo} archivo Archivo del disco duro a verificar permisos
 */
function verificarPermisosEscritura(archivo) {
    var permisos = archivo.permisos
    var propietario = archivo.duenio
    var grupo = archivo.grupo

    if (usuario == propietario) {
        if (permisos[2] == "w") {
            return true
        }
    }
    if (obtenerGrupo(grupo).usuarios.includes(usuario)) {
        if (permisos[5] == "w") {
            return true
        }
    }
    if (permisos[8] == "w") {
        return true
    }
}

/**
 * Mira si el usuario activo tiene permisos de Ejecucion en un archivo
 * @param {archivo} archivo Archivo del disco duro a verificar permisos
 */
function verificarPermisosEjecucion(archivo) {
    var permisos = archivo.permisos
    var propietario = archivo.duenio
    var grupo = archivo.grupo

    if (usuario == propietario) {
        if (permisos[3] == "x") {
            return true
        }
    }
    if (obtenerGrupo(grupo).usuarios.includes(usuario)) {
        if (permisos[6] == "x") {
            return true
        }
    }
    if (permisos[9] == "x") {
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
 * Obtiene un computador a partir de su nombre o direccion IP
 * @param {String} host El hostname o IP del computador a obtener
 */
function obtenerComputador(host) {
    for (const i in computadores) {
        if (computadores.hasOwnProperty(i)) {
            const pc = computadores[i]
            if (pc.hostname == host || pc.IP == host) {
                return pc
            }
        }
    }
    return null
}

/**
 * Procesa el comando (chmod)
 * Cambia los Permisos de un archivo
 * @param {string[]} parametros la lista de archivos
 */
function chmod(parametros) {
    if (parametros.length == 0) {
        addConsola("chmod: falta un operando")
        return false
    }
    if(parametros.length < 2){
        addConsola("chmod: falta un operando despues de «" + parametros[0] + "»")
        return false
    }
    var permisos = crearPermisos(parametros[0]);

    if( !parseInt(parametros[0]) || permisos == null){
        addConsola("chmod: modo invalido «" + parametros[0] + "»")
        return false
    }

    var subparametros = parametros.slice(1, parametros.length)
    for (const i in subparametros) {
        const archivo = obtenerArchivo(subparametros[i])
        if (archivo == null) {
            addConsola("chmod: no se puede acceder a '" + subparametros[i] + "': No existe el archivo o directorio");
            return false;
        }
        archivo.permisos = permisos
    }
}

function crearPermisos(permisos) {
    var aux = "-";
    if (permisos.length > 3) {
        return null
    }
    for (let i = 0; i < 3; i++) {
        var valor = parseInt(permisos[i])
        if (valor > 7) {
            return null
        }
        if (valor >= 4) {
            aux += "r"
            valor -= 4
        } else { aux += "-" }

        if (valor >= 2) {
            aux += "w"
            valor -= 2
        } else { aux += "-" }

        if (valor >= 1) {
            aux += "x"
            valor -= 1
        } else { aux += "-" }
    }
    return aux
}
/**
 * ejecuta un archivo con ./
 * @param {String} comando el archivo a ejecutar
 */
function ejecutar(comando) {
    if (comando[1] == "/") {
        if (comando.length == 2) {
            addConsola("bash: ./: Es un directorio")
        } else {
            var archivo = obtenerArchivo(comando.slice(2))
            if (archivo == null) {
                addConsola("bash: " + comando + ": No existe el archivo o directorio");
                return false;
            }
            if (verificarPermisosEjecucion(archivo)) {
                addConsola("Ejecutando en el archivo ....")
            } else {
                addConsola("bash: " + comando + ": Permiso denegado")
            }
        }
    } else {
        addConsola(".: modo de empleo: nombre de archivo [argumentos]")
    }
}

/**
 * Ejecuta el comando (scp)
 * Intenta Copiar archivos entre máquinas
 * @param {String[]} parametros 
 */
function scp(parametros){
    console.log(parametros.length)
    console.log(parametros)
    //pasar archivo
    if(parametros.length == 2){
        if(obtenerArchivo(parametros[0]) != null){
            var archivo = obtenerArchivo(parametros[0])
            if(!verificarPermisosLectura(archivo)){
                addConsola("permiso denegado")
                return false
            }
            var subparametros = parametros[1].split(":")
            if(subparametros.length == 2){
                var nombre = subparametros[0].split("@")[0]
                var ip = subparametros[0].split("@")[1]
                var comp = obtenerComputador(ip)
                if (comp != null) {
                    const usuarios = comp.usuarios
                    for (const i in usuarios) {
                        if (usuarios.hasOwnProperty(i)) {
                            const u = usuarios[i]
                            if (u == nombre) {
                                if(subparametros[1] == "."){
                                    var nuevo = {
                                        "nombre": archivo.nombre, "duenio": u.nombre, "grupo": u.nombre,
                                        "fecha": "oct 09 2020 22:54:00", "permisos": archivo.permisos
                                    }
                                    comp.disco.push(nuevo)
                                    addConsola("envio exitoso, cambiar despues")
                                    console.log(comp.disco)
                                } else{
                                    const disco = comp.disco
                                    for (const i in disco) {
                                        if (disco.hasOwnProperty(i)) {
                                            const a = disco[i]
                                            if (a.nombre == subparametros[1]) {
                                                if(verificarPermisosEscritura(a)){
                                                    a.fecha = "oct 09 2020 22:54:00"
                                                    a.permisos = archivo.permisos
                                                }else{
                                                 addConsola("permiso denegado")   
                                                }
                                            }
                                        }
                                    }
                                    addConsola("No such file or directory")
                                    return false
                                }
                            }
                        }
                    }
                    addConsola(parametros[0] + "ssh: Could not resolve hostname [nombre ingresado]: Name or service not known lost connection")
                    return false
                } else {
                    addConsola("ssh: connect to host " + parametros[0].split("@")[0] +
                        " port 22: No route to host")
                }
            }else{
                addConsola("usage: agregar algo")
                return false;
            }
        //obtener archivo
        }else{
            var subparametros = parametros[0].split(":")
            if(subparametros.length == 2){
                var nombre = subparametros[0].split("@")[0]
                var ip = subparametros[0].split("@")[1]
                var comp = obtenerComputador(ip)
                var nombreArchivo = subparametros[1]
                
                if (comp != null) {
                    if(comp.usuarios.includes(nombre)){
                        var aux = usuario
                        usuario = nombre
                        var compu = computador
                        computador = comp
                        var file = obtenerArchivo(nombreArchivo)
                        if(file == null){
                            usuario = aux
                            computador = compu
                            addConsola("no existe archivo")
                            return false
                        }
                        if(verificarPermisosEscritura(file)){
                            usuario = aux
                            computador = compu
                            if(parametros[1] == "."){
                                touch([nombreArchivo])
                            }
                            else{
                                touch([parametros[1]])
                            }
                            addConsola("envio exitoso, cambiar despues")
                            console.log(computador.disco)
                            return true
                        } else{
                            usuario = aux
                            computador = compu
                            addConsola("No permisos")
                            return false
                        }                        
                    }else{
                        addConsola(parametros[0] + "ssh: Could not resolve hostname [nombre ingresado]: Name or service not known lost connection")
                        return false
                    }
                } else {
                    addConsola("ssh: connect to host " + parametros[0].split("@")[0] +
                        " port 22: No route to host")
                }
            }else{
                addConsola("usage: agregar algo")
                return false;
            }
        }
    }else{
        addConsola("usage: agregar algo")
        return false;
    }
}