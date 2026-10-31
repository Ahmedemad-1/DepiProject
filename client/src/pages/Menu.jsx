import { useEffect, useState } from 'react'
import { getMenuItems } from '../services/api.js'
import { formatPrice } from '../utils/formatPrice.js'

// Starter example: loads menu items from the API (json-server for now)
// and shows them as a simple list. Replace with DishCard components.
export default function Menu() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(() => setError('Could not load the menu. Is the mock API running? (npm run mock)'))
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h1>Menu</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <span>{item.name}{!item.isAvailable && ' (Unavailable)'}</span>
            <span>{formatPrice(item.basePrice)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
