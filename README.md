# 🎓 Diapositivas y Presentaciones Educativas Interactivas
> **Universidad Nacional Experimental Simón Rodríguez (UNESR)**  
> **Decanato de Postgrado y Educación Avanzada — Núcleo Apure**  
> **Maestría en Ciencias Administrativas: Gerencia del Talento Humano**  
> **Autor:** Julio Vera (`julioverx`) | **C.I:** V-26.889.534

Este repositorio contiene la plataforma interactiva de diapositivas y presentaciones académicas desarrollada en HTML5, CSS moderno y JavaScript modular, optimizada para desplegarse de forma gratuita e instantánea en **GitHub Pages**.

---

## 🚀 Despliegue en GitHub Pages

Para publicar este portal y todas sus diapositivas en internet:

### 1. Crear el repositorio en GitHub
1. Ingresa a tu cuenta de [GitHub](https://github.com/new).
2. Crea un nuevo repositorio público llamado, por ejemplo: `diapositivas` o `presentaciones-unesr`.
3. Conecta este directorio local con tu repositorio remoto ejecutando en tu terminal:

```bash
git remote add origin https://github.com/julioverx/presentaciones.git
git branch -M main
git push -u origin main
```

### 2. Activar GitHub Pages
1. En GitHub, ve a la pestaña **Settings** (Configuración) de tu repositorio.
2. En el menú lateral izquierdo, selecciona **Pages**.
3. En **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
4. Haz clic en **Save** (Guardar).
5. ¡Listo! En 1-2 minutos tu sitio estará en vivo en:
   👉 **`https://julioverx.github.io/presentaciones/`**

---

## 📁 Estructura del Proyecto

```text
Diapositivas/
├── index.html                   # 🏛️ Landing Page / Hub principal de todas las presentaciones
├── README.md                    # 📖 Documentación del repositorio
├── .gitignore                   # 🚫 Archivos ignorados por Git
├── Assets/
│   ├── Logo.svg                 # 🏛️ Logo oficial UNESR
│   ├── css/
│   │   ├── main.css             # 🎨 Estilos del Hub / Landing Page (tema claro/oscuro)
│   │   └── slide-framework.css  # 📐 Motor visual y diseño 16:9 de las diapositivas
│   ├── js/
│   │   ├── presentations.js     # 📋 Catálogo centralizado de diapositivas
│   │   └── slide-engine.js      # ⚡ Motor de navegación, teclado y pantalla completa
│   └── PDF/                     # 📄 Documentos descargables complementarios
└── Proyectos/
    ├── Etica-de-la-Profesion/
    │   └── index.html           # 💡 Presentación: "La ilusión de la edad dorada"
    └── Teorias-de-la-Administracion/
        └── Slides-1/
            └── index.html       # 📚 Presentación: "Teorías de la Administración"
```

---

## ➕ Cómo Agregar una Nueva Presentación

1. **Crea la carpeta de tu presentación:**
   Copia la plantilla dentro de `Proyectos/` (ej: `Proyectos/Mi-Nueva-Materia/Slides-1/index.html`).

2. **Personaliza el contenido:**
   Edita las diapositivas (`<section class="slide"> ... </section>`) con tus temas, conceptos y actividades.

3. **Regístrala en el catálogo:**
   Abre [`Assets/js/presentations.js`](Assets/js/presentations.js) y añade un nuevo objeto al arreglo `PRESENTATIONS`:

```javascript
{
  id: "mi-nueva-materia-slides-1",
  title: "Título de la Presentación",
  subtitle: "Subtítulo descriptivo",
  subject: "Nombre de la Asignatura",
  author: "Julio Vera",
  facilitator: "Nombre del Docente",
  date: "Mes Año",
  tags: ["Etiqueta1", "Etiqueta2"],
  url: "Proyectos/Mi-Nueva-Materia/Slides-1/index.html",
  slidesCount: 8,
  accentColor: "#2563eb"
}
```

La Landing Page principal la detectará y mostrará automáticamente con buscador y filtros.

---

## ⌨️ Controles y Atajos de Teclado durante la Exposición

| Tecla / Gesto | Acción |
| :--- | :--- |
| `→` / `Espacio` / `AvPág` | Avanzar a la siguiente diapositiva |
| `←` / `RePág` | Retroceder a la diapositiva anterior |
| `F` | Activar / desactivar Pantalla Completa |
| `O` o `Esc` | Abrir vista general en mosaico (Overview) |
| `Home` / `End` | Ir a la primera o última diapositiva |
| `?` | Abrir ayuda de atajos |
| `Swipe` táctil | Deslizar izquierda/derecha en tablets o móviles |
