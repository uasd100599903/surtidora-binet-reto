/* Asistente virtual "Resu" · reglas simples, sin servidor ni datos guardados */
(function () {
  'use strict';

  var respuestas = [
    { claves: ['hola', 'buenas', 'saludos', 'hey'], texto: '¡Hola! Soy Resu, el asistente de Surtidora Binet. Puedo contarte qué pasó, qué vendemos, el horario o cómo pedir.' },
    { claves: ['pasó', 'paso', 'historia', 'borr', 'desapare', 'misterio', 'usb'], texto: 'Una noche nos borraron la página y las redes. Apareció un USB con un mensaje. Lo cuento completo en Historia del misterio.' },
    { claves: ['embutido', 'salami', 'jamon', 'jamón', 'salchicha', 'jamoneta'], texto: 'Manejamos salchichas Chef Ranchera, jamón Picnic, salamis (criollo, ahumado, argentino y latino) y jamoneta especial.' },
    { claves: ['desechable', 'plato', 'vaso', 'bandeja', 'cubierto', 'servilleta', 'funda', 'envase'], texto: 'Tenemos bandejas, vasos, platos, cubiertos, tapas, servilletas y fundas. Ideal para negocios de comida.' },
    { claves: ['salsa', 'mayonesa', 'catchup', 'mostaza', 'aderezo'], texto: 'Tenemos mostaza Baldom, mayonesa en sobres Baldom y mayonesa y catchup Espalsa en cajas de 4 galones.' },
    { claves: ['servicio', 'vend', 'ofrec', 'producto', 'catalogo', 'catálogo'], texto: 'Somos especialistas en embutidos y desechables, y también manejamos carnes, lácteos, salsas, bebidas y más. Mira el catálogo en Servicios.' },
    { claves: ['precio', 'cuesta', 'cotiz', 'cuanto', 'cuánto', 'costo'], texto: 'No publicamos precios. Arma tu pedido en Servicios y se abre WhatsApp para que te confirmemos el precio.' },
    { claves: ['delivery', 'domicilio', 'envío', 'envio', 'entrega', 'retiro'], texto: 'Puedes comprar con delivery o de forma personal en el local. En el armador de pedidos eliges cuál prefieres.' },
    { claves: ['horario', 'abren', 'cierran', 'hora', 'abierto'], texto: 'Lunes a viernes de 8:00 a. m. a 8:00 p. m. Sábados y domingos de 8:00 a. m. a 6:00 p. m.' },
    { claves: ['donde', 'dónde', 'direcci', 'ubica', 'mapa', 'queda'], texto: 'Estamos en Villa Mella, Santo Domingo Norte. En Contacto hay un mapa de la zona.' },
    { claves: ['contact', 'whatsapp', 'telef', 'llamar', 'numero', 'número'], texto: 'Escríbenos o llámanos al +1 (849) 803-6235. Respondemos por WhatsApp.' },
    { claves: ['segur', 'ataque', 'proteg', 'respaldo', 'hack'], texto: 'Ahora tenemos copias de seguridad, verificación en dos pasos y varios canales de contacto para que no nos borren otra vez.' },
    { claves: ['secreto', 'easter', 'huevo'], texto: 'Dicen que el sitio guarda un secreto. Pista: cinco clics rápidos en el logo y un código muy viejo de videojuegos.' },
    { claves: ['gracias', 'chao', 'adiós', 'adios'], texto: '¡Con gusto! Aquí estaremos, esta vez con respaldo.' }
  ];
  var porDefecto = 'No estoy seguro de eso. Prueba con: historia, embutidos, desechables, horario, delivery, ubicación o contacto.';
  var chips = ['¿Qué pasó?', 'Embutidos', 'Horario', 'Delivery'];

  function normalizar(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function responder(texto) {
    var t = normalizar(texto);
    for (var i = 0; i < respuestas.length; i++) {
      for (var j = 0; j < respuestas[i].claves.length; j++) {
        if (t.indexOf(normalizar(respuestas[i].claves[j])) !== -1) return respuestas[i].texto;
      }
    }
    return porDefecto;
  }

  /* ----- Interfaz ----- */
  var fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Abrir asistente virtual');
  fab.setAttribute('aria-expanded', 'false');
  fab.textContent = '💬';

  var panel = document.createElement('section');
  panel.className = 'chat';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Asistente virtual Resu');
  panel.innerHTML =
    '<div class="chat-head"><span>Resu · asistente</span><button type="button" aria-label="Cerrar asistente">×</button></div>' +
    '<div class="chat-log" role="log" aria-live="polite"></div>' +
    '<div class="chat-chips"></div>' +
    '<form class="chat-form"><label class="sr" for="chat-in">Escribe tu pregunta</label>' +
    '<input id="chat-in" type="text" maxlength="120" autocomplete="off" placeholder="Escribe tu pregunta">' +
    '<button type="submit">Enviar</button></form>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var log = panel.querySelector('.chat-log');
  var chipBox = panel.querySelector('.chat-chips');
  var input = panel.querySelector('#chat-in');

  function agregar(texto, quien) {
    var p = document.createElement('div');
    p.className = 'msg ' + quien;
    p.textContent = texto; // textContent: nunca se interpreta HTML del usuario
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }
  function preguntar(texto) {
    agregar(texto, 'user');
    setTimeout(function () { agregar(responder(texto), 'bot'); }, 350);
  }

  chips.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = c;
    b.addEventListener('click', function () { preguntar(c); });
    chipBox.appendChild(b);
  });

  var saludado = false;
  function abrir(estado) {
    panel.hidden = !estado;
    fab.setAttribute('aria-expanded', String(estado));
    fab.setAttribute('aria-label', estado ? 'Cerrar asistente virtual' : 'Abrir asistente virtual');
    if (estado) {
      if (!saludado) { agregar('Hola, soy Resu. Fui restaurado junto con la surtidora. ¿En qué te ayudo?', 'bot'); saludado = true; }
      input.focus();
    } else { fab.focus(); }
  }
  fab.addEventListener('click', function () { abrir(panel.hidden); });
  panel.querySelector('.chat-head button').addEventListener('click', function () { abrir(false); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrir(false); });
  panel.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) return;
    input.value = '';
    preguntar(v);
  });
})();
