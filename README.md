# BasquetPro · Compendio Interactivo de Baloncesto

> Plataforma educativa interactiva para el estudio de la metodología técnica y táctica del baloncesto.

🔗 **Demo en vivo**: [https://apuntes-basket2.netlify.app](https://apuntes-basket2.netlify.app)

---

## 📚 Descripción

**BasquetPro** es una aplicación web progresiva (PWA) que funciona como compendio interactivo de baloncesto. Está diseñada para estudiantes, entrenadores y jugadores que desean aprender y repasar conceptos técnicos, reglamentarios y tácticos del baloncesto de forma dinámica y entretenida.

### Características principales

- 📘 **10 módulos educativos** con contenido teórico completo
- 🃏 **Flashcards de memoria** para repaso activo con modo estudio individual
- 🎮 **Mini-juegos educativos** (matching y pizarra táctica)
- 🧪 **Examen de autoevaluación** con 150+ preguntas y temporizador configurable
- 📊 **Retroalimentación inmediata** con explicaciones detalladas
- 🔊 **Feedback auditivo** al responder preguntas (opcional)
- 🌙 **Modo oscuro** con persistencia en localStorage
- 💾 **Progreso persistente** — retoma flashcards y exámenes donde los dejaste
- 📄 **Exportación a PDF** de resultados del examen
- 📱 **Diseño responsive** y accesible (ARIA labels, navegación por teclado)
- ⚡ **PWA** — funciona offline con service worker

---

## 🛠️ Stack Tecnológico

- **HTML5** + **CSS3** + **Vanilla JavaScript** (sin frameworks ni bundlers)
- **Google Fonts**: Poppins + Inter
- **LocalStorage** para persistencia de datos
- **Service Worker** para funcionalidad offline
- **Web Audio API** para feedback auditivo

---

## 📁 Estructura del Proyecto

```
basketball-apuntes-2/
├── index.html          # Aplicación principal (SPA monolítica)
├── js/
│   ├── app.js          # Inicialización, tabs, scrollspy, sidebar
│   ├── questions.js    # Banco de preguntas (150+ preguntas)
│   ├── flashcards.js   # Lógica de flashcards y modo estudio
│   ├── games.js        # Minijuegos educativos
│   └── exam.js         # Sistema de examen con temporizador
├── sw.js               # Service Worker (PWA / modo offline)
├── manifest.json       # PWA manifest
├── .clinerules         # Convenciones de código y flujo de trabajo
├── PLAN.md             # Roadmap de mejoras
└── README.md           # Este archivo
```

---

## 🚀 Inicio Rápido

### Requisitos

- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor local HTTP (para desarrollo) — ej: `npx serve` o la extensión Live Server de VS Code

### Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/ovedfs/basketball-apuntes-2.git
cd basketball-apuntes-2

# Servir con Node.js (requiere Node instalado)
npx serve -s -l 5500 .

# O abrir directamente index.html en tu navegador
# (algunas funcionalidades requieren servidor HTTP)
```

Abre [http://localhost:5500](http://localhost:5500) en tu navegador.

---

## 🎯 Funcionalidades por Módulo

### 📘 Apuntes
- 10 módulos de contenido teórico sobre baloncesto
- Progreso de lectura con barra superior
- Sidebar con índice navegable
- Scrollspy que resalta la sección actual

### 🃏 Flashcards
- **Modo cuadrícula**: explora todas las flashcards con animación 3D flip
- **Modo estudio**: navega secuencialmente con contador "Tarjeta X / Y" y barra de progreso
- **Persistencia**: recuerda la última tarjeta estudiada
- Navegación por teclado (Enter/Espacio para girar)

### 🎮 Mini-Juegos
- **Matching**: relaciona conceptos con sus definiciones
- **Pizarra táctica**: diagramas interactivos de jugadas

### 🧪 Examen
- 30 preguntas aleatorias de un banco de 150+
- **3 dificultades**: Fácil (90s), Normal (60s), Difícil (30s) por pregunta
- Retroalimentación inmediata con explicación
- **Feedback auditivo** al acertar/fallar (opcional)
- **Retomar examen** si lo interrumpes
- **Terminar en cualquier momento** — no es necesario contestar todas las preguntas
- Exportación a PDF del reporte detallado

---

## 🧪 Testing

Dado que es una SPA monolítica sin frameworks de testing, la prueba se realiza manualmente:

1. **Flashcards**: Navegar entre tarjetas, verificar contador y barra de progreso, recargar página
2. **Examen**: Iniciar examen, responder preguntas, verificar temporizador, terminar anticipadamente, exportar PDF
3. **Navegación**: Cambiar entre tabs, verificar scrollspy y sidebar
4. **Accesibilidad**: Navegar por teclado (Tab, Enter, Espacio)
5. **Modo oscuro**: Toggle, recargar página, verificar persistencia
6. **PWA**: Verificar registro del service worker en DevTools > Application > Service Workers
7. **Offline**: Activar modo offline en DevTools, recargar página

---

## 🔧 Convenciones de Código

- **CSS**: Variables CSS personalizadas (`--naranja`, `--azul`, `--fondo`, etc.)
- **IDs y clases**: kebab-case
- **JavaScript**: camelCase para variables y funciones
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` — nueva funcionalidad
  - `fix:` — corrección de bugs
  - `refactor:` — cambio de estructura sin cambiar comportamiento
  - `a11y:` — mejora de accesibilidad
  - `perf:` — mejora de rendimiento
  - `chore:` — tareas de infraestructura

---

## 📊 Roadmap

Ver [PLAN.md](./PLAN.md) para el listado completo de mejoras planificadas.

### Completado
- ✅ Separación de JS en módulos
- ✅ Accesibilidad (ARIA labels, landmarks, skip-link)
- ✅ Lazy loading de iframes con IntersectionObserver
- ✅ PWA con Service Worker y manifest
- ✅ Scrollspy refinado con indicador de progreso
- ✅ Contador de flashcards y barra de progreso
- ✅ Temporizador configurable en examen
- ✅ Modo oscuro con toggle y persistencia
- ✅ Feedback auditivo en examen (Web Audio API)
- ✅ Progreso persistente en localStorage
- ✅ Exportación a PDF mejorada

---

## 🌐 Despliegue

El proyecto se despliega automáticamente en **Netlify** mediante CI/CD desde GitHub.

Cada push a `main` dispara un nuevo deploy.

---

## 📝 Licencia

Este proyecto es de uso educativo. Consulta la licencia del repositorio para más detalles.

---

## 👨‍💻 Autor

**Obed** — [GitHub](https://github.com/ovedfs)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue en GitHub.

---

**Hecho con ❤️ y 🏀 para la comunidad del baloncesto**