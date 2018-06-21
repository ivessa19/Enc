/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
function IngresarMovimientos( nId_Documento_Movimiento,sGlosa_Movimiento,nEntrada_Movimiento, nSalida_Movimiento,nStock_A_La_Fecha,dFecha_Movimiento,dFecha_Registro_Movimiento,nId_Producto,nId_Bodega,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Movimiento)
{
	db.transaction
	(
		function( tx )
		{
			
			var nId_Movimiento = parseInt(GetLocalStorage("Movimientos"));
			nId_Movimiento = nId_Movimiento - 1;
			SetLocalStorage("Movimientos",nId_Movimiento);

			var query = 'INSERT INTO Movimientos ' +
			'(nId_Movimiento,nId_Documento_Movimiento,sGlosa_Movimiento,nEntrada_Movimiento, nSalida_Movimiento,nStock_A_La_Fecha,dFecha_Movimiento,dFecha_Registro_Movimiento,nId_Producto,nId_Bodega,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Movimiento)' +
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
			'?,'+
			'?,'+
			'?)';

			tx.executeSql(query,[nId_Movimiento,nId_Documento_Movimiento,sGlosa_Movimiento,nEntrada_Movimiento, nSalida_Movimiento,nStock_A_La_Fecha,dFecha_Movimiento,dFecha_Registro_Movimiento,nId_Producto,nId_Bodega,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Movimiento],
			function( tx, data )
			{
				ShowStatusInfo("Se inserto el Movimiento correctamente");
				SetLocalStorage("Sincronizado_Movimientos", false);
			},
			function( tx, error )
			{ 
				var nId_Movimiento = parseInt(GetLocalStorage("Movimientos"));
				nId_Movimiento = nId_Movimiento + 1;
				SetLocalStorage("Movimientos",nId_Movimiento);
				console.log( 'Error al insertar el Movimiento. Error: ' + error.message); 
			});
		},
		function( error ) { console.log( 'Error al insertar el Movimiento tx. Error: ' + error); }, 
		function()
		{
			console.log( 'Transacción ejecutada');
			
		}
	);
}