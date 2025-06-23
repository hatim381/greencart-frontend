import React, { useState } from 'react';
import { products } from '../services/api';
import ProductCard from './ProductCard';

const ProducerProductForm = ({ user, product, onClose }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [quantity, setQuantity] = useState(product ? product.quantity : '');
  const [category, setCategory] = useState(product ? product.category || '' : '');
  const [dlc, setDlc] = useState(product && product.dlc ? product.dlc.substring(0, 10) : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [co2Reduction, setCo2Reduction] = useState(product ? product.co2_reduction || '' : '');
  const [description, setDescription] = useState(product ? product.description || '' : '');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation stricte
    if (!name || !price || !quantity || !category || !dlc) {
      setError("Tous les champs marqués * sont obligatoires.");
      setLoading(false);
      return;
    }
    if (parseFloat(price) <= 0) {
      setError("Le prix doit être supérieur à 0.");
      setLoading(false);
      return;
    }
    if (isNaN(parseInt(quantity, 10)) || parseInt(quantity, 10) < 0) {
      setError("La quantité ne peut pas être négative.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = product ? product.image_url : '';
      let payload;
      if (image) {
        // Envoi du fichier image via FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', parseFloat(price));
        formData.append('quantity', parseInt(quantity, 10));
        formData.append('producer_id', user.id);
        formData.append('category', category);
        formData.append('dlc', dlc);
        formData.append('image', image);
        formData.append('co2_reduction', co2Reduction);
        formData.append('description', description);

        if (product) {
          await products.update(product.id, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await products.add(formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } else {
        payload = {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          producer_id: user.id,
          category,
          dlc,
          image_url: imageUrl,
          co2_reduction: co2Reduction,
          description
        };
        if (product) {
          await products.update(product.id, payload);
        } else {
          await products.add(payload);
        }
      }
      onClose(true);
    } catch (err) {
      let msg = "Erreur lors de l'enregistrement du produit";
      if (err.response && err.response.data && err.response.data.error) {
        msg += " : " + err.response.data.error;
      } else if (err.response && err.response.data && err.response.data.message) {
        msg += " : " + err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#0008", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        borderRadius: 16,
        padding: 36,
        minWidth: 340,
        maxWidth: "95vw",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 4px 18px #22C55E22",
        border: "1.5px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        maxWidth: 420
      }}>
        <h3 style={{ color: "#22C55E", fontWeight: 700, marginBottom: 8 }}>{product ? "Modifier" : "Ajouter"} un produit</h3>
        <label style={{ fontWeight: 600 }}>Nom du produit *</label>
        <input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%" }} />
        <label style={{ fontWeight: 600 }}>Prix (€) *</label>
        <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: "100%" }} />
        <label style={{ fontWeight: 600 }}>Quantité *</label>
        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width: "100%" }} />
        <label style={{ fontWeight: 600 }}>Catégorie *</label>
        <select value={category} onChange={e => setCategory(e.target.value)} required style={{ width: "100%" }}>
          <option value="">Sélectionnez une catégorie</option>
          <option value="Fruits & légumes">Fruits & légumes</option>
          <option value="Produits laitiers">Produits laitiers</option>
          <option value="Viandes & Volaille">Viandes & Volaille</option>
          <option value="Boulangerie">Boulangerie</option>
          <option value="Boissons">Boissons</option>
          <option value="Autre">Autre</option>
        </select>
        <label style={{ fontWeight: 600 }}>Date limite de consommation (DLC) *</label>
        <input
          type="date"
          value={dlc}
          onChange={e => setDlc(e.target.value)}
          required
          style={{ width: "100%" }}
          pattern="\d{4}-\d{2}-\d{2}"
          placeholder="YYYY-MM-DD"
        />
        <label style={{ fontWeight: 600 }}>Description détaillée *</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ width: "100%", minHeight: 60, borderRadius: 8, border: "1px solid #E5E7EB", padding: 8 }}
          placeholder="Décrivez le produit, ses atouts, origine, etc."
        />
        <label style={{ fontWeight: 600 }}>Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          style={{
            width: "100%",
            padding: 0,
            border: "none",
            background: "none",
            fontSize: "0.98em"
          }}
        />
        {/* Affiche un aperçu carré, petit, non déformé */}
        {image ? (
          <div style={{ marginBottom: 10, textAlign: "center" }}>
            <div style={{
              width: 48,
              height: 48,
              display: "inline-block",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#fafafa"
            }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Aperçu"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </div>
          </div>
        ) : product && product.image_url ? (
          <div style={{ marginBottom: 10, textAlign: "center" }}>
            <div style={{
              width: 48,
              height: 48,
              display: "inline-block",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#fafafa"
            }}>
              <img
                src={
                  product.image_url.startsWith('http')
                    ? product.image_url
                    : `${process.env.REACT_APP_API_URL.replace('/api', '')}${product.image_url}`
                }
                alt="Produit"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </div>
          </div>
        ) : null}
        <label style={{ fontWeight: 600 }}>CO₂ économisé (kg)</label>
        <input
          type="number"
          value={co2Reduction}
          onChange={e => setCo2Reduction(e.target.value)}
          style={{ width: "100%" }}
        />
        {error && <div style={{ color: "#e11d48", marginBottom: 4 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="button" className="btn btn-outline-green" onClick={() => onClose(false)}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
        <div style={{
          marginTop: 18,
          background: "#F8FAFB",
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          padding: 12
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#22C55E" }}>Aperçu du produit :</div>
          <ProductCard
            product={{
              name,
              price,
              quantity,
              category,
              dlc,
              co2_reduction: co2Reduction,
              description,
              image_url: image ? URL.createObjectURL(image) : (product && product.image_url),
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default ProducerProductForm;
