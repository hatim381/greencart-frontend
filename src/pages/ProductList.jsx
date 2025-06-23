import React, { useEffect, useState } from 'react';
import { products } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProducerProductForm from '../components/ProducerProductForm';

const ProductList = ({ onAddToCart, user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fonction utilitaire pour savoir si un produit est périmé
  function isExpired(product) {
    if (!product.dlc) return false;
    const today = new Date();
    const dlcDate = new Date(product.dlc);
    return dlcDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  useEffect(() => {
    products.getAll()
      .then(res => {
        if (user && user.role === 'producer') {
          setItems(res.data.filter(p => p.producer_id === user.id));
        } else {
          // Côté consommateur : uniquement produits quantité > 0 ET non périmés
          setItems(res.data.filter(p => p.quantity > 0 && !isExpired(p)));
        }
      })
      .catch(() => setError("Erreur lors du chargement des produits"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormClose = (refresh = false) => {
    setShowForm(false);
    setEditProduct(null);
    if (refresh) {
      setLoading(true);
      products.getAll()
        .then(res => {
          if (user && user.role === 'producer') {
            setItems(res.data.filter(p => p.producer_id === user.id));
          } else {
            // Correction : filtrer quantité > 0 ET non périmés pour consommateur
            setItems(res.data.filter(p => p.quantity > 0 && !isExpired(p)));
          }
        })
        .catch(() => setError("Erreur lors du chargement des produits"))
        .finally(() => setLoading(false));
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '2em 0' }}>Chargement…</div>;
  if (error) return <div style={{ textAlign: 'center', margin: '2em 0', color: '#e11d48' }}>{error}</div>;

  // Séparation des produits actifs et épuisés/périmés pour le producteur
  let activeProducts = items;
  let soldOrExpired = [];
  if (user && user.role === 'producer') {
    activeProducts = items.filter(p => p.quantity > 0 && !isExpired(p));
    soldOrExpired = items.filter(p => p.quantity === 0 || isExpired(p));
  }

  return (
    <main>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
        {user && user.role === 'producer' ? "Mes produits" : "Nos produits"}
      </h2>
      {user && user.role === 'producer' && (
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Ajouter un produit
          </button>
        </div>
      )}
      {/* Liste des produits actifs */}
      <div
        className="product-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 32,
          margin: "0 auto",
          maxWidth: 1200,
        }}
      >
        {activeProducts.map(p => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 18px #22C55E11",
              overflow: "hidden",
              border: "1.5px solid #E5E7EB",
              display: "flex",
              flexDirection: "column",
              minHeight: 370,
              position: "relative",
              transition: "box-shadow 0.18s, transform 0.13s",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={p.image_url || p.image || "/placeholder.jpg"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  background: "#f3f3f3",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              />
              {(p.co2_reduction || p.co2) && (
                <span style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  background: "#22C55E",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "4px 14px",
                  boxShadow: "0 2px 8px #22C55E33",
                  letterSpacing: 0.5,
                }}>
                  {p.co2_reduction || p.co2}%
                </span>
              )}
            </div>
            <div style={{
              padding: "1.3em 1.2em 0.7em 1.2em",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.18em", marginBottom: 6 }}>{p.name}</div>
                <div style={{ color: "#22C55E", fontWeight: 700, fontSize: "1.13em", marginBottom: 2 }}>
                  {p.price} <span style={{ fontWeight: 400, color: "#222" }}>{p.price && p.price.toString().endsWith('kg') ? "" : "€"}</span>
                </div>
                {p.dlc && (
                  <div style={{ fontSize: "1em", color: "#888", marginBottom: 8 }}>
                    DLC : {typeof p.dlc === "string" ? p.dlc.split("T")[0] : p.dlc}
                  </div>
                )}
                {p.description && (
                  <div style={{ fontSize: "0.98em", color: "#666", marginBottom: 8 }}>
                    {p.description}
                  </div>
                )}
                <div style={{ fontSize: "0.97em", color: "#16A34A", fontWeight: 600, marginBottom: 6 }}>
                  {p.quantity > 1
                    ? `${p.quantity} exemplaires disponibles`
                    : p.quantity === 1
                      ? "1 exemplaire disponible"
                      : "Rupture de stock"}
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: 16,
                  background: "#22C55E",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.08em",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #22C55E22",
                  letterSpacing: 0.5,
                  transition: "background 0.18s, transform 0.13s",
                }}
                onClick={onAddToCart ? () => onAddToCart(p) : undefined}
                disabled={!onAddToCart}
              >
                Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Section produits vendus ou périmés */}
      {user && user.role === 'producer' && soldOrExpired.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3 style={{ color: "#888", marginBottom: 16 }}>Produits vendus ou périmés</h3>
          <div className="product-list" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            opacity: 0.7
          }}>
            {soldOrExpired.map(p => (
              <div key={p.id} style={{ position: "relative" }}>
                <ProductCard
                  product={p}
                  onEdit={() => handleEdit(p)}
                />
                <div style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  background: isExpired(p) ? "#e11d48" : "#f59e42",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "2px 10px",
                  fontWeight: 700,
                  fontSize: 13
                }}>
                  {isExpired(p)
                    ? "Périmé"
                    : "Épuisé / Vendu"}
                </div>
                <button
                  className="btn btn-outline-green"
                  style={{ marginTop: 10, width: "100%" }}
                  onClick={() => handleEdit(p)}
                >
                  Remettre en vente / Modifier
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {showForm && user && user.role === 'producer' && (
        <ProducerProductForm
          user={user}
          product={editProduct}
          onClose={handleFormClose}
        />
      )}
    </main>
  );
};

export default ProductList;
