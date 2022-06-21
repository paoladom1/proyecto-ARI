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
  if (
    file.value.split(".")[1] == "txt" ||
    file.value.split(".")[1] == "xml" ||
    file.value.split(".")[1] == "json"
  ) {
    if (file.value.split(".")[1] != option.options[option.selectedIndex].text) {
      console.log(clave.value.length);
      if (clave.value.length == 16) {
        fetchjson.tipo = file.value.split(".")[1];
        fetchjson.convertir_a = option.options[option.selectedIndex].text;

        fetchjson.clave = clave.value;
        fetchjson.delimitador = delimitador.value;
        let myFile = file.files[0];
        let reader = new FileReader();
        reader.readAsText(myFile);
        reader.onload = function () {
          let strfile = reader.result;
          origen.value = reader.result;
          fetchjson.file = strfile;
          console.log(fetchjson);
          let re = /[0-9]{16}/g;
          let s = strfile;
          let m;
          let newstrfile = strfile;
          do {
            m = re.exec(s);
            if (m) {
              console.log(m);
              let aux = strfile.substr(m.index, 16);
              console.log(aux);
              let aux_cifrado = cifrado(aux, clave.value);
              console.log(aux_cifrado);
              let descifrado = decifrado(aux_cifrado, clave.value);
              console.log(descifrado);
              newstrfile = newstrfile.replace(aux, (macth) => {
                return aux_cifrado;
              });
            }
          } while (m);

          fetchjson.file = newstrfile;

          request(fetchjson);
        };
      } else {
        alert("la llave deben ser 16 numeros enteros sin espacios");
      }
    } else {
      alert("valores iguales a convertir, ingrese un valor diferente");
    }
  } else {
    alert(
      "Favor adjuntar la información solicitada para convertir los archivos"
    );
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
      let re = /[0-9]{16}/g;
      let s = response.result;
      let m;
      let newstrfile = response.result;
      do {
        m = re.exec(s);
        if (m) {
          console.log(m);
          let aux = response.result.substr(m.index, 16);
          console.log(aux);

          let descifrado = decifrado(aux, clave.value);
          console.log(descifrado);
          newstrfile = newstrfile.replace(aux, (macth) => {
            return descifrado;
          });
        }
      } while (m);

      resultadof.value = newstrfile.toString();
      if (response.tipo == "xml") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/xml;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "resultado.xml");
      }

      if (response.tipo == "txt") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "resultado.txt");
      }

      if (response.tipo == "json") {
        dnl.classList.remove("d-none");
        dnl.setAttribute(
          "href",
          "data:text/json;charset=utf-8," + encodeURIComponent(newstrfile)
        );
        dnl.setAttribute("download", "resultado.json");
      }
    });
}
