import type { StaticImageData } from "next/image";

export type ArtworkCategory = "tattoos" | "cuadros" | "fotografia";

export type Artwork = {
  id: string;
  title: string;
  category: ArtworkCategory;
  technique: string;
  image: StaticImageData;
  alt: string;
  year: string;
  dimensions: string;
  medium: string;
  description: string;
  collection: string;
};


