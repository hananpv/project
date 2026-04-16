import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
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

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await api.get("/games");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT
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
      });

      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

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

              {/* ✅ FIXED IMAGE */}
              <td>
                <img
                  src={
                    p.image?.startsWith("data:image")
                      ? p.image
                      : `http://localhost:5000${p.image}`
                  }
                  alt={p.title}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "8px"
                  }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/60")
                  }
                />
              </td>

              <td>₹{p.price}</td>
              <td>⭐ {p.rating}</td>

              <td>
                <button onClick={() => setEditProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Edit Product</h3>

            <input
              placeholder="Title"
              value={editProduct.title || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, title: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={editProduct.price || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={editProduct.rating || ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, rating: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={editProduct.description || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  description: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={updateProduct}>Update</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Add Product</h3>

            <input
              placeholder="Title"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
            />

            <input
              placeholder="Developer"
              value={newProduct.developer}
              onChange={(e) =>
                setNewProduct({ ...newProduct, developer: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Year"
              value={newProduct.year}
              onChange={(e) =>
                setNewProduct({ ...newProduct, year: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={newProduct.rating}
              onChange={(e) =>
                setNewProduct({ ...newProduct, rating: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <input
              placeholder="Platform"
              value={newProduct.platform}
              onChange={(e) =>
                setNewProduct({ ...newProduct, platform: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.value })
              }
            />

            {newProduct.image && (
              <img
                src={newProduct.image}
                alt="preview"
                style={{
                  width: "100px",
                  marginTop: "10px",
                  borderRadius: "8px"
                }}
              />
            )}

            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
            />

            <label>
              <input
                type="checkbox"
                checked={newProduct.isNew}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    isNew: e.target.checked,
                  })
                }
              />
              New
            </label>

            <label>
              <input
                type="checkbox"
                checked={newProduct.isTopSeller}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    isTopSeller: e.target.checked,
                  })
                }
              />
              Top Seller
            </label>

            <div className="modal-actions">
              <button onClick={addProduct}>Add</button>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;