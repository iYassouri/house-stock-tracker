export default function ItemCard({ item, onAdjust, onDelete }) {
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return null;
    const days = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return days === 0 ? "Aujourd'hui" : `Il y a ${days}j`;
  };

  const daysAgo = getDaysAgo(item.bought_at);
  const isOldProduce =
    (item.category === "vegetables" || (item.category === "meat" && item.storage_location === "fridge")) &&
    item.bought_at &&
    Math.floor((new Date() - new Date(item.bought_at)) / (1000 * 60 * 60 * 24)) >= 4;

  return (
    <div className="card mb-2 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3 p-2">
        <img
          src={item.image_url || "https://placehold.co/64x64?text=Produit"}
          alt={item.name}
          className="rounded object-fit-cover"
          style={{ width: 64, height: 64 }}
        />

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <h6 className="mb-0 fw-bold">{item.name}</h6>
            {item.category === "meat" && (
              <span className={`badge ${item.storage_location === "freezer" ? "bg-info text-dark" : "bg-warning text-dark"}`}>
                {item.storage_location === "freezer" ? "Congélateur" : "Frigo"}
              </span>
            )}
          </div>

          {item.bought_at && (
            <small className={`d-block ${isOldProduce ? "text-danger fw-semibold" : "text-muted"}`}>
              Acheté : {item.bought_at} ({daysAgo})
            </small>
          )}

          {item.tracking_type === "count" ? (
            <div className="d-flex align-items-center gap-2 mt-2">
              <button className="btn btn-sm btn-outline-danger px-3" onClick={() => onAdjust(item.id, { delta: -1 })}>
                -
              </button>
              <span className="fw-bold">
                {item.quantity} {item.unit}
              </span>
              <button className="btn btn-sm btn-outline-success px-3" onClick={() => onAdjust(item.id, { delta: 1 })}>
                +
              </button>
            </div>
          ) : (
            <div className="btn-group btn-group-sm mt-2">
              {[
                { key: "full", label: "Plein" },
                { key: "half", label: "Moitié" },
                { key: "low", label: "Bas" },
                { key: "empty", label: "Vide" },
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  className={`btn ${item.level === lvl.key ? "btn-primary" : "btn-outline-secondary"}`}
                  onClick={() => onAdjust(item.id, { level: lvl.key })}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-sm text-muted" onClick={() => onDelete(item.id)} title="Supprimer">
          ✕
        </button>
      </div>
    </div>
  );
}