import React, { useEffect, useState } from 'react';
import { orders } from '../services/api';
import axios from 'axios';

const Dashboard = ({ user, setUser }) => {
  const [userOrders, setUserOrders] = useState([]);
  const [producerOrders, setProducerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editProfile, setEditProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileAddress, setProfileAddress] = useState(user?.default_address || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [editPwd, setEditPwd] = useState(false);
  const [pwd1, setPwd1] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  // Fonction pour rafraîchir le user depuis l'API
  const refreshUser = async () => {
    if (user && user.id) {
      const res = await axios.get('/api/auth/users');
      const updated = res.data.find(u => u.id === user.id);
      if (updated && setUser) setUser(updated);
    }
  };

  useEffect(() => {
    setError('');
    setUserOrders([]);
    setProducerOrders([]);
    if (user && user.id) {
      setLoading(true);
      if (user.role === 'consumer') {
        orders.getByUser(user.id)
          .then(res => setUserOrders(res.data))
          .catch(() => setError("Erreur lors du chargement des commandes"))
          .finally(() => setLoading(false));
      } else if (user.role === 'producer') {
        axios.get(`/api/orders/producer/${user.id}`)
          .then(res => setProducerOrders(res.data))
          .catch(() => setError("Erreur lors du chargement des commandes reçues"))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fonction pour valider un produit dans une commande
  const handleValidateOrderItem = async (orderitem_id) => {
    await axios.put(`/api/orders/orderitem/${orderitem_id}/status`, { status: "traitée" });
    // Recharge les commandes producteur
    axios.get(`/api/orders/producer/${user.id}`)
      .then(res => setProducerOrders(res.data));
    // Recharge le user pour afficher le solde à jour
    await refreshUser();
  };

  // Sauvegarde des modifications du profil
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      // Correction : le backend attend peut-être un champ "default_address"
      await axios.put(`/api/auth/users/${user.id}`, {
        name: profileName,
        email: profileEmail,
        default_address: profileAddress // Assure-toi que ce champ existe côté backend
      });
      setProfileMsg('Profil mis à jour !');
      if (setUser) setUser({ ...user, name: profileName, email: profileEmail, default_address: profileAddress });
      setEditProfile(false); // Ferme le mode édition après succès
    } catch (err) {
      setProfileMsg("Erreur lors de la mise à jour.");
    }
  };

  // Sauvegarde du mot de passe
  const handlePwdSave = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    if (!pwd1 || pwd1.length < 6) {
      setPwdMsg("Mot de passe trop court.");
      return;
    }
    if (pwd1 !== pwd2) {
      setPwdMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      await axios.put(`/api/auth/users/${user.id}/password`, { password: pwd1 });
      setPwdMsg("Mot de passe modifié !");
      setPwd1('');
      setPwd2('');
      setEditPwd(false);
    } catch {
      setPwdMsg("Erreur lors du changement de mot de passe.");
    }
  };

  // Séparation des commandes à traiter et déjà traitées
  let toProcess = [];
  let processed = [];
  if (user.role === 'producer') {
    toProcess = producerOrders.filter(order =>
      order.products.some(p => p.status !== "traitée")
    );
    processed = producerOrders.filter(order =>
      order.products.every(p => p.status === "traitée")
    );
  }

  if (!user) return (
    <main style={{ textAlign: 'center', marginTop: '3em' }}>
      <div style={{
        display: 'inline-block',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px #22C55E22',
        padding: '2em 3em'
      }}>
        <h2 style={{ color: '#22C55E' }}>Veuillez vous connecter</h2>
        <p>Connectez-vous pour accéder à votre tableau de bord.</p>
      </div>
    </main>
  );
  if (!user.id) return (
    <main style={{ textAlign: 'center', marginTop: '3em' }}>
      <div style={{
        display: 'inline-block',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px #22C55E22',
        padding: '2em 3em'
      }}>
        <h2 style={{ color: '#e11d48' }}>Erreur utilisateur</h2>
        <p>Votre identifiant utilisateur est manquant ou invalide.</p>
      </div>
    </main>
  );
  if (loading) return <div style={{ textAlign: 'center', margin: '2em 0' }}>Chargement…</div>;
  if (error) return <div style={{ textAlign: 'center', margin: '2em 0', color: '#e11d48' }}>{error}</div>;

  // Calculs fictifs pour l’exemple
  const totalCO2 = (userOrders || []).reduce((sum, o) => sum + (o.co2 || o.total_co2_saved || 0), 0);
  const totalSaved = (userOrders || []).reduce((sum, o) => sum + (o.savings || o.total_price || 0), 0);
  const totalOrders = (userOrders || []).length;

  // Pour le producteur : calcul du portefeuille et du nombre de commandes/produits vendus
  let portefeuille = 0;
  let nbCommandesProd = 0;
  let nbProduitsVendus = 0;
  if (user && user.role === 'producer') {
    portefeuille = (producerOrders || []).reduce((sum, o) => sum + (o.total_price || 0), 0);
    nbCommandesProd = (producerOrders || []).length;
    nbProduitsVendus = (producerOrders || []).reduce((sum, o) =>
      sum + o.products.reduce((s, p) => s + (p.status === "traitée" ? p.quantity : 0), 0), 0
    );
  }

  return (
    <main style={{
      maxWidth: 1100,
      margin: '0 auto',
      marginTop: '2em',
      background: "#F8FAFB",
      borderRadius: 18,
      boxShadow: "0 4px 24px #22C55E11",
      padding: "2.5em 1.5em"
    }}>
      {/* Nom de l'utilisateur */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: 900,
        fontSize: "2em",
        color: "#22C55E",
        letterSpacing: 1,
        textShadow: "0 2px 8px #22C55E22"
      }}>
        Bonjour <span style={{ color: "#16A34A" }}>{user?.name || (user?.role === "producer" ? "Producteur" : "Client")}</span> !
      </div>

      {/* Espace profil */}
      <div style={{
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 8px 32px #22C55E22",
        padding: "2.5em 2.2em 2em 2.2em",
        marginBottom: 48,
        maxWidth: 540,
        marginLeft: "auto",
        marginRight: "auto",
        border: "1.5px solid #E5E7EB",
        position: "relative"
      }}>
        <h3 style={{
          color: "#22C55E",
          fontWeight: 900,
          marginTop: 0,
          marginBottom: 22,
          fontSize: "1.35em",
          letterSpacing: 1,
          textShadow: "0 2px 8px #22C55E11"
        }}>Mon profil</h3>
        {!editProfile ? (
          <div style={{ fontSize: "1.13em", color: "#222", lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>
              <b style={{ color: "#16A34A" }}>Nom :</b> {user.name}
            </div>
            <div style={{ marginBottom: 6 }}>
              <b style={{ color: "#16A34A" }}>Email :</b> <span style={{ color: "#1d4ed8" }}>{user.email}</span>
            </div>
            <div style={{ marginBottom: 6 }}>
              <b style={{ color: "#16A34A" }}>Adresse par défaut :</b> {user.default_address
                ? <span style={{ color: "#222" }}>{user.default_address}</span>
                : <span style={{ color: "#888", fontStyle: "italic" }}>Non renseignée</span>}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button className="btn btn-outline-green" style={{ minWidth: 170 }} onClick={() => setEditProfile(true)}>
                Modifier mon profil
              </button>
              <button className="btn btn-outline-green" style={{ minWidth: 170 }} onClick={() => setEditPwd(true)}>
                Modifier mon mot de passe
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ fontWeight: 600, color: "#16A34A" }}>Nom</label>
            <input value={profileName} onChange={e => setProfileName(e.target.value)} required />
            <label style={{ fontWeight: 600, color: "#16A34A" }}>Email</label>
            <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} required />
            <label style={{ fontWeight: 600, color: "#16A34A" }}>Adresse par défaut</label>
            <input value={profileAddress} onChange={e => setProfileAddress(e.target.value)} placeholder="Optionnel" />
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button type="button" className="btn btn-outline-green" onClick={() => setEditProfile(false)}>Annuler</button>
              <button type="submit" className="btn btn-primary">Enregistrer</button>
            </div>
            {profileMsg && (
              <div style={{
                color: profileMsg.toLowerCase().includes("erreur") ? "#e11d48" : "#22C55E",
                marginTop: 8,
                fontWeight: 600
              }}>
                {profileMsg}
              </div>
            )}
          </form>
        )}
        {/* Mot de passe */}
        {editPwd && (
          <div style={{
            marginTop: 28,
            background: "#F8FAFB",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            padding: 18
          }}>
            <form onSubmit={handlePwdSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontWeight: 600, color: "#16A34A" }}>Nouveau mot de passe</label>
              <input type="password" value={pwd1} onChange={e => setPwd1(e.target.value)} required minLength={6} />
              <label style={{ fontWeight: 600, color: "#16A34A" }}>Confirmer le mot de passe</label>
              <input type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} required minLength={6} />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button type="button" className="btn btn-outline-green" onClick={() => setEditPwd(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
              {pwdMsg && <div style={{ color: pwdMsg.includes("Erreur") ? "#e11d48" : "#22C55E", marginTop: 8, fontWeight: 600 }}>{pwdMsg}</div>}
            </form>
          </div>
        )}
      </div>

      {/* DASHBOARD PRODUCTEUR */}
      {user.role === 'producer' && (
        <div>
          {/* Statistiques producteur */}
          <div style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 36
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 8px #22C55E11",
              padding: "2em 2em 1.5em 2em",
              minWidth: 220,
              textAlign: "center",
              flex: "1 1 220px"
            }}>
              <div style={{ fontSize: 34, color: "#22C55E", fontWeight: 800, marginBottom: 6 }}>
                {user.wallet_balance !== undefined ? user.wallet_balance.toFixed(2) : "0.00"} €
              </div>
              <div style={{ color: '#222', fontWeight: 600, marginBottom: 8 }}>Portefeuille disponible</div>
              <button
                className="btn btn-primary"
                style={{ marginRight: 10 }}
                onClick={() => alert("Demande de virement envoyée (simulation).")}
              >
                Demander un virement
              </button>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 8px #22C55E11",
              padding: "2em 2em 1.5em 2em",
              minWidth: 220,
              textAlign: "center",
              flex: "1 1 220px"
            }}>
              <div style={{ fontSize: 34, color: "#16A34A", fontWeight: 800, marginBottom: 6 }}>
                {nbCommandesProd}
              </div>
              <div style={{ color: '#222', fontWeight: 600 }}>Commandes reçues</div>
            </div>
            <div style={{
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 8px #22C55E11",
              padding: "2em 2em 1.5em 2em",
              minWidth: 220,
              textAlign: "center",
              flex: "1 1 220px"
            }}>
              <div style={{ fontSize: 34, color: "#f59e42", fontWeight: 800, marginBottom: 6 }}>
                {nbProduitsVendus}
              </div>
              <div style={{ color: '#222', fontWeight: 600 }}>Produits vendus</div>
            </div>
          </div>

          {/* Commandes à traiter */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 8px #22C55E11',
            padding: '2em',
            marginBottom: 36
          }}>
            <h3 style={{ color: '#22C55E', marginTop: 0, fontWeight: 700, fontSize: "1.18em" }}>Commandes à traiter</h3>
            {toProcess.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center' }}>Aucune commande à traiter.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Commande</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Date</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Adresse</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Produits</th>
                  </tr>
                </thead>
                <tbody>
                  {toProcess.map(o => (
                    <tr key={o.order_id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: 10 }}>#{o.order_id}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.ordered_at ? o.ordered_at.split('T')[0] : ''}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.address}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        {o.products.map(p => (
                          <div key={p.product_id} style={{ marginBottom: 6 }}>
                            {p.name} x{p.quantity} ({p.unit_price} €)
                            {p.status !== "traitée" && (
                              <button
                                className="btn btn-outline-green"
                                style={{ marginLeft: 10, fontSize: "0.95em", padding: "0.3em 1em" }}
                                onClick={() => handleValidateOrderItem(p.orderitem_id)}
                              >
                                Valider
                              </button>
                            )}
                            {p.status === "traitée" && (
                              <span style={{ marginLeft: 10, color: "#22C55E", fontWeight: 600 }}>✔️ Traité</span>
                            )}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Commandes déjà traitées */}
          <div style={{
            background: '#F8FAFB',
            borderRadius: 16,
            boxShadow: '0 2px 8px #22C55E11',
            padding: '2em',
            marginBottom: 36
          }}>
            <h3 style={{ color: '#888', marginTop: 0, fontWeight: 700, fontSize: "1.13em" }}>Commandes déjà traitées</h3>
            {processed.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center' }}>Aucune commande traitée.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Commande</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Date</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Adresse</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Produits</th>
                  </tr>
                </thead>
                <tbody>
                  {processed.map(o => (
                    <tr key={o.order_id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: 10 }}>#{o.order_id}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.ordered_at ? o.ordered_at.split('T')[0] : ''}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.address}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        {o.products.map(p => (
                          <div key={p.product_id} style={{ marginBottom: 6 }}>
                            {p.name} x{p.quantity} ({p.unit_price} €)
                            <span style={{ marginLeft: 10, color: "#22C55E", fontWeight: 600 }}>✔️ Traité</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD CONSOMMATEUR */}
      {user.role === 'consumer' && (
        <div>
          {/* Statistiques consommateur */}
          <div style={{
            display: 'flex',
            gap: 28,
            justifyContent: 'center',
            marginBottom: 36,
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              padding: '2em 2em 1.5em 2em',
              minWidth: 220,
              textAlign: 'center',
              boxShadow: '0 2px 8px #22C55E11'
            }}>
              <div style={{ fontSize: 34, color: '#22C55E', fontWeight: 800, marginBottom: 6 }}>{totalCO2} kg</div>
              <div style={{ color: '#222', fontWeight: 600 }}>CO₂ économisé</div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              padding: '2em 2em 1.5em 2em',
              minWidth: 220,
              textAlign: 'center',
              boxShadow: '0 2px 8px #22C55E11'
            }}>
              <div style={{ fontSize: 34, color: '#22C55E', fontWeight: 800, marginBottom: 6 }}>{totalSaved} €</div>
              <div style={{ color: '#222', fontWeight: 600 }}>Économies réalisées</div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              padding: '2em 2em 1.5em 2em',
              minWidth: 220,
              textAlign: 'center',
              boxShadow: '0 2px 8px #22C55E11'
            }}>
              <div style={{ fontSize: 34, color: '#16A34A', fontWeight: 800, marginBottom: 6 }}>{totalOrders}</div>
              <div style={{ color: '#222', fontWeight: 600 }}>Commandes passées</div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: 14,
              padding: '2em 2em 1.5em 2em',
              minWidth: 220,
              textAlign: 'center',
              boxShadow: '0 2px 8px #22C55E11'
            }}>
              <div style={{ fontSize: 34, color: '#f59e42', fontWeight: 800, marginBottom: 6 }}>{user.loyalty_points || 0}</div>
              <div style={{ color: '#222', fontWeight: 600 }}>Points de fidélité</div>
            </div>
          </div>
          {/* Historique commandes */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 8px #22C55E11',
            padding: '2em',
            marginBottom: 36
          }}>
            <h3 style={{ color: '#22C55E', marginTop: 0, fontWeight: 700, fontSize: "1.18em" }}>Mes commandes</h3>
            {userOrders.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center' }}>Aucune commande pour l’instant.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                <thead>
                  <tr style={{ background: '#F3F4F6' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Commande</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Date</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>Total (€)</th>
                    <th style={{ padding: 10, textAlign: 'center' }}>CO₂ (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {userOrders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: 10 }}>#{o.id}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.date ? o.date.split('T')[0] : ''}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.total_price || o.price || 0}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>{o.total_co2_saved || o.co2 || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
