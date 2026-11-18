/**
 * PAGE    : About
 * ROUTE   : /about
 * OWNER   : Ahmed Taher (suggested - change if the team reassigns)
 * PURPOSE : The restaurant story and values (static content, no API calls).
 * ORIGIN  : Velora page by [FRIEND'S NAME], text unchanged except that the name comes from BRAND.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Img from '../components/Img.jsx';
import { sitePhoto } from '../config/photos.js';
import { BRAND } from '../config/brand.js';

const values = [
  ['Seasonal first', 'We cook with what is at its best this week and let the menu follow the produce, not the other way round.'],
  ['Made by hand', 'Pasta is rolled every morning, sauces simmer in our own kitchen and bread comes out of the same oven as dinner.'],
  ['Fire and patience', 'The wood-fired oven gives vegetables, bread and meat a flavour that cannot be hurried, so we never try.'],
  ['A warm welcome', 'Candlelight, honest recommendations and no rush. Your table is yours for the whole evening.'],
];

export default function About() {
  return (
    <main id="main">
      <section className="page-head" style={{ '--photo': `url(${sitePhoto.aboutHead})` }}>
        <div className="container">
          <p className="tag">About {BRAND.name}</p>
          <h1>Our Story</h1>
          <p className="lead">A restaurant should feel like the best table at a friend’s house. This is how we cook, who we cook for and what we care about.</p>
        </div>
      </section>

      <section className="sec" aria-labelledby="story-h">
        <div className="container"><div className="row align-items-center gx-4 gy-5 gx-lg-5">
          <div className="col-md-5">
            <div className="about-frame"><div className="about-clip"><Img src={sitePhoto.about} alt={`A warm lamp glowing over a set table in the ${BRAND.name} dining room`} className="about-img" /></div></div>
          </div>
          <div className="col-md-7 col-lg-6 about-offset">
            <h2 id="story-h">A simple idea, done properly</h2>
            <p>{BRAND.name} began with a simple idea: a restaurant should feel like the best table at a friend’s house. Warm light, honest food and people who are genuinely glad you came.</p>
            <p className="muted">Our kitchen cooks with seasonal produce from nearby growers, pasta rolled every morning and a wood-fired oven that never rests. The menu moves with the market, so what you taste is what is good right now.</p>
            <p className="muted">The room is candlelit, the pace is relaxed, and the team knows every dish well enough to tell you what they would order. Come for dinner, stay for dessert, and take your time.</p>
            <Link to="/menu" className="btn-ghost mt-3">View the menu <ArrowRight className="arrow" size={16} aria-hidden="true" /></Link>
          </div>
        </div></div>
      </section>

      <section className="sec light" aria-labelledby="values-h">
        <div className="container">
          <div className="head"><h2 id="values-h">What we care about</h2><p className="muted">Four ideas shape every plate and every evening.</p></div>
          <div className="values">
            {values.map(([title, text], i) => (
              <article key={title} className="value">
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec promo text-center" aria-labelledby="visit-h">
        <Img src={sitePhoto.bookTable} alt="" className="promo-img" />
        <div className="container">
          <h2 id="visit-h">Come and sit with us</h2>
          <p className="mx-auto mb-4" style={{ maxWidth: 520 }}>Book a table, or get in touch if you are planning something special. We’ll keep the candle lit.</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/reservation" className="btn-solid">Book a Table</Link>
            <Link to="/contact" className="btn-ghost">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
