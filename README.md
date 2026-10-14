# Surtidora Binet S.R.L. · Hackeando el futuro de una pyme

Reto individual de Lenguaje de Programación III (INF5160-18).
Sitio web estático de 3 páginas (HTML, CSS y JavaScript puros, sin dependencias) construido sobre el negocio real **Surtidora Binet**, de Villa Mella, con sus fotos, productos, horario y contacto.

## La historia
La surtidora fue "borrada" de internet de la noche a la mañana: página, redes y presencia en buscadores.
El relato del incidente es **ficticio** (parte del reto); los productos y datos del negocio son reales.

## Páginas
| Archivo | Contenido |
|---|---|
| `index.html` | Historia del misterio: pantalla de error inicial, cronología y fotos del local |
| `servicios.html` | Servicios reinventados: catálogo con filtros, armador de pedidos por WhatsApp y "Escudo anti-borrado" |
| `contacto.html` | Contacto real, formulario validado, mapa y pruebas del incidente (registro y evidencias) |

## Requisitos del reto
- **HTML:** estructura semántica (`header`, `nav`, `main`, `section`, `article`, `figure`, `time`, `address`, `table`), enlace "saltar al contenido" y etiquetas ARIA.
- **CSS:** identidad azul marino y dorado del negocio con acentos rojo y cian, efecto *glitch*, escaneo de pantalla, diseño responsive y respeto a `prefers-reduced-motion`.
- **JavaScript:**
  - Pantalla de error 404 inicial que se "recupera" con un clic (una vez por sesión).
  - Easter egg: código Konami (↑ ↑ ↓ ↓ ← → ← → B A) o 5 clics rápidos en el logo.
  - Asistente virtual "Resu" (`js/chatbot.js`) con los productos, horario y contacto reales.
- **Extras (2 puntos):**
  - Integración con APIs: mapa de OpenStreetMap y pedido en línea que abre WhatsApp (`wa.me`) con el mensaje ya escrito.
  - Modo oscuro / claro con la preferencia guardada (el modo claro usa los colores del sitio original).

## Seguridad aplicada
- Política de seguridad de contenido (CSP) por `<meta>`: sin scripts ni estilos en línea.
- El chatbot y el carrito escriben con `textContent` (no interpretan HTML del usuario).
- Validación del formulario y límites de longitud.
- Almacenamiento del navegador envuelto en `try/catch`.

## Cómo ejecutarlo
Abre `index.html` en el navegador, o con un servidor local:

```bash
python3 -m http.server 8000
```

## Cómo publicarlo en GitHub (entrega)
```bash
git init
git add .
git commit -m "Reto: Hackeando el futuro de una pyme"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```
Luego, en GitHub: **Settings → Collaborators → Add people** e invita al usuario **edianfranklin**.

## Nota
La ubicación del mapa es aproximada (zona de Villa Mella). Ajusta las coordenadas en `contacto.html` si quieres marcar el local exacto.
