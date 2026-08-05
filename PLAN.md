# PLAN.md — Roadmap de Mejoras

## Fase 0: Setup del proyecto
- [x] Crear `.clinerules`
- [x] Crear `PLAN.md`
- [x] Inicializar repo Git y hacer commit inicial (`v1.0.0`)
- [x] Crear repo en GitHub y subir `main`
- [x] Desplegar en Netlify (deploy automático desde GitHub) — https://candid-vacherin-52f2af.netlify.app

## Fase 1: Mejoras (1 commit / mejora, probar en navegador antes de commit)

### 1. Separar JS en módodos ✅ (commit 411b8e0)
**Archivos**: Extraer JS monolítico en `js/app.js`, `js/questions.js`, `js/flashcards.js`, `js/games.js`, `js/exam.js`
**Prueba**: Todas las funcionalidades (apuntes, flashcards, juegos, examen) deben funcionar igual que antes.

### 2. Mejorar accesibilidad ✅ (commit 5a1ff0a)
**Archivos**: `index.html`
**Cambios**: Añadir `aria-label`, `role`, `alt` texts a SVG y botones, landmarks semánticos (`<nav>`, `<main>`, `<aside>`)
**Prueba**: Navegar con tabulación, verificar lectores de pantalla (inspeccionar con DevTools > Accessibility).

### 3. Lazy loading mejorado de iframes ✅ (commit 6c653af)
**Archivos**: `index.html`
**Cambios**: Añadir placeholder con thumbnail usando `srcdoc` y cargar solo cuando sea visible (IntersectionObserver).
**Prueba**: Abrir red lenta en DevTools, los iframes deben cargar solo al hacerse visibles.

### 4. Externalizar banco de preguntas ✅ (commit 411b8e0)
**Archivos**: Mover `const QB = [...]` de `index.html` a `js/questions.js`
**Cambios**: El array QB queda en su propio módulo.
**Prueba**: Flashcards y examen deben funcionar exactamente igual.

### 5. Service Worker + PWA ✅ (commit bb6f9f7)
**Archivos**: `sw.js`, `manifest.json`, modificar `index.html` (registrar SW + link manifest)
**Prueba**: En DevTools > Application > Service Workers, verificar que se registra y cachea correctamente. Abrir en modo offline.

### 6. Scrollspy más refinado ✅ (commit 9717e86)
**Archivos**: `index.html` (JS en app.js)
**Cambios**: Mejorar el tracking de sección activa con IntersectionObserver + indicar progreso en sidebar.
**Prueba**: Scrollear por los 10 módulos, el sidebar debe marcar correctamente la sección actual.

### 7. Feedback auditivo en examen ✅ (commit bf99a57)
**Archivos**: `index.html` (JS en exam.js)
**Cambios**: Usar Web Audio API para generar tonos suaves al acertar/fallar (opcional con toggle).
**Prueba**: Activar sonido, responder correcta/incorrectamente, verificar que suena.


### 8. Contador de flashcards ✅ (commit 367233b)
**Archivos**: `index.html` (JS en flashcards.js)
**Cambios**: Mostrar "Tarjeta X / Y" y barra de progreso.
**Prueba**: Navegar flashcards, verificar que el contador avanza correctamente.

### 9. Temporizador configurable ✅ (commit 241be85)
**Archivos**: `index.html` (JS en exam.js, HTML en inicio de examen)
**Cambios**: Añadir selector de dificultad (Fácil: 90s, Normal: 60s, Difícil: 30s).
**Prueba**: Iniciar examen con cada dificultad, verificar tiempo límite.

### 10. Dark Mode ✅ (commit 994ee6e)
**Archivos**: `index.html`
**Cambios**: Añadir toggle, variables CSS para dark mode, persistencia en localStorage, respetar `prefers-color-scheme`.
**Prueba**: Toggle, recargar página (debe persistir), verificar en modo oscuro del sistema.

### 11. Progreso persistente en localStorage ✅ (commit 940ae5b)
**Archivos**: `index.html`, `js/exam.js`, `js/flashcards.js`
**Cambios**: Guardar estado de flashcards vistas y último examen, permitir retomar.
**Prueba**: Completar parcialmente flashcards, recargar, verificar que se retoma desde donde se dejó.

### 12. Exportar reporte a PDF
**Archivos**: `index.html` (JS en exam.js)
**Cambios**: Usar `window.print()` mejorado con estilo específico para PDF o librería ligera.
**Prueba**: Hacer un examen, generar PDF, verificar formato.

---

## Notas importantes
- Cada tarea debe **probarse en navegador local** antes de commit (F12, consola limpia)
- No romper funcionalidad existente
- 1 commit por mejora, mensajes semánticos
- Push a `main` → Netlify despliega automáticamente