import transform from "camaro";
import json2csv from "json2csv";
import csv from "csvtojson";
import jwt from "jsonwebtoken";

import { cifrado, descifrado } from "./cifradoVigenere";

//Formato de txt a xml
function txtToXML(file, del, clave) {
  console.log(file);
  const fileContents = file;
  let csvData = fileContents.split("\n").map((row) => row.trim());

  let headings = csvData[0].split(del);

  let xml = ``;
  xml += "<clientes>\n";
  for (let i = 1; i < csvData.length; i++) {
    let details = csvData[i].split(del);
    xml += "<cliente>\n";
    for (let j = 0; j < headings.length; j++) {
      xml += `    <${headings[j]}>${details[j]}</${headings[j]}>\n`;
    }
    xml += "</cliente>\n\n";
  }
  xml += "</clientes>\n";

  let re = /[0-9]{13}/g;
  let s = xml;
  let m;
  let newstrfile = xml;

  //crifrado de credit-card
  do {
    m = re.exec(s);
    if (m) {
      console.log(m);
      let aux = xml.substr(m.index, 13);
      console.log(aux);
      let aux_cifrado = cifrado(aux, clave);
      console.log(aux_cifrado);
      let desc = descifrado(aux_cifrado, clave);
      console.log(desc);
      newstrfile = newstrfile.replace(aux, (macth) => {
        return aux_cifrado;
      });
    }
  } while (m);

  return newstrfile;
}

//Formato de xml a txt
async function xmlToTxt(file, del, clave) {
  try {
    //console.log(file);
    const template = {
      data: [
        "//cliente",
        {
          documento: "documento",
          primer_nombre: "primer-nombre",
          apellido: "apellido",
          credit_card: "credit-card",
          tipo: "tipo",
          telefono: "telefono",
        },
      ],
    };

    let result = await transform.transform(file, template);

    let csv = json2csv.parse(result.data);
    if (del != ",") {
      csv = csv.replace(",", del);
    }

    //descifrado de credit-card
    let re = /[0-9]{13}/g;
    let s = csv;
    let newstrfile = csv;
    let m;

    do {
      m = re.exec(s);
      if (m) {
        let aux = csv.substr(m.index, 13);
        let desc = descifrado(aux, clave);

        newstrfile = newstrfile.replace(aux, (macth) => {
          return desc;
        });
      }
    } while (m);

    return newstrfile;
  } catch (error) {
    console.log(error);
    return "";
  }
}

//Formato json a txt
function JsonToTxt(file, del) {
  let csv = json2csv.parse(JSON.parse(file));

  if (del != ",") {
    csv = csv.replace(",", del);
  }

  return csv;
}

//Formato de txt a json
async function TxtToJson(file, del) {
  let header = file.split("\n")[0].split(";");
  // fs npm package
  let res = await csv({
    noheader: false,
    headers: header,
    delimiter: del,
  }).fromString(file);

  // genera token
  const token = jwt.sign(JSON.stringify(res), "secret");

  console.log(token)
  
  // decodifica token
  const decode = jwt.decode(token)

  return JSON.stringify(decode);
}

module.exports.convertFunctions = {
  txtToXML,
  xmlToTxt,
  JsonToTxt,
  TxtToJson,
};
