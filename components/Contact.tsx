"use client";

import { useEffect, useState, useMemo } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { MetadataValues } from "@/types/metadata";
import {
  fetchMetadataTemplate,
  getSection,
  getFieldValue,
} from "@/utils/metadata";

interface ContactProps {
  onNavigate?: (page: string, id?: string) => void;
  initialCollection?: string;
}

export default function Contact({ onNavigate, initialCollection = "" }: ContactProps) {
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
    const seoSection = getSection(metadata, "seo_metadata", "seo", "contact_seo");
    const metaTitle =
      getFieldValue(seoSection, "meta_title", "title", "contact_title") ||
      "Contact Premier";
    const metaDesc =
      getFieldValue(seoSection, "meta_description", "description") ||
      "Reach out to Premier for samples, dealer inquiries, product questions, or project consultations.";

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
  // 2. Contact Page Data from Metadata
  // -----------------------------------------------------------------
  const contactSection = useMemo(
    () => getSection(metadata, "contact", "contact_page", "enquiry"),
    [metadata]
  );
  const heroTitle =
    getFieldValue(contactSection, "hero_title", "title", "heading") ||
    "Let’s talk about your space.";
  const infoHeading =
    getFieldValue(contactSection, "info_heading", "subheading") ||
    "We reply to every enquiry.";
  const infoLede =
    getFieldValue(contactSection, "info_lede", "description", "lede") ||
    "Tell us what you are building. We will suggest a collection and arrange samples.";

  const contactPhone =
    getFieldValue(contactSection, "phone", "contact_phone") || "+91 XXXXX XXXXX";
  const contactEmail =
    getFieldValue(contactSection, "email", "contact_email") ||
    "Premierindia@gmail.com";
  const contactAddress =
    getFieldValue(contactSection, "address", "location") ||
    "Mumbai, Maharashtra, India";
  const contactHours =
    getFieldValue(contactSection, "hours", "timing") ||
    "Mon to Sat, 9:30 am to 6:30 pm";
  const formEndpoint =
    getFieldValue(contactSection, "form_endpoint", "endpoint", "webhook_url") || "";

  // -----------------------------------------------------------------
  // 3. Form State & Validation (Matching site.js behavior)
  // -----------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    role: "Homeowner",
    collection: initialCollection,
    message: "",
  });

  // Sync initialCollection when prop changes
  useEffect(() => {
    if (initialCollection) {
      setFormData((prev) => ({ ...prev, collection: initialCollection }));
    }
  }, [initialCollection]);

  const [formStatus, setFormStatus] = useState<{
    show: boolean;
    type: "ok" | "warn";
    message: string;
  }>({
    show: false,
    type: "ok",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    const nameVal = formData.name.trim();
    const phoneVal = formData.phone.trim();
    const emailVal = formData.email.trim();
    const cityVal = formData.city.trim();

    if (!nameVal) newErrors.name = true;
    if (!phoneVal || phoneVal.replace(/\D/g, "").length < 10) newErrors.phone = true;
    if (!emailVal || !/^\S+@\S+\.\S+$/.test(emailVal)) newErrors.email = true;
    if (!cityVal) newErrors.city = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormStatus({
        show: true,
        type: "warn",
        message: "Please check the highlighted fields.",
      });
      return;
    }

    if (formEndpoint) {
      try {
        const bodyData = new FormData();
        Object.entries(formData).forEach(([k, v]) => bodyData.append(k, v));
        const res = await fetch(formEndpoint, {
          method: "POST",
          body: bodyData,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error();

        setFormStatus({
          show: true,
          type: "ok",
          message:
            "Thank you. We have received your enquiry and will call you back soon.",
        });
        setFormData({
          name: "",
          phone: "",
          email: "",
          city: "",
          role: "Homeowner",
          collection: "",
          message: "",
        });
      } catch {
        setFormStatus({
          show: true,
          type: "warn",
          message: "Could not send the enquiry. Please try again or call us.",
        });
      }
    } else {
      // Default success confirmation
      setFormStatus({
        show: true,
        type: "ok",
        message:
          "Thank you. We have received your enquiry and will call you back soon.",
      });
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        role: "Homeowner",
        collection: "",
        message: "",
      });
    }
  };

  return (
    <main>
      {/* 1. HERO SECTION */}
      <section className="phero">
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
            <span>Contact</span>
          </nav>
          <h1 className="t-xl" style={{ maxWidth: "12ch" }}>
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & FORM */}
      <section className="sec-tight">
        <div className="wrap cgrid2">
          <div>
            <h2 className="t-m">{infoHeading}</h2>
            <p className="lede" style={{ marginTop: "14px" }}>
              {infoLede}
            </p>
            <div className="info">
              <div>
                <span className="ic">
                  <Phone className="icon" aria-hidden="true" />
                </span>
                <span>
                  <small>Phone</small>
                  <b>{contactPhone}</b>
                </span>
              </div>
              <div>
                <span className="ic">
                  <Mail className="icon" aria-hidden="true" />
                </span>
                <span>
                  <small>Email</small>
                  <b>{contactEmail}</b>
                </span>
              </div>
              <div>
                <span className="ic">
                  <MapPin className="icon" aria-hidden="true" />
                </span>
                <span>
                  <small>Address</small>
                  <b>{contactAddress}</b>
                </span>
              </div>
              <div>
                <span className="ic">
                  <Clock className="icon" aria-hidden="true" />
                </span>
                <span>
                  <small>Hours</small>
                  <b>{contactHours}</b>
                </span>
              </div>
            </div>
          </div>

          <form className="form" id="enq" noValidate onSubmit={handleSubmit}>
            <div className={`field ${errors.name ? "bad" : ""}`}>
              <label htmlFor="f-name">Full name</label>
              <input
                id="f-name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
              <p className="err">Enter your name.</p>
            </div>

            <div className={`field ${errors.phone ? "bad" : ""}`}>
              <label htmlFor="f-phone">Phone</label>
              <input
                id="f-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <p className="err">Enter a 10-digit phone number.</p>
            </div>

            <div className={`field ${errors.email ? "bad" : ""}`}>
              <label htmlFor="f-email">Email</label>
              <input
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <p className="err">Enter a valid email address.</p>
            </div>

            <div className={`field ${errors.city ? "bad" : ""}`}>
              <label htmlFor="f-city">City</label>
              <input
                id="f-city"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
              />
              <p className="err">Enter your city.</p>
            </div>

            <div className="field">
              <label htmlFor="f-role">I am a</label>
              <select
                id="f-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option>Homeowner</option>
                <option>Architect or designer</option>
                <option>Contractor or carpenter</option>
                <option>Dealer</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="f-col">Collection of interest</label>
              <select
                id="f-col"
                name="collection"
                value={formData.collection}
                onChange={handleChange}
              >
                <option value="">Not sure yet</option>
                <option value="hybrid-lam">Hybrid Lam</option>
                <option value="versace-6h">Versace 6H</option>
                <option value="imazica">Imazica</option>
                <option value="jutex">Jutex</option>
                <option value="cork-versace">Cork Versace</option>
                <option value="sofitek-panels">Sofitek Panels</option>
                <option value="ubuntu">Ubuntu</option>
                <option value="fluted-acrylic">Fluted Acrylic</option>
              </select>
            </div>

            <div className="field full">
              <label htmlFor="f-msg">Message</label>
              <textarea
                id="f-msg"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="full">
              <button className="btn btn-sapphire" type="submit">
                Send enquiry <ArrowRight className="icon" aria-hidden="true" />
              </button>
            </div>

            <p
              className={`form-note full ${formStatus.show ? `show ${formStatus.type}` : ""}`}
              id="formNote"
              role="status"
            >
              {formStatus.message}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
