/**
 * Catálogo central de presentaciones interactivas
 * Cada elemento agregado aquí se reflejará automáticamente en la Landing Page principal.
 */
const PRESENTATIONS = [
  {
    id: "etica-profesion-edad-dorada",
    title: "La Ilusión de la Edad Dorada",
    subtitle: "Técnica, juicio ético y los nuevos dilemas algorítmicos en la gestión del trabajo",
    subject: "Ética de la Profesión",
    degree: "Maestría en Ciencias Administrativas: Gerencia del Talento Humano",
    institution: "UNESR — Decanato de Postgrado y Educación Avanzada (Núcleo Apure)",
    author: "Julio Vera",
    idNumber: "V-26.889.534",
    facilitator: "Dra. Yennis Sarmiento",
    date: "Noviembre 2026",
    location: "Biruaca, Venezuela",
    tags: ["Ética", "Algoritmos", "Talento Humano", "Inteligencia Artificial", "Gestión Laboral"],
    url: "Proyectos/Etica-de-la-Profesion/Slides-1/index.html",
    pdfUrl: null,
    essayUrl: "Proyectos/Etica-de-la-Profesion/Slides-1/ensayo.pdf",
    slidesCount: 13,
    status: "Disponible",
    featured: true,
    accentColor: "#2563eb",
    summary: "Análisis crítico sobre la automatización algorítmica en la gestión de recursos humanos y la necesidad ineludible del juicio ético profesional frente al reduccionismo técnico."
  },
  {
    id: "teorias-administracion-slides-1",
    title: "Teorías de la Administración: Fundamentos y Evolución",
    subtitle: "De la administración clásica al enfoque sistémico y contingencial",
    subject: "Teorías de la Administración",
    degree: "Maestría en Ciencias Administrativas: Gerencia del Talento Humano",
    institution: "UNESR — Decanato de Postgrado y Educación Avanzada",
    author: "Julio Vera",
    idNumber: "V-26.889.534",
    facilitator: "Cátedra de Administración",
    date: "Noviembre 2026",
    location: "Biruaca, Venezuela",
    tags: ["Administración Clásica", "Taylor & Fayol", "Enfoque Humanista", "Sistemas"],
    url: "Proyectos/Teorias-de-la-Administracion/Slides-1/index.html",
    pdfUrl: null,
    slidesCount: 6,
    status: "Disponible",
    featured: false,
    accentColor: "#059669",
    summary: "Recorrido dinámico por las principales escuelas del pensamiento administrativo, destacando sus aportes a la comprensión moderna de las organizaciones."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRESENTATIONS;
}
