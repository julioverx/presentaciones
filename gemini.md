# 🧠 GEMINI.MD — Manual de Operaciones y Contexto Obligatorio
> **ESTE ARCHIVO DEBE SER CONSULTADO OBLIGATORIAMENTE AL INICIO DE CADA SESIÓN Y ANTES DE EJECUTAR CUALQUIER TAREA EN ESTE REPOSITORIO.**

---

## 1. Directriz Suprema de Estilo: "Ortogonal, Limpio y Editorial" (El Estilo Julio Vera)
Queda **estrictamente prohibido el diseño 'tech genérico de IA'** (sin fondos con partículas plexus, sin degradados de neón, sin badges flotantes con bordes redondeados tipo píldora, sin sombras difusas exageradas ni separadores innecesarios).

El lenguaje visual de este proyecto se rige por el sistema de diseño editorial y ortogonal definido por Julio Vera en su manual de marca (*Método de Valoración, Estrategia, Resultados y Activación*):

1. **Ortogonalidad y Retícula Suiza:**
   - Líneas limpias, cajas rectangulares nítidas con esquinas rectas o radio mínimo (0 a 4px).
   - Encabezados de cajas con lengüetas o bloques sólidos en azul marino profundo (`#0f2e5a` / `#0a2540`) con texto blanco en negrita.
   - Paginación minimalista en la esquina inferior derecha con cajón rectangular: `[ N | Total ]`.
   - Mucho aire, jerarquía tipográfica espaciosa y márgenes respirables.
2. **Tipografía Exclusiva:**
   - **Figtree** (Google Fonts).
   - Títulos con peso `700` / `800` (Bold), subtítulos y etiquetas en `500` (Medium), cuerpo en `400` / `500` con interlineado generoso (1.5 - 1.6).
3. **Paleta Cromática Oficial:**
   - **Fondo:** Blanco puro (`#ffffff`) o gris neutro ultraclaro (`#f8fafc`).
   - **Azul Primario / Tinta:** `#0f2e5a` (Navy profundo / azul institucional).
   - **Azul Acento:** `#1e3a8a` / `#2563eb` (utilizado con mesura funcional).
   - **Textos:** `#0f172a` (Títulos) y `#334155` (Párrafos y descripciones).
   - **Líneas y bordes:** Trazo fino de 1px (`#0f2e5a` o `#cbd5e1`).

---

## 2. Regla Inquebrantable: La Portada (Slide 1 / Ejemplo Oficial)
La primera diapositiva de cada presentación **DEBE calcar con precisión milimétrica la composición de `Assets/Ejemplo` (`.svg` / `.pdf` / `.png`)**:

- **Fondo:** Plano y limpio (sin efectos, sin plexus).
- **Arriba Izquierda:** Logo oficial (`Assets/Logo.svg`).
- **Membrete Superior:** Ubicado inmediatamente a la derecha del logo, en un solo bloque tipográfico alineado, **SIN línea separadora abajo y SIN pastillas de color**:
  ```text
  REPÚBLICA BOLIVARIANA DE VENEZUELA
  UNIVERSIDAD NACIONAL EXPERIMENTAL SIMÓN RODRÍGUEZ
  DECANATO DE POSTGRADO Y EDUCACIÓN AVANZADA — NÚCLEO APURE
  MAESTRÍA EN CIENCIAS ADMINISTRATIVAS: GERENCIA DEL TALENTO HUMANO
  CURSO: [NOMBRE DE LA ASIGNATURA EN MAYÚSCULAS Y NEGRILLA]
  ```
- **Título en el Medio:** Alineado a la izquierda con el margen del logo:
  - Título principal en **Figtree Bold (negrita)**.
  - Subtítulo o continuación en **Figtree Medium**.
- **Créditos (Debajo del Título en 2 Columnas):**
  - **Columna 1:**
    `FACILITADOR(A)` (Figtree Bold)  
    `[NOMBRE COMPLETO]` (Figtree Medium)
  - **Columna 2:**
    `PARTICIPANTE` (Figtree Bold)  
    `JULIO VERA | V-26.889.534` (Figtree Medium)
- **Pie Inferior Izquierdo:**
  `BIRUACA, [MES] DE [AÑO]` (Figtree Bold, mayúsculas).

---

## 3. Política de Privacidad y Discreción
- El repositorio, la Landing Page (`index.html`) y el `README.md` deben ser **sobrios, discretos y minimalistas**.
- **No sobreexponer identidad:** No usar frases como "Repositorio público de Julio Vera para la universidad", ni exponer correos, teléfonos o datos privados innecesarios en el Hub público.
- La Landing Page principal funciona como un visor/catálogo limpio y profesional llamado **Presentaciones**.

---

## 4. Organización de Carpetas
```text
Diapositivas/
├── gemini.md                              # 🧠 Contexto obligatorio permanente
├── index.html                            # 🏛️ Landing Page / Visor central
├── README.md                             # 📖 Documentación limpia y discreta
├── .gitignore                            # 🚫 Filtros de Git
├── Assets/
│   ├── Logo.svg                          # 🏛️ Logo oficial UNESR
│   ├── Ejemplo.svg / .pdf / .png         # 📐 Referencia exacta de la portada
│   ├── css/
│   │   ├── main.css                      # Estilos ortogonales del hub
│   │   └── slide-framework.css           # Framework ortogonal de diapositivas 16:9
│   └── js/
│       ├── presentations.js              # Catálogo centralizado de diapositivas
│       └── slide-engine.js               # Motor de navegación y teclado
│
├── Transcripciones/                      # 🎙️ Transcripciones de clases en Markdown (.md)
│   ├── Etica-de-la-Profesion/
│   └── Teorias-de-la-Administracion/
│
└── Proyectos/
    ├── Etica-de-la-Profesion/
    │   └── Slides-1/                     # 🎯 Presentación específica
    │       ├── index.html                # Diapositivas web interactivas ortogonales
    │       ├── croquis.md                # Boceto de láminas
    │       ├── ensayo.md                 # Ensayo base en Markdown
    │       └── evaluacion.md             # Rúbrica de la profesora
    └── Teorias-de-la-Administracion/
        └── Slides-1/
            └── index.html
```

---

## 5. Protocolo Autónomo de Git
- **El usuario NO ejecuta comandos de Git.** Antigravity hace `git add .`, `git commit` y `git push origin main` de manera automática en cada sesión.
- Si se requiere `git pull`, se procede con la autorización general ya otorgada.
