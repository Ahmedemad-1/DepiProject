// Hides the full-screen loading splash (the #splash element in index.html) once the
// fonts, and on the home page the first hero photo, are ready (max 3 seconds).
// Kept from the Velora project unchanged except for the import path.
import { sitePhoto } from "../config/photos.js";

const MAX_WAIT_MS = 3000;
const FADE_MS = 700;
const FACES = [
  "400 1em Lora",
  "italic 400 1em Lora",
  "400 1em Sora",
  "500 1em Sora",
];

const imageReady = (src) =>
  new Promise((done) => {
    const img = new Image();
    img.onload = img.onerror = done;
    img.src = src;
  });

const fontsReady = () =>
  Promise.allSettled(FACES.map((face) => document.fonts.load(face)));

export function hideSplashWhenReady() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  const ready = Promise.all([
    fontsReady(),
    location.pathname === "/" ? imageReady(sitePhoto.hero[0]) : null,
  ]);
  const timeout = new Promise((done) => setTimeout(done, MAX_WAIT_MS));
  Promise.race([ready, timeout]).then(() =>
    requestAnimationFrame(() => {
      splash.classList.add("hide");
      setTimeout(() => splash.remove(), FADE_MS);
    }),
  );
}
