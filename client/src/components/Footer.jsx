/**
 * COMPONENT : Footer
 * OWNER     : Shared (first version: Ahmed Taher)
 * NOTE      : Working shell. Replace the text with the real restaurant details.
 */
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-auto">
      <small>&copy; {YEAR} Restaurant - DEPI graduation project</small>
    </footer>
  );
}
