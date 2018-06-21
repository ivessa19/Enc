/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
var swal;
var mensajeNotificacion = "";

function Sincronizar()
{
	mensajeNotificacion = "";

	var sincronizado_Usuarios = GetLocalStorage("Sincronizado_Usuarios");

	if (sincronizado_Usuarios)
	{
		NotificarMensajeInfo("Todos los usuarios se encuentran sincronizados");
		Sincronizar_Productos();
	}
	else
	{
		Sincronizar_Usuario();
	}
}

function Sincronizar_Usuario()
{
	db.transaction(function(tx)
	{
		tx.executeSql('SELECT * FROM Usuarios WHERE  nId_Estado_Sincronizado = 1',[],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				var parametros = 
				{
					"user" : "admin",
					"pass" : "admin",
					"json_usuarios" : JSON.stringify(data.rows)
				};

				$.ajax
				({
					type: "POST",
					url: "http://dev.tecnocreativo.cl/Proyectos/servicio_usuarios_exportar.php",
					data: parametros,
					beforeSend: function(xhr)
					{
						NotificarMensajeInfo("Exportando Usuarios");
					},
					success: function(data)
					{
						
						if(data == "OK")
						{
							SetLocalStorage("Sincronizado_Usuarios", true);
							NotificarMensajeInfo("Los Usuarios se han insertado correctamente");
							Sincronizar_Productos();
						}
						else
						{
							NotificarMensajeError(data);
						}
					},
					error: function (jqXHR, textStatus, errorThrown)
					{
						if (jqXHR.status == 500)
						{
							NotificarMensajeError('error interno del servidor: ' + jqXHR.responseText);
						}
						else
						{
							NotificarMensajeError('Error inesperado.');
						}
					}
				});
			}
			else
			{
				SetLocalStorage("Sincronizado_Usuarios", true);
				Sincronizar_Productos();
			}
		},
		function( tx, error )
		{
			NotificarMensajeError( 'Error al obtener Usuarios.\nError: ' + error.message);
		});
	},
	function( error )
	{
		NotificarMensajeError( 'Error al obtener Usuarios.\nError: ' + error.message);
	});
}

//Productos
function Sincronizar_Productos()
{
	var sincronizado_Productos = GetLocalStorage("Sincronizado_Productos");

	if(sincronizado_Productos)
	{
		var parametros =
		{
			"user" : "admin",
			"pass" : "admin",
			"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")),
			"nId_Bodega" : parseInt(GetLocalStorage("usuario_id_bodega"))
		};

		$.ajax
		({
			type: "POST",
			url: "http://dev.tecnocreativo.cl/Proyectos/servicio_productos_importar.php",
			data: parametros,
			beforeSend: function(xhr)
			{
				NotificarMensajeInfo("importar Productos");
			},
			success: function(data)
			{
				if(data.Ajax["nId_Codigo_Error"] == 0)
				{
					AnalizarProductos(data.Productos, 0);
					//SetLocalStorage("Sincronizado_Productos", true);
					//NotificarMensajeInfo("Los Productos se han insertado correctamente");
					//Sincronizar_Ventas();
				}
				else
				{
					NotificarMensajeError(data);("Ocurrió un error al importar los datos<br/>" + data.Ajax["sMensaje_Error"]);
				}
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					NotificarMensajeError('error interno del servidor: ' + jqXHR.responseText);
				}
				else
				{
					NotificarMensajeError('Error inesperado.');
				}
			}
		});
	}
	else
	{
		db.transaction(function(tx)
		{
			tx.executeSql('SELECT * FROM Productos WHERE  nId_Estado_Sincronizado = 1',[],
			function( tx, data )
			{
				if (data.rows.length > 0)
				{
					//Ajax envia datos al servidor
					var parametros = 
					{
						"user" : "admin",
						"pass" : "admin",
						"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")),
						"nId_Bodega" : parseInt(GetLocalStorage("usuario_id_bodega")),
						"json_productos" : JSON.stringify(data.rows)
					};

					$.ajax
					({
						type: "POST",
						url: "http://dev.tecnocreativo.cl/Proyectos/servicio_productos_exportar.php",
						data: parametros,
						beforeSend: function(xhr)
						{
							NotificarMensajeInfo("Exportando Productos");
						},
						success: function(data)
						{
							if(data.Ajax["nId_Codigo_Error"] == 0)
							{
								AnalizarProductos(data.Productos, 0);
								//SetLocalStorage("Sincronizado_Productos", true);
								//NotificarMensajeInfo("Los Productos se han insertado correctamente");
								//Sincronizar_Ventas();
							}
							else
							{
								NotificarMensajeInfo("Ocurrió un error al sincronizar los datos<br/>" + data.Ajax["sMensaje_Error"]);
							}
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								NotificarMensajeError('error interno del servidor: ' + jqXHR.responseText);
							}
							else
							{
								NotificarMensajeError('Error inesperado.');
							}
						}
					});
				}
				else
				{
					SetLocalStorage("Sincronizado_Productos", true);
					Sincronizar_Ventas();
				}
			},
			function( tx, error )
			{
				NotificarMensajeError( 'Error al obtener Productos . Error: ' + error.message);
			});
		},
		function( error )
		{
			NotificarMensajeError( 'Error al obtener Productos. Error: ' + error.message);
		});
	}
}

function AnalizarProductos(ProductosData, indice_sync_producto)
{
	if (ProductosData.length == indice_sync_producto)
	{
		//Se sale de la función y sigue con la siguiente tabla
		SetLocalStorage("Sincronizado_Productos", true);
		NotificarMensajeInfo("Los productos se han analizado correctamente");
		Sincronizar_Ventas();
	}
	else
	{
		db.transaction(function(tx)
		{
			var query = 'SELECT 1 FROM Productos WHERE nId_Producto = ?';

			tx.executeSql
			(query, [ ProductosData[indice_sync_producto].nId_Producto ],
				function( tx, data )
				{
					if (data.rows.length > 0)
					{
						//Modifica todos los valores del producto
						console.log('El producto existe.');

						db.transaction(function(tx)
						{
							var query = "UPDATE Productos " +
							"SET sCodigo_Barra_Producto = ?, " +
							"sNombre_Producto = ?, " +
							"sDescripcion_Producto = ?, " +
							"nPrecio_Producto = ?, " +
							"nStock_Producto = ?, " +
							"nStock_Critico_Producto = ?, " +
							"dFecha_Registro_Producto = ?, " +
							"nId_Estado_Producto = ?, " +
							"nId_Categoria = ? " +
							"WHERE nId_Producto = ? ";

							var nId_Producto = ProductosData[indice_sync_producto].nId_Producto;
							var sCodigo_Barra_Producto = ProductosData[indice_sync_producto].sCodigo_Barra_Producto;
							var sNombre_Producto = ProductosData[indice_sync_producto].sNombre_Producto;
							var sDescripcion_Producto = ProductosData[indice_sync_producto].sDescripcion_Producto;
							var nPrecio_Producto = ProductosData[indice_sync_producto].nPrecio_Producto;
							var nStock_Producto = ProductosData[indice_sync_producto].nStock_Producto;
							var nStock_Critico_Producto = ProductosData[indice_sync_producto].nStock_Critico_Producto;
							var dFecha_Registro_Producto = ProductosData[indice_sync_producto].dFecha_Registro_Producto;
							var nId_Estado_Producto = ProductosData[indice_sync_producto].nId_Estado_Producto;
							var nId_Categoria = ProductosData[indice_sync_producto].nId_Categoria;
							var nId_Dispositivo = ProductosData[indice_sync_producto].nId_Dispositivo;

							tx.executeSql(query,[sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto, nId_Estado_Producto, nId_Categoria, nId_Producto],
								function( tx, data )
								{
									console.log("Producto actualizado correctamente");
									indice_sync_producto++;
									//alert("Producto actualizado correctamente");
									AnalizarProductos(ProductosData, indice_sync_producto);
								},
								function( tx, error )
								{          
									NotificarMensajeError( 'Error al actualizar el producto' + error.message );
								}
							);
						},
						function( error )
						{
							NotificarMensajeError( 'Error al insertar Productos tx. Error: ' + error.message);
						}, 
						function()
						{
							console.log( 'Transacción ejecutada');
						});
					}
					else
					{
						console.log('El producto no existe con ese ID.');

						if (ProductosData[indice_sync_producto].nId_Dispositivo == parseInt(GetLocalStorage("nId_Dispositivo")))
						{
							//Actualiza la columna nId_Servidor del Producto con el ID generado en la MySql
							console.info("Actualiza el nId_Servidor del Producto");

							var query = 'UPDATE Productos SET nId_Servidor = ?, nId_Estado_Sincronizado = 2 WHERE nId_Producto = ?';

							tx.executeSql
							(query, [ ProductosData[indice_sync_producto].nId_Producto, ProductosData[indice_sync_producto].nId_Local ],
								function( tx, data )
								{
									console.log('El producto fue actualizado correctamente.');
									indice_sync_producto++;
									AnalizarProductos(ProductosData, indice_sync_producto);
								},
								function( tx, error )
								{
									NotificarMensajeError('Error al actualizar el producto' + error.message );
								}
							);
						}
						else
						{
							//Inserta el Producto en la tabla
							console.info("Inserta el Producto en la tabla");

							var query = 'INSERT INTO Productos ' +
							'(nId_Producto,sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto,nId_Empresa, nId_Estado_Sincronizado, nId_Dispositivo, nId_Estado_Producto, nId_Servidor, nId_Categoria)' +
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
							'2,'+
							'?,'+
							'7,'+
							'?,'+
							'?)';

							var nId_Producto = ProductosData[indice_sync_producto].nId_Producto;
							var sCodigo_Barra_Producto = ProductosData[indice_sync_producto].sCodigo_Barra_Producto;
							var sNombre_Producto = ProductosData[indice_sync_producto].sNombre_Producto;
							var sDescripcion_Producto = ProductosData[indice_sync_producto].sDescripcion_Producto;
							var nPrecio_Producto = ProductosData[indice_sync_producto].nPrecio_Producto;
							var nStock_Producto = ProductosData[indice_sync_producto].nStock_Producto;
							var nStock_Critico_Producto = ProductosData[indice_sync_producto].nStock_Critico_Producto;
							var dFecha_Registro_Producto = ProductosData[indice_sync_producto].dFecha_Registro_Producto;
							var nId_Empresa = ProductosData[indice_sync_producto].nId_Empresa;
							var nId_Dispositivo = ProductosData[indice_sync_producto].nId_Dispositivo;
							var nId_Categoria = ProductosData[indice_sync_producto].nId_Categoria;
							//var nId_Dispositivo = parseInt(GetLocalStorage("nId_Dispositivo"));

							tx.executeSql
							(query,[nId_Producto,sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto, nId_Empresa, nId_Dispositivo, nId_Producto, nId_Categoria],
								function( tx, data )
								{
									ShowStatusInfo("Insert Productos correctamente");
									indice_sync_producto++;
									AnalizarProductos(ProductosData, indice_sync_producto);
								},
								function( tx, error )
								{
									NotificarMensajeError( 'Error al insertar el producto. Error: ' + error.message);
								}
							);
						}
					}
				},
				function( tx, error )
				{
					NotificarMensajeError("Error al consultar por el producto\nError: " + error.message);
					console.error('Error al consultar el producto');
					console.error( error.message );
				}
			);
		},
		function( error )
		{
			NotificarMensajeError( 'Error al consultar el producto tx. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Terminó de analizar el producto tx");
		})
	}
}

//Ventas
function Sincronizar_Ventas()
{
	var sincronizado_Ventas = GetLocalStorage("Sincronizado_Ventas");

	if(sincronizado_Ventas)
	{
		NotificarMensajeInfo("Todas las Ventas se encuentran sincronizadas");
		Sincronizar_Detalles_Venta();
	}
	else
	{
		db.transaction(function(tx)
		{
			tx.executeSql('SELECT * FROM Ventas WHERE  nId_Estado_Sincronizado = 1',[],
			function( tx, data )
			{
				if (data.rows.length > 0)
				{
					var parametros = 
					{
						"user" : "admin",
						"pass" : "admin",
						"nId_Usuario" : parseInt(GetLocalStorage("usuario_id")),
						"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")),
						"nId_Bodega" : parseInt(GetLocalStorage("usuario_id_bodega")),
						"json_ventas" : JSON.stringify(data.rows)
					};
						
					$.ajax
					({
						type: "POST",
						url: "http://dev.tecnocreativo.cl/Proyectos/servicio_ventas_exportar.php",
						data: parametros,
						beforeSend: function(xhr)
						{
							NotificarMensajeInfo("Exportando Ventas");								
						},
						success: function(data)
						{
							if(data.Ajax["nId_Codigo_Error"] == 0)
							{
								AnalizarVentas(data.Ventas, 0);
								//SetLocalStorage("Sincronizado_Ventas", true);
								//NotificarMensajeInfo("Los Ventas se han insertado correctamente");
								//Sincronizar_Detalles_Venta();
							}
							else
							{
								NotificarMensajeError("Ocurrió un error al sincronizar los datos\n" + data.Ajax["sMensaje_Error"]);
							}
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								NotificarMensajeError('error interno del servidor: ' + jqXHR.responseText);
							}
							else
							{
								NotificarMensajeError('Error inesperado en el servicio que exporta las ventas.');
							}
						}
					});
				}
				else
				{
					SetLocalStorage("Sincronizado_Ventas", true);
					//AnalizarVentas(data.Ventas, 0); //No puede analizar las ventas, ya que no hay ventas por analizar
					Sincronizar_Detalles_Venta();
				}
			},
			function( tx, error )
			{
				NotificarMensajeError( 'Error al obtener Ventas.\nError: ' + error.message);
			});
		},
		function( error )
		{
			NotificarMensajeError( 'Error al obtener Ventas.\nError: ' + error.message);
		});
	}
}

function AnalizarVentas(VentasData, indice_sync_venta)
{
	if (VentasData.length == indice_sync_venta)
	{
		//Se sale de la función y sigue con la siguiente tabla
		SetLocalStorage("Sincronizado_Ventas", true);
		NotificarMensajeInfo("Las ventas se han analizado correctamente");
		Sincronizar_Detalles_Venta();
	}
	else
	{
		db.transaction(function(tx)
		{
			var query = 'SELECT 1 FROM Ventas WHERE nId_Venta = ?';

			tx.executeSql
			(query, [ VentasData[indice_sync_venta].nId_Venta ],
				function( tx, data )
				{
					if (data.rows.length > 0)
					{
						//Modifica todos los valores de la venta						
						console.warn('La venta existe. Pero las ventas no se modifican');
						indice_sync_venta++;
						AnalizarVentas(VentasData, indice_sync_venta);
					}
					else
					{
						console.log('La venta no existe con ese ID.');

						if (VentasData[indice_sync_venta].nId_Dispositivo == parseInt(GetLocalStorage("nId_Dispositivo")))
						{
							//Actualiza la columna nId_Servidor de la venta con el ID generado en la MySql
							console.info("Actualiza el nId_Servidor de la venta");

							var query = 'UPDATE Ventas SET nId_Servidor = ?, nId_Estado_Sincronizado = 2 WHERE nId_Venta = ?';

							tx.executeSql
							(query, [ VentasData[indice_sync_venta].nId_Venta, VentasData[indice_sync_venta].nId_Local ],
								function( tx, data )
								{
									console.log('La venta fue actualizada correctamente.');
									indice_sync_venta++;
									AnalizarVentas(VentasData, indice_sync_venta);
								},
								function( tx, error )
								{
									NotificarMensajeError('Error al actualizar la venta'+ error.message );
								}
							);
						}
						else
						{
							//Inserta la venta en la tabla
							console.warn("Inserta la venta en la tabla. Pero por ahora solo necesitamos las ventas propias");
							indice_sync_venta++;
							AnalizarVentas(VentasData, indice_sync_venta);
						}
					}
				},
				function( tx, error )
				{
					NotificarMensajeError("Error al consultar por la venta\nError: " + error.message);
					console.error('Error al consultar la venta');
					console.error( error.message );
				}
			);
		},
		function( error )
		{
			NotificarMensajeError( 'Error al consultar la venta tx. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Terminó de analizar la venta tx");
		})
	}
}

//Detalles Venta
function Sincronizar_Detalles_Venta()
{
	var sincronizado_Detalles_Venta = GetLocalStorage("Sincronizado_Detalles_Venta");

	if(sincronizado_Detalles_Venta)
	{
		NotificarMensajeInfo("Todos los Detalles de las Ventas se encuentran sincronizados");
		Sincronizar_Movimientos();
	}
	else
	{
		db.transaction(function(tx)
		{
			tx.executeSql('SELECT * FROM Detalles_Venta WHERE  nId_Estado_Sincronizado = 1',[],
			function( tx, data )
			{
				if (data.rows.length > 0)
				{
					var parametros = 
					{
						"user" : "admin",
						"pass" : "admin",
						"nId_Usuario" : parseInt(GetLocalStorage("usuario_id")),
						"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")),
						"nId_Bodega" : parseInt(GetLocalStorage("usuario_id_bodega")),
						"json_detalles_venta" : JSON.stringify(data.rows)
					};
						
					$.ajax
					({
						type: "POST",
						url: "http://dev.tecnocreativo.cl/Proyectos/servicio_detalles_venta_exportar.php",
						data: parametros,
						beforeSend: function(xhr)
						{
							NotificarMensajeInfo("Exportando el detalle de las Ventas");								
						},
						success: function(data)
						{
							if(data.Ajax["nId_Codigo_Error"] == 0)
							{
								//SetLocalStorage("Sincronizado_Detalles_Venta", true);
								//NotificarMensajeInfo("Los detalles de las ventas se han insertado correctamente");
								//NotificarMensajeExito();
								AnalizarDetallesVentas(data.Detalles_Venta, 0);
							}
							else
							{
								NotificarMensajeInfo("Ocurrió un error al sincronizar los datos<br/>" + data.Ajax["sMensaje_Error"]);
							}
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								NotificarMensajeError('Error interno del servidor: ' + jqXHR.responseText);
							}
							else
							{
								NotificarMensajeError('Error inesperado.');
							}
						}
					});
				}
				else
				{
					SetLocalStorage("Sincronizado_Detalles_Venta", true);
					Sincronizar_Movimientos();
				}
			},
			function( tx, error )
			{
				NotificarMensajeError(error.message);
			});
		},
		function( error )
		{
			NotificarMensajeError(error.message);
		});
	}
}

function AnalizarDetallesVentas(DetallesVentasData, indice_sync_detalle_venta)
{
	if (DetallesVentasData.length == indice_sync_detalle_venta)
	{
		//Se sale de la función y sigue con la siguiente tabla
		SetLocalStorage("Sincronizado_Detalles_Venta", true);
		NotificarMensajeInfo("Los detalles de las ventas se han insertado correctamente");
		Sincronizar_Movimientos();
	}
	else
	{
		db.transaction(function(tx)
		{
			var query = 'SELECT 1 FROM Detalles_Venta WHERE nId_Detalle_Venta = ?';

			tx.executeSql
			(query, [ DetallesVentasData[indice_sync_detalle_venta].nId_Detalle_Venta ],
				function( tx, data )
				{
					if (data.rows.length > 0)
					{
						//Modifica todos los valores de la venta						
						console.warn('El detalle de venta existe. Pero los detalles de ventas no se modifican');
						indice_sync_detalle_venta++;
						AnalizarDetallesVentas(DetallesVentasData, indice_sync_detalle_venta);
					}
					else
					{
						console.log('El detalle de venta no existe con ese ID.');

						if (DetallesVentasData[indice_sync_detalle_venta].nId_Dispositivo == parseInt(GetLocalStorage("nId_Dispositivo")))
						{
							//Actualiza la columna nId_Servidor de la venta con el ID generado en la MySql
							console.info("Actualiza el nId_Servidor del detalle venta");

							var query = 'UPDATE Detalles_Venta SET nId_Servidor = ?, nId_Estado_Sincronizado = 2 WHERE nId_Detalle_Venta = ?';

							tx.executeSql
							(query, [ DetallesVentasData[indice_sync_detalle_venta].nId_Detalle_Venta, DetallesVentasData[indice_sync_detalle_venta].nId_Local ],
								function( tx, data )
								{
									console.log('El detalle de venta fue actualizado correctamente.');
									indice_sync_detalle_venta++;
									AnalizarDetallesVentas(DetallesVentasData, indice_sync_detalle_venta);
								},
								function( tx, error )
								{
									NotificarMensajeError('Error al actualizar le detalle de venta.\nError: '+ error.message );
								}
							);
						}
						else
						{
							//Inserta el detalle de la venta en la tabla
							console.warn("Inserta el detalle de venta en la tabla. Pero por ahora solo necesitamos los de detalles de las ventas propias");
							indice_sync_detalle_venta++;
							AnalizarDetallesVentas(DetallesVentasData, indice_sync_detalle_venta);
						}
					}
				},
				function( tx, error )
				{
					NotificarMensajeError("Error al consultar por el detalle de la venta\nError: " + error.message);
					console.error('Error al consultar el detalle de venta');
					console.error( error.message );
				}
			);
		},
		function( error )
		{
			NotificarMensajeError( 'Error al consultar el detalle de la venta tx. Error: ' + error.message);
		},
		function( )
		{
			ShowStatusInfo("Terminó de analizar el detalle de venta tx");
		})
	}
}

//Movimientos
function Sincronizar_Movimientos()
{
	var Sincronizado_Movimientos = GetLocalStorage("Sincronizado_Movimientos");

	if(Sincronizado_Movimientos)
	{
		NotificarMensajeInfo("Todos los Movimientos se encuentran sincronizados");
		ActualizaIDTablas(); //FIN
	}
	else
	{
		db.transaction(function(tx)
		{
			tx.executeSql('SELECT * FROM Movimientos WHERE  nId_Estado_Sincronizado = 1',[],
			function( tx, data )
			{
				if (data.rows.length > 0)
				{
					var parametros = 
					{
						"user" : "admin",
						"pass" : "admin",
						"nId_Usuario" : parseInt(GetLocalStorage("usuario_id")),
						"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")),
						"nId_Bodega" : parseInt(GetLocalStorage("usuario_id_bodega")),
						"json_movimientos" : JSON.stringify(data.rows)
					};
						
					$.ajax
					({
						type: "POST",
						url: "http://dev.tecnocreativo.cl/Proyectos/servicio_movimientos_exportar.php",
						data: parametros,
						beforeSend: function(xhr)
						{
							NotificarMensajeInfo("Exportando Movimientos");
						},
						success: function(data)
						{
							if(data != "")
							{
								try
								{
									if(data.Ajax["nId_Codigo_Error"] == 0)
									{
										AnalizarMovimientos(data.Movimientos, 0);
									}
									else
									{
										NotificarMensajeError("Ocurrió un error al sincronizar los datos de movimiento\n" + data.Ajax["sMensaje_Error"]);
									}
								}
								catch (e)
								{
									NotificarMensajeError("Error al sincronizar los movimiento\nEl servicio no tiene el formato esperado\nError: " + e.message);
								}
							}
							else
							{
								NotificarMensajeError("Error en el servicio al momento de sincronizar los datos de movimiento\nError: La respuesta del servicio esta vacia");
							}
						},
						error: function (jqXHR, textStatus, errorThrown)
						{
							if (jqXHR.status == 500)
							{
								NotificarMensajeError('Error interno del servidor: ' + jqXHR.responseText);
							}
							else if (jqXHR.status == 200)
							{
								NotificarMensajeError('Error inesperado.\n' + jqXHR.responseText);
								console.log(jqXHR.responseText);
							}
							else
							{
								NotificarMensajeError('Error inesperado en el servicio que exporta los movimientos.');
							}
						}
					});
				}
				else
				{
					SetLocalStorage("Sincronizado_Movimientos", true);
					//AnalizarMovimientos(data.Movimientos, 0);
					Sincronizar_Stock();
				}
			},
			function( tx, error )
			{
				NotificarMensajeError( 'Error al obtener los Movimientos.\nError: ' + error.message);
			});
		},
		function( error )
		{
			NotificarMensajeError( 'Error al obtener los Movimientos.\nError: ' + error.message);
		});
	}
}

function AnalizarMovimientos(MovimientosData, indice_sync_movimiento)
{
	if(typeof MovimientosData == "undefined")
	{
		Sincronizar_Stock();
	}
	else
	{
		if (MovimientosData.length == indice_sync_movimiento)
		{
			//Se sale de la función y sigue con la siguiente tabla
			SetLocalStorage("Sincronizado_Movimientos", true);
			NotificarMensajeInfo("Los movimientos se han insertado correctamente");
			Sincronizar_Stock();
		}
		else
		{
			db.transaction(function(tx)
			{
				var query = 'SELECT 1 FROM Movimientos WHERE nId_Movimiento = ?';

				tx.executeSql
				(query, [ MovimientosData[indice_sync_movimiento].nId_Movimiento ],
					function( tx, data )
					{
						if (data.rows.length > 0)
						{
							//Modifica todos los valores de la venta						
							console.warn('El movimiento existe. Pero los movimientos no se modifican');
							indice_sync_movimiento++;
							AnalizarMovimientos(MovimientosData, indice_sync_movimiento);
						}
						else
						{
							console.log('El movimiento no existe con ese ID.');

							if (MovimientosData[indice_sync_movimiento].nId_Dispositivo == parseInt(GetLocalStorage("nId_Dispositivo")))
							{
								//Actualiza la columna nId_Servidor de la venta con el ID generado en la MySql
								console.info("Actualiza el nId_Servidor del movimiento");

								var query = 'UPDATE Movimientos SET nId_Servidor = ?, nId_Estado_Sincronizado = 2 WHERE nId_Movimiento = ?';

								tx.executeSql
								(query, [ MovimientosData[indice_sync_movimiento].nId_Movimiento, MovimientosData[indice_sync_movimiento].nId_Local ],
									function( tx, data )
									{
										console.log('El movimiento fue actualizado correctamente.');
										indice_sync_movimiento++;
										AnalizarMovimientos(MovimientosData, indice_sync_movimiento);
									},
									function( tx, error )
									{
										NotificarMensajeError('Error al actualizar le movimiento.\nError: '+ error.message );
									}
								);
							}
							else
							{
								//Inserta el detalle de la venta en la tabla
								console.warn("Inserta el movimiento en la tabla. Pero por ahora solo necesitamos los movimientos propios");
								indice_sync_movimiento++;
								AnalizarMovimientos(MovimientosData, indice_sync_movimiento);
							}
						}
					},
					function( tx, error )
					{
						NotificarMensajeError("Error al consultar por el movimiento\nError: " + error.message);
						console.error('Error al consultar el movimiento');
						console.error( error.message );
					}
				);
			},
			function( error )
			{
				NotificarMensajeError( 'Error al consultar el movimiento tx. Error: ' + error.message);
			},
			function( )
			{
				ShowStatusInfo("Terminó de analizar el movimiento tx");
			})
		}
	}
}

function Sincronizar_Stock()
{
	var parametros = 
	{
		"user"  : "admin",
		"pass"  : "admin",
		"nId_Bodega"  : parseInt(GetLocalStorage("usuario_id_bodega")),
		"nId_Empresa" : parseInt(GetLocalStorage("usuario_id_empresa")) 
	};

	$.ajax
	({
		type: "POST",
		url: "http://dev.tecnocreativo.cl/Proyectos/servicio_stock_importar.php",
		data: parametros,
		beforeSend: function(xhr)
		{
			$("#msjServicio").html("importar stock");
		},
		success: function(data)
		{
			if (data.Ajax["nId_Codigo_Error"] == 0) 
			{
				SetLocalStorage("Sincronizado_Stock", true);
				NotificarMensajeInfo("El stock de producto se han insertado correctamente");
				ActualizaIDTablas(); //FIN
			}
			else
			{
				NotificarMensajeError("Ocurrió un error al importar los datos<br/>" + data.Ajax["sMensaje_Error"]);
			}
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			if (jqXHR.status == 500)
			{
				NotificarMensajeError('error interno del servidor:' + jqXHR.responseText);
			}
			else
			{
				NotificarMensajeError('Error inesperado');
			}
		}
	});
}

//Actualiza los ID de las tablas locales
function ActualizaIDTablas()
{
	db.transaction(function(tx)
  	{
		//ID Productos Detalles Ventas
    	var queryIDProductosDetalleVentas = "" +
			"UPDATE Detalles_Venta " +
			"SET nId_Producto = (SELECT p.nId_Servidor " +
			"				 FROM Productos p " +
			"				 WHERE Detalles_Venta.nId_Producto = p.nId_Producto " +
			"				 ) " +
			"WHERE EXISTS (SELECT p.nId_Servidor " +
			"				 FROM Productos p " +
			"				 WHERE Detalles_Venta.nId_Producto = p.nId_Producto " +
			"				   AND Detalles_Venta.nId_Producto <> p.nId_Servidor " +
			"				   AND p.nId_Servidor IS NOT NULL " +
			"				 ); ";


		tx.executeSql(queryIDProductosDetalleVentas,[],
			function( tx, data )
			{
				console.log("Los ID Productos de la tabla Detalle Venta fueron actualizados correctamente");
				NotificarMensajeInfo("Los ID Productos de la tabla Detalle Venta fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los ID Productos de la tabla Detalle Venta\n' + error.message );
			}
		);

		//ID Venta Detalles Ventas
    	var queryIDVentaDetalleVentas = "" +
			"UPDATE Detalles_Venta " +
			"SET nId_Venta = (SELECT v.nId_Servidor " +
			"				 FROM Ventas v " +
			"				 WHERE Detalles_Venta.nId_Venta = v.nId_Venta " +
			"				 ) " +
			"WHERE EXISTS (SELECT v.nId_Servidor " +
			"				 FROM Ventas v " +
			"				 WHERE Detalles_Venta.nId_Venta = v.nId_Venta " +
			"				   AND Detalles_Venta.nId_Venta <> v.nId_Servidor " +
			"				   AND v.nId_Servidor IS NOT NULL " +
			"				 ); ";

		tx.executeSql(queryIDVentaDetalleVentas,[],
			function( tx, data )
			{
				console.log("Los ID Ventas de la tabla Detalle Venta fueron actualizados correctamente");
				NotificarMensajeInfo("Los ID Ventas de la tabla Detalle Venta fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los ID Ventas de la tabla Detalle Venta\n' + error.message );
			}
		);

		//ID Venta Movimientos
    	var queryIDVentaMovimientos = "" +
			"UPDATE Movimientos " +
			"SET nId_Documento_Movimiento = (SELECT v.nId_Servidor " +
			"				 FROM Ventas v " +
			"				 WHERE Movimientos.nId_Documento_Movimiento = v.nId_Venta " +
			"				 ) " +
			"WHERE EXISTS (SELECT v.nId_Servidor " +
			"				 FROM Ventas v " +
			"				 WHERE Movimientos.nId_Documento_Movimiento = v.nId_Venta " +
			"				   AND Movimientos.nId_Documento_Movimiento <> v.nId_Servidor " +
			"				   AND v.nId_Servidor IS NOT NULL " +
			"				 ); ";

		tx.executeSql(queryIDVentaMovimientos,[],
			function( tx, data )
			{
				console.log("Los ID Ventas del movimiento fueron actualizados correctamente");
				NotificarMensajeInfo("Los ID Venta de la tabla movimientos fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los ID Ventas de la tabla Movimientos\n' + error.message );
			}
		);

		//ID Producto Movimientos
    	var queryIDProductoMovimientos = "" +
			"UPDATE Movimientos " +
			"SET nId_Producto = (SELECT p.nId_Servidor " +
			"				 FROM Productos p " +
			"				 WHERE Movimientos.nId_Producto = p.nId_Producto " +
			"				 ) " +
			"WHERE EXISTS (SELECT p.nId_Servidor " +
			"				 FROM Productos p " +
			"				 WHERE Movimientos.nId_Producto = p.nId_Producto " +
			"				   AND Movimientos.nId_Producto <> p.nId_Servidor " +
			"				   AND p.nId_Servidor IS NOT NULL " +
			"				 ); ";

		tx.executeSql(queryIDProductoMovimientos,[],
			function( tx, data )
			{
				console.log("Los ID Producto del movimiento fueron actualizados correctamente");
				NotificarMensajeInfo("Los ID Producto de la tabla movimientos fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los ID Producto de la tabla Movimientos\n' + error.message );
			}
		);



		//Productos
    	var queryIDProductos = "UPDATE Productos " +
      	"SET nId_Producto = nId_Servidor " +
      	"WHERE nId_Servidor > 0";
    
		tx.executeSql(queryIDProductos,[],
			function( tx, data )
			{
				console.log("Productos actualizados correctamente");
				NotificarMensajeInfo("Los ID de los productos fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los productos con el ID Servidor' + error.message );
			}
		);

		//Ventas
    	var queryIDVentas = "UPDATE Ventas " +
      	"SET nId_Venta = nId_Servidor " +
      	"WHERE nId_Servidor > 0";
    
		tx.executeSql(queryIDVentas,[],
			function( tx, data )
			{
				console.log("Ventas actualizadas correctamente");
				NotificarMensajeInfo("Los ID de las ventas fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar las ventas con el ID Servidor' + error.message );
			}
		);

		//Detalles Ventas
    	var queryIDDetallesVentas = "UPDATE Detalles_Venta " +
      	"SET nId_Detalle_Venta = nId_Servidor " +
      	"WHERE nId_Servidor > 0";
    
		tx.executeSql(queryIDDetallesVentas,[],
			function( tx, data )
			{
				console.log("Detalle de Ventas actualizadas correctamente");
				NotificarMensajeInfo("Los ID de los detalles de las ventas fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los detalles de las ventas con el ID Servidor' + error.message );
			}
		);

		//Movimientos
    	var queryIDMovimientos = "UPDATE Movimientos " +
      	"SET nId_Movimiento = nId_Servidor " +
      	"WHERE nId_Servidor > 0";
    
		tx.executeSql(queryIDMovimientos,[],
			function( tx, data )
			{
				console.log("Movimientos actualizados correctamente");
				NotificarMensajeInfo("Los ID de los Movimientos fueron actualizados correctamente");
			},
			function( tx, error )
			{          
				NotificarMensajeError( 'Error al actualizar los Movimientos con el ID Servidor' + error.message );
			}
		);
	},
  	function( error )
	{
		NotificarMensajeError( 'Error al actualizar los ID de las tablas tx.\nError: ' + error.message);
	}, 
	function()
	{
		NotificarMensajeInfo( 'Termin&oacute; la funci&oacute;n que actualiza los ID de las tablas');
		Sincronizar_ActualizaIDTablas_Servicio();
		//NotificarMensajeExito();
	});
}

//Actualiza los ID de las tablas del servidor
function Sincronizar_ActualizaIDTablas_Servicio()
{
	var parametros = 
	{
		"user" : "admin",
		"pass" : "admin",
		"nId_Dispositivo" : parseInt(GetLocalStorage("nId_Dispositivo"))
	};

	$.ajax
	({
		type: "POST",
		url: "http://dev.tecnocreativo.cl/Proyectos/servicio_actualiza_id_tablas.php",
		data: parametros,
		beforeSend: function(xhr)
		{
			NotificarMensajeInfo("Actualizando los ID de las tablas del servidor...");
		},
		success: function(data)
		{
			if(data != "")
			{
				try
				{
					if(data.Ajax["nId_Codigo_Error"] == 0)
					{
						NotificarMensajeExito();
					}
					else
					{
						NotificarMensajeError("Ocurrió un error al sincronizar los id de las tablas del servicio\n" + data.Ajax["sMensaje_Error"]);
					}
				}
				catch (e)
				{
					NotificarMensajeError("Error al sincronizar los id de las tablas del servicio\nEl servicio no tiene el formato esperado\nError" + e.message);
				}
			}
			else
			{
				NotificarMensajeError("Error en el servicio al momento de sincronizar los id de las tablas del servicio\nError: La respuesta del servicio esta vacia");
			}
		},
		error: function (jqXHR, textStatus, errorThrown)
		{
			if (jqXHR.status == 500)
			{
				NotificarMensajeError('Error interno del servidor: ' + jqXHR.responseText);
			}
			else
			{
				NotificarMensajeError('Error inesperado.');
				console.error(jqXHR.responseText);
			}
		}
	});
}


/********************/
/** NOTIFICACIÓNES **/
/********************/
function NotificarMensajeInfo(mensaje)
{
	if(mensajeNotificacion == "")
	{
		mensajeNotificacion = mensaje;
	}
	else
	{
		mensajeNotificacion = mensajeNotificacion + "\n" + mensaje;
	}

	swal({
		title: "Sincronizando Datos...",
		text: mensajeNotificacion,
		type: "info",
		showConfirmButton: false
	});
}

function NotificarMensajeExito()
{
	swal({
		title: "Sincronizaci\u00F3n Exitosa",
		text: mensajeNotificacion,
		type: "success",
		confirmButtonClass: "btn-success",
		showConfirmButton: true
	});
}

function NotificarMensajeError(mensaje)
{
	swal({
		title: mensaje,
		text: mensajeNotificacion,
		type: "error",
		confirmButtonClass: "btn-danger",
		showConfirmButton: true
	});
}