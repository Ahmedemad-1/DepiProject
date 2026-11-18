// Helpers for links. Keeps phone numbers clickable: telHref("+20 155 614 5996") -> "tel:+201556145996"
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
