var url_path
var end_point = "/public/forms/"
if (window.location.href.includes("http://localhost:8080")) {
  url_path = "http://localhost:46104" + end_point
} else {
  url_path = end_point
}

$(document).ready(function () {

  $(".file").fileinput({
    language: 'es',
    showRemove: false,
    showUpload: false,
  });

  console.log("document ready")

  axios.get(url_path + "provincias").then(res => {
    res.data.map(prov => {
      $('#provincia').append($('<option>', {
        value: prov.id,
        text: prov.nombre
      }));
      $('#empleador_provincia').append($('<option>', {
        value: prov.id,
        text: prov.nombre
      }));
    })
  })
  //console.log(res.data)


})

//console.log(url_path)

$("#btn_submit").on("click", async () => {

  if (validar()) {



    if (!$("#chk_confirma").prop("checked")) {
      $("#chk_confirma").addClass("is-invalid");
      return false
    }
    $("#chk_confirma").removeClass("is-invalid");
    let formData = new FormData();

    $('.form-control,.custom-select').each(function (i, obj) {
      console.log("name", obj.name, "id", obj.id)

      formData.append(obj.name, obj.value)
    });
    formData.append("empleador_tipo_domicilio", $("input:radio[name ='empleador_tipo_domicilio']:checked").val())


    const img_dni_frente = document.querySelector('#doc_dni_frente');
    if (img_dni_frente.files.length < 1) {
      $(img_dni_frente).addClass("is-invalid");
      return
    }
    if ((img_dni_frente.files[0].size / 1024 / 1024) > 5) {
      $(img_dni_frente).addClass("is-invalid");
      return
    }
    formData.append("img_dni_frente", img_dni_frente.files[0]);

    const img_dni_dorso = document.querySelector('#doc_dni_dorso');
    if (img_dni_dorso.files.length < 1) {
      $(img_dni_dorso).addClass("is-invalid");
      return
    }

    if ((img_dni_dorso.files[0].size / 1024 / 1024) > 5) {
      $(img_dni_dorso).addClass("is-invalid");
      return
    }
    formData.append("img_dni_dorso", img_dni_dorso.files[0]);

    const img_recibo = document.querySelector('#doc_recibo');
    let trl = document.querySelector('#tipo_relacion_laboral').value;

    // Solo requerir el recibo si la relación laboral seleccionada es "dependencia_con_recibo"
    if (trl === 'dependencia_con_recibo') {
      if (img_recibo.files.length < 1) {
        $(img_recibo).addClass("is-invalid");
        return
      }
      if ((img_recibo.files[0].size / 1024 / 1024) > 5) {
        $(img_recibo).addClass("is-invalid");
        return
      }
      formData.append("img_recibo", img_recibo.files[0]);
    } else {
      // Si subió un archivo opcionalmente, o por error de usabilidad residual
      if (img_recibo.files.length > 0) {
        if ((img_recibo.files[0].size / 1024 / 1024) > 5) {
          $(img_recibo).addClass("is-invalid");
          return
        }
        formData.append("img_recibo", img_recibo.files[0]);
      }
    }


    //console.log(url_path)
    let captcha_token = await get_capcha_token()
    if (captcha_token != '') {
      formData.append("token_captcha", captcha_token);
      axios.post(url_path + "afiliados", formData)

        .then(res => {
          console.log(res)
          window.location = "afiliados_paso2.html"

        })
        .catch(error => {
          if (error.response && error.response.status == 400) {
            $("#form_error").text(error.response.data).show();
          } else {
            $("#form_error").text("Hubo un error al enviar la solicitud. Por favor, intentá de nuevo.").show();
          }
          window.scrollTo({ top: $("#form_error").offset().top - 100, behavior: 'smooth' });
        })
    } else {
      console.log("Error captcha")
    }
  }

})


function validar() {
  let res = true
  $(".form-control,.custom-select").each(function (d) {

    var field = $(this)
    var required = field.attr("required")
    if (required) {
      let elem = field[0]
      if (elem.type == "select-one") {
        if (elem.selectedIndex == 0) {
          $(elem).addClass("is-invalid");
          elem.focus()
          res = false
          return false
        }
      }
      if (!elem.checkValidity()) {
        $(elem).addClass("is-invalid");
        elem.focus();
        res = false
        return false
      }

    }
  })

  return res
}