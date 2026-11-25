export interface CollectionItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  bgGradient: string;
  swatches: string[];
  href: string;
  cataloguePdf?: string;
}

export const collections: CollectionItem[] = [
  {
    id: "hybrid-lam",
    name: "Hybrid Lam",
    tagline: "Always ahead",
    description: "Premium laminate with an Anti Yellow Warranty, made to keep its shade.",
    coverImage: "/img/cover-hybrid-lam.jpg",
    bgGradient: "linear-gradient(135deg, #9A6A58, #3B5B5F)",
    swatches: ["#B48774", "#A19A90", "#CEB6AC", "#356267"],
    href: "/collection-hybrid-lam.html",
    cataloguePdf: "/catalogue/premier-hybrid-lam-catalogue.pdf"
  },
  {
    id: "versace-6h",
    name: "Versace 6H",
    tagline: "6H scratch grade",
    description: "100% pure virgin acrylic, 1.5 mm thick, with a 6H scratch grade.",
    coverImage: "/img/cover-versace-6h.jpg",
    bgGradient: "linear-gradient(135deg, #4C513A, #2B2F20)",
    swatches: ["#4C513A", "#888C75", "#F5ECDC", "#BB9A77"],
    href: "/collection-versace-6h.html",
    cataloguePdf: "/catalogue/premier-versace-6h-catalogue.pdf"
  },
  {
    id: "imazica",
    name: "Imazica",
    tagline: "Design that comes alive",
    description: "Designer acrylic laminates for kids’ spaces. Beautiful walls, long-lasting smiles.",
    coverImage: "/img/cover-imazica.jpg",
    bgGradient: "linear-gradient(135deg, #1F8582, #0F5B63)",
    swatches: ["#34ACAA", "#EE3B7D", "#F37332", "#F68BA9"],
    href: "/collection-imazica.html",
    cataloguePdf: "/catalogue/premier-imazica-catalogue.pdf"
  },
  {
    id: "jutex",
    name: "Jutex",
    tagline: "Natural texture",
    description: "A textured Premier laminate collection with a natural character.",
    coverImage: "/img/cover-jutex.jpg",
    bgGradient: "linear-gradient(135deg, #6B5232, #33271A)",
    swatches: ["#8A6B43", "#C9A66B", "#E8D8B8", "#3F4A36"],
    href: "/collection-jutex.html"
  },
  {
    id: "cork-versace",
    name: "Cork Versace",
    tagline: "Exquisite design",
    description: "90° bendable, borer free and formaldehyde free.",
    coverImage: "/img/cover-cork-versace.jpg",
    bgGradient: "linear-gradient(135deg, #8E2A15, #4D1609)",
    swatches: ["#9E3019", "#BF8B35", "#FFCF91", "#66999A"],
    href: "/collection-cork-versace.html"
  },
  {
    id: "sofitek-panels",
    name: "Sofitek Panels",
    tagline: "Panels for interiors",
    description: "Premier’s panel collection for walls and interior features.",
    coverImage: "/img/cover-sofitek-panels.jpg",
    bgGradient: "linear-gradient(135deg, #2C2F3B, #14161F)",
    swatches: ["#2C2F3B", "#A7AABD", "#D4B067", "#F4EADC"],
    href: "/collection-sofitek-panels.html"
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    tagline: "An art laminates series",
    description: "Art laminates in bold geometric patterns of green, orange and lime.",
    coverImage: "/img/cover-ubuntu.jpg",
    bgGradient: "linear-gradient(135deg, #00754B, #003F2D)",
    swatches: ["#00754B", "#F47920", "#D2DE29", "#FDF3E7"],
    href: "/collection-ubuntu.html"
  },
  {
    id: "fluted-acrylic",
    name: "Fluted Acrylic",
    tagline: "Ribbed texture, acrylic finish",
    description: "Vertical ribbed texture in Premier’s acrylic range.",
    coverImage: "/img/cover-fluted-acrylic.jpg",
    bgGradient: "linear-gradient(135deg, #1A2490, #07126E)",
    swatches: ["#07126E", "#3F4BB5", "#A7AABD", "#B8860B"],
    href: "/collection-fluted-acrylic.html"
  }
];
