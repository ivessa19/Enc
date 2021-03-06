/* ===================================== */
/* ============== EVENTOS ============== */
/* ===================================== */
$("#btnGuardarDataEmpresa").click(function( event )
{

	var id_empresa = $("#ddlCategorias").val();
  	var id_usuario_datos = $("#ddlSubCategorias").val();

	var htmlError = ValidarIngresarProducto();
	if(htmlError=="")
	{
		window.location.href = "venta_ingresar.html";	
	}
	else
	{		
		$("#divMensajeError").html(htmlError);
		$("#divErrorIngresarProducto").show();
	}
});

//OnChange Select Categorias
$(document).on('change', '#ddlCategorias', function (event)
{
	CargarSubCategoriasCombobox(parseInt($(this).val()));
});

/* ===================================== */
/* ============= FUNCIONES ============= */
/* ===================================== */
function InitIngresarProducto()
{
	CargaMenu();
	CargaCategoriasCombobox();

	$('form').parsley();	

	$('#demo-form').parsley().on('field:validated', function () {
		var ok = $('.parsley-error').length === 0;
		$('.alert-info').toggleClass('hidden', !ok);
		$('.alert-warning').toggleClass('hidden', ok);
	})

	.on('form:submit', function () {
		return false; // Don't submit form for this demo
	});
}

function ObtenerCodigoDeBarra(codigo)
{
	db.transaction(function(tx)
	{
		tx.executeSql('SELECT sCodigo_Barra_Producto FROM Productos WHERE sCodigo_Barra_Producto = ? ',[codigo],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				$("#divMensajeError").html("Ya existe un producto con este c&oacute;digo de barra");
				$("#divErrorIngresarProducto").show();
				$("#txtCodigoBarraProducto").val('');
				$("#txtCodigoBarraProducto").focus();
			}
			else
			{
				var codigo_barra=$("#txtCodigoBarraProducto").val();
				var nombre_producto =$("#txtNombreProducto").val();
				var descripcion_producto =$("#txtDescripcionProducto").val();
				var precio_producto =$("#txtPrecioProducto").val();
				var stock_producto =$("#txtStockProducto").val();
				var stock_critico_producto =$("#txtStockCriticoProducto").val();
				var fecha_actual = GetFechaActual();
				var id_empresa = parseInt(GetLocalStorage("usuario_id_empresa"));
				var nId_Sub_Categoria = parseInt($("#ddlSubCategorias").val());

				IngresarProductos(codigo_barra,nombre_producto,descripcion_producto,precio_producto,stock_producto,stock_critico_producto,fecha_actual,id_empresa, nId_Sub_Categoria);
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener el codigo de barra . Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener el codigo de barra. Error: ' + error);
	});
}

/**************************/
/*** AGREGAR PRRODUCTOS ***/
/**************************/
function CargaCategoriasCombobox()
{
	var htmlList = "";
	htmlList = htmlList+"<option value ='-1000'>Seleccione una empresa</option>";

	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Empresa, sRazon_Social_Empresa FROM Empresas',[],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++) 
				{
					htmlList = htmlList+"<option value ='"+data.rows.item(i).nId_Empresa+"'>"+data.rows.item(i).sRazon_Social_Empresa+"</option>";
				}

				$("#ddlCategorias").html(htmlList);
			}
			else
			{
				//No encontraron categorias
				alert("No se encontraron empresas");
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener las empresas. Error: ' + error.message);
			alert('Error al obtener las empresas. Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener las empresas. Error: ' + error);
		alert('Error al obtener las empresas. Error: ' + error);
	});
}

function CargarSubCategoriasCombobox(nId_Usuario)
{
	var htmlList = "";
	htmlList = htmlList+"<option value ='-1000'>Seleccione un usuario</option>";

	db.transaction(function(tx)
  	{
		tx.executeSql('SELECT nId_Usuario, sNombre_Usuario FROM Usuarios Where nId_Usuario = ?',[nId_Usuario],
		function( tx, data )
		{
			if (data.rows.length > 0)
			{
				//Recorro todos los registro que trae la tabla
				for (var i = 0; i < data.rows.length; i++) 
				{
				  htmlList = htmlList+"<option value ='"+data.rows.item(i).nId_Usuario+"'>"+data.rows.item(i).sNombre_Usuario+"</option>";
				}

				$("#ddlSubCategorias").html(htmlList);
			}
			else
			{
				//No encontraron categorias
				//alert("No se encontraron sub-categor�as");
				$("#ddlSubCategorias").html(htmlList);
			}
		},
		function( tx, error )
		{
			console.log( 'Error al obtener los usuarios. Error: ' + error.message);
		});
	},
	function( error )
	{
		console.log( 'Error al obtener los usuarios. Error: ' + error);
	});
}

function IngresarProductos( sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto,nId_Empresa, nId_Categoria)
{
	try
	{
		db.transaction
		(
			function( tx )
			{
				var id_dispositivo = parseInt(GetLocalStorage("nId_Dispositivo"));
				var id_actual_producto = GetLocalStorage("Productos");
				id_actual_producto=id_actual_producto-1;
				SetLocalStorage("Productos",id_actual_producto);
				var query = 'INSERT INTO Productos ' +
				'(nId_Producto,sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto,nId_Empresa, nId_Estado_Sincronizado, nId_Dispositivo, nId_Estado_Producto, nId_Servidor, nId_Categoria) ' +
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
				'1,'+
				'?,'+
				'7,'+
				'0,'+
				'?)';

				tx.executeSql(query,[id_actual_producto,sCodigo_Barra_Producto,sNombre_Producto,sDescripcion_Producto,nPrecio_Producto, nStock_Producto,nStock_Critico_Producto,dFecha_Registro_Producto, nId_Empresa, id_dispositivo, nId_Categoria],
				function( tx, data )
				{
					ShowStatusInfo("Insert Productos correctamente");
					SetLocalStorage("Sincronizado_Productos", false);
				},
				function( tx, error )
				{ 
					// Agregar nuevo id Local Storge 
					var id_actual_producto = GetLocalStorage("Productos");
					id_actual_producto=parseInt(id_actual_producto)+1;
					SetLocalStorage("Productos",id_actual_producto);
					console.log( 'Error al insertar Productos. Error: ' + error.message);
					alert("error: " + error.message);
				});
			},
			function( error ) { console.log( 'Error al insertar Productos tx. Error: ' + error); }, 
			function()
			{
				console.log( 'Transacci�n de producto terminada');
				//window.location.href = "producto_listar.html";
				window.location.href = "producto_ingresar.html";
			}
		);
	}
	catch (e)
	{
		alert(e);
	}
}

/***************************/
/*** VALIDAR FORMULARIOS ***/
/***************************/
function ValidarIngresarProducto()
{
	var htmlErrors				= "";
	try
	{
		//Cambiar document.getElementById por c�digo JQuery
		var nId_Categoria = parseInt($("#ddlCategorias").val());
		var nId_Sub_Categoria = parseInt($("#ddlSubCategorias").val());
		
		if(nId_Categoria == -1000)
		{
			htmlErrors = htmlErrors +"La empresa es obligatorio</br>";
		}
		else
		{
			if(nId_Sub_Categoria == -1000)
			{
				htmlErrors = htmlErrors +"El usuario es obligatorio</br>";
			}
		}
	}
	catch (e)
	{
		alert(e);
	}

	return htmlErrors;
}
