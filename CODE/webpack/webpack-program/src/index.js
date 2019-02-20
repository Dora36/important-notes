require('./index.css');
require('./aaaa.less');

import logo from './img/logo.jpg';
console.log(logo);
let image = new Image();
image.src =logo;
document.body.appendChild(image);




  let str = require('./a.js');

console.log(str);


let fn = ()=>{
  console.log('dora author');
};

fn();

let xhr = new XMLHttpRequest();

xhr.open('GET','/api/user',true);

xhr.onload = function () {
  console.log(xhr.response);
};

xhr.send();
