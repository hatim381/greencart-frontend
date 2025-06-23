import React from 'react';

const ProductCard = ({ product, onAddToCart, onEdit }) => {
  // Détermine l'URL de l'image à afficher
  let imageUrl = product.image_url || product.image;
  if (imageUrl && !imageUrl.startsWith('http') && imageUrl.startsWith('/uploads/')) {
    imageUrl = `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
  }
  if (!imageUrl) {
    imageUrl = "/placeholder.jpg";
  }

  return (
    <div className="product-card" style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px #0001",
      padding: 0,
      overflow: "hidden",
      border: "1px solid #E5E7EB",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ position: "relative" }}>
        <img
          src={imageUrl}
          alt={product.name}
          style={{ width: "100%", height: 140, objectFit: "cover", background: "#f3f3f3" }}
        />
        {(product.co2 || product.co2_reduction) && (
          <span style={{
            position: "absolute", top: 10, left: 10, background: "#22C55E", color: "#fff",
            borderRadius: 6, fontSize: 13, fontWeight: 600, padding: "2px 10px"
          }}>
            {product.co2 || product.co2_reduction}%
          </span>
        )}
      </div>
      <div style={{ padding: "1.1em 1em 1em 1em", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 700, fontSize: "1.08em", marginBottom: 2 }}>{product.name}</div>
        <div style={{ color: "#22C55E", fontWeight: 600, fontSize: "1.05em" }}>
          {product.price} <span style={{ fontWeight: 400, color: "#222" }}>{product.price && product.price.toString().endsWith('kg') ? "" : "€"}</span>
        </div>
        {/* Quantité disponible */}
        {typeof product.quantity !== "undefined" && (
          <div style={{ fontSize: "0.97em", color: "#16A34A", fontWeight: 600, marginBottom: 6 }}>
            {product.quantity > 1
              ? `${product.quantity} exemplaires disponibles`
              : product.quantity === 1
                ? "1 exemplaire disponible"
                : "Rupture de stock"}
          </div>
        )}
        <div style={{ fontSize: "0.98em", color: "#666", marginBottom: 2 }}>{product.description}</div>
        {product.dlc && (
          <div style={{ fontSize: "0.95em", color: "#888", marginBottom: 8 }}>
            DLC : {typeof product.dlc === "string" ? product.dlc.split("T")[0] : product.dlc}
          </div>
        )}
        {product.badge && (
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <span style={{
              background: product.badge === "Invendu" ? "#DCFCE7" : "#F0FDF4",
              color: "#22C55E",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 13,
              padding: "2px 10px"
            }}>{product.badge}</span>
          </div>
        )}
        {onEdit && (
          <button
            className="btn btn-outline-green"
            style={{ width: '100%', marginTop: "auto" }}
            onClick={onEdit}
          >
            Modifier
          </button>
        )}
        {onAddToCart && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', background: "#22C55E", border: "1px solid #22C55E", color: "#fff", fontWeight: 600, marginTop: "auto" }}
            onClick={() => onAddToCart(product)}
          >
            Ajouter
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
