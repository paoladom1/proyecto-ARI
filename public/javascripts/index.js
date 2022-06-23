const btn = document.getElementById("btn_submit");
const file = document.getElementById("formFile");
const option = document.getElementById("formSelect");
const delimitador = document.getElementById("llave");
const clave = document.getElementById("clave");
const dnl = document.getElementById("donwloadfile");
const origen = document.getElementById("originf");
const resultadof = document.getElementById("resultf");

btn.addEventListener("click", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  let fetchjson = {};

  //Se valida los tipos de archivos permitidos
  if (
    file.value.split(".")[1] == "txt" ||
    file.value.split(".")[1] == "xml" ||
    file.value.split(".")[1] == "json"
  ) {
    //Verifica que el archivo subido y a convertir sean de diferente extension
    if (file.value.split(".")[1] != option.options[option.selectedIndex].text) {
      console.log(clave.value.length);

      //Valida que la clave tenga 13 digitos
      if (clave.value.length == 13) {
        fetchjson.tipo = file.value.split(".")[1];
        fetchjson.convertir_a = option.options[option.selectedIndex].text;

        fetchjson.clave = clave.value;
        fetchjson.delimitador = delimitador.value;
        let myFile = file.files[0];
        let reader = new FileReader();
        reader.readAsText(myFile);

        //Se trata el archivo para cifrarlo
        reader.onload = function () {
          let strfile = reader.result;
          origen.value = reader.result;
          fetchjson.file = strfile;

          let newstrfile = strfile;
          fetchjson.file = newstrfile;

          request(fetchjson);
        };
      } else {
        alert("La llave tiene que ser 13 números enteros sin espacios");
      }
    } else {
      alert(
        "La extención del archivo seleccionado y a convertir son iguales, por favor seleccionar uno diferente"
      );
    }
  } else {
    alert("Por favor adjuntar el archivo a convertir");
  }
}

function request(data) {
  const url = "/";

  fetch(url, {
    method: "POST", // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:"))
    .then((response) => {
      console.log(response);
      let newstrfile = response.result;

      //muestra resultado en TARGET FILE y se le asigna nombre al archivo de descarga
      resultadof.value = newstrfile.toString();
      if (response.tipo == "xml") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/xml;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "archivo_final.xml");
      }

      if (response.tipo == "txt") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "archivo_final.txt");
      }

      if (response.tipo == "json") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/json;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "archivo_final.json");
      }
    });
}
