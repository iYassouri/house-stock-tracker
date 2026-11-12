const API_URL = "http://127.0.0.1:8000/api";

export const fetchItems = async () => {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
};

export const createItem = async (formData) => {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  return res.json();
};

export const adjustItem = async (id, payload) => {
  const res = await fetch(`${API_URL}/items/${id}/adjust`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteItem = async (id) => {
  await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
};