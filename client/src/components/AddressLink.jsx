import { BRAND, MAP_URL } from '../config/brand.js';

export default function AddressLink({ className }) {
  const { address } = BRAND;
  const mapUrl = MAP_URL;
  return (
    <a className={className} href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${address} (opens in Google Maps in a new tab)`}>
      {address}
    </a>
  );
}
