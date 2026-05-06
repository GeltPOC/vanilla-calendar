# 📅 Vanilla Calendar

Calendario interactivo completo con JavaScript Vanilla (lógica pura sin frameworks), construido sobre Next.js como plataforma de despliegue.

## ✨ Características

- **Navegación mensual** — Botones anterior/siguiente + botón "Hoy"
- **Resaltado del día actual** — Destacado con color púrpura
- **Días de semana en español** — Lu, Ma, Mi, Ju, Vi, Sá, Do
- **Grilla completa** — Días del mes anterior/siguiente en gris
- **Modal de eventos** — Click en cualquier día para agregar eventos/notas
- **Lista de eventos** — Los eventos se muestran en el día correspondiente
- **Persistencia** — Los eventos se guardan en `localStorage`
- **Eliminar eventos** — Botón de eliminar en cada evento (en chip y en modal)
- **Diseño responsivo** — Mobile-friendly con paleta púrpura/índigo moderna
- **Accesibilidad** — ARIA labels, navegación por teclado (Enter, Space, Escape)

## 🚀 Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🖥️ Producción con PM2

```bash
npm run build
pm2 start ecosystem.config.js
```

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── globals.css       # Estilos del calendario (CSS moderno)
│   ├── layout.tsx        # Layout raíz
│   └── page.tsx          # Página principal
└── components/
    └── CalendarApp.tsx   # Componente React + lógica vanilla JS
```

## 🎨 Paleta de colores

- **Primario:** Púrpura `#7c3aed`
- **Acento:** Índigo `#4f46e5`
- **Fondo:** Gradiente suave lavanda
- **Hover:** Efectos sutiles con sombra

## 🔧 Variables de entorno

No se requieren variables de entorno para este proyecto.
