import { useState } from "react";
import { createItem } from "../api/itemsApi";

export default function AddItemModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("pantry");
  const [storageLocation, setStorageLocation] = useState("pantry");
  const [boughtAt, setBoughtAt] = useState(new Date().toISOString().split("T")[0]);
  const [trackingType, setTrackingType] = useState("count");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [level, setLevel] = useState("full");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (val === "vegetables") {
      setTrackingType("count");
      setStorageLocation("fridge");
      setUnit("pcs");
    } else if (val === "meat") {
      setTrackingType("count");
      setStorageLocation("freezer");
      setUnit("portions");
    } else {
      setStorageLocation("pantry");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("storage_location", storageLocation);
    formData.append("bought_at", boughtAt);
    formData.append("tracking_type", trackingType);
    formData.append("quantity", quantity);
    formData.append("unit", unit);
    formData.append("level", level);
    if (image) formData.append("image", image);

    const created = await createItem(formData);
    onCreated(created);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title">Ajouter un produit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body d-flex flex-column gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Nom (ex: Thon, Poulet, Pommes de terre, Sucre)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="row g-2">
              <div className="col-6">
                <label className="form-label small mb-1">Catégorie</label>
                <select className="form-select" value={category} onChange={(e) => handleCategoryChange(e.target.value)}>
                  <option value="pantry">🥫 Épicerie</option>
                  <option value="vegetables">🥕 Légumes</option>
                  <option value="meat">🥩 Viande</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small mb-1">Stockage</label>
                <select className="form-select" value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)}>
                  <option value="pantry">Placard</option>
                  <option value="fridge">Frigo</option>
                  <option value="freezer">Congélateur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label small mb-1">Date d'achat</label>
              <input type="date" className="form-control" value={boughtAt} onChange={(e) => setBoughtAt(e.target.value)} />
            </div>

            {category === "pantry" && (
              <div>
                <label className="form-label small mb-1">Type de suivi</label>
                <select className="form-select" value={trackingType} onChange={(e) => setTrackingType(e.target.value)}>
                  <option value="count">Quantité exacte (boîtes, paquets)</option>
                  <option value="level">Niveau (Plein / Moitié / Bas / Vide)</option>
                </select>
              </div>
            )}

            {trackingType === "count" ? (
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small mb-1">Quantité</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small mb-1">Unité</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="pcs, boîtes, paquets, g"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="form-label small mb-1">Niveau actuel</label>
                <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="full">Plein</option>
                  <option value="half">Moitié</option>
                  <option value="low">Bas</option>
                  <option value="empty">Vide</option>
                </select>
              </div>
            )}

            <div>
              <label className="form-label small mb-1">Photo du produit</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Enregistrement..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}