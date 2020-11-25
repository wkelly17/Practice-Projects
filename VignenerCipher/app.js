const encryptionMessage = document.querySelector('#EncryptionMessage');
const decryptionMessage = document.querySelector('#decryptionMessage');
console.log(decryptionMessage);

const encryptBtn = document.querySelector('.encryptBtn');
const decryptBtn = document.querySelector('.decryptBtn');
const clearBtn = document.querySelector('.clearBtn');
let values = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  6: 'G',
  7: 'H',
  8: 'I',
  9: 'J',
  10: 'K',
  11: 'L',
  12: 'M',
  13: 'N',
  14: 'O',
  15: 'P',
  16: 'Q',
  17: 'R',
  18: 'S',
  19: 'T',
  20: 'U',
  21: 'V',
  22: 'W',
  23: 'X',
  24: 'Y',
  25: 'Z',
};

let alphabet = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25,
};

console.log(alphabet);

// ex: E on  0 - 25 (alphabet) = 5;
// y on 0-25 = 24.   24 + 5 = 29 mod 26 = 3 = C;
function createKey(messageLength) {
  //   debugger;
  //non probably long key and short message

  let initialKey = document.querySelector('#providedKey');
  let generatedKey = '';
  if (initialKey.value.length > messageLength) {
    generatedKey = initialKey.value.substring(0, messageLength);
  } else
    for (let i = 0; generatedKey.length < messageLength; i++) {
      if (i >= initialKey.value.length) {
        i = 0;
      }
      generatedKey += initialKey.value[i];
    }
  generatedKey = generatedKey.toUpperCase();
  return generatedKey;
}

function encrypt(event) {
  let generatedKey = createKey(encryptionMessage.textLength);
  let encryption = encryptionMessage.value.toUpperCase();
  for (
    let i = 0;
    decryptionMessage.value.length < encryptionMessage.value.length;
    i++
  ) {
    let letter = '';
    if (!alphabet.hasOwnProperty(encryption[i])) {
      letter = encryption[i];
      decryptionMessage.value += letter;
    } else {
      letter = (alphabet[encryption[i]] + alphabet[generatedKey[i]]) % 26;
      decryptionMessage.value += values[letter];
    }
  }
}

function decrypt(event) {
  let generatedKey = createKey(decryptionMessage.textLength);
  let decryption = decryptionMessage.value.toUpperCase();
  for (
    let i = 0;
    encryptionMessage.value.length < decryptionMessage.value.length;
    i++
  ) {
    let letter = '';
    if (!alphabet.hasOwnProperty(decryption[i])) {
      letter = decryption[i];
      encryptionMessage.value += letter;
    } else {
      letter = (alphabet[decryption[i]] - alphabet[generatedKey[i]] + 26) % 26;
      encryptionMessage.value += values[letter];
    }
  }
}
function clearTextFields() {
  decryptionMessage.value = '';
  encryptionMessage.value = '';
}

//todo: Make a decrypter and other user stories, but these work;
//todo: refactor into class?
//todo: Handle upper and lowerCase letters?
//? refactor to handle more punctuation and etc;

encryptBtn.addEventListener('click', encrypt);
decryptBtn.addEventListener('click', decrypt);
clearBtn.addEventListener('click', clearTextFields);
