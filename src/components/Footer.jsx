import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setMsg('Merci ! Vous êtes inscrit à la newsletter.');
        setEmail('');
      } else {
        const data = await res.json();
        setMsg(data.error || "Erreur lors de l'inscription.");
      }
    } catch {
      setMsg('Erreur lors de l’inscription.');
    }
  };

  return (
    <footer style={{marginTop: "3rem", background: "none"}}>
      {/* Newsletter section */}
      <div style={{
        background: "#22C55E",
        color: "#fff",
        padding: "2.5rem 0 2rem 0",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        textAlign: "left"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          <div style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 6 }}>Restez informé</div>
          <div style={{ fontSize: "1.08rem", marginBottom: 18 }}>
            Abonnez-vous à notre newsletter pour recevoir nos offres spéciales et des conseils anti-gaspillage.
          </div>
          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              maxWidth: 600,
              marginBottom: 8
            }}
          >
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                border: "none",
                padding: "0.9em 1em",
                fontSize: "1.08em",
                outline: "none",
                background: "#fff",
                borderRadius: 8,
                color: "#222",
                flex: 1
              }}
            />
            <button
              type="submit"
              className="btn btn-white"
              style={{
                color: "#22C55E",
                fontWeight: 700,
                background: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.9em 1.7em",
                fontSize: "1.08em",
                letterSpacing: 0.5,
                cursor: "pointer"
              }}
            >
              S’abonner
            </button>
          </form>
          <div style={{ fontSize: "0.95em", color: "#d1fae5", marginBottom: 4 }}>
            Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.
          </div>
          {msg && (
            <div style={{
              color: msg.includes("Merci") ? "#fff" : "#e11d48",
              background: msg.includes("Merci") ? "#16A34A" : "#fee2e2",
              borderRadius: 8,
              padding: "0.5em 1.2em",
              fontWeight: 500,
              textAlign: "center",
              fontSize: "1.05em",
              marginTop: 4,
              marginBottom: 4,
              transition: "color 0.2s"
            }}>
              {msg}
            </div>
          )}
        </div>
      </div>
      {/* Main footer */}
      <div style={{
        background: "#181F2A",
        color: "#fff",
        padding: "2.5rem 0 1.5rem 0"
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: 32
        }}>
          {/* GreenCart */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>GREENCART</div>
            <div style={{ color: "#d1fae5", fontSize: "0.98em" }}>
              La plateforme qui connecte consommateurs et producteurs locaux pour une alimentation durable et anti-gaspillage.
            </div>
          </div>
          {/* Navigation */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>NAVIGATION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Accueil</a>
              <a href="/products" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Produits</a>
              <a href="/apropos" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>À propos</a>
              <a href="/producteurs" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Producteurs</a>
              <a href="/impact" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Notre impact</a>
            </div>
          </div>
          {/* Légal */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>LÉGAL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a href="/conditions-generales" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Conditions générales</a>
              <a href="/confidentialite" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Politique de confidentialité</a>
              <a href="/mentions-legales" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Mentions légales</a>
              <a href="/cookies" style={{ color: "#fff", textDecoration: "none", fontSize: "0.98em" }}>Cookies</a>
            </div>
          </div>
          {/* Contact */}
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>CONTACT</div>
            <div style={{ color: "#d1fae5", fontSize: "0.98em", marginBottom: 4 }}>
              <span role="img" aria-label="phone">📞</span> 01 23 45 67 89<br />
              <span role="img" aria-label="location">📍</span> Paris, France
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <a href="mailto:contact@greencart.fr" style={{ color: "#fff", fontSize: 18 }} aria-label="mail"><span role="img" aria-label="mail">✉️</span></a>
              <a href="https://facebook.com" style={{ color: "#fff", fontSize: 18 }} aria-label="facebook"><span role="img" aria-label="fb">📘</span></a>
              <a href="https://twitter.com" style={{ color: "#fff", fontSize: 18 }} aria-label="twitter"><span role="img" aria-label="tw">🐦</span></a>
              <a href="https://instagram.com" style={{ color: "#fff", fontSize: 18 }} aria-label="instagram"><span role="img" aria-label="ig">📸</span></a>
              <a href="https://linkedin.com" style={{ color: "#fff", fontSize: 18 }} aria-label="linkedin"><span role="img" aria-label="in">💼</span></a>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #263043",
          marginTop: 32,
          paddingTop: 18,
          color: "#b6c2d1",
          fontSize: "0.97em",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
          flexWrap: "wrap"
        }}>
          <div>© 2023 GreenCart. Tous droits réservés.</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="/accessibilite" style={{ color: "#b6c2d1", textDecoration: "none" }}>Accessibilité</a>
            <a href="/plan-du-site" style={{ color: "#b6c2d1", textDecoration: "none" }}>Plan du site</a>
            <a href="/faq" style={{ color: "#b6c2d1", textDecoration: "none" }}>FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
