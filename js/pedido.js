/* Catálogo con filtros y armador de pedido que se envía por WhatsApp */
(function () {
  'use strict';
  var TEL = '18498036235';
  var cart = {};
  try { cart = JSON.parse(sessionStorage.getItem('pedido') || '{}') || {}; } catch (e) { cart = {}; }

  var lista = document.getElementById('pedido-lista');
  var vacio = document.getElementById('pedido-vacio');
  var enviar = document.getElementById('pedido-enviar');
  var nombre = document.getElementById('p-nombre');
  var entrega = document.getElementById('p-entrega');
  var notas = document.getElementById('p-notas');

  function guardar() { try { sessionStorage.setItem('pedido', JSON.stringify(cart)); } catch (e) {} }

  function texto() {
    var lineas = Object.keys(cart).map(function (n) { return '- ' + cart[n] + ' x ' + n; });
    var quien = nombre.value.trim();
    var t = 'Hola, ' + (quien ? 'soy ' + quien + '. ' : '') + 'quisiera hacer este pedido:\n' + lineas.join('\n') +
      '\nEntrega: ' + entrega.value;
    if (notas.value.trim()) t += '\nDetalles: ' + notas.value.trim();
    return t;
  }

  function pintar() {
    lista.textContent = '';
    var nombres = Object.keys(cart);
    vacio.hidden = nombres.length > 0;
    nombres.forEach(function (n) {
      var li = document.createElement('li');
      var sp = document.createElement('span'); sp.className = 'nombre'; sp.textContent = n;
      var menos = document.createElement('button'); menos.type = 'button'; menos.textContent = '−';
      menos.setAttribute('aria-label', 'Quitar una unidad de ' + n);
      var c = document.createElement('span'); c.className = 'cant'; c.textContent = cart[n];
      var mas = document.createElement('button'); mas.type = 'button'; mas.textContent = '+';
      mas.setAttribute('aria-label', 'Agregar una unidad de ' + n);
      menos.addEventListener('click', function () { cart[n]--; if (cart[n] <= 0) delete cart[n]; actualizar(); });
      mas.addEventListener('click', function () { cart[n] = Math.min(99, cart[n] + 1); actualizar(); });
      li.append(sp, menos, c, mas);
      lista.appendChild(li);
    });
    var hay = nombres.length > 0;
    enviar.setAttribute('aria-disabled', String(!hay));
    enviar.setAttribute('tabindex', hay ? '0' : '-1');
    enviar.href = hay ? 'https://wa.me/' + TEL + '?text=' + encodeURIComponent(texto()) : '#pedido';
  }
  function actualizar() { guardar(); pintar(); }

  document.querySelectorAll('.add').forEach(function (b) {
    b.addEventListener('click', function () {
      var n = b.dataset.name;
      cart[n] = Math.min(99, (cart[n] || 0) + 1);
      actualizar();
      b.textContent = 'Agregado ✓';
      setTimeout(function () { b.textContent = 'Agregar al pedido'; }, 900);
    });
  });
  [nombre, entrega, notas].forEach(function (el) { el.addEventListener('input', pintar); el.addEventListener('change', pintar); });
  document.getElementById('pedido-limpiar').addEventListener('click', function () { cart = {}; actualizar(); });

  /* Filtros del catálogo */
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      document.querySelectorAll('.producto').forEach(function (p) { p.hidden = !(f === 'todos' || p.dataset.cat === f); });
    });
  });

  pintar();
})();
