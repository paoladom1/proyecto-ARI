import transform from "camaro";
import json2csv from "json2csv";
import csv from "csvtojson";

//Formato de txt a xml
function txtToXML(file, del) {
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
  console.log(xml);
  return xml;
}

//Formato de xml a txt
async function xmlToTxt(file, del) {
  try {
    console.log(file);
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
    console.log(result);
    let csv = json2csv.parse(result.data);
    if (del != ",") {
      csv = csv.replace(",", del);
    }

    console.log(csv);
    return csv;
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
  console.log(file);
  let header = file.split("\n")[0].split(";");
  // fs npm package
  let res = await csv({
    noheader: false,
    headers: header,
    delimiter: del,
  }).fromString(file);
  console.log(res);
  return JSON.stringify(res);
}

module.exports.convertFunctions = {
  txtToXML,
  xmlToTxt,
  JsonToTxt,
  TxtToJson
};
