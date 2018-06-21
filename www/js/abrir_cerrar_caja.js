/* ===================================== */
/* ============== EVENTOS ============== */
/* ===================================== */
$( "#btnAbrirCaja" ).click(function( event ) 
{
	$("#divWarningLogin").hide();

	var monto_abrir_caja = $("#txtMontoAbrirCaja").val();

	if(monto_abrir_caja != "")
	{	
		if(EsNumerico(monto_abrir_caja))
		{
			//var monto_abrir_caja=$("#txtMontoAbrirCaja").val();
			var fecha_actual = GetFechaActual();
			var id_empresa =1;
			var id_usuario = parseInt(GetLocalStorage("usuario_id"));

			IngresarAbrirCaja(id_usuario, fecha_actual, monto_abrir_caja, id_empresa);
		}
		else
		{
			$("#divMensajeWarning").html("El monto ingresado debe ser un valor numérico");
			$("#divWarningLogin").show();
		}
	}
	else
	{
		$("#divMensajeWarning").html("Por favor ingrese un monto");
		$("#divWarningLogin").show();
	}
	return false;
});

$( "#btnCerrarCaja" ).click(function( event ) 
{	
	IngresarCerrarCaja();
});


/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
function Init()
{
	$("#txtMontoAbrirCaja").focus();
}

function IngresarAbrirCaja( nId_Usuario, dFecha_Log_Caja, nMonto_Inicio_Log_Caja, nId_Empresa)
{
	db.transaction
	(
		function( tx )
		{
			var id_dispositivo = GetLocalStorage("nId_Dispositivo");
			var id_actual_log_caja = GetLocalStorage("Log_Caja");
			id_actual_log_caja=id_actual_log_caja-1;
			SetLocalStorage("Log_Caja",id_actual_log_caja);

			var query = 'INSERT INTO Log_Caja ' +
			'(nId_Log_Caja,dFecha_Log_Caja,nMonto_Inicio_Log_Caja,nMonto_Efectivo_Log_Caja,nMonto_Tarjeta_Credito_Log_Caja,nMonto_Tarjeta_Debito_Log_Caja,nMonto_Total_Log_Caja,dFecha_Registro_Log_Caja,nId_Usuario,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Accion, nId_Dispositivo)' +
			'VALUES (' +
			'?,'+
			'?,'+
			'?,'+
			'0,'+
			'0,'+
			'0,'+
			'0,'+
			'?,'+
			'?,'+
			'?,'+
			'1,'+
			'1,'+
			'?)';

			tx.executeSql(query,[ id_actual_log_caja, dFecha_Log_Caja, nMonto_Inicio_Log_Caja, dFecha_Log_Caja, nId_Usuario, nId_Empresa, id_dispositivo ],
			function( tx, data )
			{
				ShowStatusInfo("Insert Abrir caja correctamente");
				window.location.href = "home.html";
			},
			function( tx, error )
			{ 
				var id_actual_log_caja = GetLocalStorage("Log_Caja");
				id_actual_log_caja=parseInt(id_actual_log_caja)+1;
				SetLocalStorage("Log_Caja",id_actual_log_caja);

				console.log( 'Error al insertar Log_Caja. Error: ' + error.message); 
			});
		},
		function( error ) { console.log( 'Error al insertar Log_Caja tx. Error: ' + error); }, 
		function()
		{
			console.log( 'Transacción ejecutada');
		}
	);
}
function InitCerrarCaja()
{
	db.transaction(function(tx)
	{
	var nId_Log_Caja = parseInt(GetLocalStorage("Log_Caja")); // parseInt( 
	tx.executeSql("SELECT COALESCE(SUM(Ventas.nValor_Total_Venta),0) AS 'Suma_Venta',COALESCE(Tabla_Detalle.nId_Tabla_Detalle,0) AS 'Forma_Pago', Tabla_Detalle.sNombre_Tabla_Detalle AS 'Nombre_Forma_Pago','' AS 'Nombre_Usuario' "+
				  "FROM Tabla_Detalle "+
				  "LEFT JOIN Ventas "+
				  "ON Tabla_Detalle.nId_Tabla_Detalle = Ventas.nId_Forma_Pago_Venta  "+
				  "AND Ventas.nId_Log_Caja =? "+
				  "WHERE Tabla_Detalle.nId_Tabla_Maestra=5 "+
				  "GROUP BY Nombre_Forma_Pago "+
				  "UNION "+
				  "SELECT nMonto_Inicio_Log_Caja AS 'Suma_Venta',-1 AS 'Forma_Pago','Monto Inicio' AS 'Nombre_Forma_Pago', Usuarios.sNombre_Completo_Usuario AS 'Nombre_Usuario' "+
				  "FROM Log_Caja "+
				  "LEFT JOIN Usuarios "+
				  "ON Log_Caja.nId_Usuario = Usuarios.nId_Usuario "+
				  "WHERE nId_Log_Caja =? "+
				  "ORDER BY Forma_Pago",[nId_Log_Caja,nId_Log_Caja],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				
				var dFecha_Log_Caja = FormatoFechaString(GetFechaActual());
				var sNombre_Usuario = String(data.rows.item(0).Nombre_Usuario);
				var nMonto_Inicio_Log_Caja = String(FormatoNumeroDecimal(data.rows.item(0).Suma_Venta));
				var nMonto_Efectivo_Log_Caja = String(FormatoNumeroDecimal(data.rows.item(1).Suma_Venta));
				var nMonto_Tarjeta_Debito_Log_Caja = String(FormatoNumeroDecimal(data.rows.item(2).Suma_Venta));
				var nMonto_Tarjeta_Credito_Log_Caja = String(FormatoNumeroDecimal(data.rows.item(3).Suma_Venta));
				var nMonto_Total_Log_Caja =String(FormatoNumeroDecimal(parseInt(data.rows.item(0).Suma_Venta) + parseInt(data.rows.item(1).Suma_Venta)));
				$("#lblsNombreVendedor").html(sNombre_Usuario);
				$("#lblFecha").html(dFecha_Log_Caja);
				$("#lblTotalAbrir_Caja").html(nMonto_Inicio_Log_Caja);
				$("#lblTotalEfectivo").html(nMonto_Efectivo_Log_Caja);
				$("#lblTotalDebito").html(nMonto_Tarjeta_Debito_Log_Caja);
				$("#lblTotalCredito").html(nMonto_Tarjeta_Credito_Log_Caja);
				$("#lblTotalFinal").html(nMonto_Total_Log_Caja);
				
				

			}
			else
			{
				var dFecha_Log_Caja = GetFechaActual();	
				$("#lblFecha").html(dFecha_Log_Caja);$
			}
		},
		function( tx, error ){ console.log( 'Error al obtener los totales de venta. ' + error.message); alert(error.message); });
	},
	function( error ) { console.log( 'Error al obtener los totales de venta. ' + error); }, 
	function() { console.log( 'Transacción ejecutada'); });
}
function IngresarCerrarCaja()
{
 db.transaction(function(tx)
 {
	var nId_Log_Caja = parseInt(GetLocalStorage("Log_Caja")); //parseInt( 
	tx.executeSql("SELECT COALESCE(SUM(Ventas.nValor_Total_Venta),0) AS 'Suma_Venta',COALESCE(Tabla_Detalle.nId_Tabla_Detalle,0) AS 'Forma_Pago', Tabla_Detalle.sNombre_Tabla_Detalle AS 'Nombre_Forma_Pago' "+
				  "FROM Tabla_Detalle "+
				  "LEFT JOIN Ventas "+
				  "ON Tabla_Detalle.nId_Tabla_Detalle = Ventas.nId_Forma_Pago_Venta  "+
				  "AND Ventas.nId_Log_Caja =? "+
				  "WHERE Tabla_Detalle.nId_Tabla_Maestra=5 "+
				  "GROUP BY Nombre_Forma_Pago "+
				  "UNION "+
				  "SELECT nMonto_Inicio_Log_Caja AS 'Suma_Venta',-1 AS 'Forma_Pago','Monto Inicio' AS 'Nombre_Forma_Pago' "+
				  "FROM Log_Caja "+
				  "WHERE nId_Log_Caja =? "+
				  "ORDER BY Forma_Pago",[nId_Log_Caja,nId_Log_Caja],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				var id_dispositivo = GetLocalStorage("nId_Dispositivo");
				nId_Log_Caja=nId_Log_Caja-1;
				SetLocalStorage("Log_Caja", nId_Log_Caja);
				var dFecha_Log_Caja = GetFechaActual();
				var nMonto_Inicio_Log_Caja = String(data.rows.item(0).Suma_Venta);
				var nMonto_Efectivo_Log_Caja = String(data.rows.item(1).Suma_Venta);
				var nMonto_Tarjeta_Debito_Log_Caja = String(data.rows.item(2).Suma_Venta);
				var nMonto_Tarjeta_Credito_Log_Caja = String(data.rows.item(3).Suma_Venta);
				var nMonto_Total_Log_Caja =String(parseInt(data.rows.item(0).Suma_Venta) + parseInt(data.rows.item(1).Suma_Venta));
				var nId_Usuario = parseInt(GetLocalStorage("usuario_id"));
				var nId_Empresa =1; 

				var query = 'INSERT INTO Log_Caja ' +
				'(nId_Log_Caja,dFecha_Log_Caja,nMonto_Inicio_Log_Caja,nMonto_Efectivo_Log_Caja,nMonto_Tarjeta_Credito_Log_Caja,nMonto_Tarjeta_Debito_Log_Caja,nMonto_Total_Log_Caja,dFecha_Registro_Log_Caja,nId_Usuario,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Accion, nId_Dispositivo)' +
				'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'1,'+
				'2,'+
				'?)';
				tx.executeSql(query, [ nId_Log_Caja, dFecha_Log_Caja, nMonto_Inicio_Log_Caja,nMonto_Efectivo_Log_Caja,nMonto_Tarjeta_Credito_Log_Caja,nMonto_Tarjeta_Debito_Log_Caja,nMonto_Total_Log_Caja,dFecha_Log_Caja, nId_Usuario, nId_Empresa, id_dispositivo ],
				function( tx, data )
				{
						ShowStatusInfo("Insert Cerrar caja correctamente");
						window.location.href = "index.html";
				},
				function( tx, error )
				{
						var id_actual_log_caja = GetLocalStorage("Log_Caja");
						id_actual_log_caja=parseInt(id_actual_log_caja)+1;
						SetLocalStorage("Log_Caja",id_actual_log_caja);
						console.log( 'Error al insertar Log_Caja. Error: ' + error.message); 
						alert(error.message);
				});
			}
			else
			{
				nId_Log_Caja=nId_Log_Caja-1;
				SetLocalStorage("Log_Caja", nId_Log_Caja);
				var dFecha_Log_Caja = GetFechaActual();				
				var nId_Usuario = parseInt(GetLocalStorage("usuario_id"));
				var nId_Empresa =1; 

				var query = 'INSERT INTO Log_Caja ' +
				'(nId_Log_Caja,dFecha_Log_Caja,nMonto_Inicio_Log_Caja,nMonto_Efectivo_Log_Caja,nMonto_Tarjeta_Credito_Log_Caja,nMonto_Tarjeta_Debito_Log_Caja,nMonto_Total_Log_Caja,dFecha_Registro_Log_Caja,nId_Usuario,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Accion)' +
				'VALUES (' +
				'?,'+
				'?,'+
				'0,'+
				'0,'+
				'0,'+
				'0,'+
				'0,'+
				'?,'+
				'?,'+
				'?,'+
				'1,'+
				'2)';
				tx.executeSql(query, [ nId_Log_Caja, dFecha_Log_Caja,dFecha_Log_Caja, nId_Usuario, nId_Empresa ],
				function( tx, data )
				{
						ShowStatusInfo("Insert Cerrar caja correctamente");
						window.location.href = "index.html";
				},
				function( tx, error )
				{
						var id_actual_log_caja = GetLocalStorage("Log_Caja");
						id_actual_log_caja=parseInt(id_actual_log_caja)+1;
						SetLocalStorage("Log_Caja",id_actual_log_caja);
						console.log( 'Error al insertar Log_Caja. Error: ' + error.message); 
						alert(error.message);
				});
			}
		},
		function( tx, error ){ console.log( 'Error al obtener los totales de venta. ' + error.message); });
	},
	function( error ) { console.log( 'Error al obtener los totales de venta. ' + error); }, 
	function() { console.log( 'Transacción ejecutada'); });
}