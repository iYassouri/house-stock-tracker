import { useEffect, useState } from "react";
import { fetchItems, adjustItem, deleteItem } from "./api/itemsApi";
import ItemCard from "./components/ItemCard";
import AddItemModal from "./components/AddItemModal";

export default function App() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("pantry");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const handleAdjust = async (id, payload) => {
    const updated = await adjustItem(id, payload);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleDelete = async (id) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toBuyItems = items.filter(
    (i) =>
      (i.tracking_type === "count" && i.quantity <= i.min_threshold) ||
      (i.tracking_type === "level" && ["low", "empty"].includes(i.level))
  );

  const visibleItems = (activeTab === "to_buy" ? toBuyItems : items.filter((i) => i.category === activeTab)).filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-3" style={{ maxWidth: 600 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold">🏠 Stock Maison</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + Ajouter
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Rechercher thon, poulet, sucre, pommes de terre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="nav nav-pills nav-fill mb-3">
        {[
          { key: "pantry", label: "🥫 Épicerie" },
          { key: "vegetables", label: "🥕 Légumes" },
          { key: "meat", label: "🥩 Viande" },
          { key: "to_buy", label: `🛒 À acheter (${toBuyItems.length})` },
        ].map((tab) => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {visibleItems.length === 0 ? (
        <p className="text-center text-muted mt-4">Aucun produit dans cette catégorie.</p>
      ) : (
        visibleItems.map((item) => (
          <ItemCard key={item.id} item={item} onAdjust={handleAdjust} onDelete={handleDelete} />
        ))
      )}

      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onCreated={(newItem) => setItems((prev) => [newItem, ...prev])}
        />
      )}
    </div>
  );
}