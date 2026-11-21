/**
 * Catálogo central de presentaciones interactivas
 * Cada elemento agregado aquí se reflejará automáticamente en la Landing Page principal.
 */
const PRESENTATIONS = [
  {
    id: "etica-profesion-edad-dorada",
    title: "El Problema de la Nostalgia",
    subtitle: "Técnica, juicio ético y los nuevos dilemas algorítmicos en la gestión del trabajo",
    subject: "Ética de la Profesión",
    degree: "Maestría en Ciencias Administrativas: Gerencia del Talento Humano",
    institution: "UNESR — Decanato de Postgrado y Educación Avanzada (Núcleo Apure)",
    author: "Julio Vera",
    idNumber: "V-26.889.534",
    facilitator: "Dra. Yennys Sarmiento",
    date: "Noviembre 2026",
    location: "Biruaca, Venezuela",
    tags: ["Ética", "Algoritmos", "Talento Humano", "Inteligencia Artificial", "Gestión Laboral"],
    url: "Proyectos/Etica-de-la-Profesion/Slides-1/index.html",
    pdfUrl: "Ensayos/Etica-de-la-Profesion/Slides-1/ensayo.pdf",
    essayUrl: "Ensayos/Etica-de-la-Profesion/Slides-1/ensayo.pdf",
    slidesCount: 15,
    status: "Disponible",
    featured: true,
    accentColor: "#2563eb",
    summary: "Análisis crítico sobre la nostalgia laboral, el reduccionismo técnico y los dilemas algorítmicos (ATS, BPE, Bossware) en la gestión moderna del talento humano."
  },
  {
    id: "teorias-administracion-caso-fuso",
    title: "Análisis de Caso Sistemático: Caso FUSÓ",
    subtitle: "Reestructuración organizacional y adaptación contingencial en entornos VUCA/BANI",
    subject: "Teorías de la Administración",
    degree: "Maestría en Ciencias Administrativas: Gerencia del Talento Humano",
    institution: "UNESR — Decanato de Postgrado y Educación Avanzada (Núcleo Apure)",
    author: "Julio Vera & Mabri Herrera",
    idNumber: "V-26.889.534 / V-14.694.959",
    facilitator: "Dra. Maira Ruíz",
    date: "Noviembre 2026",
    location: "Biruaca, Venezuela",
    tags: ["VUCA", "BANI", "Entropía", "Neguentropía", "Bertalanffy", "Caso FUSÓ", "Contingencia"],
    url: "Proyectos/Teorias-de-la-Administracion/Slides-1/index.html",
    pdfUrl: "Ensayos/Teorias-de-la-Administracion/Slides-1/caso-fuso.pdf",
    essayUrl: "Ensayos/Teorias-de-la-Administracion/Slides-1/caso-fuso.pdf",
    slidesCount: 8,
    status: "Disponible",
    featured: true,
    accentColor: "#0f2e5a",
    summary: "Auditoría organizacional y reestructuración de FlyAds Agency hacia FUSÓ bajo la Teoría General de Sistemas, el Enfoque Contingencial y el cruce de entornos VUCA/BANI."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRESENTATIONS;
}
