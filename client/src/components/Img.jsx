import { useState } from "react";
import { LogoMark } from "./Logo.jsx";

export default function Img({ src, alt, className = "" }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    const a11y = alt
      ? { role: "img", "aria-label": alt }
      : { "aria-hidden": true };
    return (
      <div className={`ph ${className}`} {...a11y}>
        <LogoMark size={56} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setBad(true)}
    />
  );
}
