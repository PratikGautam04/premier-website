"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { MetadataValues } from "@/types/metadata";
import {
  fetchMetadataTemplate,
  getSection,
  getField,
  getFieldValue,
  getCardJsonData,
  parseButtonValue,
} from "@/utils/metadata";

interface AboutProps {
  onNavigate?: (page: string, id?: string) => void;
}

// Exact 8 collection dots matching about.html
const DEFAULT_COLLECTION_DOTS = [
  { id: "hybrid-lam", color: "#B58773", name: "Hybrid Lam" },
  { id: "versace-6h", color: "#4C513A", name: "Versace 6H" },
  { id: "imazica", color: "#31ABA9", name: "Imazica" },
  { id: "jutex", color: "#8B6D45", name: "Jutex" },
  { id: "cork-versace", color: "#A03120", name: "Cork Versace" },
  { id: "sofitek-panels", color: "#2B2E3B", name: "Sofitek Panels" },
  { id: "ubuntu", color: "#F6E7D2", name: "Ubuntu" },
  { id: "fluted-acrylic", color: "#0A1070", name: "Fluted Acrylic" },
];

export default function About({ onNavigate }: AboutProps) {
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
    const seoSection = getSection(metadata, "seo_metadata", "seo", "about_seo");
    const metaTitle =
      getFieldValue(seoSection, "meta_title", "title", "about_title") ||
      "About Premier";
    const metaDesc =
      getFieldValue(seoSection, "meta_description", "description") ||
      "Premier was born in Andhra Pradesh in 1993 and is part of the Kalpavruksh family. Learn about our purpose, positioning, goals and culture.";

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
  // 2. Section 1: Hero Banner Data
  // -----------------------------------------------------------------
  const heroSection = useMemo(
    () => getSection(metadata, "about_hero", "hero_banner", "hero", "about"),
    [metadata]
  );
  const heroImage =
    getFieldValue(heroSection, "hero_image", "image", "banner_image") ||
    "/img/hl-cafe.jpg";
  const heroTitle =
    getFieldValue(heroSection, "hero_title", "title", "heading") ||
    "We make dreams come true.";
  const heroDescription =
    getFieldValue(heroSection, "hero_description", "description", "lede") ||
    "Premier has been making strong, stylish and affordable surfaces for Indian homes since 1993.";
  const heroBtn1 = parseButtonValue(
    getFieldValue(heroSection, "button_1", "catalogue_button", "cta_1"),
    "View catalogue",
    "catalog"
  );
  const heroBtn2 = parseButtonValue(
    getFieldValue(heroSection, "button_2", "collections_button", "cta_2"),
    "Explore collections",
    "home"
  );

  // -----------------------------------------------------------------
  // 3. Section 2: Intro Section Data
  // -----------------------------------------------------------------
  const introSection = useMemo(
    () => getSection(metadata, "about_intro", "intro", "about_premier"),
    [metadata]
  );
  const introPill =
    getFieldValue(introSection, "pill", "section_label", "label") ||
    "About Premier";
  const introDescription =
    getFieldValue(introSection, "description", "content", "paragraph") ||
    "Born in the heart of Andhra Pradesh in 1993, Premier has grown with one belief: quality should never be compromised, no matter the budget. As part of the Kalpavruksh family, we are committed to enriching homes and commercial spaces with plywood and laminates that are durable and reflect modern design sensibilities.";

  // -----------------------------------------------------------------
  // 4. Section 3: Bento Cards Data
  // -----------------------------------------------------------------
  const bentoSection = useMemo(
    () => getSection(metadata, "bento", "about_bento", "highlights", "bento_cards"),
    [metadata]
  );
  const bcardQualityText =
    getFieldValue(bentoSection, "card_1_text", "quality_text") ||
    "Superior quality, contemporary design and affordability.";
  const bcardQualitySubtext =
    getFieldValue(bentoSection, "card_1_subtext", "quality_subtext") ||
    "Delivered consistently, backed by timely delivery and reliable supply.";
  const bcardSince =
    getFieldValue(bentoSection, "since", "since_label") || "Since 1993";

  const bcardTeamImage =
    getFieldValue(bentoSection, "card_2_image", "team_image", "photo") ||
    "/img/team.jpg";
  const bcardTeamPill =
    getFieldValue(bentoSection, "card_2_pill", "team_pill") ||
    "Born in Andhra Pradesh";

  const bcardStatBig =
    getFieldValue(bentoSection, "card_3_number", "collections_count") || "8";
  const bcardStatTitle =
    getFieldValue(bentoSection, "card_3_title", "collections_title") ||
    "Premium laminate collections";
  const bcardStatDesc =
    getFieldValue(bentoSection, "card_3_desc", "collections_desc") ||
    "Each with its own colours, textures and strengths.";

  // -----------------------------------------------------------------
  // 5. Statistics Counter State & Animation (Matching Home.tsx)
  // -----------------------------------------------------------------
  const statsSection = useMemo(
    () =>
      getSection(
        metadata,
        "statistics",
        "stats",
        "facts",
        "about_facts",
        "stats_section"
      ),
    [metadata]
  );
  const statsHeading =
    getFieldValue(statsSection, "heading", "title") ||
    "A few more facts about us in numbers";
  const statsCardField = useMemo(
    () =>
      getField(
        statsSection,
        "stats",
        "statistics",
        "facts",
        "statistic_list",
        "stat_items",
        "items"
      ),
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
      { threshold: 0.25 }
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
  // 6. Section 5: What Makes Us Different Data
  // -----------------------------------------------------------------
  const diffSection = useMemo(
    () => getSection(metadata, "what_makes_us_different", "different", "difference"),
    [metadata]
  );
  const diffImage =
    getFieldValue(diffSection, "image", "different_image") || "/img/veneers.jpg";
  const diffHeading =
    getFieldValue(diffSection, "heading", "title") || "What makes us different";
  const diffDesc =
    getFieldValue(diffSection, "description", "content", "lede") ||
    "Premier offers a rare combination of superior quality, contemporary design and affordability. While many brands compromise between price and durability, we deliver both, consistently. Our roots in Andhra Pradesh and decades of experience give us a deep understanding of regional and national demands, backed by a reputation for timely delivery and reliable supply.";

  // -----------------------------------------------------------------
  // 7. Section 6: Where We Are Headed Data
  // -----------------------------------------------------------------
  const headedSection = useMemo(
    () => getSection(metadata, "where_we_are_headed", "headed", "vision", "goal"),
    [metadata]
  );
  const headedImage =
    getFieldValue(headedSection, "image", "vision_image") || "/img/craft.jpg";
  const headedHeading =
    getFieldValue(headedSection, "heading", "title") || "Where we are headed";
  const headedDesc =
    getFieldValue(headedSection, "description", "content", "lede") ||
    "Our goal is to become one of India’s most trusted and recognisable plywood and laminate brands. We aim to lead not just in volume, but in the trust we build with every contractor, designer and homeowner, with a consistent supply chain, unmatched value and unwavering quality.";

  // -----------------------------------------------------------------
  // 8. Section 7: What We Stand For Data (Repeatable)
  // -----------------------------------------------------------------
  const standSection = useMemo(
    () => getSection(metadata, "what_we_stand_for", "stand_for", "values", "attributes"),
    [metadata]
  );
  const standHeading =
    getFieldValue(standSection, "heading", "title") || "What we stand for";
  const standLede =
    getFieldValue(standSection, "subtitle", "description", "lede") ||
    "The attributes behind every product and every conversation.";
  const standField = getField(standSection, "attributes", "values", "cards", "items");
  const standCardData = getCardJsonData<Record<string, string>>(standField);

  const attributesData = useMemo(() => {
    if (standCardData && standCardData.length > 0) {
      return standCardData.map((item, idx) => ({
        title: item.title || item.name || `Value ${idx + 1}`,
        desc: item.desc || item.description || "",
      }));
    }
    return [
      {
        title: "Reliable",
        desc: "A dependable brand that delivers consistently high-quality products.",
      },
      {
        title: "Modern",
        desc: "Ahead of design trends and material innovations.",
      },
      {
        title: "Strong",
        desc: "Strength in material and in brand character.",
      },
      {
        title: "Affordable",
        desc: "Premium construction and design materials for a broader segment of consumers.",
      },
      {
        title: "Pride",
        desc: "A legacy rooted in Vijayawada and pride in the communities we serve.",
      },
      {
        title: "Leadership",
        desc: "Purpose and vision, setting benchmarks in the industry.",
      },
      {
        title: "Designer",
        desc: "Laminates and finishes that elevate every space.",
      },
      {
        title: "Warm",
        desc: "Professional yet approachable, simple and solution oriented.",
      },
    ];
  }, [standCardData]);

  // -----------------------------------------------------------------
  // 9. Section 8: Quote Data
  // -----------------------------------------------------------------
  const quoteSection = useMemo(
    () => getSection(metadata, "quote", "about_quote", "mission_quote"),
    [metadata]
  );
  const quoteText =
    getFieldValue(quoteSection, "quote", "text", "quote_text") ||
    "Three decades. Thousands of homes. One commitment: quality.";

  // -----------------------------------------------------------------
  // 10. Section 9: CTA Section Data
  // -----------------------------------------------------------------
  const ctaSection = useMemo(
    () => getSection(metadata, "cta", "cta_section", "contact_teaser"),
    [metadata]
  );
  const ctaHeading =
    getFieldValue(ctaSection, "heading", "title") ||
    "Planning a project? Talk to Premier.";
  const ctaDescription =
    getFieldValue(ctaSection, "description", "subtitle", "lede") ||
    "Tell us what you are building and we will suggest the collection, share samples and answer your questions.";
  const ctaBtn1 = parseButtonValue(
    getFieldValue(ctaSection, "button_1", "enquiry_button", "cta_button"),
    "Send an enquiry",
    "contact"
  );
  const ctaBtn2 = parseButtonValue(
    getFieldValue(ctaSection, "button_2", "catalogue_button"),
    "View catalogue",
    "catalog"
  );
  const contactPhone =
    getFieldValue(ctaSection, "phone", "contact_phone") || "+91 XXXXX XXXXX";
  const contactEmail =
    getFieldValue(ctaSection, "email", "contact_email") ||
    "Premierindia@gmail.com";
  const contactAddress =
    getFieldValue(ctaSection, "address", "location") ||
    "Mumbai, Maharashtra, India";

  return (
    <main>
      {/* 1. HERO BANNER */}
      <section className="abp-hero">
        <div className="wrap">
          <div className="abp-banner">
            <img src={heroImage} alt="" fetchPriority="high" />
            <div>
              <nav className="crumbs" aria-label="Breadcrumb">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("home");
                  }}
                >
                  Home
                </a>
                <span>/</span>
                <span>About us</span>
              </nav>
              <h1>{heroTitle}</h1>
              <p className="lede">{heroDescription}</p>
              <div className="btn-row">
                <a
                  className="btn btn-white"
                  href="/catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(heroBtn1.link === "#" ? "catalog" : heroBtn1.link);
                  }}
                >
                  {heroBtn1.text}{" "}
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a
                  className="btn btn-glass"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("home");
                  }}
                >
                  {heroBtn2.text}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="sec-tight">
        <div className="wrap abp-intro">
          <div>
            <span className="pill">{introPill}</span>
          </div>
          <p>{introDescription}</p>
        </div>
      </section>

      {/* 3. BENTO CARDS */}
      <section className="sec-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="bento">
            {/* Card 1: Dark Highlights */}
            <div className="bcard dark">
              <span className="bic">
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <p>
                {bcardQualityText}{" "}
                <span>{bcardQualitySubtext}</span>
              </p>
              <span className="since">{bcardSince}</span>
            </div>

            {/* Card 2: Photo */}
            <div className="bcard photo">
              <img
                src={bcardTeamImage}
                alt="Premier team member in uniform"
                loading="lazy"
              />
              <span className="pill">{bcardTeamPill}</span>
            </div>

            {/* Card 3: Collection Dots Statistics */}
            <div className="bcard stat">
              <div>
                <div className="big">{bcardStatBig}</div>
                <h3>{bcardStatTitle}</h3>
                <p>{bcardStatDesc}</p>
              </div>
              <div className="dots8">
                {DEFAULT_COLLECTION_DOTS.map((item) => (
                  <a
                    key={item.id}
                    href={`/collection-${item.id}`}
                    style={{ "--c": item.color } as React.CSSProperties}
                    title={item.name}
                    aria-label={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate?.("collection", item.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FACTS COUNTER / STATISTICS */}
      <section className="facts" ref={statsRef}>
        <div className="wrap">
          <h2>{statsHeading}</h2>
          <div className="row">
            {statsData.map((stat, idx) => (
              <div className="fact" key={idx}>
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

      {/* 5. WHAT MAKES US DIFFERENT */}
      <section className="sec" style={{ background: "var(--cream)" }}>
        <div className="wrap split flip">
          <div className="split-media">
            <img
              src={diffImage}
              alt="Fan of layered wood veneers"
              loading="lazy"
            />
          </div>
          <div className="split-copy">
            <h2 className="t-l">{diffHeading}</h2>
            <p className="lede">{diffDesc}</p>
          </div>
        </div>
      </section>

      {/* 6. WHERE WE ARE HEADED */}
      <section className="sec">
        <div className="wrap split">
          <div className="split-media arch-top">
            <img
              src={headedImage}
              alt="Craftsman holding a Premier board"
              loading="lazy"
            />
          </div>
          <div className="split-copy">
            <h2 className="t-l">{headedHeading}</h2>
            <p className="lede">{headedDesc}</p>
          </div>
        </div>
      </section>

      {/* 7. WHAT WE STAND FOR */}
      <section className="sec">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">{standHeading}</h2>
            <p className="lede">{standLede}</p>
          </div>
          <div className="attrs">
            {attributesData.map((attr, idx) => (
              <div className="attr" key={idx}>
                <h3>{attr.title}</h3>
                <p>{attr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. QUOTE */}
      <section className="quote sec">
        <div className="wrap">
          <p>{quoteText}</p>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="cta sec-tight">
        <div className="wrap">
          <div className="cta-box">
            <div>
              <h2 className="t-l">{ctaHeading}</h2>
              <p className="lede">{ctaDescription}</p>
              <div className="btn-row" style={{ marginTop: "32px" }}>
                <a
                  className="btn btn-gold"
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(ctaBtn1.link === "#" ? "contact" : ctaBtn1.link);
                  }}
                >
                  {ctaBtn1.text}{" "}
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a
                  className="btn btn-ghost"
                  href="/catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.(ctaBtn2.link === "#" ? "catalog" : ctaBtn2.link);
                  }}
                >
                  {ctaBtn2.text}
                </a>
              </div>
            </div>

            <div className="cta-lines">
              <div>
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
                <span>{contactPhone}</span>
              </div>
              <div>
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <span>{contactEmail}</span>
              </div>
              <div>
                <svg
                  className="icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{contactAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
