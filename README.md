# LE SHOMS · Página web de perfumes

Sitio estático (HTML + CSS + JS, sin dependencias) listo para publicar gratis en **GitHub Pages** con la dirección **https://leshoms.github.io**.

## Archivos que hay que subir
- `index.html`: la estructura de la página
- `styles.css`: el diseño en negro y gris
- `logo.js`: la animación de entrada con el logo original (img/logo.png)
- `data.js`: la lista de perfumes con marcas y precios
- `notas.js`: las notas olfativas (salida, corazón, fondo y acordes) de cada perfume, según Fragrantica
- `script.js`: el carrusel, los filtros, el buscador y el carrito
- `img/`: el logo (`logo.jpg`) y las fotos de los perfumes (`d01.jpg`–`d68.jpg` de diseñador y `a01.jpg`–`a60.jpg` de árabes)

La carpeta `.claude/` solo sirve para la vista previa local y no hace falta subirla.

## 1. Publicar gratis en https://leshoms.github.io
1. Crea una cuenta de GitHub con el nombre de usuario **`leshoms`** en https://github.com/signup. Si ya tienes una cuenta, puedes crear una organización gratuita llamada `leshoms` en https://github.com/organizations/plan.
2. Con esa cuenta, crea un repositorio **público** llamado exactamente **`leshoms.github.io`** en https://github.com/new.
3. **Add file → Upload files**: arrastra `index.html`, `styles.css`, `script.js`, `data.js`, `logo.js`, `README.md` y la carpeta `img` completa. Pulsa **Commit changes**.
4. Ve a **Settings → Pages** y confirma que *Source* esté en **Deploy from a branch**, rama `main`, carpeta `/ (root)`.
5. En 1 o 2 minutos la web estará en **https://leshoms.github.io**.

Si el nombre `leshoms` ya estuviera ocupado, usa por ejemplo `leshomsperfumes`: el repositorio sería `leshomsperfumes.github.io` y la web, `https://leshomsperfumes.github.io`.

## 2. (Opcional, más adelante) Usar el dominio leshoms.com
GitHub Pages es gratis, pero **el dominio .com hay que comprarlo** (unos 10–15 USD al año) en un registrador como Namecheap, GoDaddy, Cloudflare o Google/Squarespace Domains. Antes, comprueba que `leshoms.com` siga disponible.

Cuando ya tengas el dominio:
1. En el panel DNS de tu registrador, crea estos registros:

   | Tipo  | Nombre / Host | Valor                    |
   |-------|---------------|--------------------------|
   | A     | @             | 185.199.108.153          |
   | A     | @             | 185.199.109.153          |
   | A     | @             | 185.199.110.153          |
   | A     | @             | 185.199.111.153          |
   | CNAME | www           | leshoms.github.io        |

2. En GitHub, en **Settings → Pages → Custom domain**, escribe `leshoms.com` y pulsa **Save**. GitHub creará automáticamente un archivo `CNAME` en el repositorio.
3. Cuando el DNS se active (puede tardar desde unos minutos hasta 24 horas), marca **Enforce HTTPS**.

> No añadas el archivo `CNAME` antes de comprar el dominio: GitHub redirigiría la web a leshoms.com y dejaría de verse.

## Personalizar
- **Precios:** en `data.js`, cada perfume tiene el formato `["Marca", "Nombre", precio]`. Cambia `null` por el precio (por ejemplo `450000`) y aparecerá con el botón "Añadir". Con `null` se muestra "Precio a consultar".
- **Añadir un perfume:** agrega una línea al final de la lista `disenador` o `arabes` y sube su foto a `img/` con el número siguiente (por ejemplo `d69.jpg` o `a61.jpg`).
- **Pedidos y formulario:** "Hacer pedido" y "Consultar" escriben el mensaje en el formulario de contacto, pero el formulario todavía no envía nada. Para recibir los mensajes por correo, conéctalo a Formspree: en `index.html`, cambia `<form id="contactForm">` por `<form id="contactForm" action="https://formspree.io/f/TU-ID" method="POST">` y borra en `script.js` el bloque que empieza con `$("#contactForm").addEventListener`. También se puede conectar a WhatsApp.
- **Notas de un perfume:** en `notas.js`, cada perfume tiene `[[salida], [corazón], [fondo], [acordes], "ruta en Fragrantica"]`. Si añades un perfume nuevo a `data.js`, añade también su línea aquí con el mismo id (por ejemplo `d69`).
