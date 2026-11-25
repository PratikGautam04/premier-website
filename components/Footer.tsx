"use client";

import { collections } from "@/data/collections";

interface FooterProps {
  onNavigate?: (page: string, id?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: string, id?: string) => {
    onNavigate?.(page, id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <img
              className="lg"
              src="/logo/premier-logo-white.png"
              alt="Premier"
            />
            <p style={{ maxWidth: "32ch" }}>
              Premium laminates and surfaces for homes and commercial spaces. Part of the Kalpavruksh family.
            </p>
          </div>

          <div>
            <h4>Collections</h4>
            <ul className="cols2">
              {collections.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/collection-${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("collection", item.id);
                    }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("home");
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("about");
                  }}
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="/catalog"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("catalog");
                  }}
                >
                  Catalogue
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav("contact");
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li>+91 XXXXX XXXXX</li>
              <li>Premierindia@gmail.com</li>
              <li>Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="ftr-bot">
          <span>© 2026 Premier. All rights reserved.</span>
          <span>Every layer tells a story of craftsmanship.</span>
        </div>
      </div>
    </footer>
  );
}
