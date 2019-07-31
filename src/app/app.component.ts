import { Component, OnInit  } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 


export class AppComponent implements OnInit {
  ngOnInit(){

  $.fn.getpage = function(page){

    $.get( "https://reqres.in/api/users?page="+page, function(data1) {
      $(".pagination li").not("#first,#last").remove()
      $(".pagination li a").off("click")
      for(var i=1;i<=data1["total_pages"];i++){   
        $("<li><a data-page='"+i+"' href='#'>"+i+"</a></li>").insertBefore($(".pagination li").last())
      }
      $(".pagination #last a").attr("data-page",data1["total_pages"])
      $(".pagination li a").on("click",function(e){
          $.fn.getpage($(e.target).attr("data-page"))
      })
      $("#tableP tr").not("#head").remove()
      var offset = (data1["page"]-1) * data1["per_page"]
      data1["data"].forEach(function(v,i) {
        $("#tableP").append($("<tr><td>"+(offset+i+1)+".</td><td>"+v["first_name"]+"</td><td>"+v["last_name"]+"</td><td><img class='rounded' style='width:30px;height:30px'  src='"+v["avatar"] +"'/></td><td><button id='edit' class='btn btn-success btn-xs' type='button' data-id='"+v["id"]+"' >Editar</button>&nbsp;<button id='detail' class='btn btn-primary btn-xs' type='button'  data-id='"+v["id"]+"' >Detalle</button></td>"))
      });
      $("#tableP #detail").on("click",function(e){
        $.fn.getperson($(e.target).attr("data-id"))
      })
      $("#tableP #edit").on("click",function(e){
        $.fn.updateperson($(e.target).attr("data-id"))
      })

    });
    
  } 

  $.fn.newperson = function(){

    $("div#field001").hide();
    $(".box-footer .btn-primary").show();
    $(".box-footer .btn-primary").off("click");
    $("#field001 input").val("") 
    $("#field001 #avatar").attr("src",   "" )    
    $("#field001 input").prop("readonly", false);
    $("#person-detail h3").text("Nueva Persona") 

    $("#field001 #nombre, #field001 #apellidopat, #field001 #apellidomat, #field001 #email, #field001 #fchnac, #field001 #fchingreso").closest("#field001").show();

    $(".box-footer .btn-primary").on("click",function(){
      if(confirm("Desea crear Nuevo Registro?")){
        $.fn.savenewperson()

      }
    });

  } 

  $.fn.updateperson = function(person){

    $("div#field001").hide();
    $(".box-footer .btn-primary").show();
    $(".box-footer .btn-primary").prop("disable", true);;

    $(".box-footer .btn-primary").off("click");
    $("#field001 input").val("") 
    $("#field001 #avatar").attr("src", "" )    
    $("#field001 input").prop("readonly", false);
    $("#person-detail h3").text("Actualizar Persona: "+ person) 


    $("#field001 #nombre, #field001 #apellidopat, #field001 #apellidomat, #field001 #email, #field001 #fchnac, #field001 #fchingreso").closest("#field001").show();

    $(".box-footer .btn-primary").on("click",function(){
      if(confirm("Desea Actualizar Registro "+person+"?")){
        $.fn.putperson()
      }
    });

    $.get( "https://reqres.in/api/users/"+person, function(data1) {

      var v = data1["data"]
      $("#field001 #nombre").val(v["first_name"])
      $("#field001 #apellidopat").val(v["last_name"])
      $("#field001 #email").val(v["email"])
      $(".box-footer .btn-primary").prop("disable", false);;
  
       

    });


 } 


  $.fn.savenewperson = function(){

    var txtPerson = []

    $("#field001 #nombre, #field001 #apellidopat, #field001 #apellidomat, #field001 #email, #field001 #fchnac, #field001 #fchingreso").each(function(index){
      txtPerson.push(encodeURIComponent(this.id) + "=" + encodeURIComponent($(this).val()));
    });

    $.post( "https://reqres.in/api/users",txtPerson.join("&"), function(data1,status) {
      var v = data1

      if(status=="success"){
        alert("Registro Nuevo grabado Exitosamente. Id:"+v["id"])
        $("#field001 #nombre").val(v["nombre"]||"")
        $("#field001 #apellidopat").val(v["apellidopat"]||"")
        $("#field001 #apellidomat").val(v["apellidomat"]||"")
        $("#field001 #email").val(v["email"]||"")
        $("#field001 #fchnac").val(v["fchnac"]||"")
        $("#field001 #fchingreso").val(v["fchingreso"]||"")
      }else{
        alert("Registro con error:"+status)
      }

    });
   

  } 

  $.fn.putperson = function(person){

    var txtPerson = []

    $("#field001 #nombre, #field001 #apellidopat, #field001 #apellidomat, #field001 #email, #field001 #fchnac, #field001 #fchingreso").each(function(index){
      if($(this).val()!="") txtPerson.push(encodeURIComponent(this.id) + "=" + encodeURIComponent($(this).val()));
    });


    $.ajax({type: 'PUT',url: "https://reqres.in/api/users/"+person,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      contentType: 'application/x-www-form-urlencoded; charset=utf-8',
      data:  txtPerson.join("&"),
      success: function (data1,status) {
      var v = data1

      if(status=="success"){
        alert("Registro Actualizado grabado Exitosamente.")
        $("#field001 #nombre").val(v["nombre"]||"")
        $("#field001 #apellidopat").val(v["apellidopat"]||"")
        $("#field001 #apellidomat").val(v["apellidomat"]||"")
        $("#field001 #email").val(v["email"]||"")
        $("#field001 #fchnac").val(v["fchnac"]||"")
        $("#field001 #fchingreso").val(v["fchingreso"]||"")
      }else{
        alert("Error:"+status)
      }

    }});
  }


  $.fn.getperson = function(person){

    $("div#field001, .box-footer .btn-primary").hide();
    $("#field001 #nombre,#field001 #apellidopat,#field001 #email,#field001 #avatar").closest("#field001").show();

    $("#field001 input").prop("readonly", true);
    $("#field001 input").val("") 
    $("#field001 #avatar").attr("src", "" )
    $("#person-detail h3").text("Detalle de Persona: "+ person) 

    $.get( "https://reqres.in/api/users/"+person, function(data1) {

      var v = data1["data"]
      $("#field001 #nombre").val(v["first_name"])
      $("#field001 #apellidopat").val(v["last_name"])
      $("#field001 #email").val(v["email"])

      $("#field001 #avatar").attr("src", v["avatar"] )
       

    });
    
  } 

  $(document).ready(function(){
    $.fn.getpage(1)
    $("#new-person").on("click",function(e){
      $.fn.newperson()
    }) 
   });
   }
  }