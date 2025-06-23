import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ cart, onRemove, onClear, user }) => {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState(user?.default_address || '');
  const [payment, setPayment] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAddress(user?.default_address || '');
  }, [user]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderMsg('');

    if (!user || !user.id) {
      setError("Vous devez être connecté pour commander.");
      setLoading(false);
      return;
    }
    if (!cart || cart.length === 0) {
      setError("Votre panier est vide.");
      setLoading(false);
      return;
    }
    if (!address || !payment || !email || !phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(email)) {
      setError("Veuillez saisir un email valide.");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      setError("Veuillez saisir un numéro de téléphone valide (10 chiffres).");
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/orders/', {
        consumer_id: user.id,
        address,
        payment,
        email,
        phone,
        instructions,
        items: cart.map(item => ({
          product_id: item.id || item.product_id,
          quantity: item.quantity
        }))
      });
      setOrderMsg("Commande passée avec succès !");
      onClear();
      setShowOrderForm(false);
      setAddress('');
      setPayment('');
      setEmail('');
      setPhone('');
      setInstructions('');
    } catch (err) {
      let msg = "Erreur lors de la commande.";
      if (err.response?.data?.error) {
        msg += " " + err.response.data.error;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '2em', boxShadow: '0 2px 8px #0001' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Mon panier</h2>
      {orderMsg && <div style={{ color: "#22C55E", textAlign: "center", marginBottom: 16 }}>{orderMsg}</div>}
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Votre panier est vide.</div>
      ) : (
        <div>
          <table style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#F3F4F6' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Produit</th>
                <th style={{ textAlign: 'center', padding: 8 }}>Prix</th>
                <th style={{ textAlign: 'center', padding: 8 }}>Quantité</th>
                <th style={{ textAlign: 'center', padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{item.name}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>
                    {typeof item.price === 'string' && item.price.includes('€') ? item.price : `${item.price} €`}
                  </td>
                  <td style={{ textAlign: 'center', padding: 8 }}>{item.quantity}</td>
                  <td style={{ textAlign: 'center', padding: 8 }}>
                    <button className="btn btn-outline-green" style={{ padding: '0.3em 1em', fontSize: '0.95em' }} onClick={() => onRemove(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.2em', marginBottom: 24 }}>
            Total : {cart.reduce((sum, item) => {
              const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                : item.price;
              return sum + price * item.quantity;
            }, 0).toFixed(2)} €
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <button className="btn btn-outline-green" onClick={onClear}>Vider le panier</button>
            <button className="btn btn-primary" onClick={() => setShowOrderForm(true)} disabled={showOrderForm}>Commander</button>
          </div>

          {showOrderForm && (
            <form onSubmit={handleOrder} style={{ marginTop: 24, background: "#F8FAFB", padding: 16, borderRadius: 8 }}>
              <div style={{ marginBottom: 10 }}>
                <label>Adresse de livraison *</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  style={{ width: "100%", marginTop: 4 }}
                  placeholder="Ex : 12 rue des Lilas, 75000 Paris"
                />
                {user?.default_address && (
                  <div style={{ color: "#888", fontSize: "0.95em", marginTop: 4 }}>
                    (Adresse par défaut pré-remplie)
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 600 }}>Email de contact *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: "100%" }}
                  placeholder="exemple@email.com"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 600 }}>Téléphone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  style={{ width: "100%" }}
                  placeholder="06XXXXXXXX"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 600 }}>Instructions de livraison</label>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  style={{ width: "100%", minHeight: 40, borderRadius: 8, border: "1px solid #E5E7EB", padding: 8 }}
                  placeholder="Ex : sonnette, étage, créneau préféré…"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontWeight: 600 }}>Moyen de paiement *</label>
                <select value={payment} onChange={e => setPayment(e.target.value)} required style={{ width: "100%" }}>
                  <option value="">Sélectionnez</option>
                  <option value="cb">Carte bancaire</option>
                  <option value="paypal">PayPal</option>
                  <option value="especes">Espèces à la livraison</option>
                </select>
              </div>

              {payment === "cb" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontWeight: 600 }}>Numéro de carte bancaire</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    pattern="\d{4} \d{4} \d{4} \d{4}"
                    required
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="text" maxLength={5} placeholder="MM/AA" required style={{ width: 80 }} />
                    <input type="text" maxLength={3} placeholder="CVC" required style={{ width: 60 }} />
                  </div>
                </div>
              )}

              <div style={{
                background: "#F8FAFB",
                borderRadius: 10,
                padding: 14,
                marginBottom: 4,
                border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: "#16A34A" }}>Résumé de la commande :</div>
                {cart.map((item, i) => (
                  <div key={i} style={{ fontSize: "0.98em", color: "#222" }}>
                    {item.name} × {item.quantity} — {(typeof item.price === 'string' && item.price.includes('€') ? item.price : `${item.price} €`)}
                  </div>
                ))}
                <div style={{ fontWeight: 700, marginTop: 8, color: "#22C55E" }}>
                  Total : {cart.reduce((sum, item) => {
                    const price = typeof item.price === 'string'
                      ? parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                      : item.price;
                    return sum + price * item.quantity;
                  }, 0).toFixed(2)} €
                </div>
              </div>

              {error && <div style={{ color: "#e11d48", marginBottom: 8 }}>{error}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline-green" onClick={() => setShowOrderForm(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Commande..." : "Valider la commande"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </main>
  );
};

export default Cart;
