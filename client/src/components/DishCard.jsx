/**
 * COMPONENT : DishCard
 * OWNER     : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE   : One dish card (photo, category, name, description, price) for the menu grid.
 *             Replaces Nocturne's old DishCard and Velora's FoodCard (same markup as Velora).
 * ORIGIN    : Velora design by [FRIEND'S NAME], wired to the Nocturne data layer.
 * PROPS     : item (a menuItems record), category (the category name to show)
 * NOTE      : an item with isAvailable === false is shown dimmed with an 'Unavailable' tag.
 */
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import Img from "./Img.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function DishCard({ item, category }) {
  return (
    <article className={`dish${item.isAvailable ? "" : " off"}`}>
      <div className="thumb">
        <Img src={item.image} alt={item.name} />
        {item.isVegetarian && (
          <span className="veg">
            <Leaf size={13} /> Vegetarian
          </span>
        )}
        {!item.isAvailable && <span className="dish-flag">Unavailable</span>}
      </div>
      <div className="dish-body">
        <span className="cat">{category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="dish-foot d-flex justify-content-between align-items-center mt-auto">
          <strong className="price">{formatPrice(item.basePrice)}</strong>
          <Link to={`/menu/${item.id}`} className="stretched-link more">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
