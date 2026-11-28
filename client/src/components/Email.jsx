export default function Email({ address, className }) {
  const [user, domain] = address.split("@");
  return (
    <a className={className} href={`mailto:${address}`}>
      {user}@<wbr />
      {domain}
    </a>
  );
}
