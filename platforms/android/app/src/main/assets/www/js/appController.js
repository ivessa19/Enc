$("#btnLogin").click(function( event )
{
  var password = $("#Pass").val();
  ValidaUsuario(password);
  localStorage.setItem("Codigo", password);
  return false;
});

$("#btnCerrarSesion").click(function( event )
{
  window.location.href="index.html";
  return false;
});
$("#btnGuardarData").click(function( event )
{
  var htmlError = ValidarIngresarProducto();
  if(htmlError=="")
  {

    window.location.href="preguntas.html";
  }
  else
  {   
    $("#divMensajeError").html(htmlError);
    $("#divErrorIngresarProducto").show();
  }
  

  //ObtenerPreguntas();
  return false;
});
$("#btnEnviar").click(function( event )
{
    var idTrabajador = localStorage.id_trabajador;
    var idEmpresa = localStorage.id_empresa;
    var idUsuario = localStorage.id_usuario;
    var preg1 = localStorage.test;
    var preg2 = localStorage.test2;
    var preg3 = localStorage.test3;
    var preg4 = localStorage.test4;
    var preg5 = localStorage.test5;

    var res1 = localStorage.Respuesta1;
    var res2 = localStorage.Respuesta2;
    var res3 = localStorage.Respuesta3;
    var res4 = localStorage.Respuesta4;
    var res5 = localStorage.Respuesta5;

    var nId_Trabajador = idTrabajador;
    var nId_Empresa = 1;
    var nId_Usuarios = 1;
    var sPregunta_1 = preg1;
    var sPregunta_2 = preg2;
    var sPregunta_3 = preg3;
    var sPregunta_4 = preg4;
    var sPregunta_5 = preg5;
    var sRespuesta_1 = res1;
    var sRespuesta_2 = res2;
    var sRespuesta_3 = res3;
    var sRespuesta_4 = res4;
    var sRespuesta_5 = res5;
    var nValidado = 1;
    ingresarValores(nId_Trabajador,nId_Empresa, nId_Usuarios, sPregunta_1, sPregunta_2, sPregunta_3, sPregunta_4, sPregunta_5, sRespuesta_1, sRespuesta_2, sRespuesta_3, sRespuesta_4, sRespuesta_5, nValidado);
});

function ingresarValores(nId_Trabajador,nId_Empresa, nId_Usuarios, sPregunta_1, sPregunta_2, sPregunta_3, sPregunta_4, sPregunta_5, sRespuesta_1, sRespuesta_2, sRespuesta_3, sRespuesta_4, sRespuesta_5, nValidado)
{
  //var url = "http://localhost:8080/JSON/AgregarData.php";
  var parametros = {
                "nId_Trabajador" : nId_Trabajador,
                "nId_Empresa" : nId_Empresa,
                "nId_Usuarios" : nId_Usuarios,
                "sPregunta_1" : sPregunta_1,
                "sPregunta_2" : sPregunta_2,
                "sPregunta_3" : sPregunta_3,
                "sPregunta_4" : sPregunta_4,
                "sPregunta_5" : sPregunta_5,
                "sRespuesta_1" : sRespuesta_1,
                "sRespuesta_2" : sRespuesta_2,
                "sRespuesta_3" : sRespuesta_3,
                "sRespuesta_4" : sRespuesta_4,
                "sRespuesta_5" : sRespuesta_5, 
                "nValidado"    : nValidado
        };

       $.ajax({
         url: "http://dev.tecnocreativo.cl/JSON/AgregarData.php",
         data: parametros,
         type: "POST",
         beforeSend: function(xhr)
            {
              alert("Exportando Ventas");                
            },
            success: function(data)
            {
              EnviarCorreo()
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
function validacion(){
  
      var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Login.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
        var htmlList = "";
        if (data.length > 0)
        {
        //Recorro todos los registro que trae la tabla
          for (var i = 0; i < data.length; i++) 
          {
            htmlList = htmlList+"<option value ='"+data[i].nId_Trabajador+"'>"+data[i].sNombre_Completo_Trabajador+"</option>";
            localStorage.setItem('id_trabajador', data[i].nId_Trabajador);
          }
        }

        $("#pPsw").html(htmlList);  
  });
}
function preguntas(){
        var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Preguntas.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
      var htmlList = "";    
      
     if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Pregunta+"'>"+data[i].sPregunta_1+"</option>";
        }
      }
      $("#lblPregunta1").html(htmlList);
  });
}
function preguntas2(){
        var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Preguntas.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
      var htmlList = "";    
      
     if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Pregunta+"'>"+data[i].sPregunta_2+"</option>";
        }
      }
      $("#lblPregunta2").html(htmlList);

  });
}
function preguntas3(){
        var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Preguntas.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
      var htmlList = "";    
      
     if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Pregunta+"'>"+data[i].sPregunta_3+"</option>";
        }
      }
      $("#lblPregunta3").html(htmlList);
  });
}
function preguntas4(){
        var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Preguntas.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
      var htmlList = "";    
      
     if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Pregunta+"'>"+data[i].sPregunta_4+"</option>";
        }
      }
      $("#lblPregunta4").html(htmlList);
  });
}
function preguntas5(){
        var Codigo = localStorage.Codigo;
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Preguntas.php?nCodigo_Trabajador='+ Codigo, function(data){
          console.log(JSON.stringify(data));
      var htmlList = "";    
      
     if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Pregunta+"'>"+data[i].sPregunta_5+"</option>";
        }
      }
      $("#lblPregunta5").html(htmlList);
  });
}
function init(){
        $.getJSON('http://dev.tecnocreativo.cl/JSON/Conexion.php', function(data){
          console.log(JSON.stringify(data));
          
      var htmlList = "";
      htmlList = htmlList+"<option value ='-1000'>Seleccione una empresa</option>";
      if (data.length > 0)
      {
        //Recorro todos los registro que trae la tabla
        for (var i = 0; i < data.length; i++) 
        {
          htmlList = htmlList+"<option value ='"+data[i].nId_Empresa+"'>"+data[i].sNombre_Empresa+"</option>";
          //localStorage.setItem('id_empresa', data[i].nId_Empresa);
        }

        $("#ddlEmpresa").html(htmlList);
      }
  });
}

/*function LLenarTabla()
{
   $.getJSON('http://localhost:8080/JSON/Preguntas.php', function(data){
          console.log(JSON.stringify(data));
          var datos;
          var tr;

          for (var i = 0; i < data.length; i++){
            tr = $('<tr/>');
            tr.append("<td>" + data[i].nId_Pregunta + "</td>");
            tr.append("<td>" + data[i].nId_Trabajador + "</td>");
            tr.append("<td>" + data[i].sPregunta_1 + "</td>");
            tr.append("<td>" + data[i].sPregunta_2 + "</td>");
            tr.append("<td>" + data[i].sPregunta_3 + "</td>");
            tr.append("<td>" + data[i].sPregunta_4 + "</td>");
            tr.append("<td>" + data[i].sPregunta_5 + "</td>");
            $('#tabla').append(tr);
      }
    });
}*/


$(document).on('change', '#ddlEmpresa', function (event)
{
  ComboboxEmpresa(parseInt($(this).val()));
});

function ComboboxEmpresa(nId_Empresa)
{
      var datos = nId_Empresa;
      //datos = JSON.stringify({ Idioma: "3" })
      localStorage.setItem('id_empresa', nId_Empresa);
      var url = "http://dev.tecnocreativo.cl/JSON/Usuarios.php?nId_Empresa="+nId_Empresa;

       $.ajax({
         data: datos,
         url: url,
         type: "GET",
         contentType: "application/json",
         dataType: "json",
         success: function(data) {
            
            var htmlList = "";
            htmlList = htmlList+"<option value ='-1000'>Seleccione un usuario</option>";
            if (data.length > 0)
            {
              //Recorro todos los registro que trae la tabla
              for (var i = 0; i < data.length; i++) 
              {
                htmlList = htmlList+"<option value ='"+data[i].nId_Usuarios+"'>"+data[i].sNombre_Completo+"</option>";
                localStorage.setItem('id_usuario', data[i].nId_Usuarios);
              }

              $("#ddlUsuario").html(htmlList);

              //Carga los datos del producto inicial que esté seleccionado
              
            }

         },
         error: function (err) {
           
         }
      }); // Cierre Ajax*/
  }
function ValidaUsuario(pass)
{

  var url = "http://dev.tecnocreativo.cl/JSON/Login.php?nCodigo_Trabajador="+pass;
  

       $.ajax({
         url: url,
         type: "GET",
         contentType: "application/json",
         dataType: "json",
         success: function(data) {

            var password = $("#Pass").val();
            

          if($("#Pass").val() != "")
          {
            if(pass != password) 
            {
                //alert("El codigo ingresado no existe");
            }
            else
            {
              window.location.href = "datos.html";
            }
          }
          else
          {
            $("#divMensajeError").html("No reconozco esa contraseña.<br/>Por favor vuelve a intentarlo nuevamente.");
            $("#divErrorLogin").show();
          }
            //alert("Debes ingresar un codigo o el codigo ingresado no es correcto");
          
         },
         error: function (err) {
           
         }
      }); // Cierre Ajax*/
}
function ObtenerPreguntas(nId_Trabajador)
{

  var url = "http://dev.tecnocreativo.cl/JSON/Preguntas.php?nId_Trabajador="+nId_Trabajador;

       $.ajax({
         url: url,
         type: "GET",
         contentType: "application/json",
         dataType: "json",
         success: function(data) {
            var html = "";

         },
         error: function (err) {
           
         }
      }); // Cierre Ajax*/
}
function ValidarIngresarProducto()
{
  var empresa  = document.getElementById('ddlEmpresa').value;
  var usuario    = document.getElementById('ddlUsuario').value;
  var htmlErrors        = "";

  if(empresa == "Seleccione una empresa")
  {   
    htmlErrors = htmlErrors +"Debes seleccionar una empresa</br> ";
    
  }
  if(usuario == null || usuario.length == 0 || /^\s+$/.test(usuario))
  {   
    htmlErrors = htmlErrors +"Debes seleccionar un usuario</br>";
    
  }

  return htmlErrors;
}