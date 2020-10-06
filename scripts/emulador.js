/*
 description Emulador de una terminal y varias máquinas en red usando Javascript
 author Julián Esteban Gutiérrez Posada y Carlos Eduardo Gómez Montoya
 email jugutier@uniquindio.edu.co carloseg@uniquindio.edu.co
 licence GNU General Public License  Ver. 3.0 (GNU GPL v3)
 date Octubre 2020
 version 1.1
*/

/**
 * Borra (limpia) todo el contenido de la consola (ver HTML)
 */
function limpiarConsola() {
  document.getElementById( "textoImprimir" ).innerHTML = ""
  document.getElementById( "entrada" ).value           = "";
}

/**
 * Adiciona una texto a la consola de la GUI (Ver HTML)
 * @param texto Texto que se desea adicionar al final de la consola.
 */
function addConsola ( texto ) {
  document.getElementById( "textoImprimir" ).innerHTML += texto + "<br>";
  var consola = document.getElementById( "consola" );
  consola.scrollTop = consola.scrollHeight;
}


/**
 * Proceso de inicio de la terminal
 */
function procesoInicio()
{
    entrada.focus();
}


/**
 * Procesa el evento de teclado. Enter (13) procesa la orden y ESC (27) imprime el JSON
 */
function procesarEntrada( e ) {
	if (e.keyCode == 13) {
		procesarComando ( document.getElementById( "entrada" ) );
	}	
}

/**
 * Procesa el comando enviado como argumento.
 * @param comando a procesar
 */
function procesarComando ( comando ) {
	var comandoParametros = comando.value.split(" ");

	addConsola ( "carloseg@ventas$ " );

    switch ( comandoParametros[0] ){
        case 'clear': 
            procesarClear( comandoParametros );
            break;


        // ...

        default:
            addConsola ( "uqsh: comando no reconocido: " + comandoParametros[0] );
    }

    addConsola ( "" );
    document.getElementById( "entrada" ).value = "";
}

/**
 * Procesa el comando (clear)
 */
function procesarClear ( comandoParametros ) {
    if ( comandoParametros.length > 1 ) {
        addConsola ( "clear: No requiere parámetros." )
    } else {
        limpiarConsola();
    }
}

