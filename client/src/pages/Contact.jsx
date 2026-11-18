/**
 * PAGE    : Contact
 * ROUTE   : /contact  (extra route that exists only in the Velora design)
 * OWNER   : Heba Talaat (suggested - forms) / Ahmed Taher (design)
 * PURPOSE : Contact details, opening hours and the "send us a message" form.
 * API     : sendContactMessage() in services/api.js (external Web3forms service).
 * NOTE    : the form validates with its own rules (name, email, phone, message); the email
 *           check reuses utils/validators.js. Hours shown here come from BRAND.hours.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Check, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand.js';
import { sitePhoto } from '../config/photos.js';
import { telHref } from '../utils/links.js';
import { isValidEmail } from '../utils/validators.js';
import AddressLink from '../components/AddressLink.jsx';
import Dropdown from '../components/Dropdown.jsx';
import Email from '../components/Email.jsx';
import { sendContactMessage } from '../services/api.js';

const TOPICS = ['General question', 'Reservation help', 'Celebrations and events', 'Feedback'];
const EMPTY = { name: '', email: '', phone: '', topic: TOPICS[0], message: '', botcheck: false };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please tell us your Name';
  if (!v.email.trim()) errors.email = 'Please enter your Email address';
  else if (!isValidEmail(v.email.trim())) errors.email = 'That Email address doesn’t look right';
  if (v.phone.trim() && !/^[\d\s()+.-]{11}$/.test(v.phone.trim())) errors.phone = 'Use digits, spaces, + or - only.';
  if (v.message.trim().length < 10) errors.message = 'Please write a few words (at least 10 characters)';
  return errors;
}

function Field({ id, label, optional, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <small>optional</small>}</label>
      {children}
      {error && <p className="field-err" id={`${id}-err`}>{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');
  const sentRef = useRef(null);
  const errors = validate(values);
  const shown = f => touched[f] ? errors[f] : undefined;

  const ctl = f => ({
    id: `c-${f}`, name: f, value: values[f],
    onChange: e => setValues(v => ({ ...v, [f]: e.target.value })),
    onBlur: () => setTouched(t => ({ ...t, [f]: true })),
    'aria-invalid': shown(f) ? 'true' : undefined,
    'aria-describedby': shown(f) ? `c-${f}-err` : undefined,
  });

  useEffect(() => { if (status === 'sent') sentRef.current?.focus(); }, [status]);

  async function submit(e) {
    e.preventDefault();
    if (status === 'sending') return;
    setTouched({ name: true, email: true, phone: true, message: true });
    const first = Object.keys(errors)[0];
    if (first) { document.getElementById(`c-${first}`)?.focus(); return; }
    if (values.botcheck) { setStatus('sent'); return; }
    setStatus('sending');
    try {
      await sendContactMessage({ topic: values.topic, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), message: values.message.trim() });
      setStatus('sent');
    } catch (err) {
      console.error('Contact form: the message was not sent', err);
      setStatus('error');
    }
  }

  const again = () => { setValues(EMPTY); setTouched({}); setStatus('idle'); };

  return (
    <main id="main">
      <section className="page-head" style={{ '--photo': `url(${sitePhoto.contactHead})` }}>
        <div className="container">
          <h1>Contact</h1>
          <p className="lead">Questions, celebrations or just a hello? Send us a message or give us a call and we’ll get back to you.</p>
        </div>
      </section>

      <section className="sec" aria-labelledby="visit-h">
        <div className="container"><div className="row gx-4 gy-5 gx-lg-5">
          <div className="col-lg-5">
            <h2 id="visit-h" className="sm mb-4">Visit or call us</h2>
            <ul className="contact-list">
              <li><span className="ico"><MapPin size={18} aria-hidden="true" /></span><div><small>Address</small><AddressLink className="val" /></div></li>
              <li><span className="ico"><Phone size={18} aria-hidden="true" /></span><div><small>Phone</small><a className="val" href={telHref(BRAND.phone)}>{BRAND.phone}</a></div></li>
              <li><span className="ico"><Mail size={18} aria-hidden="true" /></span><div><small>Email</small><Email className="val" address={BRAND.email} /></div></li>
            </ul>
            <h3 className="mini">Opening hours</h3>
            <ul className="list hours">
              {BRAND.hours.map(([day, time]) => <li key={day}><span>{day}</span><span>{time}</span></li>)}
            </ul>
            <div className="book-note">
              <p>Planning an evening with us? Reserve your table online.</p>
              <Link to="/reservation" className="btn-ghost sm">Book a Table</Link>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="form-card">
              {status === 'sent' ? (
                <div className="sent" tabIndex={-1} ref={sentRef}>
                  <span className="sent-ico"><Check size={22} aria-hidden="true" /></span>
                  <h2 className="sm">Thank you, {values.name.trim().split(/\s+/)[0]}.</h2>
                  <p>Your message is on its way. We’ll reply to {values.email.trim()} as soon as we can.</p>
                  <button type="button" className="btn-ghost" onClick={again}>Send another message</button>
                </div>
              ) : (
                <>
                  <h2 className="sm">Send us a message</h2>
                  <p className="lead">Fill in the form and we’ll reply by email.</p>
                  <form onSubmit={submit} noValidate>
                    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} checked={values.botcheck} onChange={e => setValues(v => ({ ...v, botcheck: e.target.checked }))} />
                    <div className="row g-3">
                      <div className="col-md-6"><Field id="c-name" label="Name" error={shown('name')}><input type="text" className="form-control" autoComplete="name" {...ctl('name')} /></Field></div>
                      <div className="col-md-6"><Field id="c-email" label="Email" error={shown('email')}><input type="email" className="form-control" autoComplete="email" {...ctl('email')} /></Field></div>
                      <div className="col-md-6"><Field id="c-phone" label="Phone" optional error={shown('phone')}><input type="tel" className="form-control" autoComplete="tel" {...ctl('phone')} /></Field></div>
                      <div className="col-md-6"><Field id="c-topic" label="Topic"><Dropdown id="c-topic" label="Topic" options={TOPICS} value={TOPICS.indexOf(values.topic)} onChange={i => setValues(v => ({ ...v, topic: TOPICS[i] }))} /></Field></div>
                      <div className="col-12"><Field id="c-message" label="Message" error={shown('message')}><textarea className="form-control" rows={5} placeholder="How can we help?" {...ctl('message')} /></Field></div>
                    </div>
                    <div className="form-foot">
                      <button type="submit" className="btn-solid" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending…' : <>Send Message <ArrowRight className="arrow" size={16} aria-hidden="true" /></>}
                      </button>
                    </div>
                    {status === 'error' && <p className="form-error" role="alert">Something went wrong and your message was not sent. Please try again, or call us on <a className="val" href={telHref(BRAND.phone)}>{BRAND.phone}</a>.</p>}
                  </form>
                </>
              )}
            </div>
          </div>
        </div></div>
      </section>
    </main>
  );
}
