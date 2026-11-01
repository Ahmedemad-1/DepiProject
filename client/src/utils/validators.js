export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isValidPhone = (v) => /^01[0-9]{9}$/.test(v); // Egyptian mobile format
export const isValidPassword = (v) => v.length >= 6;
