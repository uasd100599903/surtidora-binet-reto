/* Surtidora Binet · comportamiento global */
(function () {
  'use strict';

  /* ---------- Almacenamiento seguro ---------- */
  function store(kind, key, value) {
    try {
      var s = kind === 'local' ? window.localStorage : window.sessionStorage;
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Modo oscuro / claro ---------- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.textContent = t === 'dark' ? 'Modo claro' : 'Modo oscuro';
      toggle.setAttribute('aria-pressed', String(t === 'light'));
    }
  }
  applyTheme(store('local', 'tema') || 'dark');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store('local', 'tema', next);
  });

  /* ---------- Menú móvil ---------- */
  var btn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (btn && menu) btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  /* ---------- Pantalla de error inicial (solo en el inicio) ---------- */
  var boot = document.getElementById('boot');
  if (boot) {
    var lines = [
      '> buscando surtidorabinet.do ...',
      '> DNS: sin respuesta',
      '> redes sociales: 0 publicaciones',
      '> respaldo local: ENCONTRADO',
      '> listo para restaurar.'
    ];
    var log = document.getElementById('boot-log');
    var bootBtn = document.getElementById('boot-btn');
    var bar = boot.querySelector('.progress');

    if (store('session', 'restaurado') === '1') {
      boot.hidden = true;
    } else {
      boot.hidden = false;
      document.body.style.overflow = 'hidden';
      bootBtn.focus();
      var i = 0;
      var typer = setInterval(function () {
        if (i < lines.length) { log.textContent += lines[i++] + '\n'; } else { clearInterval(typer); }
      }, 450);

      bootBtn.addEventListener('click', function () {
        clearInterval(typer);
        log.textContent = lines.join('\n') + '\n> restaurando...';
        bootBtn.disabled = true;
        bar.hidden = false;
        // fuerza el reflujo para que la transición de ancho arranque
        void bar.offsetWidth;
        boot.classList.add('restoring');
        setTimeout(function () {
          boot.classList.add('leaving');
          document.body.style.overflow = '';
          store('session', 'restaurado', '1');
          setTimeout(function () { boot.hidden = true; }, 650);
        }, 1800);
      });
    }
  }

  /* ---------- Easter egg: código Konami o 5 clics en el logo ---------- */
  var egg;
  function showEgg() {
    if (!egg) {
      egg = document.createElement('div');
      egg.className = 'egg';
      egg.setAttribute('role', 'dialog');
      egg.setAttribute('aria-modal', 'true');
      egg.setAttribute('aria-labelledby', 'egg-title');
      egg.innerHTML =
        '<div class="egg-box">' +
        '<h2 id="egg-title" class="glitch" data-text="Encontraste el fantasma">Encontraste el fantasma</h2>' +
        '<p>Quien nos borró dejó una puerta abierta, y tú la hallaste. Lo único que había detrás era un respaldo bien guardado.</p>' +
        '<p>Cuéntanos que lo encontraste:</p>' +
        '<a class="btn" target="_blank" rel="noopener" href="https://wa.me/18498036235?text=' +
        encodeURIComponent('Hola, encontré el secreto escondido en la web de Surtidora Binet.') + '">Avisar por WhatsApp</a> ' +
        '<button class="btn btn-ghost" type="button">Volver al sitio</button>' +
        '</div>';
      document.body.appendChild(egg);
      egg.querySelector('button').addEventListener('click', function () {
        egg.hidden = true;
        document.body.classList.remove('egg-on');
      });
    }
    egg.hidden = false;
    document.body.classList.add('egg-on');
    egg.querySelector('a').focus();
  }

  var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var pos = 0;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && egg && !egg.hidden) { egg.querySelector('button').click(); return; }
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = (k === seq[pos]) ? pos + 1 : (k === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; showEgg(); }
  });

  var logo = document.getElementById('logo');
  if (logo) {
    var clicks = 0, timer;
    logo.addEventListener('click', function (e) {
      e.preventDefault(); // el logo es un enlace: se frena para poder contar los clics
      clicks++;
      clearTimeout(timer);
      if (clicks >= 5) { clicks = 0; showEgg(); return; }
      timer = setTimeout(function () {
        var solo = clicks === 1;
        clicks = 0;
        if (solo) window.location.href = 'index.html'; // un clic simple sigue llevando al inicio
      }, 1500);
    });
  }
  console.log('%cPista 2 de 2: toca el logo cinco veces, rápido.', 'color:#19e3ff;font-size:14px');

  /* ---------- Formulario de contacto (abre WhatsApp con el mensaje) ---------- */
  var form = document.getElementById('form-contacto');
  if (form) {
    var rules = {
      'c-nombre': function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 letras).'; },
      'c-tel': function (v) { return v.replace(/\D/g, '').length >= 10 ? '' : 'Escribe un teléfono de 10 dígitos, por ejemplo 809 555 0123.'; },
      'c-msg': function (v) { return v.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.'; }
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Object.keys(rules).forEach(function (id) {
        var input = document.getElementById(id);
        var msg = rules[id](input.value);
        form.querySelector('[data-for="' + id + '"]').textContent = msg;
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg) ok = false;
      });
      if (!ok) {
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      var texto = 'Hola, soy ' + document.getElementById('c-nombre').value.trim() +
        ' (tel. ' + document.getElementById('c-tel').value.trim() + ').\n' +
        document.getElementById('c-msg').value.trim();
      window.open('https://wa.me/18498036235?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      document.getElementById('form-ok').hidden = false;
    });
  }
})();
