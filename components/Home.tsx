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
    () => getField(statsSection, "stats", "statistics", "statistic_list", "stat_items"),
    [statsSection]
  );
  const statsCardData = useMemo(
    () => getCardJsonData<Record<string, string>>(statsCardField),
    [statsCardField]
  );

  const statsData = useMemo(() => {
    if (statsCardData && statsCardData.length > 0) {
      return statsCardData.map((item) => {
        const rawVal = item.value || item.count || item.number || "100+";
        const match = rawVal.match(/(\d+)/);
        const target = match ? parseInt(match[0], 10) : 100;
        const suffix = rawVal.replace(String(target), "") || "+";
        const label = item.label || item.title || item.name || "Items";
        return { target, suffix, label };
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

      setCounts(statsData.map((s) => Math.round(s.target * ease)));

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

  const heroBtn1 = parseButtonValue(
    getFieldValue(heroSection, "button_1", "explore_button", "cta_1"),
    "Explore collections",
    "#collections"
  );
  const heroBtn2 = parseButtonValue(
    getFieldValue(heroSection, "button_2", "catalogue_button", "cta_2"),
    "Download catalogue",
    "catalog"
  );

  const heroImages = useMemo(() => {
    const img1 = getFieldValue(heroSection, "image_1", "hero_image_1", "image") || "/img/interior.jpg";
    const img2 = getFieldValue(heroSection, "image_2", "hero_image_2") || "/img/livingroom.jpg";
    const img3 = getFieldValue(heroSection, "image_3", "hero_image_3") || "/img/hl-cafe.jpg";
    return [img1, img2, img3];
  }, [heroSection]);

  const heroBadgesField = getField(heroSection, "badges", "hero_badges", "features");
  const heroBadgesData = getCardJsonData<Record<string, string>>(heroBadgesField);
  const heroBadges = useMemo(() => {
    if (heroBadgesData && heroBadgesData.length > 0) {
      return heroBadgesData.map((b) => b.title || b.label || b.name || "");
    }
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
    getFieldValue(aboutSection, "button", "cta_button"),
    "About Premier",
    "about"
  );

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
    getFieldValue(latestSection, "subtitle", "description") ||
    "Two fresh arrivals from Premier. Watch them in real spaces, then open the full collection.";
  const versaceVideo = getFieldValue(latestSection, "versace_video", "video_1") || "";
  const imazicaVideo = getFieldValue(latestSection, "imazica_video", "video_2") || "";

  // -----------------------------------------------------------------
  // 8. Why Premier (6-card sequence) - Dynamic Count
  // -----------------------------------------------------------------
  const whySection = useMemo(
    () => getSection(metadata, "why_premier", "why", "features"),
    [metadata]
  );
  const whyHeading =
    getFieldValue(whySection, "heading", "title") || "Why people choose Premier";
  const whySubtitle =
    getFieldValue(whySection, "subtitle", "description", "lede") ||
    "Six things we hold ourselves to, in every collection we make.";

  const whyCardsField = getField(whySection, "tabs", "cards", "why_items", "reasons");
  const whyCardsData = getCardJsonData<Record<string, string>>(whyCardsField);

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
  // 9. Blog Section Data
  // -----------------------------------------------------------------
  const blogSection = useMemo(
    () => getSection(metadata, "blog", "articles", "news"),
    [metadata]
  );
  const blogHeading =
    getFieldValue(blogSection, "heading", "title") || "Ideas, guides & inspiration";
  const blogSubtitle =
    getFieldValue(blogSection, "subtitle", "description") ||
    "Tips on choosing, using and styling laminates, straight from the Premier team.";

  const blogCardField = getField(blogSection, "blogs", "articles", "posts", "items");
  const blogCardData = getCardJsonData<Record<string, string>>(blogCardField);

  const dynamicBlogs = useMemo(() => {
    if (blogCardData && blogCardData.length > 0) {
      return blogCardData.map((item, idx) => ({
        id: item.id || `blog-${idx}`,
        img: item.img || item.image || "/img/hl-kitchen.jpg",
        alt: item.alt || item.title || "Blog image",
        tag: item.tag || item.category || "Guides",
        date: item.date || "12 Nov 2026",
        readTime: item.readTime || item.read_time || "4 min read",
        title: item.title || "Laminate Guide",
        desc: item.desc || item.description || "",
        delay: `${idx * 90}ms`,
      }));
    }
    return [
      {
        id: "kitchen-laminate",
        img: "/img/hl-kitchen.jpg",
        alt: "A kitchen with dark laminate and a wood-fluted tower",
        tag: "Guides",
        date: "12 Nov 2026",
        readTime: "4 min read",
        title: "How to choose the right laminate finish for your kitchen",
        desc: "Matte, gloss or textured? A simple way to match finish, colour and daily wear to the way you cook.",
        delay: "0ms",
      },
      {
        id: "scratch-grade",
        img: "/img/v6h-lobby.jpg",
        alt: "A lounge with a marble-finish wall",
        tag: "Materials",
        date: "5 Nov 2026",
        readTime: "3 min read",
        title: "Why scratch grade matters in busy spaces",
        desc: "What a 6H rating means, and where a harder surface pays off in lobbies, salons and showrooms.",
        delay: "90ms",
      },
      {
        id: "kids-room",
        img: "/img/imz-playroom.jpg",
        alt: "A bright kids’ play room with printed wall panels",
        tag: "Inspiration",
        date: "28 Oct 2026",
        readTime: "5 min read",
        title: "Designing a kids’ room that lasts",
        desc: "Ideas for printed wall panels that stay bright, wipe clean and grow with your child.",
        delay: "180ms",
      },
    ];
  }, [blogCardData]);

  // -----------------------------------------------------------------
  // 10. Gallery Section Data
  // -----------------------------------------------------------------
  const gallerySection = useMemo(
    () => getSection(metadata, "gallery", "gallery_section", "spaces"),
    [metadata]
  );
  const galleryHeading =
    getFieldValue(gallerySection, "heading", "title") || "Premier in spaces";
  const gallerySubtitle =
    getFieldValue(gallerySection, "subtitle", "description") ||
    "Homes, salons, cafés and kids’ rooms finished with Premier collections.";

  const galRow1 = [
    { src: "/img/hl-kitchen.jpg", w: 1153, h: 1153, alt: "A kitchen with dark laminate and a wood-fluted tower" },
    { src: "/img/imz-playroom.jpg", w: 615, h: 615, alt: "A bright kids’ play room with printed wall panels" },
    { src: "/img/v6h-lobby.jpg", w: 615, h: 439, alt: "A lounge with a marble-finish wall" },
    { src: "/img/hl-cafe.jpg", w: 1153, h: 1153, alt: "A sage-green café with laminate wall panels" },
    { src: "/img/imz-mermaid.jpg", w: 615, h: 615, alt: "A mermaid-themed bedroom with a printed wall panel" },
    { src: "/img/v6h-salon-b.jpg", w: 615, h: 439, alt: "A salon with arched mirrors on a stone-finish wall" },
  ];
  const galRow2 = [
    { src: "/img/v6h-salon-a.jpg", w: 615, h: 439, alt: "Stylists at work in front of mirrors on a stone-finish wall" },
    { src: "/img/hl-nursery.jpg", w: 1151, h: 1152, alt: "A nursery with blue laminate wardrobe doors" },
    { src: "/img/imz-rainbow.jpg", w: 916, h: 615, alt: "A rainbow wall design and the finished play room" },
    { src: "/img/hl-office.jpg", w: 1153, h: 1153, alt: "A calm office with laminate desks" },
    { src: "/img/v6h-lobby.jpg", w: 615, h: 439, alt: "A lounge with a marble-finish wall" },
    { src: "/img/imz-playroom.jpg", w: 615, h: 615, alt: "A bright kids’ play room with printed wall panels" },
  ];
  const galRow3 = [
    { src: "/img/hl-cafe.jpg", w: 1153, h: 1153, alt: "A sage-green café with laminate wall panels" },
    { src: "/img/v6h-salon-b.jpg", w: 615, h: 439, alt: "A salon with arched mirrors on a stone-finish wall" },
    { src: "/img/hl-kitchen.jpg", w: 1153, h: 1153, alt: "A kitchen with dark laminate and a wood-fluted tower" },
    { src: "/img/imz-mermaid.jpg", w: 615, h: 615, alt: "A mermaid-themed bedroom with a printed wall panel" },
    { src: "/img/hl-nursery.jpg", w: 1151, h: 1152, alt: "A nursery with blue laminate wardrobe doors" },
    { src: "/img/v6h-salon-a.jpg", w: 615, h: 439, alt: "Stylists at work in front of mirrors on a stone-finish wall" },
  ];

  // -----------------------------------------------------------------
  // 11. CTA Section Data
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
    getFieldValue(ctaSection, "button", "cta_button"),
    "Send an enquiry",
    "contact"
  );
  const contactPhone = getFieldValue(ctaSection, "phone", "contact_phone") || "+91 XXXXX XXXXX";
  const contactEmail = getFieldValue(ctaSection, "email", "contact_email") || "Premierindia@gmail.com";
  const contactAddress =
    getFieldValue(ctaSection, "address", "location") || "Mumbai, Maharashtra, India";

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
            <article className="acard">
              <img
                src="/img/craft.jpg"
                alt="Craftsman holding a Premier board"
                loading="lazy"
              />
              <div className="ic">
                <ShieldCheck className="icon" aria-hidden="true" />
              </div>
              <h3>Strong</h3>
              <p>
                Built for the demands of everyday use, with strength in the material and in the brand.
              </p>
            </article>

            <article className="acard">
              <img
                src="/img/swatches.jpg"
                alt="Premier laminate samples in marble, speckled and wood finishes"
                loading="lazy"
              />
              <div className="ic">
                <Palette className="icon" aria-hidden="true" />
              </div>
              <h3>Designer</h3>
              <p>
                Laminates and finishes that elevate every space.
              </p>
            </article>

            <article className="acard">
              <img
                src="/img/team.jpg"
                alt="Premier team member in uniform"
                loading="lazy"
              />
              <div className="ic">
                <BadgeCheck className="icon" aria-hidden="true" />
              </div>
              <h3>Reliable</h3>
              <p>
                Consistently high-quality products, and every commitment honoured.
              </p>
            </article>
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

          {/* Versace 6H */}
          <article className="lc-row">
            <button
              className="lc-media"
              type="button"
              aria-label="Play the Versace 6H video"
              onClick={() => openVideo(versaceVideo)}
            >
              <img
                src="/img/v6h-lobby.jpg"
                alt="A lounge with a marble-finish wall"
                loading="lazy"
              />
              <span className="play">
                <Play aria-hidden="true" fill="currentColor" />
              </span>
              <span className="lc-tag">
                <span className="lc-new">New</span>Watch the film
              </span>
            </button>

            <div className="lc-copy">
              <span className="eyebrow">New collection</span>
              <h3>Versace 6H</h3>
              <p className="sub">6H scratch grade</p>
              <p className="lede">
                100% pure virgin acrylic, 1.5 mm thick, with a 6H scratch grade.
              </p>
              <ul className="lc-pills">
                <li>100% pure virgin acrylic</li>
                <li>1.5 mm thick</li>
                <li>6H scratch grade</li>
              </ul>
              <div className="btn-row">
                <button
                  className="btn btn-sapphire"
                  type="button"
                  onClick={() => onNavigate?.("collection", "versace-6h")}
                >
                  See Versace 6H <ArrowRight className="icon" aria-hidden="true" />
                </button>
                <a
                  className="btn btn-ghost dk"
                  style={{ color: "var(--sapphire)" }}
                  href="/catalogue/premier-versace-6h-catalogue.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="icon eye" aria-hidden="true" /> View catalogue
                </a>
              </div>
            </div>
          </article>

          {/* Imazica */}
          <article className="lc-row flip">
            <button
              className="lc-media"
              type="button"
              aria-label="Play the Imazica video"
              onClick={() => openVideo(imazicaVideo)}
            >
              <img
                src="/img/imz-playroom.jpg"
                alt="A bright kids’ play room with printed wall panels"
                loading="lazy"
              />
              <span className="play">
                <Play aria-hidden="true" fill="currentColor" />
              </span>
              <span className="lc-tag">
                <span className="lc-new">New</span>Watch the film
              </span>
            </button>

            <div className="lc-copy">
              <span className="eyebrow">New collection</span>
              <h3>Imazica</h3>
              <p className="sub">Beautiful walls. Long-lasting smiles.</p>
              <p className="lede">
                India’s first designer acrylic laminate made for kids’ spaces. A premium, long-lasting wall solution that goes beyond wallpaper.
              </p>
              <ul className="lc-pills">
                <li>High-gloss acrylic finish</li>
                <li>Hundreds of exciting themes</li>
                <li>4 ft × 8 ft panels</li>
              </ul>
              <div className="btn-row">
                <button
                  className="btn btn-sapphire"
                  type="button"
                  onClick={() => onNavigate?.("collection", "imazica")}
                >
                  See Imazica <ArrowRight className="icon" aria-hidden="true" />
                </button>
                <a
                  className="btn btn-ghost dk"
                  style={{ color: "var(--sapphire)" }}
                  href="/catalogue/premier-imazica-catalogue.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="icon eye" aria-hidden="true" /> View catalogue
                </a>
              </div>
            </div>
          </article>
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
                  <span className="eyebrow">Why Premier</span>
                  <h2>
                    Why people choose <em>Premier</em>
                  </h2>
                </div>
                <div className="why-r">
                  <p className="lede">{whySubtitle}</p>
                  <a className="btn btn-sapphire" href="#collections">
                    Explore collections <ArrowRight className="icon" aria-hidden="true" />
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

      {/* 7. BLOG SECTION (REPEATABLE & DYNAMIC) */}
      <section className="blg sec" id="blog">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="eyebrow">Blog</span>
              <h2 className="t-l">
                Ideas, guides &amp; <em>inspiration</em>
              </h2>
            </div>
            <p className="lede">{blogSubtitle}</p>
          </div>

          <div className="blg-grid">
            {dynamicBlogs.map((item) => (
              <article
                key={item.id}
                className="blg-card"
                style={{ "--d": item.delay } as React.CSSProperties}
              >
                <a
                  className="blg-img"
                  href="#blog"
                  aria-label={item.title}
                >
                  <img src={item.img} alt={item.alt} loading="lazy" />
                  <span className="blg-tag">{item.tag}</span>
                </a>
                <div className="blg-body">
                  <p className="blg-meta">
                    <time>{item.date}</time>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime}</span>
                  </p>
                  <h3>
                    <a href="#blog">{item.title}</a>
                  </h3>
                  <p>{item.desc}</p>
                  <a className="blg-more" href="#blog">
                    Read article <ArrowRight className="icon" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="btn-row blg-cta">
            <a className="btn btn-sapphire" href="#blog">
              View all articles <ArrowRight className="icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 8. GALLERY SECTION (REPEATABLE & DYNAMIC) */}
      <section className="gal3 sec" id="gallery">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">
              Premier in <em>spaces</em>
            </h2>
            <p className="lede">{gallerySubtitle}</p>
          </div>
        </div>

        <div className="g3-rows">
          <div className="g3-row">
            <div className="g3-track">
              {[...galRow1, ...galRow1].map((img, idx) => (
                <figure key={idx}>
                  <img
                    src={img.src}
                    width={img.w}
                    height={img.h}
                    alt={img.alt}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>

          <div className="g3-row">
            <div className="g3-track">
              {[...galRow2, ...galRow2].map((img, idx) => (
                <figure key={idx}>
                  <img
                    src={img.src}
                    width={img.w}
                    height={img.h}
                    alt={img.alt}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>

          <div className="g3-row">
            <div className="g3-track">
              {[...galRow3, ...galRow3].map((img, idx) => (
                <figure key={idx}>
                  <img
                    src={img.src}
                    width={img.w}
                    height={img.h}
                    alt={img.alt}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA SECTION */}
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
                  View catalogue
                </button>
              </div>
            </div>

            <div className="cta-lines">
              <div>
                <Phone className="icon" aria-hidden="true" />
                <span>{contactPhone}</span>
              </div>
              <div>
                <Mail className="icon" aria-hidden="true" />
                <span>{contactEmail}</span>
              </div>
              <div>
                <MapPin className="icon" aria-hidden="true" />
                <span>{contactAddress}</span>
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
