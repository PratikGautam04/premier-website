"use client";

import { Download, Sun, Gem, ShieldCheck } from "lucide-react";
import { collections } from "@/data/collections";

interface OtherPageProps {
  collectionId?: string;
  onNavigate?: (page: string, id?: string) => void;
}

export default function OtherPage({
  collectionId = "hybrid-lam",
  onNavigate,
}: OtherPageProps) {
  const current =
    collections.find((c) => c.id === collectionId) || collections[0];

  const otherCollections = collections.filter((c) => c.id !== current.id);

  return (
    <main>
      {/* 1. COLLECTION HERO */}
      <section className="chero">
        <div
          className="chero-bg"
          style={{ background: current.bgGradient }}
        />
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
            <a
              href="/catalog"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.("catalog");
              }}
            >
              Collections
            </a>
            <span>/</span>
            <span>{current.name}</span>
          </nav>

          <div className="chero-grid">
            <div>
              <h1 className="t-xl">{current.name}</h1>
              <p className="lede">{current.description}</p>
              <div className="btn-row">
                <a
                  className="btn btn-white"
                  href={current.cataloguePdf || "#"}
                  download
                >
                  <Download className="icon" aria-hidden="true" />
                  Download catalogue
                </a>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => onNavigate?.("contact", current.id)}
                >
                  Enquire about {current.name}
                </button>
              </div>
            </div>

            <div className="chero-art">
              <span className="bkw">
                <span className="bk">
                  <img
                    src={current.coverImage}
                    alt={`Premier ${current.name} collection cover`}
                  />
                </span>
              </span>
              <i />
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIGHLIGHTS */}
      <section className="sec-tight">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">Highlights</h2>
            <p className="lede">{current.tagline}</p>
          </div>
          <div className="feats" style={{ "--n": 3 } as React.CSSProperties}>
            <div className="feat">
              <Sun className="icon" aria-hidden="true" />
              <h3>Anti Yellow Warranty</h3>
            </div>
            <div className="feat">
              <Gem className="icon" aria-hidden="true" />
              <h3>Premium collection</h3>
            </div>
            <div className="feat">
              <ShieldCheck className="icon" aria-hidden="true" />
              <h3>Premier quality check</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT COLLECTION */}
      <section className="sec" style={{ background: "var(--cream)" }}>
        <div className="wrap split">
          <div className="split-copy">
            <h2 className="t-l">About {current.name}</h2>
            <p className="lede">
              {current.name} is Premier’s signature collection, designed for spaces that demand durable elegance and modern aesthetics.
            </p>
            <p className="lede">
              Every sheet is rigorously inspected for surface resistance, color stability, and flawless finishing.
            </p>
            <p className="lede">
              Ask us for the complete shade card, custom panel dimensions, and dealer availability in your city.
            </p>
          </div>
          <div className="split-media">
            <div className="swblock">
              {current.swatches.map((color, idx) => (
                <i key={idx} style={{ background: color }} />
              ))}
              <span>{current.tagline}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOWNLOAD TEASER */}
      <section className="sec-tight">
        <div className="wrap">
          <div
            className="cta-box"
            style={{ background: current.bgGradient }}
          >
            <div>
              <h2 className="t-l">Get the {current.name} catalogue</h2>
              <p className="lede">
                See the full range as a PDF, or talk to us about samples and availability.
              </p>
            </div>
            <div className="btn-row">
              <a
                className="btn btn-white"
                href={current.cataloguePdf || "#"}
                download
              >
                <Download className="icon" aria-hidden="true" />
                Download PDF
              </a>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => onNavigate?.("contact", current.id)}
              >
                Send an enquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OTHER COLLECTIONS */}
      <section className="sec">
        <div className="wrap">
          <div className="shead">
            <h2 className="t-l">Other collections</h2>
          </div>
          <div className="others">
            {otherCollections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.("collection", item.id);
                }}
              >
                <div className="o">
                  <span className="bkw">
                    <span className="bk">
                      <img
                        src={item.coverImage}
                        alt=""
                        loading="lazy"
                      />
                    </span>
                  </span>
                </div>
                <b>{item.name}</b>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
