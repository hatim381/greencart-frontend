import { Link } from 'react-router-dom';

const Navbar = ({ cartCount, user, onLogout, darkMode, onToggleDarkMode }) => (
  <nav style={{
    background: darkMode ? "#181F2A" : "#fff",
    padding: "1.3rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 18px #22C55E22",
    borderBottom: "2px solid #F0FDF4",
    position: "sticky",
    top: 0,
    zIndex: 100,
    minHeight: 90,
    color: darkMode ? "#fff" : "#222"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/Images/logo.jpeg"
          alt="GreenCart"
          style={{
            height: 85,
            borderRadius: 16,
            background: "#F0FDF4",
            boxShadow: "0 2px 8px #22C55E44",
            transition: "transform 0.18s",
            cursor: "pointer"
          }}
        />
      </Link>
    </div>
    <div className="nav-links" style={{
      display: "flex",
      gap: "2.7rem",
      fontSize: "1.15em",
      fontWeight: 700,
      alignItems: "center",
      color: darkMode ? "#fff" : "#16A34A",
    }}>
      <Link to="/" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>Accueil</Link>
      <Link to="/products" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>Produits</Link>
      <Link to="/apropos" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>À propos</Link>
      <Link to="/producteurs" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>Producteurs</Link>
      <Link to="/impact" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>Notre impact</Link>
      <Link to="/blog" style={{
        color: "#16A34A",
        textDecoration: "none",
        padding: "0.3em 0.8em",
        borderRadius: 8,
        transition: "background 0.18s, color 0.18s"
      }}>Conseils</Link>
      {user && user.role === 'owner' && (
        <Link to="/admin" style={{
          color: "#e11d48",
          textDecoration: "none",
          padding: "0.3em 0.8em",
          borderRadius: 8,
          fontWeight: 700,
          transition: "background 0.18s, color 0.18s"
        }}>Admin</Link>
      )}
    </div>
    <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 22 }}>
      {(!user || user.role === 'consumer') && (
        <Link to="/cart" className="cart-icon" style={{
          position: 'relative',
          fontSize: 28,
          color: "#16A34A",
          background: "#F0FDF4",
          borderRadius: "50%",
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #22C55E22"
        }}>
          <span role="img" aria-label="panier">🛒</span>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -8,
              right: -10,
              background: '#22C55E',
              color: '#fff',
              borderRadius: '50%',
              fontSize: 15,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              border: "2px solid #fff",
              boxShadow: "0 2px 8px #22C55E44"
            }}>{cartCount}</span>
          )}
        </Link>
      )}
      <Link to="/dashboard" style={{
        fontSize: 28,
        color: "#16A34A",
        background: "#F0FDF4",
        borderRadius: "50%",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px #22C55E22"
      }}>
        <span role="img" aria-label="profil">👤</span>
      </Link>
      {user ? (
        <button
          className="btn btn-primary"
          onClick={onLogout}
          style={{
            background: "linear-gradient(90deg, #22C55E 60%, #16A34A 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "1.05em",
            padding: "0.7em 1.7em",
            boxShadow: "0 2px 8px #22C55E22",
            cursor: "pointer",
            transition: "background 0.18s"
          }}
        >
          Déconnexion
        </button>
      ) : (
        <Link
          to="/login"
          className="btn btn-primary"
          style={{
            background: "linear-gradient(90deg, #22C55E 60%, #16A34A 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "1.05em",
            padding: "0.7em 1.7em",
            boxShadow: "0 2px 8px #22C55E22",
            textDecoration: "none",
            transition: "background 0.18s"
          }}
        >
          Connexion
        </Link>
      )}
      {/* Bouton dark mode */}
      <button
        aria-label="Basculer mode sombre"
        onClick={onToggleDarkMode}
        style={{
          background: darkMode ? "#222" : "#F0FDF4",
          color: darkMode ? "#fff" : "#16A34A",
          border: "none",
          borderRadius: "50%",
          width: 38,
          height: 38,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #22C55E22",
          cursor: "pointer"
        }}
        title={darkMode ? "Mode clair" : "Mode sombre"}
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </div>
  </nav>
);

export default Navbar;
