"use client";

import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import Home from "@/components/Home";
import About from "@/components/About";
import Catalog from "@/components/Catalog";
import Contact from "@/components/Contact";
import OtherPage from "@/components/OtherPage";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [currentCollection, setCurrentCollection] = useState<string>("hybrid-lam");

  // Read URL pathname on initial load and handle browser back/forward
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");
      const idParam = params.get("id");

      if (path.startsWith("collection-")) {
        setCurrentPage("collection");
        setCurrentCollection(path.replace("collection-", ""));
      } else if (path === "about" || path === "catalog" || path === "catalogue" || path === "contact") {
        setCurrentPage(path);
      } else if (pageParam) {
        setCurrentPage(pageParam);
        if (idParam) setCurrentCollection(idParam);
      } else {
        setCurrentPage("home");
      }
    };

    parseUrl();
    window.addEventListener("popstate", parseUrl);
    return () => window.removeEventListener("popstate", parseUrl);
  }, []);

  // Clean path-based navigation handler (/about, /catalog, /contact, /collection-[id])
  const navigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) setCurrentCollection(id);

    let path = "/";
    if (page === "about" || page === "contact") {
      path = `/${page}`;
    } else if (page === "catalog" || page === "catalogue") {
      path = "/catalog";
    } else if (page === "collection" && id) {
      path = `/collection-${id}`;
    }

    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "about":
        return <About onNavigate={navigate} />;
      case "catalog":
      case "catalogue":
        return <Catalog onNavigate={navigate} />;
      case "contact":
        return <Contact onNavigate={navigate} initialCollection={currentCollection} />;
      case "collection":
        return <OtherPage collectionId={currentCollection} onNavigate={navigate} />;
      case "home":
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <>
      <ScrollEffects currentPage={currentPage} />
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      {renderPage()}
      <Footer onNavigate={navigate} />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}
