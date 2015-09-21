// blinker
var blinker=document.querySelectorAll('.blink')[0];
var color_default = 'lime';

// recursion avoids infinitely growing call stack of setInterval
function func () {
  var color = blinker.style.backgroundColor;
  var isDefault = color === color_default;

  blinker.style.backgroundColor = isDefault ? '' : color_default;
  setTimeout(func, 600);
}
setTimeout(func, 600);
