import React, { useEffect, useState } from "react";
import { api, getImageUrl, normalizeGame } from "../../api/Axios";
import { toast } from "react-toastify";
import "../css/products.css";

const EMPTY = { title: "", developer: "", year: "", price: "", rating: "", category: "", platform: "", image: "", description: "", isNew: false, isTopSeller: false };

function Products() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null);
  const [uploading, setUploading] = useState(false);

  // FETCH from admin route
  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      const list = res.data?.games || (Array.isArray(res.data) ? res.data : []);
      setProducts(list.map(normalizeGame));
    } catch { toast.error("Failed to load products"); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // SAVE (add or update) via admin route
  const save = async () => {
    if (!modal) return;
    const { mode, data } = modal;
    if (!data.title || !data.price) return toast.warning("Title and Price are required");

    const body = { ...data, price: Number(data.price), rating: Number(data.rating) || 0, year: Number(data.year) || new Date().getFullYear() };

    try {
      if (mode === "add") await api.post("/admin/products", body);
      else await api.put(`/admin/products/${data.id}`, body);
      toast.success(mode === "add" ? "Product added" : "Product updated");
      setModal(null);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || "Save failed"); }
  };

  // DELETE via admin route
  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await api.delete(`/admin/products/${id}`); toast.success("Deleted"); fetchProducts(); }
    catch { toast.error("Delete failed"); }
  };

  // IMAGE UPLOAD via admin route
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !modal) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      setUploading(true);
      const res = await api.post("/admin/products/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setModal({ ...modal, data: { ...modal.data, image: res.data.imageUrl } });
      toast.success("Image uploaded!");
    } catch (err) { toast.error(err.response?.data?.message || "Upload failed"); }
    finally { setUploading(false); }
  };

  const set = (field, value) => setModal({ ...modal, data: { ...modal.data, [field]: value } });

  return (
    <div className="products">
      <h2>Products</h2>
      <button className="add-main-btn" onClick={() => setModal({ mode: "add", data: { ...EMPTY } })}>+ Add Product</button>

      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Image</th><th>Price</th><th>Rating</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={`${p.id}-${i}`}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td><img src={getImageUrl(p.image)} alt={p.title} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} onError={(e) => (e.target.src = "https://via.placeholder.com/60")} /></td>
              <td>₹{p.price}</td>
              <td>⭐ {p.rating}</td>
              <td>
                <button onClick={() => setModal({ mode: "edit", data: { ...p } })}>Edit</button>
                <button onClick={() => remove(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal && (
        <div className="modal">
          <div className="modal-box large">
            <h3>{modal.mode === "add" ? "Add" : "Edit"} Product</h3>

            <input placeholder="Title" value={modal.data.title || ""} onChange={(e) => set("title", e.target.value)} />
            <input placeholder="Developer" value={modal.data.developer || ""} onChange={(e) => set("developer", e.target.value)} />
            <input type="number" placeholder="Year" value={modal.data.year || ""} onChange={(e) => set("year", e.target.value)} />
            <input type="number" placeholder="Price" value={modal.data.price || ""} onChange={(e) => set("price", e.target.value)} />
            <input type="number" step="0.1" placeholder="Rating" value={modal.data.rating || ""} onChange={(e) => set("rating", e.target.value)} />
            <input placeholder="Category" value={modal.data.category || ""} onChange={(e) => set("category", e.target.value)} />
            <input placeholder="Platform" value={modal.data.platform || ""} onChange={(e) => set("platform", e.target.value)} />

            <div style={{ margin: "10px 0", display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, color: "#aaa" }}>Game Cover Image</label>
              <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} style={{ background: "#222", border: "1px solid #444", padding: 5 }} />
              {uploading && <span style={{ fontSize: 12, color: "#3b82f6" }}>Uploading...</span>}
              <input placeholder="Or paste direct Image URL" value={modal.data.image || ""} onChange={(e) => set("image", e.target.value)} />
            </div>

            {modal.data.image && (
              <div style={{ marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "#aaa" }}>Preview:</span><br />
                <img src={getImageUrl(modal.data.image)} alt="preview" style={{ width: 100, marginTop: 5, borderRadius: 8, border: "1px solid #444" }} onError={(e) => (e.target.src = "https://via.placeholder.com/100?text=Invalid+Image")} />
              </div>
            )}

            <textarea placeholder="Description" value={modal.data.description || ""} onChange={(e) => set("description", e.target.value)} />

            <label><input type="checkbox" checked={modal.data.isNew || false} onChange={(e) => set("isNew", e.target.checked)} /> New</label>
            <label><input type="checkbox" checked={modal.data.isTopSeller || false} onChange={(e) => set("isTopSeller", e.target.checked)} /> Top Seller</label>

            <div className="modal-actions">
              <button onClick={save}>{modal.mode === "add" ? "Add" : "Update"}</button>
              <button onClick={() => setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
