let coder = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  [3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  [5, 6, 7, 8, 9, 0, 1, 2, 3, 4],
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  [7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
  [9, 0, 1, 2, 3, 4, 5, 6, 7, 8],
];

function cifrado(creditcard, key) {
  let ccarray = creditcard.split("");
  for (let i = 0; i < ccarray.length; i++) {
    ccarray[i] = parseInt(ccarray[i]);
  }

  let clave = key.split("");
  for (let i = 0; i < clave.length; i++) {
    clave[i] = parseInt(clave[i]);
  }

  let cccodiado = [];

  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 10; j++) {
      if (ccarray[i] == coder[0][j]) {
        x = coder[0][j];
        for (let j = 0; j < 10; j++) {
          if (clave[i] == coder[j][0]) {
            y = coder[j][0];
          }
        }
        cccodiado[i] = coder[x][y];
      }
    }
  }
  cccodiado = cccodiado.toString().replace(/,/g, "");

  return cccodiado;
}

function decifrado(creditcardcoder, key) {
  let cccodiado = creditcardcoder.split("");
  for (let i = 0; i < cccodiado.length; i++) {
    cccodiado[i] = parseInt(cccodiado[i]);
  }

  let clave = key.split("");
  for (let i = 0; i < clave.length; i++) {
    clave[i] = parseInt(clave[i]);
  }

  let ccdecoder = [];
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 10; j++) {
      if (cccodiado[i] == coder[clave[i]][j]) {
        ccdecoder[i] = coder[0][j];
      }
    }
  }
  ccdecoder = ccdecoder.toString().replace(/,/g, "");

  return ccdecoder;
}
