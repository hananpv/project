import React, { useEffect, useState } from "react";
import { api, getImageUrl, normalizeGame } from "../../api/Axios";
import "../css/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    developer: "",
    year: "",
    price: "",
    rating: "",
    category: "",
    platform: "",
    image: "",
    description: "",
    isNew: false,
    isTopSeller: false,
  });

  // FETCH
  const fetchProducts = async () => {
    try {
      const res = await api.get("/games");
      setProducts(res.data.map(normalizeGame));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD
  const addProduct = async () => {
    try {
      await api.post("/games", {
        ...newProduct,
        price: +newProduct.price,
        rating: +newProduct.rating,
        year: +newProduct.year,
      });

      setShowAdd(false);
      fetchProducts();

      setNewProduct({
        title: "",
        developer: "",
        year: "",
        price: "",
        rating: "",
        category: "",
        platform: "",
        image: "",
        description: "",
        isNew: false,
        isTopSeller: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/games/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE
  const updateProduct = async () => {
    try {
      await api.put(`/games/${editProduct.id}`, {
        ...editProduct,
        price: Number(editProduct.price),
        rating: Number(editProduct.rating),
        year: Number(editProduct.year),
      });

      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ COMMON FORM (ADD + EDIT)
  const renderForm = (data, setData) => (
    <>
      <input
        placeholder="Title"
        value={data.title || ""}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />

      <input
        placeholder="Developer"
        value={data.developer || ""}
        onChange={(e) => setData({ ...data, developer: e.target.value })}
      />

      <input
        type="number"
        placeholder="Year"
        value={data.year || ""}
        onChange={(e) => setData({ ...data, year: e.target.value })}
      />

      <input
        type="number"
        placeholder="Price"
        value={data.price || ""}
        onChange={(e) => setData({ ...data, price: e.target.value })}
      />

      <input
        type="number"
        step="0.1"
        placeholder="Rating"
        value={data.rating || ""}
        onChange={(e) => setData({ ...data, rating: e.target.value })}
      />

      <input
        placeholder="Category"
        value={data.category || ""}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      />

      <input
        placeholder="Platform"
        value={data.platform || ""}
        onChange={(e) => setData({ ...data, platform: e.target.value })}
      />

      <input
        placeholder="Image URL"
        value={data.image || ""}
        onChange={(e) => setData({ ...data, image: e.target.value })}
      />

      {data.image && (
        <img
          src={data.image}
          alt="preview"
          style={{
            width: "100px",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        />
      )}

      <textarea
        placeholder="Description"
        value={data.description || ""}
        onChange={(e) =>
          setData({ ...data, description: e.target.value })
        }
      />

      <label>
        <input
          type="checkbox"
          checked={data.isNew || false}
          onChange={(e) =>
            setData({ ...data, isNew: e.target.checked })
          }
        />
        New
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.isTopSeller || false}
          onChange={(e) =>
            setData({ ...data, isTopSeller: e.target.checked })
          }
        />
        Top Seller
      </label>
    </>
  );

  return (
    <div className="products">
      <h2>Products</h2>

      <button className="add-main-btn" onClick={() => setShowAdd(true)}>
        + Add Product
      </button>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Image</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p, index) => (
            <tr key={`${p.id}-${index}`}>
              <td>{p.id}</td>
              <td>{p.title}</td>

              <td>
                <img
                  src={
                    getImageUrl(p.image)
                  }
                  alt={p.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/60")
                  }
                />
              </td>

              <td>₹{p.price}</td>
              <td>⭐ {p.rating}</td>

              <td>
                <button onClick={() => setEditProduct({ ...p })}>
                  Edit
                </button>
                <button onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Edit Product</h3>

            {renderForm(editProduct, setEditProduct)}

            <div className="modal-actions">
              <button onClick={updateProduct}>Update</button>
              <button onClick={() => setEditProduct(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Add Product</h3>

            {renderForm(newProduct, setNewProduct)}

            <div className="modal-actions">
              <button onClick={addProduct}>Add</button>
              <button onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
