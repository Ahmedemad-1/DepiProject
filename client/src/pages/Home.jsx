/**
 * PAGE    : Home
 * ROUTE   : /
 * OWNER   : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE : Landing page: hero, rotating dish showcase, categories, about teaser, booking call-to-action.
 * ORIGIN  : Velora design by [FRIEND'S NAME]; data and rules from the Nocturne system.
 * DATA    : categories and dishes from useMenu() (services/api.js). Copy is Velora's.
 * TODO    : the hero/about text still describes a wood-fired, pasta-led Italian menu while the
 *           database menu is Egyptian. The team must align the copy with the real menu.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MenuShowcase from '../components/MenuShowcase.jsx';
import Img from '../components/Img.jsx';
import HeroBackdrop from '../components/HeroBackdrop.jsx';
import WaitingTable from '../components/WaitingTable.jsx';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useMenu } from '../hooks/useMenu.js';
import { sitePhoto } from '../config/photos.js';
import { BRAND } from '../config/brand.js';

export default function Home() {
  const { items, categories, loading, error, reload } = useMenu();
  // Category card photo = the category's own `image` (Velora's categories have one),
  // otherwise the photo of its first dish.
  const cardImage = (c) => c.image || items.find((i) => i.categoryId === c.id)?.image;

  return (
    <main id="main">
      <section id="hero" className="hero">
        <HeroBackdrop />
        <div className="container hero-in">
          <p className="tag">{BRAND.tagline}</p>
          <h1>A Taste Worth Remembering</h1>
          <p className="lead">{BRAND.name} brings seasonal ingredients, wood fired heat and unhurried service to one warm table. Come hungry, stay for the evening.</p>
          <div className="d-grid d-sm-flex flex-wrap gap-3">
            <Link to="/menu" className="btn-solid">Explore Our Menu</Link>
            <Link to="/reservation" className="btn-ghost">Book a Table</Link>
          </div>
        </div>
      </section>

      <section className="sec feature" aria-label="From our kitchen">
        <div className="container"><MenuShowcase /></div>
      </section>

      <section className="sec light" aria-labelledby="courses">
        <div className="container">
          <div className="head"><h2 id="courses">Find your course</h2><p className="muted">Start with what you’re craving and we’ll show you the matching dishes.</p></div>
          <div className="row g-3 g-lg-4">
            {loading && <Loader />}
            {error && <ErrorMessage message={`We couldn’t load the menu. ${error}`} onRetry={reload} />}
            {categories.map(c => (
              <div key={c.id} className="col-6 col-lg-3">
                <Link to={`/menu?category=${c.id}`} className="cat-card">
                  <Img src={cardImage(c)} alt="" className="cat-img" />
                  <h3>{c.name}</h3><p>{c.description}</p><span className="cat-go">View dishes</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="sec" aria-labelledby="about-h">
        <div className="container"><div className="row align-items-center gy-5 gx-lg-5">
          <div className="col-md-5"><div className="about-frame"><div className="about-clip"><Img src={sitePhoto.about} alt={`A warm lamp glowing over a set table in the ${BRAND.name} dining room`} className="about-img" /></div></div></div>
          <div className="col-md-7 col-lg-6 about-offset">
            <h2 id="about-h">Cooked slowly, served warmly</h2>
            <p>{BRAND.name} began with a simple idea: a restaurant should feel like the best table at a friend’s house. Our kitchen cooks with seasonal produce from nearby growers, pasta rolled every morning and a wood-fired oven that never rests.</p>
            <p className="muted">Every plate starts with ingredients we’d happily serve at home: this year’s olive oil, aged beef from trusted farms, herbs cut the same day. The room is candlelit, the pace is relaxed, and the team knows the menu by heart.</p>
            <Link to="/about" className="btn-solid mt-4">Discover our story <ArrowRight className="arrow" size={16} aria-hidden="true" /></Link>
          </div>
        </div></div>
      </section>

      <section className="sec promo text-center" aria-labelledby="reserve">
        <Img src={sitePhoto.bookTable} alt="" className="promo-img" />
        <div className="container">
          <h2 id="reserve">Make your evening special</h2>
          <p className="mx-auto mb-4" style={{ maxWidth: 520 }}>Book a table for dinner or a celebration. We’ll keep the candle lit.</p>
          <Link to="/reservation" className="btn-solid">Book a Table</Link>
        </div>
      </section>

      <WaitingTable />

    </main>
  );
}
