function dora(oX, oY, s) {
  // oX：起始点 x 坐标；oY：长度，s：字母间距
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', oX + (oY - oX) * 2.5 + 3 * s)
  svg.setAttribute('height', oY+20)

  let oP = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  let arr = [];
  arr.push(`M ${oX} ${oX} L ${oX} ${oY} A ${(oY - oX) * 0.5} ${(oY - oX) * 0.5} 0 0 0 ${oX} ${oX}`); // D
  arr.push(`M ${oX + (oY - oX) * 0.8 + s} ${oX} A ${(oY - oX) * 0.3} ${(oY - oX) * 0.5} 1 1 1 ${oX + (oY - oX) * 0.8 + s - 1} ${oX}`);            // O
  arr.push('Z');
  arr.push(`M ${oX + (oY - oX) * 1.1 + 2 * s} ${oX} L ${oX + (oY - oX) * 1.1 + 2 * s} ${oY} M ${oX + (oY - oX) * 1.1 + 2 * s} ${oX} A ${(oY - oX) * 0.33} ${(oY - oX) * 0.3} 1 1 1 ${oX + (oY - oX) * 1.1 + 2 * s} ${oX + (oY - oX) * 0.5} M ${oX + (oY - oX) * 1.1 + 2 * s} ${oX + (oY - oX) * 0.5} L ${oX + (oY - oX) * 1.7 + 2 * s} ${oY}`); // R
  arr.push(`M ${oX + (oY - oX) * 2 + 3 * s} ${oX} L ${oX + (oY - oX) * 1.7 + 3 * s} ${oY} M ${oX + (oY - oX) * 2 + 3 * s} ${oX} L ${oX + (oY - oX) * 2.3 + 3 * s} ${oY} M ${oX + (oY - oX) * 1.82 + 3 * s} ${oX + (oY - oX) * 0.6} L ${oX + (oY - oX) * 2.18 + 3 * s} ${oX + (oY - oX) * 0.6}`);  // A

  oP.setAttribute('d', arr.join(' '));
  // 16777216 是 FFFFFF 的十进制
  let color = Math.floor(Math.random() * 16777216).toString(16);
  while (color.length < 6) { color = '0' + color; }

  oP.style.fill = 'none'
  oP.style.stroke = '#' + color
  oP.style.strokeWidth = 6

  svg.appendChild(oP)
  document.body.appendChild(svg)
}