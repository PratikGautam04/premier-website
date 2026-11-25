"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { collections } from "@/data/collections";

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string, id?: string) => void;
}

export default function Navbar({
  currentPage = "home",
  onNavigate,
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDrawer = () => {
    setDrawerOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    document.body.style.overflow = "";
  };

  const handleNav = (page: string, id?: string) => {
    setDropdownOpen(false);
    closeDrawer();
    onNavigate?.(page, id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className={`hdr ${scrolled ? "sc" : ""}`}>
        <div className="hdr-bar">
          <a
            href="/"
            className="hdr-logo"
            aria-label="Premier home"
            onClick={(e) => {
              e.preventDefault();
              handleNav("home");
            }}
          >
            <img
              src="/logo/premier-logo.png"
              alt="Premier"
              width="160"
              height="39"
            />
          </a>

          <nav className="nav" aria-label="Main">
            <a
              href="/"
              aria-current={currentPage === "home" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNav("home");
              }}
            >
              Home
            </a>
            <a
              href="/about"
              aria-current={currentPage === "about" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNav("about");
              }}
            >
              About us
            </a>

            <div
              className={`nav-dd ${dropdownOpen ? "open" : ""} ${
                currentPage === "collection" ? "cur" : ""
              }`}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Collections
                <ChevronDown className="icon" />
              </button>

              <div className="mega">
                {collections.map((item) => (
                  <a
                    key={item.id}
                    href={`/collection-${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav("collection", item.id);
                    }}
                  >
                    <span className="sw">
                      {item.swatches.map((color, idx) => (
                        <i key={idx} style={{ background: color }} />
                      ))}
                    </span>
                    <span>
                      <b>{item.name}</b>
                      <small>{item.tagline}</small>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/catalog"
              aria-current={currentPage === "catalog" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNav("catalog");
              }}
            >
              Catalogue
            </a>
            <a
              href="/contact"
              aria-current={currentPage === "contact" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNav("contact");
              }}
            >
              Contact
            </a>
          </nav>

          <div className="hdr-cta">
            <button
              className="btn btn-gold"
              type="button"
              onClick={() => handleNav("contact")}
            >
              Get in touch
            </button>
          </div>

          <button
            className="menu-btn"
            id="menuBtn"
            aria-label="Open menu"
            onClick={openDrawer}
          >
            <Menu className="icon" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`drawer ${drawerOpen ? "open" : ""}`}
        id="drawer"
        role="dialog"
        aria-label="Menu"
      >
        <div className="drawer-top">
          <img src="/logo/premier-logo-white.png" alt="Premier" />
          <button className="x" aria-label="Close menu" onClick={closeDrawer}>
            <X className="icon" />
          </button>
        </div>
        <nav>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNav("home");
            }}
          >
            Home
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              handleNav("about");
            }}
          >
            About us
          </a>
          <a
            href="/catalog"
            onClick={(e) => {
              e.preventDefault();
              handleNav("catalog");
            }}
          >
            Catalogue
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
          >
            Contact
          </a>

          <div className="sub">
            {collections.map((item) => (
              <a
                key={item.id}
                href={`/collection-${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav("collection", item.id);
                }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
