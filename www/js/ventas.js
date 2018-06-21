/* ===================================== */
/* ============== EVENTOS ============== */
/* ===================================== */
//OnChange Select Productos - Ventas
$(document).on('change', '#ddlSeleccionarProducto', function (event)
{
	CargaDatosProductoID(parseInt($(this).val()));
});

//OnChange Codigo de Barras - Ventas
$(document).on('focusout', '#txtCodigoBarra', function (event)
{
	var codigo_barra = $(this).val();
	CargarDatosProductoCodigoBarra(codigo_barra, false);
});

$("#txtCodigoBarra").enterKey(function ()
{
	var codigo_barra = $(this).val();
	CargarDatosProductoCodigoBarra(codigo_barra, true);
})

$(document).on('click', '#btnBorrarProducto', function (event)
{
    event.preventDefault();
	
	var id_producto = $(this).attr("id_producto");
	var nPrecio_Producto = parseInt(QuitaFormatoNumeroDecimal($("#tdPrecioProducto_" + id_producto).html()));
	var nCantidad_Producto = parseInt($("#txtCantidadProducto_" + id_producto).val());
	var nTotal_Producto = nCantidad_Producto * nPrecio_Producto;

	//Resta el monto total del producto. cantidad * precio
	ActualizaMontoTotalVenta(parseInt(-nTotal_Producto));

    $(this).closest('tr').remove();
	$("#txtCodigoBarra").focus(); //Deja el foco en el campo de codigo de barra
});

$("#btnAgregarProducto").click(function( event )
{
	AgregaProductoVentaActual();
	return false;
});

$("#btnPagar").click(function( event )
{
	var bErrorValicacion = false;
	var sMensajeErrorValidacion = "";


	var montoTotal = parseInt(GetSessionStorage("TotalVenta"));
	var numero_boleta =$("#txtNumeroBoleta").val();
	var numero_boleta_sugerido =$("#hdnNumeroBoletaSugerido").val();
	var total_venta = parseInt(montoTotal);
	var fecha_venta = GetFechaActual();
	var fecha_registro_venta = GetFechaActual();
	var id_usuario =  parseInt(GetLocalStorage("usuario_id"));
	var forma_pago = parseInt($('input:radio[name=txtFormaPago]:checked').val());
	var id_empresa = parseInt(GetLocalStorage("usuario_id_empresa"));

	//Valida que se ingrese un número de boleta numérico
	if(!EsNumerico(numero_boleta))
	{
		bErrorValicacion = true;
		sMensajeErrorValidacion += "El número de boleta debe ser un valor numérico";
	}
	else
	{
		if(numero_boleta < numero_boleta_sugerido)
		{
			bErrorValicacion = true;
			sMensajeErrorValidacion += "El número de boleta debe ser " + numero_boleta_sugerido + " o mayor";
		}
	}

	//Valida que se seleccione una forma de pago
	if(!EsNumerico(forma_pago))
	{
		bErrorValicacion = true;
		if(sMensajeErrorValidacion != "")
		{
			sMensajeErrorValidacion += "<br/>";
		}
		sMensajeErrorValidacion += "Por favor seleccione una forma de pago";
	}

	//Valida que todos los productos en el listado tengan cantidad al menos 1
	var filas = $("#ListadoAgregadoProductos").find("tr");
	if (filas.length > 0)
	{
		for(i=0; i<filas.length; i++)
		{
			//Recorre las filas 1 a 1
			var celdas = $(filas[i]).find("td");
			
			if(EsNumerico($(celdas[4]).find("input").val()))
			{
				cantidad_producto = parseInt($(celdas[4]).find("input").val());

				if(cantidad_producto == 0)
				{
					if(sMensajeErrorValidacion != "")
					{
						sMensajeErrorValidacion += "<br/>";
					}
					sMensajeErrorValidacion += "Todos los productos en el listado deben tener definida la cantidad";
					bErrorValicacion = true;
				}
			}
			else
			{
				if(sMensajeErrorValidacion != "")
				{
					sMensajeErrorValidacion += "<br/>";
				}
				sMensajeErrorValidacion += "Todos los productos en el listado deben tener definida la cantidad";
				bErrorValicacion = true;
			}
		}
	}
	else
	{
		bErrorValicacion = true;
		if(sMensajeErrorValidacion != "")
		{
			sMensajeErrorValidacion += "<br/>";
		}
		sMensajeErrorValidacion += "Por favor agregue al menos 1 producto a su venta";
	}
	
	
	if(!bErrorValicacion)
	{
		IngresarVenta(numero_boleta, total_venta, fecha_venta, fecha_registro_venta, id_usuario, forma_pago, id_empresa);
	}
	else
	{
		//Mensaje error validaciones
		NotificarError(sMensajeErrorValidacion);
	}
});

$("#btnBuscar").click(function( event )
{
	var id_vendedor =0;
	var nId_Perfil_Usuario = parseInt(GetLocalStorage("usuario_id_perfil"));
	if(nId_Perfil_Usuario == 6)
	{
		id_vendedor = parseInt($("#ddlVendedores").val());
	}
	else
	{
		id_vendedor = parseInt(GetLocalStorage("usuario_id"));
	}
	
	var forma_pago = parseInt($("#ddlFormasDePago").val());

	ObtenerListadoVentas(id_vendedor, forma_pago);
	var div = document.getElementById("EncabezadoVentas");
	if (div.style.display = 'none')
	{
		div.style.display="block";
	}
	return false;
});


/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
function InitIngresarVenta()
{
	CargaMenu();

	CargaProductosCombobox(); //Carga los productos en el select
	CreaTotalVenta(); //Crea el número de venta para poder guardar el total de la venta
	CreaNumeroVenta();
	CargaFormasDePagoRadioButton();
	$("#txtCodigoBarra").focus(); //Deja el foco en el campo de codigo de barra

	//Deja en cero el monto de la venta
	SetSessionStorage("TotalVenta", 0);
    $("#lblTotalVenta").html(FormatoNumeroDecimal(0));
	$("#lblTotalVentas").html(FormatoNumeroDecimal(0));


	//Codigo para las notificaciones
	toastr.options =
	{
	  "closeButton": true,
	  "debug": false,
	  "newestOnTop": true,
	  "progressBar": true,
	  "positionClass": "toast-top-center",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
}

function InitListadoVentas()
{
	CargaMenu();
	
	var nId_Perfil_Usuario = parseInt(GetLocalStorage("usuario_id_perfil"));
	if(nId_Perfil_Usuario == 6)
	{
		var div = document.getElementById("ListaVendedores");
		if (div.style.display = 'none')
		{
			div.style.display="inline";
		}
	}

	CargaVendedoresCombobox();
	CargaFormasDePagoCombobox();
}

function InitDetalleVenta()
{
	CargaMenu();

	LLenarTablaDetalleVentas()
}

/***********************/
/** INGRESO DE VENTAS **/
/***********************/
function CargaProductosCombobox()
{
	var htmlList = "";
	htmlList = htmlList+"<option value ='-1000'>Seleccione un producto</option>";

	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Producto,sCodigo_Barra_Producto, sNombre_Producto, sDescripcion_Producto, nPrecio_Producto, nStock_Producto, nStock_Critico_Producto FROM Productos ',[],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++) 
				{
				  htmlList = htmlList+"<option value ='"+data.rows.item(i).nId_Producto+"'>"+data.rows.item(i).sNombre_Producto+"</option>";
				}

				$("#ddlSeleccionarProducto").html(htmlList);

				//Carga los datos del producto inicial que esté seleccionado
				var id_producto = parseInt($('#ddlSeleccionarProducto').val());
			}
			else
			{
				//No encontro productos para cargar en el combobox
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener los productos . Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener los productos. Error: ' + error);
	});
}

function CargaFormasDePagoRadioButton()
{
	var htmlFormasDePago = "";

	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Tabla_Detalle AS "nId_Forma_Pago", sNombre_Tabla_Detalle AS "sNombre_Forma_Pago" FROM Tabla_Detalle WHERE nId_Tabla_Maestra = 5',[],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++)
				{
					//htmlFormasDePago = htmlFormasDePago+"<option value ='"+data.rows.item(i).nId_Forma_Pago+"''>"+data.rows.item(i).sNombre_Forma_Pago+"</option>";
					htmlFormasDePago = htmlFormasDePago + '<label class="btn btn-info btn-sm raised waves-effect" style="margin-top: 5px; margin-right: 5px;">';
					htmlFormasDePago = htmlFormasDePago + '<input name="txtFormaPago" id="txt_'+data.rows.item(i).nId_Forma_Pago+'" value="'+data.rows.item(i).nId_Forma_Pago+'" type="radio">'+data.rows.item(i).sNombre_Forma_Pago;
					htmlFormasDePago = htmlFormasDePago + '</label>';
				}

				$("#divFormasDePago").html(htmlFormasDePago);
			}
			else
			{
				//No encontro productos para cargar en el combobox
				$("#divFormasDePago").html("No se pudieron encontrar formas de pago.<br/>Por favor contactar con el Administrador");
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener las formas de pago . Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener las formas de pago. Error: ' + error.message);
	});
}

function CargaDatosProductoID(IdProducto)
{
	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Producto,sCodigo_Barra_Producto, sNombre_Producto, sDescripcion_Producto, nPrecio_Producto, nStock_Producto, nStock_Critico_Producto FROM Productos WHERE nId_Producto = ?',[IdProducto],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				$("input[name=txtCodigoBarra]").val(data.rows.item(0).sCodigo_Barra_Producto);
				$("#txtPrecio").val(data.rows.item(0).nPrecio_Producto);
			}
			else
			{
				//Mostrar mensaje de que no se encontró el producto
				NotificarError("No se encontró producto");
				$("#txtCodigoBarra").val("");
				$("#txtCodigoBarra").focus();
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener el producto. Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener el producto. Error: ' + error);
	});
}

function CargarDatosProductoCodigoBarra(sCodigo_Barra_Producto, bIngresar_Producto_Venta_Actual)
{
	if(sCodigo_Barra_Producto != "")
	{
		db.transaction(function(tx)
		{
			tx.executeSql('SELECT nId_Producto,sCodigo_Barra_Producto, sNombre_Producto, sDescripcion_Producto, nPrecio_Producto, nStock_Producto, nStock_Critico_Producto FROM Productos  WHERE sCodigo_Barra_Producto = ?',[sCodigo_Barra_Producto],
			function( tx, data )
			{
				if (data.rows.length > 0)
				{
					$("#ddlSeleccionarProducto").val(data.rows.item(0).nId_Producto);
					$("#txtPrecio").val(data.rows.item(0).nPrecio_Producto);

					if(bIngresar_Producto_Venta_Actual)
					{
						AgregaProductoVentaActual();
					}
				}
				else
				{
					//Mostrar mensaje de que no se encontró el producto
					NotificarError("No se encontró ningún producto con ese código de barra");
					$("#txtCodigoBarra").val("");
					$("#txtCodigoBarra").focus();
				}
			},
			function( tx, error )
			{
				console.log( 'Error al obtener el producto. Error: ' + error.message);
			});
		},
		function( error )
		{
			console.log( 'Error al ejecutar la consulta que obtiene el producto. Error: ' + error);
		});
	}
}

function AgregaProductoVentaActual()
{
	var id_producto = parseInt($('#ddlSeleccionarProducto').val());

	if (id_producto != -1000)
	{
		if( $("#ListadoAgregadoProductos").html().indexOf("tdCantidadProducto_" + id_producto) >= 0 )
		{
			//Asigna la cantidad de producto
			var nCantidad_Producto = parseInt($("#txtCantidadProducto_" + id_producto).val());
			nCantidad_Producto++;
			$("#txtCantidadProducto_" + id_producto).val(nCantidad_Producto);
			
			//Asigna el precio total del producto
			var nPrecio_Producto = parseInt(QuitaFormatoNumeroDecimal($("#tdPrecioProducto_" + id_producto).html()));
			var nTotal_Producto = nCantidad_Producto * nPrecio_Producto;
			$("#tdTotalProducto_" + id_producto).html(FormatoNumeroDecimal(nTotal_Producto));

			ActualizaMontoTotalVenta(parseInt(nPrecio_Producto));
			
			//Limpia los campos de la sección agregar producto
			$("#txtCodigoBarra").val("");
			var ddlSeleccionarProducto = $("#ddlSeleccionarProducto");
			ddlSeleccionarProducto[0].selectedIndex = 0;
			$("#txtPrecio").val("");
			$("#txtCodigoBarra").focus();
		}
		else
		{
			var codigo_barra = $("input[name=txtCodigoBarra]").val();
			var nombre_producto = $('select[name="ddlSeleccionarProducto"] option:selected').text();
			var cantidad_producto = 1;
			var precio = $("#txtPrecio").val();
			
			var htmlList = "";
			htmlList = htmlList+"<tr>";
			htmlList = htmlList+"<td style='display: none;'>"+ id_producto +"</td>";
			htmlList = htmlList+"<td style='text-align: center; width: 10%;'>"+ codigo_barra +"</td>";
			htmlList = htmlList+"<td style='text-align: center; width: 40%;'>"+ nombre_producto +"</td>";
			htmlList = htmlList+"<td style='text-align: center; width: 10%;' id='tdPrecioProducto_" + id_producto + "'>"+ FormatoNumeroDecimal(precio) +"</td>";
			htmlList = htmlList+"<td style='text-align: center; width: 22%;' id='tdCantidadProducto_" + id_producto + "'>";
			htmlList = htmlList+"	<div class='col-sm-12'>";
			htmlList = htmlList+"		<input id='txtCantidadProducto_" + id_producto + "' name='txtCantidadProducto_" + id_producto + "' type='text' value='" + cantidad_producto + "' onkeyup='CalcularValores(" + id_producto + ");' onchange='CalcularValores(" + id_producto + ");'/>";
			htmlList = htmlList+"	</div>";
			htmlList = htmlList+"</td>";
			htmlList = htmlList+"<td style='text-align: center; width: 10%;' id='tdTotalProducto_" + id_producto + "'>"+ FormatoNumeroDecimal(precio * cantidad_producto) +"</td>";
			htmlList = htmlList+"<div class='btn-group m-b-10'>";
			htmlList = htmlList+"<td style='text-align: center; width: 18%;'><button type='button' id_producto='" + id_producto + "' id='btnBorrarProducto' class='btn btn-icon waves-effect waves-light btn-danger'><i class='mdi mdi-delete-forever'></i></button></td>";
			htmlList = htmlList+"</div>";
			htmlList = htmlList+"</tr>";

			ActualizaMontoTotalVenta(parseInt(precio));

			//Agregar fila a tabla
			$("#ListadoAgregadoProductos").append(htmlList);

			//Le agrega el estilo numérico al input de cantidad recién creado
			$("#txtCantidadProducto_" + id_producto).TouchSpin({});

			//Limpia los campos de la sección agregar producto
			$("#txtCodigoBarra").val("");
			var ddlSeleccionarProducto = $("#ddlSeleccionarProducto");
			ddlSeleccionarProducto[0].selectedIndex = 0;
			$("#txtPrecio").val("");
			$("#txtCodigoBarra").focus();
		}
	}
	else
	{
		NotificarError("Por favor seleccione un producto");
	}
}

function CalcularValores(id_producto)
{
	//Asigna el precio total del producto
	if(EsNumerico($("#txtCantidadProducto_" + id_producto).val()))
	{
		var nPrecio_Producto = parseInt(QuitaFormatoNumeroDecimal($("#tdPrecioProducto_" + id_producto).html()));
		var nCantidad_Producto = parseInt($("#txtCantidadProducto_" + id_producto).val());
		var nTotal_Producto = nCantidad_Producto * nPrecio_Producto;
		$("#tdTotalProducto_" + id_producto).html(FormatoNumeroDecimal(nTotal_Producto));
	}
	else
	{
		$("#tdTotalProducto_" + id_producto).html(0);
	}

	//Recorre el detalle de la venta para calcular el total de la venta
	var filas = $("#ListadoAgregadoProductos").find("tr"); //devulve las filas del body de tu tabla segun el ejemplo que brindaste
	var cantidadTotalProducto = 0;

	for(i=0; i<filas.length; i++)
	{
		//Recorre las filas 1 a 1
		var celdas = $(filas[i]).find("td"); //devolverá las celdas de una fila
		cantidadTotalProducto += parseInt(QuitaFormatoNumeroDecimal($(celdas[5]).text()));
	}

	//Actualiza el valor total de la venta
	SetSessionStorage("TotalVenta", cantidadTotalProducto);
    $("#lblTotalVenta").html(FormatoNumeroDecimal(cantidadTotalProducto));
	$("#lblTotalVentas").html(FormatoNumeroDecimal(cantidadTotalProducto));
}

function CreaTotalVenta()
{
	if (!ExisteSessionStorage("TotalVenta"))
	{
		SetSessionStorage("TotalVenta", 0);
	}
}

function CreaNumeroVenta()
{
	db.transaction(function(tx)
	{
		tx.executeSql("SELECT IFNULL(MAX(nNumero_Documento_Venta),0) AS 'nNumero_Documento_Venta' FROM Ventas ", [],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				var nNumero_Documento_Venta = parseInt(data.rows.item(0).nNumero_Documento_Venta);
				nNumero_Documento_Venta++;
				$("#txtNumeroBoleta").val(nNumero_Documento_Venta);
				$("#hdnNumeroBoletaSugerido").val(nNumero_Documento_Venta);
			}
			else
			{
				var nNumero_Documento_Venta = 1;
				$("#txtNumeroBoleta").val(nNumero_Documento_Venta);
				$("#hdnNumeroBoletaSugerido").val(nNumero_Documento_Venta);
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener el número de documento. Error: ' + error.message);
		});
	},
	function( error )
	{
	    console.log( 'Error al obtener el número de documento. Error: ' + error.message);
	});
}

function ActualizaMontoTotalVenta(monto)
{
	var montoTotal = parseInt(GetSessionStorage("TotalVenta"));
	montoTotal += monto;
	SetSessionStorage("TotalVenta", montoTotal);
    $("#lblTotalVenta").html(FormatoNumeroDecimal(montoTotal));
	$("#lblTotalVentas").html(FormatoNumeroDecimal(montoTotal));
}

function IngresarVenta(nNumero_Documento_Venta, nValor_Total_Venta,dFecha_Venta, dFecha_Registro_Venta, nId_Usuario, nId_Forma_Pago_Venta, nId_Empresa)
{
	db.transaction
	(
		function( tx )
		{
			var id_dispositivo = GetLocalStorage("nId_Dispositivo");
			var id_actual_venta = GetLocalStorage("Ventas");
			id_actual_venta = id_actual_venta - 1;
			SetLocalStorage("Ventas", id_actual_venta);
			var id_log_caja =parseInt(GetLocalStorage("Log_Caja"));

			var query = 'INSERT INTO Ventas ' +
			'(nId_Venta,nNumero_Documento_Venta,nValor_Total_Venta,dFecha_Venta,dFecha_Registro_Venta, nId_Usuario,nId_Forma_Pago_Venta,nId_Empresa, nId_Estado_Sincronizado,nId_Log_Caja, nId_Dispositivo, nId_Servidor)' +
			'VALUES (' +
			'?,'+
			'?,'+
			'?,'+
			'?,'+
			'?,'+
			'?,'+
			'?,'+
			'?,'+
			'1,'+
			'?,'+
			'?,'+
			'0)';

			tx.executeSql(query,[ id_actual_venta, nNumero_Documento_Venta, nValor_Total_Venta, dFecha_Venta, dFecha_Registro_Venta, nId_Usuario, nId_Forma_Pago_Venta, nId_Empresa, id_log_caja, id_dispositivo ],
			function( tx, data )
			{
				SetLocalStorage("Sincronizado_Ventas", false);

				ShowStatusInfo("Insert Venta correctamente");

				var filas = $("#ListadoAgregadoProductos").find("tr"); //devulve las filas del body de tu tabla segun el ejemplo que brindaste
				
				var arrayDetallesVenta = [filas.length];

				for(i=0; i<filas.length; i++)
				{
					//Recorre las filas 1 a 1
					var celdas = $(filas[i]).find("td");
					nId_Producto = parseInt($(celdas[0]).text());
					nPrecio_Detalle_Venta = parseInt(QuitaFormatoNumeroDecimal($(celdas[3]).text()));
					nCantidad_Detalle_Venta = parseInt($(celdas[4]).find("input").val());
					dFecha_Registro_Detalle_Venta = GetFechaActual();
					nId_Venta = parseInt(GetLocalStorage("Ventas"));
					nId_Empresa = parseInt(GetLocalStorage("usuario_id_empresa"));

					var objDetalleVenta =
					{
						"nId_Producto": nId_Producto,
						"nCantidad_Detalle_Venta": nCantidad_Detalle_Venta,
						"nPrecio_Detalle_Venta": nPrecio_Detalle_Venta,
						"dFecha_Registro_Detalle_Venta": dFecha_Registro_Detalle_Venta,
						"nId_Venta": nId_Venta,
						"nId_Empresa": nId_Empresa
					};

					arrayDetallesVenta[i] = objDetalleVenta;
				}

				IngresarDetallesVentas(arrayDetallesVenta);
			},
			function( tx, error )
			{
				var id_actual_venta = GetLocalStorage("Ventas");
				id_actual_venta = parseInt(id_actual_venta) + 1;
				SetLocalStorage("Ventas", id_actual_venta);
				console.log( 'Error al insertar la venta. Error: ' + error.message); 
			});
		},
		function( error ) { console.log( 'Error al insertar la venta tx. Error: ' + error); }, 
		function()
		{
			console.log( 'Transacción ejecutada');
		}
	);
}

function IngresarDetallesVentas(arrayDetallesVenta)
{
	db.transaction
	(
		function( tx )
		{
			for ( i = 0; i < arrayDetallesVenta.length; i++)
			{
				//Detalle Venta
				var id_dispositivo = parseInt(GetLocalStorage("nId_Dispositivo"));
				var id_actual_detalle_venta = parseInt(GetLocalStorage("Detalles_Venta"));
				id_actual_detalle_venta = id_actual_detalle_venta - 1;
				SetLocalStorage("Detalles_Venta", id_actual_detalle_venta);

				var queryDetalleMovimiento = 'INSERT INTO Detalles_Venta ' +
				'(nId_Detalle_Venta,nCantidad_Detalle_Venta,nPrecio_Detalle_Venta,dFecha_Registro_Detalle_Venta,nId_Venta, nId_Producto,nId_Empresa, nId_Estado_Sincronizado, nId_Dispositivo, nId_Servidor)' +
				'VALUES (' +
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'?,'+
				'1,'+
				'?,'+
				'0)';

				tx.executeSql(queryDetalleMovimiento,
				[
					id_actual_detalle_venta,
					arrayDetallesVenta[i].nCantidad_Detalle_Venta,
					arrayDetallesVenta[i].nPrecio_Detalle_Venta,
					arrayDetallesVenta[i].dFecha_Registro_Detalle_Venta,
					arrayDetallesVenta[i].nId_Venta,
					arrayDetallesVenta[i].nId_Producto,
					arrayDetallesVenta[i].nId_Empresa,
					id_dispositivo
				],
				function( tx, data )
				{
					ShowStatusInfo("Insert Detalle Venta Correctamente");
					SetLocalStorage("Sincronizado_Detalles_Venta", false);
				},
				function( tx, error )
				{
					var id_actual_detalle_venta = GetLocalStorage("Detalles_Venta");
					id_actual_detalle_venta=parseInt(id_actual_detalle_venta)+1;
					SetLocalStorage("Detalles_Venta",id_actual_detalle_venta);
					console.error( 'Error al insertar el detalle de la venta. Error: ' + error.message);
				});


				//Movimientos
				var nId_Movimiento = parseInt(GetLocalStorage("Movimientos"));
				nId_Movimiento = nId_Movimiento - 1;
				SetLocalStorage("Movimientos", nId_Movimiento);

				var queryMovimientos = 'INSERT INTO Movimientos ' +
				'(nId_Movimiento,nId_Documento_Movimiento,sGlosa_Movimiento,nEntrada_Movimiento, nSalida_Movimiento,nStock_A_La_Fecha,dFecha_Movimiento,dFecha_Registro_Movimiento,nId_Producto,nId_Bodega,nId_Empresa,nId_Estado_Sincronizado,nId_Tipo_Movimiento, nId_Dispositivo, nId_Servidor)' +
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
				'?,'+
				'0)';

				tx.executeSql(queryMovimientos, [nId_Movimiento, parseInt(GetLocalStorage("Ventas")), "VENTA - BOLETA N° " + $("#txtNumeroBoleta").val(), 0, arrayDetallesVenta[i].nCantidad_Detalle_Venta, 0, GetFechaActual(), GetFechaActual(), arrayDetallesVenta[i].nId_Producto, parseInt(GetLocalStorage("usuario_id_bodega")), arrayDetallesVenta[i].nId_Empresa, 1, 13, parseInt(GetLocalStorage("nId_Dispositivo"))],
				function( tx, data )
				{
					ShowStatusInfo("Se inserto el Movimiento correctamente");
					SetLocalStorage("Sincronizado_Movimientos", false);
				},
				function( tx, error )
				{
					var nId_Movimiento = parseInt(GetLocalStorage("Movimientos"));
					nId_Movimiento = nId_Movimiento + 1;
					SetLocalStorage("Movimientos", nId_Movimiento);
					console.error( 'Error al insertar el movimiento. Error: ' + error.message);
				});


				//Stock
				var queryStock =	'UPDATE	Stock ' +
									'SET	nStock_Producto = nStock_Producto -?' +
									'WHERE	nId_Producto = ?' +
									'AND	nId_Bodega = ?';

				tx.executeSql(queryStock, [arrayDetallesVenta[i].nCantidad_Detalle_Venta, arrayDetallesVenta[i].nId_Producto, parseInt(GetLocalStorage("usuario_id_bodega"))],
				function( tx, data )
				{
					ShowStatusInfo("Se inserto el Stock correctamente");
					SetLocalStorage("Sincronizado_Stock", false);
				},
				function( tx, error )
				{
					console.error( 'Error al actualizar el stock. Error: ' + error.message); 
				});
			}
		},
		function( error )
		{
			console.error( 'Error al actualizar el stock tx. Error: ' + error.message);
		},
		function()
		{
			console.log( 'Transacción ejecutada');
			window.location.href = "venta_listar.html";
		}
	);
}



/***********************/
/** LISTADO DE VENTAS **/
/***********************/
function CargaVendedoresCombobox()
{
	var htmlList = "";
	htmlList = htmlList + "<option value ='-1'>Todos</option>";

	db.transaction(function(tx)
	{
		tx.executeSql('SELECT nId_Usuario, sNombre_Usuario, sApellido_Usuario, sNombre_Completo_Usuario, sUser_Usuario, sPassword_Usuario, dFecha_Registro_Usuario FROM Usuarios', [],
		function ( tx, data)
		{
			if (data.rows.length > 0)
			{
				for (var i = 0; i < data.rows.length; i++)
				{
					htmlList = htmlList + "<option value ='"+data.rows.item(i).nId_Usuario+"''>"+data.rows.item(i).sNombre_Usuario+"</option>";
				}
				$("#ddlVendedores").html(htmlList);
			}
    	},
		function( tx, error )
		{
			console.log( 'Error al obtener los vendedores. Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener los vendedores. Error: ' + error);
	});
}

function CargaFormasDePagoCombobox()
{
	var htmlFormasDePago = "";
	htmlFormasDePago = htmlFormasDePago + "<option value ='-1'>Todas</option>";

	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Tabla_Detalle AS "nId_Forma_Pago", sNombre_Tabla_Detalle AS "sNombre_Forma_Pago" FROM Tabla_Detalle WHERE nId_Tabla_Maestra = 5',[],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++)
				{
					htmlFormasDePago = htmlFormasDePago+"<option value ='"+data.rows.item(i).nId_Forma_Pago+"''>"+data.rows.item(i).sNombre_Forma_Pago+"</option>";
				}

				$("#ddlFormasDePago").html(htmlFormasDePago);
			}
			else
			{
				//No encontro productos para cargar en el combobox
				$("#ddlFormasDePago").html("No se pudieron encontrar formas de pago.<br/>Por favor contactar con el Administrador");
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener las formas de pago . Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener las formas de pago. Error: ' + error.message);
	});
}

function ObtenerListadoVentas(id_vendedor, forma_pago)
{
	var htmlList = "";

	db.transaction(function(tx)
	{
		var query = "";
		query += "SELECT	venta.nId_Venta, venta.nNumero_Documento_Venta, venta.nValor_Total_Venta, venta.dFecha_Registro_Venta, vendedor.sNombre_Completo_Usuario, forma_pago.sNombre_Tabla_Detalle AS sNombre_Forma_Pago ";
		query += "FROM	Ventas venta ";
		query += "JOIN	Tabla_Detalle forma_pago ";
		query += "ON venta.nId_Forma_Pago_Venta = forma_pago.nId_Tabla_Detalle ";
		query += "JOIN	Usuarios vendedor ";
		query += "ON venta.nId_Usuario = vendedor.nId_Usuario ";
		query += "WHERE	(venta.nId_Usuario = ? OR ? = -1) ";
		query += "AND	(venta.nId_Forma_Pago_Venta = ? OR ? = -1) ";

		tx.executeSql(query,[ id_vendedor, id_vendedor, forma_pago, forma_pago ],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++)
				{
					htmlList = htmlList+"<tr>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).nNumero_Documento_Venta+"</td>";					
					htmlList = htmlList+"<td style='text-align: center;'>"+FormatoFechaString(data.rows.item(i).dFecha_Registro_Venta)+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).sNombre_Completo_Usuario+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+FormatoNumeroDecimal(data.rows.item(i).nValor_Total_Venta)+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).sNombre_Forma_Pago+"</td>";

					htmlList = htmlList+"<div class='btn-group m-b-10'>";
					htmlList = htmlList+"<td style='text-align: center;'><button type='button' class='btn btn-icon waves-effect waves-light btn-primary' onclick='EnviaPantallaDetalleVenta("+data.rows.item(i).nId_Venta+")'><i class='mdi mdi-magnify'></i></button></td>";
					htmlList = htmlList+"</div>";
					htmlList = htmlList+"</tr>";
				}

				$("#ListadoAgregadoProductos").html(htmlList);
			}
			else
			{
				htmlList = htmlList+"<tr><td colspan='6' align='center' >No se encontraron resultados con los filtros seleccionados</td></tr>";
				$("#ListadoAgregadoProductos").html(htmlList);
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener el listado de ventas . Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener el listado de ventas. Error: ' + error);
	});
}

function EnviaPantallaDetalleVenta(nId_Venta)
{
	localStorage.setItem("IdVenta_Detalle", nId_Venta)
	//LLenarTablaDetalleVentas();
	window.location.href = "venta_detalle.html";
}



/***********************/
/** DETALLE DE VENTAS **/
/***********************/
function LLenarTablaDetalleVentas()
{
	id_venta = parseInt(GetLocalStorage("IdVenta_Detalle"));
	var htmlList = "";

	db.transaction(function(tx)
	{
		tx.executeSql("SELECT Ventas.nNumero_Documento_Venta, Usuarios.sNombre_Completo_Usuario, Ventas.nValor_Total_Venta, Ventas.nId_Forma_Pago_Venta, Productos.sCodigo_Barra_Producto, Productos.sNombre_Producto,Detalles_Venta.nCantidad_Detalle_Venta, Detalles_Venta.nPrecio_Detalle_Venta, Ventas.dFecha_Venta,  "+
					"detalle.sNombre_Tabla_Detalle AS 'sForma_De_Pago_Venta', "+
					"Detalles_Venta.nPrecio_Detalle_Venta * Detalles_Venta.nCantidad_Detalle_Venta AS 'nSubTotalProducto' "+
					"FROM	Detalles_Venta "+
					"JOIN	Ventas "+
					"ON	Detalles_Venta.nId_Venta = Ventas.nId_Venta "+ 
					"JOIN	Productos "+
					"ON	Productos.nId_Producto = Detalles_Venta.nId_Producto "+
					"JOIN	Usuarios "+
					"ON Usuarios.nId_Usuario = Ventas.nId_Usuario "+
					"JOIN	Tabla_Detalle detalle "+
					"ON	Ventas.nId_Forma_Pago_Venta = detalle.nId_Tabla_Detalle "+
					"AND	detalle.nId_Tabla_maestra = 5 "+
					"WHERE	Ventas.nId_Venta = ?",[ id_venta ],

		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				var htmlList ="";
				var nNumero_Documento_Venta = String(data.rows.item(0).nNumero_Documento_Venta);
				var sNombre_Completo_Usuario = String(data.rows.item(0).sNombre_Completo_Usuario);
				var dFecha_Venta = FormatoFechaString(String(data.rows.item(0).dFecha_Venta));
				var nValor_Total_Venta = FormatoNumeroDecimal(data.rows.item(0).nValor_Total_Venta);
				//var nId_Forma_Pago_Venta = String(data.rows.item(0).nId_Forma_Pago_Venta);
				var sForma_De_Pago_Venta = String(data.rows.item(0).sForma_De_Pago_Venta);
				
				$("#lblNumeroDocumento").html(nNumero_Documento_Venta);
				$("#lblVendedor").html(sNombre_Completo_Usuario);
				$("#lblFechaVenta").html(dFecha_Venta);
				$("#lblFormaPago").html(sForma_De_Pago_Venta);
				$("#lblMontoTotal").html(nValor_Total_Venta);
				
				//Recorro los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++)
				{
					htmlList = htmlList+"<tr>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).sCodigo_Barra_Producto+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).sNombre_Producto+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+data.rows.item(i).nCantidad_Detalle_Venta+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+FormatoNumeroDecimal(data.rows.item(i).nPrecio_Detalle_Venta)+"</td>";
					htmlList = htmlList+"<td style='text-align: center;'>"+FormatoNumeroDecimal(data.rows.item(i).nSubTotalProducto) +"</td>";
					htmlList = htmlList+"</tr>";
				}

				$("#ListadoDetalleVenta").html(htmlList);
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener el detalle de la venta. Error: ' + error.message);
		});
	},
	function( error )
	{
	    console.log( 'Error al obtener el detalle de la venta. Error: ' + error);
	});
}


/*****************************/
/** NOTIFICACIÓN DE ERRORES **/
/*****************************/
function NotificarError(mensaje)
{
	if(typeof toastr == "undefined")
	{
		alert(mensaje);
	}
	else
	{
		toastr["warning"](mensaje);
	}
}