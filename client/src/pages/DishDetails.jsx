/**
 * PAGE    : DishDetails
 * ROUTE   : /menu/:id
 * OWNER   : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE : One dish: photo, size, extras, quantity, live total, Add to Cart.
 * ORIGIN  : Velora design by [FRIEND'S NAME]; pricing and cart from the Nocturne system.
 * API     : getMenuItem(id) (services/api.js); cart through useCart().addItem(line).
 * RULES   : unit price = basePrice x size multiplier + extras, rounded to cents, via calcUnitPrice();
 *           the default size is medium (= base price); the size block is hidden for dishes
 *           with a single size and the extras block for dishes without extras; an
 *           unavailable dish cannot be added. The same dish with another size or other
 *           extras is a separate cart line (makeLineId in utils/cart.js).
 * CHANGED : Velora used sizes 1 / 1.3 / 1.6 and a default of Small; Nocturne's contract
 *           (0.7 / 1 / 1.2, default medium) wins. See docs/MERGE_REPORT.md.
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Leaf, Minus, Plus } from 'lucide-react';
import Img from '../components/Img.jsx';
import Loader from '../components/Loader.jsx';
import { getMenuItem } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useMenu } from '../hooks/useMenu.js';
import { calcUnitPrice, formatPrice } from '../utils/formatPrice.js';
import { makeLineId } from '../utils/cart.js';

const SIZE_LABEL = { small: 'Small', medium: 'Medium', large: 'Large' };
// Velora's original message for an unknown dish; the API answers 404 for it.
const notFoundText = (e) => (/404/.test(e.message) ? 'That dish is not on our menu.' : e.message);
const defaultSize = (dish) => (dish.availableSizes.includes('medium') ? 'medium' : dish.availableSizes[0]);

export default function DishDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ dish: null, error: null });
  const { addItem } = useCart();
  const { categoryName } = useMenu();
  const [sizeName, setSizeName] = useState('medium');
  const [pickedNames, setPickedNames] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let live = true;
    setState({ dish: null, error: null });
    setPickedNames([]); setQuantity(1);
    getMenuItem(id)
      .then(dish => { if (!live) return; setSizeName(defaultSize(dish)); setState({ dish, error: null }); })
      .catch(e => live && setState({ dish: null, error: notFoundText(e) }));
    return () => { live = false; };
  }, [id]);

  useEffect(() => { setAdded(false); }, [sizeName, pickedNames, quantity, id]);
  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 2500);
    return () => clearTimeout(t);
  }, [added]);

  const { dish, error } = state;
  if (error) return <main id="main" className="page-head"><div className="container"><h1 className="h2">Dish not found</h1><p>{error}</p><Link to="/menu" className="btn-solid">Back to menu</Link></div></main>;
  if (!dish) return <main id="main"><Loader className="tall" /></main>;

  // Options come from the dish itself (db.json): availableSizes and extras [{ name, nameAr, price }].
  const options = dish.extras || [];
  const selectedExtras = options.filter(e => pickedNames.includes(e.name));
  // Pricing rule: unit price = base price x size multiplier + extras (rounded to cents).
  const unitPrice = calcUnitPrice(dish.basePrice, sizeName, selectedExtras);
  const totalPrice = unitPrice * quantity;
  const toggle = extraName => setPickedNames(p => (p.includes(extraName) ? p.filter(x => x !== extraName) : [...p, extraName]));
  const unavailable = !dish.isAvailable;

  const addToCart = () => {
    const extras = selectedExtras.map(({ name, price }) => ({ name, price }));
    addItem({
      lineId: makeLineId(dish.id, sizeName, extras),
      menuItemId: dish.id,
      name: dish.name,
      image: dish.image,
      size: sizeName,
      extras,
      quantity,
      unitPrice,
    });
    setAdded(true);
  };

  return (
    <main id="main" className="container detail">
      <div className="detail-wrap">
        <Link to="/menu" className="back back-top"><ArrowLeft size={15} /> Back to menu</Link>
        <div className="row g-4 g-xl-5 align-items-center">
          <div className="col-sm-5 col-md-6 col-lg-5"><div className="plate detail-plate"><div className="plate-photo"><Img src={dish.imageSquare || dish.image} alt={dish.name} className="plate-img in" /></div></div></div>
          <div className="col-sm-7 col-md-6 col-lg-7">
            <div className="detail-top">
              <div><span className="cat">{categoryName(dish.categoryId)}</span>{dish.isVegetarian && <span className="veg"><Leaf size={13} /> Vegetarian</span>}</div>
              <Link to="/menu" className="back back-side"><ArrowLeft size={15} /> Back to menu</Link>
            </div>
            <h1>{dish.name}</h1>
            <p className="muted desc">{dish.description}</p>
            <p className="base">Base price {formatPrice(dish.basePrice)}</p>

            {dish.availableSizes.length > 1 && (
              <fieldset className="opt">
                <legend>Size</legend>
                <div className="seg">
                  {dish.availableSizes.map(s => (
                    <label key={s} className={sizeName === s ? 'on' : ''}>
                      <input type="radio" name="size" className="visually-hidden" checked={sizeName === s} onChange={() => setSizeName(s)} />
                      {SIZE_LABEL[s]}<small>{formatPrice(calcUnitPrice(dish.basePrice, s))}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {options.length > 0 && (
              <fieldset className="opt">
                <legend>Extras</legend>
                <div className="chips">
                  {options.map(e => {
                    const on = pickedNames.includes(e.name);
                    return (
                      <label key={e.name} className={`xtra ${on ? 'on' : ''}`}>
                        <input type="checkbox" className="visually-hidden" checked={on} onChange={() => toggle(e.name)} />
                        <span className="box">{on && <Check size={13} />}</span>{e.name}<small>+{formatPrice(e.price)}</small>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            <div className="total" aria-live="polite">
              <span className="muted">{SIZE_LABEL[sizeName]}{selectedExtras.length > 0 && ` + ${selectedExtras.length} extra${selectedExtras.length > 1 ? 's' : ''}`}, {formatPrice(unitPrice)} each</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>
            <div className="buy">
              <div className="qty" role="group" aria-label="Quantity">
                <button type="button" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <output>{quantity}</output>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
              </div>
              <button type="button" className="btn-solid grow" onClick={addToCart} disabled={unavailable}>{unavailable ? 'Unavailable' : added ? <><Check size={16} /> Added to cart</> : 'Add to Cart'}</button>
            </div>
            <p className="visually-hidden" role="status">{added ? `${quantity} × ${dish.name} added to the cart.` : ''}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
