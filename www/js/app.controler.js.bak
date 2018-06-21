/* ===================================== */
/* ========= VARIABLES GLOBALES ======== */
/* ===================================== */
var db;
var tx = {};
tx = new Object();

//Desarrollo
var debug = true;

/* ===================================== */
/* ======== INICIA LA APLICACIÓN ======= */
/* ===================================== */
var app = 
{
	initialize: function()
	{
		AbrirBD();

		//Revisa si que la aplicacion ya tiene las tablas locales creadas
		if (ExisteLocalStorage("tablasCreadas"))
		{
			if (!GetLocalStorage("tablasCreadas"))
			{
				ShowStatusInfo( 'No existen tablas locales' );
				CreaTablasLocales();
			}
			else
			{
				ShowStatusInfo( 'Si existen tablas locales' );
			}
		}
		else
		{
			ShowStatusInfo( 'No existen tablas locales' );
			CreaTablasLocales();
		}
	}
};

app.initialize();

function AbrirBD()
{
	//Si la base de datos existe la abre, y si no existe entonces la crea
	db = openDatabase('bd_coin_amatsu_1', '1', 'Base de Datos de Control de Inventario 1', 100 * 1024);
}

function CreaTablasLocales()
{
	//Crea las tablas
	db.transaction(function(tx)
	{
		ShowStatusInfo( 'Creando tablas...' );


		// -- Crea la tabla Maestra --//
		tx.executeSql('CREATE table if not exists Tabla_Maestra(nId_Tabla_Maestra,sNombre_Tabla_Maestra,dFecha_Registro_Tabla_Maestra,nId_Estado_Sincronizado)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Maestra creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la Tabla Maestra. Error: ' + error.message); } //Error
		);
		
		// -- Crea la tabla Detalle --//
		tx.executeSql('CREATE table if not exists Tabla_Detalle(nId_Tabla_Detalle,sNombre_Tabla_Detalle,dFecha_Registro_Tabla_Detalle,nId_Estado_Sincronizado,nId_Tabla_Maestra)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Detalle creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la Tabla Detalle. Error: ' + error.message); } //Error
		);
		
		// -- Crea la tabla Empresas --//
		tx.executeSql('CREATE table if not exists Empresas(nId_Empresa,sRazon_Social_Empresa,sAbreviatura_Empresa,nId_Estado_Sincronizado)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Empresas creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Empresas. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Bodegas --//
		tx.executeSql('CREATE table if not exists Bodegas(nId_Bodega,sNombre_Bodega,nId_Empresa,nId_Estado_Sincronizado, nId_Dispositivo)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Bodegas creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Bodegas. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Movimientos --//
		tx.executeSql('CREATE table if not exists Movimientos(nId_Movimiento,nId_Documento_Movimiento,sGlosa_Movimiento,nEntrada_Movimiento, nSalida_Movimiento,nStock_A_La_Fecha,dFecha_Movimiento,dFecha_Registro_Movimiento,nId_Producto,nId_Bodega,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Movimiento, nId_Dispositivo, nId_Servidor)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Movimientos creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Movimientos. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Stock --//
		tx.executeSql('CREATE table if not exists Stock(nId_Stock,nId_Producto,nId_Bodega,nStock_Producto, dFecha_Registro_Stock, nId_Empresa)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Stock creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Stock. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Usuarios --//
		tx.executeSql('CREATE table if not exists Usuarios(nId_Usuario,sNombre_Usuario,sApellido_Usuario,sNombre_Completo_Usuario,sUser_Usuario,sPassword_Usuario,dFecha_Registro_Usuario,nId_Bodega,nId_Perfil_Usuario,nId_Estado_Usuario,nId_Empresa,nId_Estado_Sincronizado)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Usuarios creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Usuarios. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Log_Caja --//
		tx.executeSql('CREATE table if not exists Log_Caja(nId_Log_Caja,dFecha_Log_Caja,nMonto_Inicio_Log_Caja,nMonto_Efectivo_Log_Caja,nMonto_Tarjeta_Credito_Log_Caja,nMonto_Tarjeta_Debito_Log_Caja,nMonto_Total_Log_Caja,dFecha_Registro_Log_Caja,nId_Usuario,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Accion, nId_Dispositivo)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Log_Caja creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError( 'Error al crear la tabla Log_Caja. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Productos --//
		tx.executeSql('CREATE table if not exists Productos(nId_Producto,sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto,nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto,nId_Empresa,nId_Estado_Sincronizado, nId_Estado_Producto, nId_Dispositivo, nId_Servidor, nId_Categoria)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Productos creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError('Error al crear la tabla Productos. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Preguntas --// 
		tx.executeSql('CREATE table if not exists Preguntas(nId_Pregunta, nId_Usuario, sPregunta_1, sPregunta_2, sPregunta_3, sPregunta_4, sPregunta_5)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Preguntas creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError('Error al crear la tabla Preguntas. Error: '+ error.message); } //Error
		);

		// -- Crea la tabla Trabajador --// 
		tx.executeSql('CREATE table if not exists Trabajador(nId_Trabajador, sNombre_Trabajador, nCodigo_Trabajador)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Trabajador creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError('Error al crear la tabla Trabajador. Error: '+ error.message); } //Error
		);

		// -- Crea la tabla Categorias --//
		tx.executeSql('CREATE table if not exists Categorias(nId_Categoria,sNombre_Categoria,dFecha_Registro_Categoria,nId_Categoria_Padre,nId_Empresa,nId_Estado_Categoria,nId_Dispositivo,nId_Servidor)', [],
			function( tx, data ) { ShowStatusInfo("Tabla Categorias creada correctamente"); }, //Success
			function( tx, error ){ ShowStatusError('Error al crear la tabla Categorias. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Ventas --//
		tx.executeSql('CREATE table if not exists Ventas(nId_Venta, nNumero_Documento_Venta, nValor_Total_Venta, dFecha_Venta, dFecha_Registro_Venta, nId_Usuario, nId_Forma_Pago_Venta, nId_Empresa, nId_Estado_Sincronizado, nId_Log_Caja, nId_Dispositivo, nId_Servidor)', [],
			function ( tx, data ) { ShowStatusInfo("Tabla Ventas creada correctamente"); }, //Success
			function ( tx, error ){ ShowStatusError('Error al crear la tabla Ventas. Error: ' + error.message); } //Error
		);

		// -- Crea la tabla Detalle Venta --//
		tx.executeSql('CREATE table if not exists Detalles_Venta(nId_Detalle_Venta, nCantidad_Detalle_Venta, nPrecio_Detalle_Venta, dFecha_Registro_Detalle_Venta, nId_Venta, nId_Producto, nId_Empresa, nId_Estado_Sincronizado, nId_Dispositivo, nId_Servidor)', [],
			function ( tx, data ) { ShowStatusInfo("Tabla Detalles Venta creada correctamente"); }, //Success
			function ( tx, error ){ ShowStatusError('Error al crear la tabla Detalles Venta. Error: ' + error.message); } //Error
		);

		//Creacion LocalStorage ID Actual
		SetLocalStorage("Log_Caja", 0);

		//Creación LocalStorage ID Producto Actual
		SetLocalStorage("Productos", 0);

		//Creación LocalStorage ID Movimientos Actual
		SetLocalStorage("Movimientos", 0);

		//Creación LocalStorage ID Stock Actual
		SetLocalStorage("Stock", 0);

		//Creación LocalStorage ID Ventas Actual
		SetLocalStorage("Ventas", 0);
    
    	//Creación LocalStorage ID Detalle Ventas Actual
    	SetLocalStorage("Detalles_Venta", 0);

		//Creación LocalStorage ID Categorias Actual
    	SetLocalStorage("Categorias", 0);
		
		
		/*LOCAL STORAGE PARA SABER SI LAS TABLAS ESTAN SICRONIZADAS*/
		SetLocalStorage("Sincronizado_Tabla_Maestra", false);
		SetLocalStorage("Sincronizado_Tabla_Detalle", false);
		SetLocalStorage("Sincronizado_Empresas", false);
		SetLocalStorage("Sincronizado_Categorias", false);
		SetLocalStorage("Sincronizado_Bodegas", false);
		SetLocalStorage("Sincronizado_Movimientos", false);
		SetLocalStorage("Sincronizado_Stock", false);
		SetLocalStorage("Sincronizado_Usuarios", false);
		SetLocalStorage("Sincronizado_Log_Caja", false);
		SetLocalStorage("Sincronizado_Productos", false);
		SetLocalStorage("Sincronizado_Ventas", false);
		SetLocalStorage("Sincronizado_Detalles_Venta", false);
		SetLocalStorage("Sincronizado_Trabajador", false);
		//SetLocalStorage("Sincronizado_Preguntas", false);

	},
	function( error ) //Transaccion Error
	{
		ShowStatusError( 'Error creando las tablas. Error: ' + error.message);
	},
	function() //Transaccion Termino
	{
		ShowStatusInfo( 'Proceso de creacion de tablas terminado' );
		SetLocalStorage("tablasCreadas", "true");
	});
}

/* ===================================== */
/* ===== INSERTA DATOS PRIMERA VEZ ===== */
/* ===================================== */
function InsertarTabla_Maestra(Tabla_MaestraData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Tabla_Maestra...");

		var query = 'INSERT INTO Tabla_Maestra ' +
		'(nId_Tabla_Maestra,sNombre_Tabla_Maestra,dFecha_Registro_Tabla_Maestra,nId_Estado_Sincronizado) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?)';
		
		//Recorre las empresas (Tabla_Maestra)
		for ( i = 0; i < Tabla_MaestraData.length; i++)
		{
			tx.executeSql(query,
			[
				Tabla_MaestraData[i].nId_Tabla_Maestra ,
				Tabla_MaestraData[i].sNombre_Tabla_Maestra ,
				Tabla_MaestraData[i].dFecha_Registro_Tabla_Maestra,
				Tabla_MaestraData[i].nId_Estado_Sincronizado
			],
			function( tx, data ) { console.log('Tabla_Maestra insertada correctamente'); }, //Success
            function( tx, error ){ console.error('Error al insertar en la Tabla_Maestra'); console.error(error.message); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error en Tabla_Maestra. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Insert en Tabla_Maestra completado correctamente");
		SetLocalStorage("Sincronizado_Tabla_Maestra", true);
	})
}

function InsertarTabla_Detalle(Tabla_DetalleData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Tabla_Detalle...");

		var query = 'INSERT INTO Tabla_Detalle ' +
		'(nId_Tabla_Detalle,sNombre_Tabla_Detalle,dFecha_Registro_Tabla_Detalle,nId_Estado_Sincronizado,nId_Tabla_Maestra) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
			    '?,'+
				'?)';
		
		//Recorre las empresas (EmpresasData)
		for ( i = 0; i < Tabla_DetalleData.length; i++)
		{
			tx.executeSql(query,
			[
				Tabla_DetalleData[i].nId_Tabla_Detalle ,
				Tabla_DetalleData[i].sNombre_Tabla_Detalle ,
				Tabla_DetalleData[i].dFecha_Registro_Tabla_Detalle,
				Tabla_DetalleData[i].nId_Estado_Sincronizado,
				Tabla_DetalleData[i].nId_Tabla_Maestra
			],
			function( tx, data ) { console.log('Tabla_DetalleData insertada correctamente'); }, //Success
            function( tx, error ){ console.error('Error al insertar la Tabla_DetalleData'); console.error(error.message); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar Tabla_DetalleData. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Insert en Tabla_DetalleData completado correctamente");
		SetLocalStorage("Sincronizado_Tabla_Detalle", true);
	})
}

function InsertarEmpresa(EmpresaData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Empresas...");

		var query = 'INSERT INTO Empresas ' +
		'(nId_Empresa, sRazon_Social_Empresa, sAbreviatura_Empresa, nId_Estado_Sincronizado) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?)';

		tx.executeSql(query,
		[
			EmpresaData.nId_Empresa ,
			EmpresaData.sRazon_Social_Empresa ,
			EmpresaData.sAbreviatura_Empresa,
			EmpresaData.nId_Estado_Sincronizado
		],
		function( tx, data ) { console.log('Empresa insertada correctamente'); }, //Success
		function( tx, error ){ console.error('Error al insertar la empresa'); console.error(error.message); } //Error
		);
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar las empresas. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Empresas insertados correctamente");
		SetLocalStorage("Sincronizado_Empresas", true);
	})
}

/*
function InsertarEmpresas(EmpresasData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Empresas...");

		var query = 'INSERT INTO Empresas ' +
		'(nId_Empresa, sRazon_Social_Empresa, dFecha_Registro_Empresa, nId_Estado_Sincronizado) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?)';
		
		//Recorre las empresas (EmpresasData)
		for ( i = 0; i < EmpresasData.length; i++)
		{
			tx.executeSql(query,
			[
				EmpresasData[i].nId_Empresa ,
				EmpresasData[i].sRazon_Social_Empresa ,
				EmpresasData[i].dFecha_Registro_Empresa,
				EmpresasData[i].nId_Estado_Sincronizado
			],
			function( tx, data ) { console.log('Empresa insertada correctamente'); }, //Success
            function( tx, error ){ console.error('Error al insertar la empresa'); console.error(error.message); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar las empresas. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Empresas insertados correctamente");
		SetLocalStorage("Sincronizado_Empresas", true);
	})
}
*/

function InsertarBodegas(BodegasData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Bodegas...");

		var query = 'INSERT INTO Bodegas ' +
		'(nId_Bodega, sNombre_Bodega, nId_Empresa, nId_Estado_Sincronizado, nId_Dispositivo) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				parseInt(GetLocalStorage("nId_Dispositivo")) + ')';
		
		//Recorre las empresas (BodegasData)
		for ( i = 0; i < BodegasData.length; i++)
		{
			tx.executeSql(query,
			[
				BodegasData[i].nId_Bodega ,
				BodegasData[i].sNombre_Bodega ,
				BodegasData[i].nId_Empresa,
				BodegasData[i].nId_Estado_Sincronizado
			],
			function( tx, data ) { console.log('Bodega insertada correctamente'); }, //Success
            function( tx, error ){ console.error('Error al insertar la Bodega'); console.log( error.message ); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar las Bodega. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Bodega insertada correctamente");
		SetLocalStorage("Sincronizado_Bodegas", true);
	})
}

function InsertarUsuarios(UsuariosData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Usuarios...");

		var query = 'INSERT INTO Usuarios ' +
		'(nId_Usuario,sNombre_Usuario,sApellido_Usuario,sNombre_Completo_Usuario,sUser_Usuario,sPassword_Usuario,dFecha_Registro_Usuario,nId_Bodega,nId_Perfil_Usuario,nId_Estado_Usuario,nId_Empresa,nId_Estado_Sincronizado) ' +
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
				'?)';

		//Recorre los usuarios (UuariosData)
		for ( i = 0; i < UsuariosData.length; i++)
		{
			tx.executeSql(query,
			[
				UsuariosData[i].nId_Usuario,
				UsuariosData[i].sNombre_Usuario,
				UsuariosData[i].sApellido_Usuario,
				UsuariosData[i].sNombre_Completo_Usuario,
				UsuariosData[i].sUser_Usuario,
				UsuariosData[i].sPassword_Usuario,
				UsuariosData[i].dFecha_Registro_Usuario,
				UsuariosData[i].nId_Bodega,
				UsuariosData[i].nId_Perfil_Usuario,				UsuariosData[i].nId_Estado_Usuario,
				UsuariosData[i].nId_Empresa,
				UsuariosData[i].nId_Estado_Sincronizado
			],
			function( tx, data ) { console.log('Usuario insertado correctamente'); }, //Success
            function( tx, error ){ alert("Error al insertar el usuario\nError: " + error.message); console.log('Error al insertar el usuario'); console.log( JSON.stringify(error) ); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar los usuarios. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Usuarios insertados correctamente");
		SetLocalStorage("Sincronizado_Usuarios", true);
	})
}

function InsertarTrabajador(TrabajadorData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Trabajador...");

		var query = 'INSERT INTO Trabajador ' +
		'(nId_Trabajador,sNombre_Trabajador,nCodigo_Trabajador) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?)';

		//Recorre los usuarios (UuariosData)
		for ( i = 0; i < TrabajadorData.length; i++)
		{
			tx.executeSql(query,
			[
				TrabajadorData[i].nId_Trabajador,
				TrabajadorData[i].sNombre_Trabajador,
				TrabajadorData[i].nCodigo_Trabajador
			],
			function( tx, data ) { console.log('Trabajador insertado correctamente'); }, //Success
            function( tx, error ){ alert("Error al insertar el trabajador\nError: " + error.message); console.log('Error al insertar el usuario'); console.log( JSON.stringify(error) ); } //Error
			);
		}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar los trabajador. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Trabajador insertados correctamente");
		SetLocalStorage("Sincronizado_Trabajador", true);
	})
}

function InsertarProductos(ProductosData)
{
	if(ProductosData != null)
	{
		db.transaction(function(tx)
		{
			ShowStatusInfo("Insertando Productos...");

			var query = 'INSERT INTO Productos ' +
			'(nId_Producto, sCodigo_Barra_Producto, sNombre_Producto, sDescripcion_Producto, nPrecio_Producto, nStock_Producto, nStock_Critico_Producto, dFecha_Registro_Producto, nId_Dispositivo, nId_Estado_Producto, nId_Empresa, nId_Estado_Sincronizado, nId_Servidor, nId_Categoria) ' +
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
					'?,'+
					'?)';

			//Recorre los productos (ProductosData)
			for ( i = 0; i < ProductosData.length; i++)
			{
				tx.executeSql(query,
				[
					ProductosData[i].nId_Producto,
					ProductosData[i].sCodigo_Barra_Producto,
					ProductosData[i].sNombre_Producto,
					ProductosData[i].sDescripcion_Producto,
					ProductosData[i].nPrecio_Producto,
					ProductosData[i].nStock_Producto,
					ProductosData[i].nStock_Critico_Producto,
					ProductosData[i].dFecha_Registro_Producto,
					ProductosData[i].nId_Dispositivo,
					ProductosData[i].nId_Estado_Producto,
					ProductosData[i].nId_Empresa,
					ProductosData[i].nId_Estado_Sincronizado,
					ProductosData[i].nId_Producto,
					ProductosData[i].nId_Categoria
				],
				function( tx, data ) { console.log('Producto insertado correctamente'); }, //Success
				function( tx, error ){ alert("Error al insertar el producto\nError: " + error.message); console.error('Error al insertar el producto'); console.error( error.message ); } //Error
				);
			}
		},
		function( error )
		{
			ShowStatusError( 'Error al insertar los Productos. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Productos insertados correctamente");
			SetLocalStorage("Sincronizado_Productos", true);
		})
	}
}

function InsertarStock(StockData)
{
	if(StockData != null)
	{
		db.transaction(function(tx)
		{
			ShowStatusInfo("Insertando Stock...");

			var query = 'INSERT INTO Stock ' +
			'(nId_Stock, nId_Producto, nId_Bodega, nStock_Producto, dFecha_Registro_Stock, nId_Empresa) ' +
			'VALUES (' +
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?)';

			//Recorre los stock (StockData)
			for ( i = 0; i < StockData.length; i++)
			{
				tx.executeSql
				(query,
				[
					StockData[i].nId_Stock,
					StockData[i].nId_Producto,
					StockData[i].nId_Bodega,
					StockData[i].nStock_Producto,
					StockData[i].dFecha_Registro_Stock,
					StockData[i].nId_Empresa
				],
				function( tx, data ) { console.log('Stock insertado correctamente'); }, //Success
				function( tx, error ){ alert("Error al insertar el stock\nError: " + error.message); console.error('Error al insertar el stock'); console.error( error.message ); }
				);
			}
		},
		function( error )
		{
			ShowStatusError( 'Error al insertar los stock de productos. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Stock insertados correctamente");
			SetLocalStorage("Sincronizado_Stock", true);
		})
	}
}


function InsertarCategorias(CategoriasData)
{
	if(CategoriasData != null)
	{
		db.transaction(function(tx)
		{
			ShowStatusInfo("Insertando Categorias...");

			var query = 'INSERT INTO Categorias ' +
			'(nId_Categoria,sNombre_Categoria,dFecha_Registro_Categoria,nId_Categoria_Padre,nId_Empresa,nId_Estado_Categoria,nId_Dispositivo,nId_Servidor) ' +
			'VALUES (' +
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?,'+
					'?)';

			//Recorre las categorias(CategoriasData)
			for ( i = 0; i < CategoriasData.length; i++)
			{
				tx.executeSql
				(query,
				[
					CategoriasData[i].nId_Categoria,
					CategoriasData[i].sNombre_Categoria,
					CategoriasData[i].dFecha_Registro_Categoria,
					CategoriasData[i].nId_Categoria_Padre,
					CategoriasData[i].nId_Empresa,
					CategoriasData[i].nId_Estado_Categoria,
					CategoriasData[i].nId_Dispositivo,
					0
				],
				function( tx, data ) { console.log('Categoria insertada correctamente'); }, //Success
				function( tx, error ){ alert("Error al insertar la categoria\nError: " + error.message); console.error('Error al insertar la categoria'); console.error( error.message ); }
				);
			}
		},
		function( error )
		{
			ShowStatusError( 'Error al insertar las categorias. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Categorias insertadas correctamente");
			SetLocalStorage("Sincronizado_Categorias", true);
		})
	}
}

function InsertarPreguntas(PreguntaData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Preguntas...");

		var query = 'INSERT INTO Preguntas ' +
		'(nId_Pregunta, nId_Usuario, sPregunta_1, sPregunta_2, sPregunta_3, sPregunta_4, sPregunta_5) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?)';

			tx.executeSql(query,
			[
				PreguntaData.nId_Pregunta ,
				PreguntaData.nId_Usuario ,
				PreguntaData.sPregunta_1,
				PreguntaData.sPregunta_2,
				PreguntaData.sPregunta_3,
				PreguntaData.sPregunta_4,
				PreguntaData.sPregunta_5
			],
			function( tx, data ) { console.log('Preguntas insertada correctamente'); }, //Success
            function( tx, error ){ console.error('Error al insertar la preguntas'); console.error(error.message); } //Error
			);
		
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar las preguntas. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Preguntas insertados correctamente");
		SetLocalStorage("Sincronizado_Preguntas", true);
	})
}
function InsertarTrabajador(TrabajadorData)
{
	db.transaction(function(tx)
	{
		ShowStatusInfo("Insertando Trabajador...");

		var query = 'INSERT INTO Trabajador ' +
		'(nId_Trabajador, sNombre_Trabajador, nCodigo_Trabajador ) ' +
		'VALUES (' +
				'?,'+
				'?,'+
				'?)';

			//Recorre las categorias(CategoriasData)
			for ( i = 0; i < TrabajadorData.length; i++)
			{
				tx.executeSql
				(query,
				[
					TrabajadorData[i].nId_Trabajador,
					TrabajadorData[i].sNombre_Trabajador,
					TrabajadorData[i].nCodigo_Trabajador
					
				],
				function( tx, data ) { console.log('Trabajador insertada correctamente'); }, //Success
				function( tx, error ){ alert("Error al insertar la trabajador\nError: " + error.message); console.error('Error al insertar la categoria'); console.error( error.message ); }
				);
			}
	},
	function( error )
	{
		ShowStatusError( 'Error al insertar las trabajador. Error: ' + error.message);
	},
	function( )
	{
		ShowStatusInfo("Trabajador insertados correctamente");
		SetLocalStorage("Sincronizado_Trabajador", true);
	})
}

/* ================================================== */
/* ============== Carga Todos Los Includes ========== */
/* ================================================== */
function CargaMenu()
{
	$("#divMenu").load("menu.html");
	$("#divFooter").load("footer.html");
}