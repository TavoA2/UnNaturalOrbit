import nightPainting from "@/public/images/gallery/night-painting.webp";
import botanicalTattoo from "@/public/images/gallery/botanical-tattoo.webp";
import flowersPhoto from "@/public/images/gallery/flowers-photo.webp";
import charcoalFigure from "@/public/images/gallery/charcoal-figure.webp";
import type { Artwork, ArtworkCategory } from "@/types/artwork";

export const artworkCategories: { id: "all" | ArtworkCategory; label: string }[] = [
  { id: "all", label: "Todo el archivo" },
  { id: "tattoos", label: "Tattoos" },
  { id: "cuadros", label: "Cuadros" },
  { id: "fotografia", label: "Fotografía" },
];

// Original AI-generated examples. Replace images and metadata together when real work is supplied.
export const artworks: Artwork[] = [
  {
    id: "el-peso-de-la-noche",
    title: "El peso de la noche",
    category: "cuadros",
    technique: "Óleo",
    image: nightPainting,
    alt: "Pintura abstracta con una forma marfil sobre un horizonte vino y negro, con textura de óleo.",
    year: "2026",
    dimensions: "60 × 80 cm · Medida de ejemplo",
    medium: "Óleo sobre lienzo · Ficha de ejemplo",
    description: "Hay paisajes que solo aparecen cuando cerramos los ojos. Una exploración del silencio, de lo que pesa y de la luz que permanece.",
    collection: "Estudios de la noche",
  },
  {
    id: "lo-que-crece-en-la-sombra",
    title: "Lo que crece en la sombra",
    category: "tattoos",
    technique: "Línea fina",
    image: botanicalTattoo,
    alt: "Tatuaje botánico de línea fina en un antebrazo, con una rama de espinas y una pequeña polilla.",
    year: "2026",
    dimensions: "18 × 7 cm · Medida de ejemplo",
    medium: "Tinta negra · Diseño de ejemplo",
    description: "Una rama que encuentra su camino entre las sombras. Un estudio de líneas delicadas, formas orgánicas y pequeñas transformaciones.",
    collection: "Herbario nocturno",
  },
  {
    id: "lo-que-permanece",
    title: "Lo que permanece",
    category: "fotografia",
    technique: "Naturaleza muerta",
    image: flowersPhoto,
    alt: "Lirios marfil ligeramente marchitos en un jarrón oscuro, iluminados tenuemente sobre un fondo burdeos.",
    year: "2026",
    dimensions: "Formato vertical · Serie de ejemplo",
    medium: "Fotografía conceptual · Imagen generada",
    description: "La belleza también habita en lo que cambia. Flores, un poco de luz y el paso lento del tiempo.",
    collection: "La memoria de las cosas",
  },
  {
    id: "donde-termina-el-ruido",
    title: "Donde termina el ruido",
    category: "cuadros",
    technique: "Carboncillo",
    image: charcoalFigure,
    alt: "Dibujo al carboncillo de una figura de espaldas sobre papel marfil, con trazos sueltos y bordes difuminados.",
    year: "2026",
    dimensions: "42 × 59 cm · Medida de ejemplo",
    medium: "Carboncillo sobre papel · Ficha de ejemplo",
    description: "Un gesto suspendido antes de decir algo. La figura se deshace en el papel y deja espacio para lo que todavía no tiene nombre.",
    collection: "Formas del silencio",
  },
];

export function categoryLabel(category: ArtworkCategory) {
  return artworkCategories.find(item => item.id === category)?.label ?? category;
}


