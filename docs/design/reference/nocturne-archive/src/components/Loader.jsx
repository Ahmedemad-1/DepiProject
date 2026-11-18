/**
 * COMPONENT : Loader
 * OWNER     : Shared
 * PURPOSE   : Loading indicator for any page that fetches data.
 * PROPS     : text? (default "Loading...")
 */
export default function Loader({ text = "Loading..." }) {
  return (
    <div className="state-loading" role="status">
      <span
        className="spinner-border spinner-border-sm text-primary"
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  );
}
