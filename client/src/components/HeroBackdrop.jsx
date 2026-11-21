import { useEffect, useState } from "react";
import { sitePhoto } from "../config/photos.js";

const SLIDE_MS = 8000;
const LATER_MS = 2500;

export default function HeroBackdrop() {
  const [photos, setPhotos] = useState([]);
  const [slide, setSlide] = useState({ i: 0, prev: null });

  useEffect(() => {
    let alive = true;
    const load = (src) => {
      const img = new Image();
      img.onload = () =>
        alive &&
        setPhotos((list) =>
          sitePhoto.hero.filter((s) => s === src || list.includes(s)),
        );
      img.src = src;
    };
    const [first, ...rest] = sitePhoto.hero;
    load(first);
    const timer = setTimeout(() => rest.forEach(load), LATER_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (photos.length < 2) return undefined;
    const timer = setInterval(() => {
      if (!document.hidden)
        setSlide((s) => ({ i: (s.i + 1) % photos.length, prev: s.i }));
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [photos]);

  return (
    <div
      className="hero-bg"
      aria-hidden="true"
      style={{ "--slide": `${SLIDE_MS}ms` }}
    >
      {photos.map((src, n) => (
        <div
          key={src}
          className={`hero-slide ${n === slide.i ? "on" : n === slide.prev ? "leaving" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
    </div>
  );
}
