/* ===================================== */
/* ============== EVENTOS ============== */
/* ===================================== */
$( "#btnLogin" ).click(function( event )
{
	$("#divErrorLogin").hide();

	//Valida que ingresaran un usuario y pass en el campo
	if($("#Usuario").val().toLowerCase() != "" && $("#Pass").val().toLowerCase() != "")
	{
		//IniciaSesion($("#Usuario").val().toLowerCase(),$("#Pass").val().toLowerCase());

		//Revisa si que la aplicacion ya tiene datos locales
		if (ExisteLocalStorage("tieneDatos"))
		{
			if (!GetLocalStorage("tieneDatos"))
			{
				//ShowStatusInfo( 'No existen datos locales' );
				IniciaSesionServicio($("#Usuario").val().toLowerCase(),$("#Pass").val().toLowerCase());
			}
			else
			{
				//ShowStatusInfo( 'Si existen datos locales' );
				IniciaSesionLocal($("#Usuario").val().toLowerCase(),$("#Pass").val().toLowerCase());
			}
		}
		else
		{
			//ShowStatusInfo( 'No existen datos locales' );
			IniciaSesionServicio($("#Usuario").val().toLowerCase(),$("#Pass").val().toLowerCase());
		}
	}
	else
	{
		$("#divMensajeError").html("Debes ingresar un usuario y una contraseña para poder iniciar sesión.");
		$("#divErrorLogin").show();
	}
	
	return false; //Es porque el botón es submit, y esta línea hace que no se recargue la página

});
/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
function IniciaSesionLocal( usuario, pass )
{
 db.transaction(function(tx)
 {
	tx.executeSql('SELECT * FROM Usuarios WHERE sUser_Usuario = ? AND sPassword_Usuario = ? ',[ usuario, pass ],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Se encontró al menos un registro
				SetLocalStorage("usuario_nombre", data.rows[0].sNombre_Completo_Usuario);
				SetLocalStorage("usuario_id", data.rows[0].nId_Usuario);
				SetLocalStorage("usuario_id_empresa", data.rows[0].nId_Empresa);
				SetLocalStorage("usuario_id_bodega", data.rows[0].nId_Bodega);
				SetLocalStorage("usuario_id_perfil",data.rows[0].nId_Perfil_Usuario);

				window.location.href = 'producto_ingresar.html';
			}
			else
			{
				 $("#divMensajeError").html("No reconozco ese usuario y/o contraseña.<br/>Por favor vuelve a intentarlo nuevamente.");
				 $("#divErrorLogin").show();
			}
		},
		function( tx, error ){ console.log( 'Error al obtener el usuario. Error: ' + error.message); });
	},
	function( error ) { console.log( 'Error al obtener el usuario. Error: ' + error); }, 
	function() { console.log( 'Transacción ejecutada'); });
}

function IniciaSesionServicio( usuario, pass )
{
	var os;
	var sNombre_Dispositivo;
	var objMac_Dispositivo;
	var sMac_Dispositivo;

	try
	{
		os = require("os");
		sNombre_Dispositivo = os.hostname();
		objMac_Dispositivo = os.networkInterfaces();
		var sKey = Object.keys(objMac_Dispositivo)[0];
		sMac_Dispositivo = objMac_Dispositivo[sKey][0].mac;
	}
	catch (e)
	{
		sNombre_Dispositivo = "Dispositivo Desconocido - Error Al Detectar";
		sMac_Dispositivo = "00:00:00:00:00:00";
		$("#divMensajeError").html("Error al detectar el dispositivo: " + e.message);
	}

	
	//MostrarObjeto(); FTW
	var parametros = 
	{
		"user" : usuario,
		"pass" : pass,
		"sNombre_Dispositivo" : sNombre_Dispositivo,
		"sMac_Dispositivo" : sMac_Dispositivo
	};

	$.ajax
	({
		type: "POST",
		url: "http://dev.tecnocreativo.cl/Proyectos/servicio_login_importar.php",
		data: parametros,
		//dataType: 'json',
		async: true,
		timeout: 180000,
		beforeSend: function()
		{
			ShowStatusInfo("Conectando al servicio...");
		},
		success: function (json)
		{
			if(json.Ajax["nId_Codigo_Error"] == 0)
			{
				ShowStatusInfo("Datos obtenidos correctamente");

				InsertarTabla_Maestra(json.Tabla_Maestra);
				InsertarTabla_Detalle(json.Tabla_Detalle);
				InsertarEmpresa(json.Empresa);
				InsertarUsuarios(json.Usuarios);
				InsertarPreguntas(json.Pregunta);
				InsertarTrabajador(json.Trabajador);
				
				//Asigna el Id Dispositivo
				SetLocalStorage("nId_Dispositivo",json.Dispositivos.nId_Dispositivo);
				//Asigna true a tieneDatos | Se usa para validar si existen datos locales
				SetLocalStorage("tieneDatos", "true");

				IniciaSesionLocal(json.UsuarioLogin["sUser_Usuario"], json.UsuarioLogin["sPassword_Usuario"]);
			}
			else
			{
				$("#divMensajeError").html("No reconozco ese usuario y/o contraseña.<br/>Por favor vuelve a intentarlo nuevamente.");
				$("#divErrorLogin").show();
				ShowStatusError(json["Ajax"]["sMensaje_Error"]);
			}
		},
		error: function (xhr, status, exception)
		{
			$("#divMensajeError").html("Error al conectarse al servicio");
			var ex = '<br>\nNumero de Excepcion: ' + xhr.status + '<br>\nMensaje de Excepcion: ' + xhr.responseText + '<br>Error: ' + xhr.statusText;
			$("#divMensajeError").html(ex);
			$("#divErrorLogin").show();
		}
	});
}