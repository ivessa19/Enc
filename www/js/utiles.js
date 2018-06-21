/*
 * -------------------------------------------------------------------
 * ------------ Mostrar información para el desarrollador ------------
 * -------------------------------------------------------------------
 */
function ShowStatus(texto)
{
	if (debug)
	{
		console.log(texto);
	}
}

function ShowStatusInfo(texto)
{
	if (debug)
	{
		console.info(texto);
	}
}

function ShowStatusWarning(texto)
{
	if (debug)
	{
		console.warn(texto);
	}
}

function ShowStatusError(texto)
{
	if (debug)
	{
		console.error(texto);
	}
}

function CleanStatus()
{
	//console.log(texto);
	$("#divStatus").html("");
}

/*
 * ---------------------------------------
 * ------------ Local Storage ------------
 * ---------------------------------------
 */
function SetLocalStorage(key, valor)
{
	//Inserta un valor en la llave key del local storage
	localStorage.setItem(key, valor);
}

function GetLocalStorage(key)
{
	//obtiene un valor en base a un key del local storage
	var valorRetorno;
	valorRetorno = localStorage.getItem(key);
	
	if(valorRetorno == "true" || valorRetorno == "false")
	{
		valorRetorno = JSON.parse(valorRetorno);
	}

	return valorRetorno;
}

function ExisteLocalStorage(key)
{
	var flag;

	try
	{
		if (localStorage.getItem(key))
		{
			flag = true;
		}
	}
	catch(e)
	{
		flag = false;
	}

	return flag;
}

function DelLocalStorage(key)
{
	localStorage.removeItem(key);
}

function SetLocalStorageJson(key, valor)
{
	//Inserta un valor como json string en la llave key del local storage
	var json_text = JSON.stringify(valor, null, 2);

	localStorage.setItem(key, json_text);
}

function GetLocalStorageJson(key)
{
	//obtiene un valor en base a un key del local storage
	var valorJsonString;
	valorJsonString = localStorage.getItem(key);
	
	var valorJson = JSON.parse(valorJsonString);

	return valorJson;
}


/*
 * ---------------------------------------
 * ------------ Session Storage ------------
 * ---------------------------------------
 */
function SetSessionStorage(key, valor)
{
	//Inserta un valor en la llave key del local storage
	sessionStorage.setItem(key, valor);
}

function GetSessionStorage(key)
{
	//obtiene un valor en base a un key del local storage
	var valorRetorno;
	valorRetorno = sessionStorage.getItem(key);
	
	if(valorRetorno == "true" || valorRetorno == "false")
	{
		valorRetorno = JSON.parse(valorRetorno);
	}

	return valorRetorno;
}

function ExisteSessionStorage(key)
{
	var flag;

	try
	{
		if (sessionStorage.getItem(key))
		{
			flag = true;
		}
	}
	catch(e)
	{
		flag = false;
	}

	return flag;
}

function DelSessionStorage(key)
{
	sessionStorage.removeItem(key);
}

function SetSessionStorageJson(key, valor)
{
	//Inserta un valor como json string en la llave key del local storage
	var json_text = JSON.stringify(valor, null, 2);

	sessionStorage.setItem(key, json_text);
}

function GetSessionStorageJson(key)
{
	//obtiene un valor en base a un key del local storage
	var valorJsonString;
	valorJsonString = sessionStorage.getItem(key);
	
	var valorJson = JSON.parse(valorJsonString);

	return valorJson;
}


/*
 * -----------------------------------------
 * ------------ Mostrar objeto ------------
 * -----------------------------------------
 */
function MostrarObjeto(objeto)
{
	$.each(objeto, function( index, value )
	{
		//showStatus( index + ": " + value );
		alert( index + ": " + value );
	});
}

/*
 * ----------------------------------------------
 * ------------ Obtiene fecha actual ------------
 * ----------------------------------------------
 */
function GetFechaActual()
{
	var d = new Date();

	var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();

	return strDate;
}

/*
 * -------------------------------------------------------------------------
 * ------------ Reemplaza todos los textos dentro de otro texto ------------
 * -------------------------------------------------------------------------
 */
function ReplaceAll(text, busca, reemplaza)
{
	while (text.toString().indexOf(busca) != -1)
		text = text.toString().replace(busca, reemplaza);
	return text;
}

/*
 * -----------------------------------------------------------------------------
 * ------------ Retorna si la variable es o no es un valor numérico ------------
 * -----------------------------------------------------------------------------
 */
function EsNumerico(valor)
{
	var esNumero = false;
	
	if(valor == "")
	{
		esNumero = false;
	}
	else
	{
		if (!/^([0-9])*$/.test(valor))
		{
			esNumero = false;
		}
		else
		{
			esNumero = true
		}
	}

	return esNumero;
}

/*
 * ---------------------------------------------------------------
 * ------------ Formatea la fecha al estandar chileno ------------
 * ---------------------------------------------------------------
 */
 function FormatoFechaString(fecha)
 {
	var fechaFormato = "";
	var date = new Date(fecha);
	fechaFormato = date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();

	return fechaFormato;
 }

/*
 * ----------------------------------------------------------
 * --------- Le da a un número el formato de Miles  ---------
 * ----------------------------------------------------------
 */
 function FormatoNumeroDecimal(valor)
 {
	valor = parseInt(valor);
	var formatoDecimal = "";
	formatoDecimal += valor.toLocaleString('es-ES', { currencyDisplay: 'symbol', });
	formatoDecimal = "$" + formatoDecimal;

	return formatoDecimal;
 }

 /*
 * --------------------------------------------------------------------------
 * ------------ Quita el formato a un número con formato decimal ------------
 * --------------------------------------------------------------------------
 */
 function QuitaFormatoNumeroDecimal(valor)
 {
	var valorSinFormatoDecimal = "";
	valorSinFormatoDecimal = ReplaceAll(valor, ".", "");
	valorSinFormatoDecimal = ReplaceAll(valorSinFormatoDecimal, "$", "");

	return valorSinFormatoDecimal;
 }

/*
 * -------------------------------------------------------------------------------------------------------------------------
 * ------------ Genera un evento personalizado para detectar si dentro de un campo se presiona la tecla 'enter' ------------
 * -------------------------------------------------------------------------------------------------------------------------
 */
 $.fn.enterKey = function (fnc)
 {
     return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
 }

/*
 * -----------------------------------------------------------------------------
 * ----- Deshabilita las letras y solo te permite ingresar valors numérico -----
 * -----------------------------------------------------------------------------
 */
function SoloNumeros(e)
{
    var tecla = e.keyCode;

    if (tecla==8 || tecla==9 || tecla==13)
	{
        return true;
    }
        
    var patron =/[0-9]/;
    var tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

/*
 * -----------------------------------------------------------------------------
 * ----- Le da a un el formato de miles -----
 * -----------------------------------------------------------------------------
 */

function FormatoDeMiles(numero)
{
	
	if(!isNaN(numero))
	{
		return "$"+numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}
 
	else
	{ 

	}
}