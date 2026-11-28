"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Wrench,
  BadgeCheck,
  Gem,
  Award,
  Palette,
  Eye,
  Play,
  X,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { collections as defaultCollections } from "@/data/collections";
import HomeScrollAnimation from "@/components/HomeScrollAnimation";
import { MetadataValues } from "@/types/metadata";
import {
  fetchMetadataTemplate,
  getSection,
  getField,
  getFieldValue,
  getCardJsonData,
  parseButtonValue,
} from "@/utils/metadata";

interface HomeProps {
  onNavigate?: (page: string, id?: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  // -----------------------------------------------------------------
  // 1. Metadata State & Fetching
  // -----------------------------------------------------------------
  const [metadata, setMetadata] = useState<MetadataValues | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const data = await fetchMetadataTemplate();
      if (isMounted && data) {
        setMetadata(data);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // SEO metadata synchronization
  useEffect(() => {
    if (!metadata) return;
    const seoSection = getSection(metadata, "seo_metadata", "seo");
    const metaTitle = getFieldValue(seoSection, "meta_title", "title", "page_title");
    const metaDesc = getFieldValue(seoSection, "meta_description", "description");

    if (metaTitle) {
      document.title = metaTitle;
    }
    if (metaDesc) {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "description");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", metaDesc);
    }
  }, [metadata]);

  // -----------------------------------------------------------------
  // 2. Statistics Counter State & Animation
  // -----------------------------------------------------------------
  const statsSection = useMemo(
  () => getSection(metadata, "statistics", "stats", "stats_section"),
  [metadata]
);

const statsCardField = useMemo(
  () => getField(statsSection, "items"),
  [statsSection]
);

const statsCardData = useMemo(
  () => getCardJsonData<Record<string, string>>(statsCardField),
  [statsCardField]
);

const statsData = useMemo(() => {
  if (statsCardData && statsCardData.length > 0) {
    return statsCardData.map((item) => {
      const number = item.number || "0";
      const target = parseInt(number.replace(/\D/g, ""), 10) || 0;
      const suffix = item.suffix || "+";
      const label = item.label || "Items";

      return {
        target,
        suffix,
        label,
      };
    });
  }

  return [
    { target: 300, suffix: "+", label: "Designs" },
    { target: 500, suffix: "+", label: "Dealers" },
    { target: 12, suffix: "+", label: "Collections" },
    { target: 10, suffix: "k+", label: "Sq ft warehouse" },
  ];
}, [statsCardData]);

const [statsInView, setStatsInView] = useState(false);
const statsRef = useRef<HTMLDivElement>(null);
const [counts, setCounts] = useState(statsData.map(() => 0));

useEffect(() => {
  setCounts(statsData.map(() => 0));
}, [statsData]);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setStatsInView(true);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  if (statsRef.current) {
    observer.observe(statsRef.current);
  }

  return () => observer.disconnect();
}, []);

useEffect(() => {
  if (!statsInView) return;

  const duration = 1600;
  const startTime = performance.now();

  const animate = (time: number) => {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);

    setCounts(
      statsData.map((stat) => Math.round(stat.target * ease))
    );

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}, [statsInView, statsData]);

  // -----------------------------------------------------------------
  // 3. Video Modal State
  // -----------------------------------------------------------------
  const [videoModal, setVideoModal] = useState<{
    open: boolean;
    src: string;
    hasError: boolean;
  }>({
    open: false,
    src: "",
    hasError: false,
  });

  const openVideo = (src: string) => {
    setVideoModal({ open: true, src, hasError: false });
    document.body.style.overflow = "hidden";
  };

  const closeVideo = () => {
    setVideoModal({ open: false, src: "", hasError: false });
    document.body.style.overflow = "";
  };

  // -----------------------------------------------------------------
  // 4. Hero Section Data (Metadata + Fallbacks)
  // -----------------------------------------------------------------
  const heroSection = useMemo(
    () => getSection(metadata, "hero", "hero_section"),
    [metadata]
  );
  const rawHeroTitle = getFieldValue(heroSection, "hero_title", "title", "heading");
  const heroWords = useMemo(() => {
    if (rawHeroTitle && rawHeroTitle.trim().length > 0) {
      const words = rawHeroTitle.trim().split(/\s+/);
      return words.map((text, idx) => ({
        text,
        isEm: idx === words.length - 1,
      }));
    }
    return [
      { text: "Luxury", isEm: false },
      { text: "comes", isEm: false },
      { text: "with", isEm: false },
      { text: "innovation", isEm: false },
      { text: "and", isEm: false },
      { text: "excellence.", isEm: true },
    ];
  }, [rawHeroTitle]);

  const heroLede =
    getFieldValue(heroSection, "hero_description", "description", "subtitle", "lede") ||
    "A grandeur of collection is ready to be explored with unmatched innovation for your premium residence and commercial spaces.";

  const heroBtn1 = {text:getFieldValue(heroSection,"primary_button_text") || "Explore collections",link: "#collections",};
const heroBtn2 = {text:getFieldValue( heroSection,"secondary_button_text") || "Download catalogue",link: "catalog",};

  const heroImages = useMemo(() => {
    const img1 = getFieldValue(heroSection, "image_1", "hero_image_1", "image") || "/img/interior.jpg";
    const img2 = getFieldValue(heroSection, "image_2", "hero_image_2") || "/img/livingroom.jpg";
    const img3 = getFieldValue(heroSection, "image_3", "hero_image_3") || "/img/hl-cafe.jpg";
    return [img1, img2, img3];
  }, [heroSection]);

  const heroBadgesField = getField(heroSection, "badges");
const heroBadgesData = getCardJsonData<Record<string, string>>(heroBadgesField);

const heroBadges = useMemo(() => {if (heroBadgesData && heroBadgesData.length > 0) {return heroBadgesData.map((item) => item.text || "").filter(Boolean);}
  return [
    "Excellent Designs",
    "Reliable Quality",
    "Supportive Team",
    "Pan India Presence",
  ];
}, [heroBadgesData]);

  // -----------------------------------------------------------------
  // 5. About Section Data (Metadata + Fallbacks)
  // -----------------------------------------------------------------
  const aboutSection = useMemo(
    () => getSection(metadata, "about", "about_section", "about_us"),
    [metadata]
  );
  const aboutEyebrow =
    getFieldValue(aboutSection, "eyebrow", "section_label", "label") ||
    "Since 1993 - A new vision.";
  const aboutHeading =
    getFieldValue(aboutSection, "heading", "title", "about_title") ||
    "Strength, style and reliability in every sheet.";
  const aboutDesc1 =
    getFieldValue(aboutSection, "description_1", "description", "paragraph_1") ||
    "At Premier, we believe every home and space deserves a foundation built on strength, style and reliability. Quality should never be compromised, no matter the budget.";
  const aboutDesc2 =
    getFieldValue(aboutSection, "description_2", "paragraph_2") ||
    "Our purpose is simple: to make high-quality, affordable materials accessible to every Indian.";
  const aboutBtn = parseButtonValue(
    getFieldValue(aboutSection, "about_button_text", "button", "cta_button"),
    "About Premier",
    "about"
  );

  const aboutCatalogueButtonText =
    getFieldValue(aboutSection, "catalogue_button_text", "catalogue_button") ||
    "View catalogue";

  const aboutCardsField = getField(aboutSection, "cards", "items", "about_cards");
  const aboutCardsData = getCardJsonData<Record<string, string>>(aboutCardsField);

  const defaultAboutCards = useMemo(
    () => [
      {
        image: "/img/craft.jpg",
        alt: "Craftsman holding a Premier board",
        title: "Strong",
        description:
          "Built for the demands of everyday use, with strength in the material and in the brand.",
      },
      {
        image: "/img/swatches.jpg",
        alt: "Premier laminate samples in marble, speckled and wood finishes",
        title: "Designer",
        description: "Laminates and finishes that elevate every space.",
      },
      {
        image: "/img/team.jpg",
        alt: "Premier team member in uniform",
        title: "Reliable",
        description:
          "Consistently high-quality products, and every commitment honoured.",
      },
    ],
    []
  );

  const aboutCards = useMemo(() => {
    if (aboutCardsData && aboutCardsData.length > 0) {
      return aboutCardsData.map((item, index) => ({
        image: item.image || "/img/craft.jpg",
        alt: item.alt || `Premier ${item.title || `feature ${index + 1}`}`,
        title: item.title || item.name || `Feature ${index + 1}`,
        description: item.description || item.desc || "",
      }));
    }

    return defaultAboutCards;
  }, [aboutCardsData, defaultAboutCards]);

  // -----------------------------------------------------------------
  // 6. Collections (Exquisite Collection sequence) - Dynamic Count
  // -----------------------------------------------------------------
  const collectionsSection = useMemo(
    () => getSection(metadata, "collections", "exquisite_collections", "collection_section"),
    [metadata]
  );
  const collectionsHeading =
    getFieldValue(collectionsSection, "heading", "title") || "Our Exquisite Collection";
  const collectionsCardField = getField(
    collectionsSection,
    "collections",
    "collection_list",
    "items",
    "cards"
  );
  const collectionsCardData = getCardJsonData<Record<string, string>>(collectionsCardField);

  const dynamicCollections = useMemo(() => {
    if (collectionsCardData && collectionsCardData.length > 0) {
      return collectionsCardData.map((item, index) => {
        const id =
          item.id || item.slug || (item.name ? item.name.toLowerCase().replace(/\s+/g, "-") : `collection-${index}`);
        return {
          id,
          name: item.name || item.title || `Collection ${index + 1}`,
          tagline: item.tagline || item.subtitle || "",
          description: item.description || item.desc || "",
          coverImage:
            item.image || item.coverImage || item.cover_image || "/img/cover-hybrid-lam.jpg",
          bgGradient:
            item.bgGradient ||
            item.bg_gradient ||
            item.gradient ||
            "radial-gradient(70% 90% at 75% 45%, #465860 0, transparent 65%), #23343C",
          cataloguePdf:
            item.pdf || item.cataloguePdf || item.catalogue_pdf || "/catalogue/premier-hybrid-lam-catalogue.pdf",
          swatches: item.swatches
            ? item.swatches.split(",").map((s) => s.trim())
            : ["#2B3E46", "#8F6449", "#D3C2AE", "#5B757E"],
        };
      });
    }
    return defaultCollections;
  }, [collectionsCardData]);

  // -----------------------------------------------------------------
  // 7. Latest Collections Section Data
  // -----------------------------------------------------------------
  const latestSection = useMemo(
    () => getSection(metadata, "latest_collections", "latest", "new_arrivals"),
    [metadata]
  );
  const latestHeading =
    getFieldValue(latestSection, "heading", "title") || "Latest collections";
  const latestSubtitle =
    getFieldValue(latestSection, "description", "subtitle") ||
    "Two fresh arrivals from Premier. Watch them in real spaces, then open the full collection.";

  const latestItemsField = getField(
    latestSection,
    "items",
    "collections",
    "collection_list",
    "cards"
  );
  const latestItemsData = getCardJsonData<Record<string, string>>(latestItemsField);

  const defaultLatestItems = useMemo(
    () => [
      {
        id: "versace-6h",
        eyebrow: "New collection",
        name: "Versace 6H",
        subtitle: "6H scratch grade",
        description:
          "100% pure virgin acrylic, 1.5 mm thick, with a 6H scratch grade.",
        image: "/img/v6h-lobby.jpg",
        video: "",
        videoLabel: "Watch the film",
        features: [
          "100% pure virgin acrylic",
          "1.5 mm thick",
          "6H scratch grade",
        ],
        collectionButtonText: "See Versace 6H",
        catalogueButtonText: "View catalogue",
        collectionId: "versace-6h",
      },
      {
        id: "imazica",
        eyebrow: "New collection",
        name: "Imazica",
        subtitle: "Beautiful walls. Long-lasting smiles.",
        description:
          "India’s first designer acrylic laminate made for kids’ spaces. A premium, long-lasting wall solution that goes beyond wallpaper.",
        image: "/img/imz-playroom.jpg",
        video: "",
        videoLabel: "Watch the film",
        features: [
          "High-gloss acrylic finish",
          "Hundreds of exciting themes",
          "4 ft × 8 ft panels",
        ],
        collectionButtonText: "See Imazica",
        catalogueButtonText: "View catalogue",
        collectionId: "imazica",
      },
    ],
    []
  );

  const cataloguePaths: Record<string, string> = {
    "versace-6h": "/catalogue/premier-versace-6h-catalogue.pdf",
    imazica: "/catalogue/premier-imazica-catalogue.pdf",
  };

  const latestItems = useMemo(() => {
    if (latestItemsData && latestItemsData.length > 0) {
      return latestItemsData.map((item, index) => ({
        id: item.id || item.slug || `latest-${index}`,
        eyebrow: item.eyebrow || "New collection",
        name: item.name || item.title || `Collection ${index + 1}`,
        subtitle: item.subtitle || "",
        description: item.description || item.desc || "",
        image: item.image || "",
        video: item.video || "",
        videoLabel: item.video_label || item.videoLabel || "Watch the film",
        features: (item.features || item.feature || "")
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        collectionButtonText:
          item.collection_button_text || item.collectionButtonText || "Explore collection",
        catalogueButtonText:
          item.catalogue_button_text || item.catalogueButtonText || "View catalogue",
        collectionId: item.id || item.slug || `collection-${index}`,
      }));
    }

    return defaultLatestItems;
  }, [latestItemsData, defaultLatestItems]);

  // -----------------------------------------------------------------
  // 8. Why Premier (6-card sequence) - Dynamic Count
  // -----------------------------------------------------------------
  const whySection = useMemo(() => getSection(metadata, "why_premier"),[metadata]);
const whyEyebrow =getFieldValue(whySection, "eyebrow") || "WHY PREMIER";
const whyHeading =getFieldValue(whySection, "heading") || "Why people choose Premier";
const whySubtitle =getFieldValue(whySection, "description") ||"Six things we hold ourselves to, in every collection we make.";
const whyButtonText =getFieldValue(whySection, "button_text") || "Explore collections";
const whyCardsField = getField(whySection, "items");
const whyCardsData =getCardJsonData<Record<string, string>>(whyCardsField);

  const defaultWhyTabs = useMemo(
    () => [
      {
        num: "01.",
        title: "Reliable",
        img: "/img/veneers.jpg",
        desc: "We deliver consistently high-quality products and honour every commitment to our customers and partners.",
        icon: <ShieldCheck className="icon" aria-hidden="true" />,
      },
      {
        num: "02.",
        title: "Modern",
        img: "/img/hl-office.jpg",
        desc: "We stay ahead of design trends and material innovations so our surfaces suit today’s homes and commercial spaces.",
        icon: <Sparkles className="icon" aria-hidden="true" />,
      },
      {
        num: "03.",
        title: "Strong",
        img: "/img/hl-kitchen.jpg",
        desc: "Built for the demands of everyday use, with strength in the material and in the brand.",
        icon: <Wrench className="icon" aria-hidden="true" />,
      },
      {
        num: "04.",
        title: "Affordable",
        img: "/img/hl-nursery.jpg",
        desc: "The right balance of cost and quality, so premium design reaches more people.",
        icon: <BadgeCheck className="icon" aria-hidden="true" />,
      },
      {
        num: "05.",
        title: "Designer",
        img: "/img/samples.jpg",
        desc: "A refined range of laminates that turns functional surfaces into design statements.",
        icon: <Gem className="icon" aria-hidden="true" />,
      },
      {
        num: "06.",
        title: "Leadership",
        img: "/img/purpose.jpg",
        desc: "We set benchmarks in Andhra Pradesh and beyond through consistent excellence.",
        icon: <Award className="icon" aria-hidden="true" />,
      },
    ],
    []
  );

  const dynamicWhyTabs = useMemo(() => {
    if (whyCardsData && whyCardsData.length > 0) {
      const iconList = [
        <ShieldCheck key="1" className="icon" aria-hidden="true" />,
        <Sparkles key="2" className="icon" aria-hidden="true" />,
        <Wrench key="3" className="icon" aria-hidden="true" />,
        <BadgeCheck key="4" className="icon" aria-hidden="true" />,
        <Gem key="5" className="icon" aria-hidden="true" />,
        <Award key="6" className="icon" aria-hidden="true" />,
      ];

      return whyCardsData.map((item, idx) => ({
        num: item.num || `0${idx + 1}.`,
        title: item.title || item.name || `Reason ${idx + 1}`,
        img: item.img || item.image || "/img/veneers.jpg",
        desc: item.desc || item.description || "",
        icon: iconList[idx % iconList.length],
      }));
    }
    return defaultWhyTabs;
  }, [whyCardsData, defaultWhyTabs]);

  // -----------------------------------------------------------------
  // 9. Gallery Section Data
  // -----------------------------------------------------------------
  const gallerySection = useMemo(
    () => getSection(metadata, "gallery", "gallery_section", "spaces"),
    [metadata]
  );
  const galleryHeading =
    getFieldValue(gallerySection, "heading", "title") || "Premier in spaces";
  const gallerySubtitle =
    getFieldValue(gallerySection, "description", "subtitle") ||
    "Homes, salons, cafés and kids’ rooms finished with Premier collections.";

  const galleryImagesField = getField(
    gallerySection,
    "images",
    "items",
    "gallery_images",
    "cards"
  );
  const galleryImagesData = getCardJsonData<Record<string, string>>(galleryImagesField);

  const defaultGalleryImages = useMemo(
    () => [
      "/img/hl-kitchen.jpg",
      "/img/imz-playroom.jpg",
      "/img/v6h-lobby.jpg",
      "/img/hl-cafe.jpg",
      "/img/imz-mermaid.jpg",
      "/img/v6h-salon-b.jpg",
      "/img/v6h-salon-a.jpg",
      "/img/hl-nursery.jpg",
      "/img/imz-rainbow.jpg",
      "/img/hl-office.jpg",
      "/img/v6h-lobby.jpg",
      "/img/imz-playroom.jpg",
      "/img/hl-cafe.jpg",
      "/img/v6h-salon-b.jpg",
      "/img/hl-kitchen.jpg",
      "/img/imz-mermaid.jpg",
      "/img/hl-nursery.jpg",
      "/img/v6h-salon-a.jpg",
    ],
    []
  );

  const galleryImages = useMemo(() => {
    if (galleryImagesData && galleryImagesData.length > 0) {
      return galleryImagesData
        .map((item) => item.image || "")
        .filter(Boolean);
    }
    return defaultGalleryImages;
  }, [galleryImagesData, defaultGalleryImages]);

  const galleryRows = useMemo(() => {
    const rows: string[][] = [[], [], []];
    galleryImages.forEach((image, index) => {
      rows[index % 3].push(image);
    });
    return rows;
  }, [galleryImages]);

  const gallerySizePresets = [
    [
      { w: 1153, h: 1153 },
      { w: 615, h: 615 },
      { w: 615, h: 439 },
      { w: 1153, h: 1153 },
      { w: 615, h: 615 },
      { w: 615, h: 439 },
    ],
    [
      { w: 615, h: 439 },
      { w: 1151, h: 1152 },
      { w: 916, h: 615 },
      { w: 1153, h: 1153 },
      { w: 615, h: 439 },
      { w: 615, h: 615 },
    ],
    [
      { w: 1153, h: 1153 },
      { w: 615, h: 439 },
      { w: 1153, h: 1153 },
      { w: 615, h: 615 },
      { w: 1151, h: 1152 },
      { w: 615, h: 439 },
    ],
  ];

  // -----------------------------------------------------------------
  // 10. CTA Section Data
  // -----------------------------------------------------------------
  const ctaSection = useMemo(
    () => getSection(metadata, "cta", "cta_section", "contact_teaser"),
    [metadata]
  );
  const ctaHeading =
    getFieldValue(ctaSection, "heading", "title") || "Planning a project? Talk to Premier.";
  const ctaDescription =
    getFieldValue(ctaSection, "description", "subtitle", "lede") ||
    "Tell us what you are building and we will suggest the collection, share samples and answer your questions.";
  const ctaButton = parseButtonValue(
    getFieldValue(ctaSection, "primary_button_text", "button", "cta_button"),
    "Send an enquiry",
    "contact"
  );

  const ctaSecondaryButtonText =
    getFieldValue(ctaSection, "secondary_button_text", "catalogue_button") ||
    "View catalogue";

  const contactDetailsField = getField(
    ctaSection,
    "contact_details",
    "contact",
    "details"
  );
  const contactDetailsData =
    getCardJsonData<Record<string, string>>(contactDetailsField);

  const contactDetails = useMemo(() => {
    const item = contactDetailsData?.[0];

    return {
      phone: item?.phone || "+91 XXXXX XXXXX",
      email: item?.email || "Premierindia@gmail.com",
      address: item?.address || "Mumbai, Maharashtra, India",
    };
  }, [contactDetailsData]);

  return (
    <>
      {/* Scroll-driven animation controller for Exquisite Collections and Why Premier */}
      <HomeScrollAnimation key={`${dynamicCollections.length}-${dynamicWhyTabs.length}`} />

      {/* 1. HERO SECTION */}
      <section className="hero2" id="top">
        <div className="hero2-bg" aria-hidden="true">
          <img src={heroImages[0]} alt="" fetchPriority="high" />
          <img src={heroImages[1]} alt="" />
          <img src={heroImages[2]} alt="" />
        </div>
        <div className="hero2-shade" />

        <div className="wrap hero2-in">
          <h1>
            {heroWords.map((word, idx) => (
              <span
                key={idx}
                className="wd"
                style={{ "--i": idx } as React.CSSProperties}
              >
                {word.isEm ? <em>{word.text}</em> : word.text}{" "}
              </span>
            ))}
          </h1>
          <p className="lede">{heroLede}</p>
          <div className="btn-row">
            <a
              className="btn btn-white"
              href={heroBtn1.link.startsWith("#") ? heroBtn1.link : undefined}
              onClick={(e) => {
                if (!heroBtn1.link.startsWith("#")) {
                  e.preventDefault();
                  onNavigate?.(heroBtn1.link);
                }
              }}
            >
              {heroBtn1.text} <ArrowRight className="icon" aria-hidden="true" />
            </a>
            <button
              className="btn btn-glass"
              type="button"
              onClick={() => onNavigate?.(heroBtn2.link === "#" ? "catalog" : heroBtn2.link)}
            >
              {heroBtn2.text}{" "}
              <span className="ci">
                <ArrowUpRight className="icon" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>

        <ul className="hero2-badges">
          {heroBadges.map((badge, idx) => (
            <li key={idx}>{badge}</li>
          ))}
        </ul>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="abt2 sec" id="about">
        <div className="wrap abt2-grid">
          <div className="abt2-l">
            <span className="eyebrow">{aboutEyebrow}</span>
            <h2>
              {aboutHeading.includes("reliability") ? (
                <>
                  Strength, style and <em>reliability</em> in every sheet.
                </>
              ) : (
                aboutHeading
              )}
            </h2>
            <p className="lede">{aboutDesc1}</p>
            <p className="lede">{aboutDesc2}</p>
            <div className="btn-row">
              <button
                className="btn btn-sapphire"
                type="button"
                onClick={() => onNavigate?.(aboutBtn.link === "#" ? "about" : aboutBtn.link)}
              >
                {aboutBtn.text} <ArrowRight className="icon" aria-hidden="true" />
              </button>
              <button
                className="btn btn-ghost dk"
                type="button"
                style={{ color: "var(--sapphire)" }}
                onClick={() => onNavigate?.("catalog")}
              >
                View catalogue
              </button>
            </div>
          </div>

          <div className="abt2-cards">
            {aboutCards.map((card, index) => {
              const AboutIcon = [ShieldCheck, Palette, BadgeCheck][index] || ShieldCheck;

              return (
                <article className="acard" key={`${card.title}-${index}`}>
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                  />
                  <div className="ic">
                    <AboutIcon className="icon" aria-hidden="true" />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION (REPEATABLE & DYNAMIC) */}
      <section className="stats" ref={statsRef}>
        <div className="wrap">
          <div className="row">
            {statsData.map((stat, idx) => (
              <div className="stat" key={idx}>
                <b>
                  <em>{statsInView ? counts[idx] : stat.target}</em>
                  <i>{stat.suffix}</i>
                </b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXQUISITE COLLECTIONS (DYNAMIC COUNT SCROLL SEQUENCE) */}
      <section className="xq" id="collections">
        <div
          className="xq-track"
          style={{ "--n": dynamicCollections.length } as React.CSSProperties}
        >
          <div className="xq-pin">
            <div className="wrap">
              <div className="shead">
                <h2 className="t-l">{collectionsHeading}</h2>
              </div>

              <div
                className="stage"
                id="xq"
                aria-roledescription="carousel"
                aria-label="Premier collections"
              >
                {dynamicCollections.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`xq-bg ${idx === 0 ? "on" : ""}`}
                    style={{ background: item.bgGradient }}
                  />
                ))}

                <div className="xq-ui">
                  <div className="xq-copy">
                    {dynamicCollections.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`slide-t ${idx === 0 ? "is-active" : ""}`}
                      >
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <button
                          className="btn btn-white"
                          type="button"
                          onClick={() => onNavigate?.("collection", item.id)}
                        >
                          Explore collection <ArrowRight className="icon" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="xq-covers">
                    {dynamicCollections.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`xq-cover ${idx === 0 ? "is-active" : ""}`}
                      >
                        <span className="bkw">
                          <span className="bk">
                            <img
                              src={item.coverImage}
                              alt={`Premier ${item.name} collection cover`}
                            />
                          </span>
                        </span>
                        <i />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="xq-dots">
                  {dynamicCollections.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      className={idx === 0 ? "is-active" : ""}
                      aria-label={`Show ${item.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST COLLECTIONS SECTION */}
      <section className="lc sec" id="latest">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">{latestHeading}</h2>
            <p className="lede">{latestSubtitle}</p>
          </div>

          {latestItems.map((item, idx) => (
            <article className={`lc-row ${idx % 2 === 1 ? "flip" : ""}`} key={item.id}>
              <button
                className="lc-media"
                type="button"
                aria-label={
                  item.video
                    ? `Play the ${item.name} video`
                    : `View the ${item.name} collection`
                }
                onClick={() => {
                  if (item.video) {
                    openVideo(item.video);
                  }
                }}
                disabled={!item.video}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="lc-media-placeholder" aria-hidden="true" />
                )}

                {item.video && (
                  <span className="play">
                    <Play aria-hidden="true" fill="currentColor" />
                  </span>
                )}

                {item.video && (
                  <span className="lc-tag">
                    <span className="lc-new">New</span>
                    {item.videoLabel}
                  </span>
                )}
              </button>

              <div className="lc-copy">
                <span className="eyebrow">{item.eyebrow}</span>
                <h3>{item.name}</h3>
                {item.subtitle && <p className="sub">{item.subtitle}</p>}
                {item.description && <p className="lede">{item.description}</p>}

                {item.features.length > 0 && (
                  <ul className="lc-pills">
                    {item.features.map((feature, featureIndex) => (
                      <li key={`${item.id}-feature-${featureIndex}`}>{feature}</li>
                    ))}
                  </ul>
                )}

                <div className="btn-row">
                  <button
                    className="btn btn-sapphire"
                    type="button"
                    onClick={() =>
                      onNavigate?.("collection", item.collectionId || item.id)
                    }
                  >
                    {item.collectionButtonText}{" "}
                    <ArrowRight className="icon" aria-hidden="true" />
                  </button>

                  {(cataloguePaths[item.id] || "/catalog") && (
                    <a
                      className="btn btn-ghost dk"
                      style={{ color: "var(--sapphire)" }}
                      href={cataloguePaths[item.id] || "/catalog"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="icon eye" aria-hidden="true" />
                      {item.catalogueButtonText}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. WHY PREMIER SECTION (DYNAMIC COUNT SCROLL SEQUENCE) */}
      <section className="why" id="why">
        <div
          className="why-track"
          style={{ "--n": dynamicWhyTabs.length } as React.CSSProperties}
        >
          <div className="why-pin">
            <div className="wrap">
              <div className="why-head">
                <div>
                    <span className="eyebrow">{whyEyebrow}</span>
                              <h2>
                                {whyHeading}
                              </h2>
                            </div>
                            <div className="why-r">
                              <p className="lede">{whySubtitle}</p>

                              <a className="btn btn-sapphire" href="#collections">
                                {whyButtonText}
                                <ArrowRight className="icon" aria-hidden="true" />
                              </a>
                            </div>
                                 </div>

              <div className="acc">
                {dynamicWhyTabs.map((tab, idx) => (
                  <div
                    key={idx}
                    className={`tab ${idx === 0 ? "on" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-expanded={idx === 0}
                  >
                    <span className="tab-num" aria-hidden="true">
                      {tab.num}
                    </span>
                    <div className="tab-img">
                      <img src={tab.img} alt="" loading="lazy" />
                    </div>
                    <div className="tab-body">
                      <span className="tab-ic">{tab.icon}</span>
                      <h3>{tab.title}</h3>
                      <p>{tab.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GALLERY SECTION (REPEATABLE & DYNAMIC) */}
      <section className="gal3 sec" id="gallery">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">{galleryHeading}</h2>
            <p className="lede">{gallerySubtitle}</p>
          </div>
        </div>

        <div className="g3-rows">
          {galleryRows.map((row, rowIndex) => (
            <div className="g3-row" key={`gallery-row-${rowIndex}`}>
              <div className="g3-track">
                {[...row, ...row].map((image, imageIndex) => {
                  const size =
                    gallerySizePresets[rowIndex][imageIndex % gallerySizePresets[rowIndex].length];

                  return (
                    <figure key={`${rowIndex}-${imageIndex}`}>
                      <img
                        src={image}
                        width={size.w}
                        height={size.h}
                        alt="Premier interior space"
                        loading="lazy"
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="cta sec-tight">
        <div className="wrap">
          <div className="cta-box">
            <div>
              <h2 className="t-l">{ctaHeading}</h2>
              <p className="lede">{ctaDescription}</p>
              <div className="btn-row" style={{ marginTop: "32px" }}>
                <button
                  className="btn btn-gold"
                  type="button"
                  onClick={() => onNavigate?.(ctaButton.link === "#" ? "contact" : ctaButton.link)}
                >
                  {ctaButton.text} <ArrowRight className="icon" aria-hidden="true" />
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => onNavigate?.("catalog")}
                >
                  {ctaSecondaryButtonText}
                </button>
              </div>
            </div>

            <div className="cta-lines">
              <div>
                <Phone className="icon" aria-hidden="true" />
                <span>{contactDetails.phone}</span>
              </div>
              <div>
                <Mail className="icon" aria-hidden="true" />
                <span>{contactDetails.email}</span>
              </div>
              <div>
                <MapPin className="icon" aria-hidden="true" />
                <span>{contactDetails.address}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Popup */}
      <div
        className={`vmodal ${videoModal.open ? "open" : ""} ${
          videoModal.hasError || !videoModal.src ? "err" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Collection video"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVideo();
        }}
      >
        <div className="vbox">
          <button
            className="vx"
            type="button"
            aria-label="Close video"
            onClick={closeVideo}
          >
            <X className="icon" aria-hidden="true" />
          </button>
          {videoModal.open && videoModal.src && (
            <video
              playsInline
              controls
              autoPlay
              src={videoModal.src}
              onError={() =>
                setVideoModal((prev) => ({ ...prev, hasError: true }))
              }
            />
          )}
          <div className="vmsg">
            <p>Video coming soon.</p>
          </div>
        </div>
      </div>
    </>
  );
}
