/**
 * COMPONENT : MenuShowcase
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : The rotating 'From our kitchen' plate on the home page.
 *             Data: useMenu() -> getMenuItems + getCategories (services/api.js).
 * ORIGIN    : Velora design by [FRIEND'S NAME], wired to the Nocturne data layer.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Img from './Img.jsx';
import Loader from './Loader.jsx';
import { useMenu } from '../hooks/useMenu.js';
import { formatPrice } from '../utils/formatPrice.js';

const INTERVAL = 5000;
const MAX_SLIDES = 8; // fallback only (see pickShowcase)
// Square photo for the plate; dishes without `imageSquare` use their normal `image`.
const plateImage = (dish) => dish.imageSquare || dish.image;

// The showcase shows the dishes that come with a square photo (`imageSquare`): these are
// Velora's original 13 dishes, in Velora's order, exactly as the original home page did.
// If none has one, fall back to one available dish per category (at most MAX_SLIDES).
function pickShowcase(items, categories) {
  const featured = items.filter((i) => i.isAvailable && i.imageSquare);
  if (featured.length) return featured;
  const picked = [];
  for (const c of categories) {
    const dish = items.find((i) => i.categoryId === c.id && i.isAvailable);
    if (dish) picked.push(dish);
  }
  return picked.slice(0, MAX_SLIDES);
}

export default function MenuShowcase() {
  const { items, categories, loading, error, categoryName } = useMenu();
  const dishes = useMemo(() => pickShowcase(items, categories), [items, categories]);
  const [slide, setSlide] = useState({ i: 0, prev: null });
  const count = dishes.length;

  useEffect(() => {
    if (!count) return undefined;
    const timer = setInterval(() => {
      if (!document.hidden) setSlide(s => ({ i: (s.i + 1) % count, prev: s.i }));
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [count]);

  useEffect(() => { if (count) new Image().src = plateImage(dishes[(slide.i + 1) % count]); }, [slide.i, count, dishes]);

  if (loading) return <Loader />;
  if (error || !count) return <div className="feature-state">The showcase is unavailable right now.</div>;

  const dish = dishes[slide.i];
  const prev = slide.prev === null ? null : dishes[slide.prev];

  return (
    <div className="feature-body" role="region" aria-label="Featured dishes">
      <h2 className="feature-title d-lg-none">From our kitchen</h2>
      <div className="row align-items-center gy-5 gx-lg-5">
        <div className="col-lg-6 order-2 order-lg-1">
          <h2 className="feature-title d-none d-lg-block">From our kitchen</h2>
          <div className="feature-text" key={dish.id}>
            <div className="feature-meta"><span className="cat">{categoryName(dish.categoryId)}</span>{dish.isVegetarian && <span className="veg"><Leaf size={13} /> Vegetarian</span>}</div>
            <h3 className="feature-name">{dish.name}</h3>
            <p className="feature-desc">{dish.description}</p>
            <p className="feature-price">{formatPrice(dish.basePrice)}</p>
            <Link to={`/menu/${dish.id}`} className="btn-ghost">View details</Link>
          </div>
        </div>
        <div className="col-lg-6 order-1 order-lg-2">
          <div className="plate">
            <div className="plate-photo">
              {prev && <Img key={`out-${prev.id}-${dish.id}`} className="plate-img out" src={plateImage(prev)} alt="" />}
              <Img key={dish.id} className="plate-img in" src={plateImage(dish)} alt={dish.name} />
              <Link to={`/menu/${dish.id}`} className="plate-link" aria-label={`View ${dish.name}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
