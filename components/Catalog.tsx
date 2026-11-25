"use client";

import { useEffect, useState, useMemo } from "react";
import { Eye, Download, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { collections } from "@/data/collections";
import { MetadataValues } from "@/types/metadata";
import {
  fetchMetadataTemplate,
  getSection,
  getField,
  getFieldValue,
  getCardJsonData,
  parseButtonValue,
} from "@/utils/metadata";

interface CatalogProps {
  onNavigate?: (page: string, id?: string) => void;
}

export default function Catalog({ onNavigate }: CatalogProps) {
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

  // SEO synchronization
  useEffect(() => {
    if (!metadata) return;
    const seoSection = getSection(metadata, "seo_metadata", "seo", "catalogue_seo");
    const metaTitle =
      getFieldValue(seoSection, "meta_title", "title", "catalogue_title") ||
      "Premier Catalogues & Collections";
    const metaDesc =
      getFieldValue(seoSection, "meta_description", "description") ||
      "Open any catalogue to view it, or download the PDF and share it with your designer, contractor or carpenter.";

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
  // 2. Hero Section Data
  // -----------------------------------------------------------------
  const heroSection = useMemo(
    () => getSection(metadata, "catalogue_hero", "catalog_hero", "catalogue", "hero"),
    [metadata]
  );
  const heroTitle =
    getFieldValue(heroSection, "title", "heading", "hero_title") ||
    "Take the collections with you.";
  const heroDesc =
    getFieldValue(heroSection, "description", "lede", "hero_description") ||
    "Open any catalogue to view it, or download the PDF and share it with your designer, contractor or carpenter.";
  const chip1 = getFieldValue(heroSection, "chip_1", "badge_1") || "8 collections";
  const chip2 = getFieldValue(heroSection, "chip_2", "badge_2") || "View online or download";

  // -----------------------------------------------------------------
  // 3. Catalogue Grid Items Data (Repeatable)
  // -----------------------------------------------------------------
  const gridSection = useMemo(
    () => getSection(metadata, "catalogue_list", "catalog_list", "catalogues"),
    [metadata]
  );
  const gridField = getField(gridSection, "items", "catalogues", "cards", "list");
  const gridCardData = getCardJsonData<Record<string, string>>(gridField);

  const cataloguesData = useMemo(() => {
    if (gridCardData && gridCardData.length > 0) {
      return gridCardData.map((item, idx) => {
        const matchingCol = collections.find(
          (c) => c.name.toLowerCase() === (item.title || item.name || "").toLowerCase()
        ) || collections[idx % collections.length];

        return {
          id: matchingCol?.id || `cat-${idx + 1}`,
          name: item.title || item.name || matchingCol?.name || "Collection",
          tagline: item.tagline || item.subtitle || matchingCol?.tagline || "",
          coverImage: item.image || item.cover || matchingCol?.coverImage || "/img/cover-hybrid-lam.jpg",
          pdf: item.pdf || item.file || matchingCol?.cataloguePdf || "#",
        };
      });
    }

    return collections.map((item) => ({
      id: item.id,
      name: item.name,
      tagline: item.tagline,
      coverImage: item.coverImage,
      pdf: item.cataloguePdf || "#",
    }));
  }, [gridCardData]);

  // -----------------------------------------------------------------
  // 4. Printed Copy Teaser Data
  // -----------------------------------------------------------------
  const teaserSection = useMemo(
    () => getSection(metadata, "printed_copy", "samples_teaser", "samples"),
    [metadata]
  );
  const teaserHeading =
    getFieldValue(teaserSection, "heading", "title") ||
    "Need a printed copy or physical samples?";
  const teaserBtn = parseButtonValue(
    getFieldValue(teaserSection, "button", "cta_button"),
    "Send an enquiry",
    "/contact"
  );

  // -----------------------------------------------------------------
  // 5. CTA Section Data
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
  const ctaBtn1 = parseButtonValue(
    getFieldValue(ctaSection, "button_1", "enquiry_button", "cta_button"),
    "Send an enquiry",
    "/contact"
  );
  const ctaBtn2 = parseButtonValue(
    getFieldValue(ctaSection, "button_2", "catalogue_button"),
    "View catalogue",
    "/catalog"
  );
  const contactPhone =
    getFieldValue(ctaSection, "phone", "contact_phone") || "+91 XXXXX XXXXX";
  const contactEmail =
    getFieldValue(ctaSection, "email", "contact_email") || "Premierindia@gmail.com";
  const contactAddress =
    getFieldValue(ctaSection, "address", "location") || "Mumbai, Maharashtra, India";

  // -----------------------------------------------------------------
  // 6. Interactive 3D tilt on pointer move (matching motion.js)
  // -----------------------------------------------------------------
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const book = e.currentTarget;
    const bk = book.querySelector<HTMLElement>(".bk");
    if (!bk) return;

    const r = book.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    bk.style.setProperty("--ry", `${(x * 16).toFixed(1)}deg`);
    bk.style.setProperty("--rx", `${(-y * 12).toFixed(1)}deg`);
    book.classList.add("tilting");
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const book = e.currentTarget;
    const bk = book.querySelector<HTMLElement>(".bk");
    if (!bk) return;

    bk.style.setProperty("--ry", "0deg");
    bk.style.setProperty("--rx", "0deg");
    book.classList.remove("tilting");
  };

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="phero dark pcat">
        <span className="orb o1" />
        <span className="orb o2" />
        <div className="wrap">
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
            <span>Catalogue</span>
          </nav>
          <h1 className="t-xl" style={{ maxWidth: "14ch" }}>
            {heroTitle}
          </h1>
          <p className="lede">{heroDesc}</p>
          <div className="chips">
            <span>{chip1}</span>
            <span>{chip2}</span>
          </div>
        </div>
      </section>

      {/* 2. CATALOGUE GRID */}
      <section className="sec-tight">
        <div className="wrap">
          <div className="cgrid">
            {cataloguesData.map((item) => (
              <article className="ccard" key={item.id}>
                <div
                  className="book"
                  onPointerMove={handlePointerMove}
                  onPointerLeave={handlePointerLeave}
                >
                  <a
                    className="book-open"
                    href={item.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${item.name} catalogue`}
                  >
                    <span className="bk">
                      <img
                        src={item.coverImage}
                        alt={`${item.name} catalogue cover`}
                        loading="lazy"
                      />
                    </span>
                  </a>
                  <i className="bk-sh" />
                  <div className="book-tools">
                    <a
                      className="tool"
                      href={item.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${item.name} catalogue`}
                      title="View"
                    >
                      <Eye className="icon eye" aria-hidden="true" />
                    </a>
                    <a
                      className="tool"
                      href={item.pdf}
                      download
                      aria-label={`Download ${item.name} catalogue`}
                      title="Download"
                    >
                      <Download className="icon" aria-hidden="true" />
                    </a>
                  </div>
                </div>
                <div className="cmeta">
                  <h3>{item.name}</h3>
                  <p>{item.tagline}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRINTED COPY TEASER */}
      <section className="sec-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead" style={{ margin: 0 }}>
            <h2 className="t-m" style={{ maxWidth: "24ch" }}>
              {teaserHeading}
            </h2>
            <a
              className="btn btn-sapphire"
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("contact");
              }}
            >
              {teaserBtn.text}{" "}
              <ArrowRight className="icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
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
                  <ArrowRight className="icon" aria-hidden="true" />
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
    </main>
  );
}
