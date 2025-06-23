import { useEffect, useState } from 'react';
import { products } from '../services/api';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [owner, setOwner] = useState(null);
  const [producers, setProducers] = useState([]);

  useEffect(() => {
    products.getAll().then(res => setItems(res.data));
    axios.get('/api/auth/users').then(res => {
      const users = res.data;
      const ownerUser = users.find(u => u.role === 'owner');
      setOwner(ownerUser || null);
      setProducers(users.filter(u => u.role === 'producer'));
      // Pour la liste des consommateurs :
      const consumers = users.filter(u => u.role === 'consumer');
      console.log('Liste des consommateurs :', consumers);
    });
    axios.get('/api/ai/recommendations').then(res => setRecommendations(res.data));
  }, []);

  return (
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "2em 1em",
      background: "#F8FAFB",
      borderRadius: 18,
      boxShadow: "0 4px 24px #22C55E11"
    }}>
      <h2 style={{
        marginBottom: 32,
        color: "#22C55E",
        fontWeight: 800,
        fontSize: "2.1em",
        letterSpacing: 1
      }}>
        Admin – Gestion des produits
      </h2>
      {owner && (
        <div style={{
          background: '#F0FDF4',
          borderRadius: 14,
          padding: '1.5em 2em',
          minWidth: 180,
          textAlign: 'center',
          boxShadow: '0 2px 8px #22C55E22',
          marginBottom: 32,
          display: "inline-block"
        }}>
          <div style={{
            fontSize: 32,
            color: '#22C55E',
            fontWeight: 700,
            marginBottom: 6
          }}>
            <span style={{
              background: "#fff",
              color: "#22C55E",
              borderRadius: 8,
              padding: "4px 18px",
              fontWeight: 700,
              fontSize: 28,
              boxShadow: "0 2px 8px #22C55E22"
            }}>
              {(owner.wallet_balance !== undefined && owner.wallet_balance !== null) ? owner.wallet_balance.toFixed(2) : "0.00"} €
            </span>
          </div>
          <div style={{ color: '#222', fontWeight: 500 }}>Solde plateforme (propriétaire)</div>
        </div>
      )}

      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px #22C55E11',
        padding: '2em 2em 1.5em 2em',
        marginBottom: 36
      }}>
        <h3 style={{
          color: "#22C55E",
          marginTop: 0,
          fontWeight: 700,
          fontSize: "1.25em",
          marginBottom: 18
        }}>Producteurs et portefeuilles</h3>
        {producers.length === 0 ? (
          <div style={{ color: "#888" }}>Aucun producteur enregistré.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              background: "#F8FAFB",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 8px #22C55E11"
            }}>
              <thead>
                <tr style={{ background: "#F3F4F6" }}>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 700, color: "#16A34A" }}>Nom</th>
                  <th style={{ padding: 12, textAlign: "left", fontWeight: 700, color: "#16A34A" }}>Email</th>
                  <th style={{ padding: 12, textAlign: "center", fontWeight: 700, color: "#16A34A" }}>Solde (€)</th>
                </tr>
              </thead>
              <tbody>
                {producers.map(p => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: 10 }}>{p.name}</td>
                    <td style={{ padding: 10 }}>{p.email}</td>
                    <td style={{ padding: 10, textAlign: "center" }}>
                      <span style={{
                        background: "#DCFCE7",
                        color: "#22C55E",
                        borderRadius: 8,
                        padding: "2px 14px",
                        fontWeight: 700
                      }}>
                        {p.wallet_balance ? p.wallet_balance.toFixed(2) : "0.00"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 8px #22C55E11",
        padding: "2em 2em 1.5em 2em",
        marginBottom: 36
      }}>
        <h3 style={{
          color: "#22C55E",
          fontWeight: 700,
          fontSize: "1.18em",
          marginBottom: 12
        }}>Recommandations IA</h3>
        {recommendations.length === 0 ? (
          <div style={{ color: "#888" }}>Aucune recommandation disponible.</div>
        ) : (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: 16
          }}>
            {recommendations.map((r, i) => (
              <li key={i} style={{
                background: "#F0FDF4",
                color: "#16A34A",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                fontSize: "1.05em",
                boxShadow: "0 2px 8px #22C55E11"
              }}>
                {r.name || r}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{
        marginBottom: 18,
        fontWeight: 700,
        fontSize: "1.18em",
        color: "#22C55E"
      }}>Liste des produits</div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 28,
        width: "100%",
      }}>
        {items.map(p => (
          <div key={p.id} style={{
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 8px #22C55E11",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
