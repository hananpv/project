import React, { useEffect, useState } from "react";
import { api } from "../../api/Axios";
import "../css/products.css";

function Products() {
  const [products, setProducts] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    id:"",
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

  // GET
  const fetchProducts = async () => {
    const res = await api.get("/games");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD
  const addProduct = async () => {
    try {
      await api.post("/games", {
        ...newProduct,
        price: Number(newProduct.price),
        rating: Number(newProduct.rating),
        year: Number(newProduct.year),
      });

      setShowAdd(false);
      fetchProducts();

      // reset
      setNewProduct({
        id:"",
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
    await api.delete(`/games/${id}`);
    fetchProducts();
  };

  // UPDATE
  const updateProduct = async () => {
    await api.put(`/games/${editProduct.id}`, editProduct);
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <div className="products">
      <h2>Products</h2>

      {/* ADD BUTTON */}
      <button className="add-main-btn" onClick={() => setShowAdd(true)}>
        + Add Product
      </button>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
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

      {/* ADD MODAL */}
      {showAdd && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Add Product</h3>
            <input placeholder="id" onChange={(e)=>setNewProduct({...newProduct,id:e.target.value})}/>

            <input placeholder="Title" onChange={(e)=>setNewProduct({...newProduct,title:e.target.value})}/>
            <input placeholder="Developer" onChange={(e)=>setNewProduct({...newProduct,developer:e.target.value})}/>
            <input placeholder="Year" type="number" onChange={(e)=>setNewProduct({...newProduct,year:e.target.value})}/>
            <input placeholder="Price" type="number" onChange={(e)=>setNewProduct({...newProduct,price:e.target.value})}/>
            <input placeholder="Rating" type="number" step="0.1" onChange={(e)=>setNewProduct({...newProduct,rating:e.target.value})}/>
            <input placeholder="Category" onChange={(e)=>setNewProduct({...newProduct,category:e.target.value})}/>
            <input placeholder="Platform" onChange={(e)=>setNewProduct({...newProduct,platform:e.target.value})}/>
            <input placeholder="Image path" onChange={(e)=>setNewProduct({...newProduct,image:e.target.value})}/>
            <textarea placeholder="Description" onChange={(e)=>setNewProduct({...newProduct,description:e.target.value})}/>

            <label>
              <input type="checkbox" onChange={(e)=>setNewProduct({...newProduct,isNew:e.target.checked})}/>
              New
            </label>

            <label>
              <input type="checkbox" onChange={(e)=>setNewProduct({...newProduct,isTopSeller:e.target.checked})}/>
              Top Seller
            </label>

            <div className="modal-actions">
              <button onClick={addProduct}>Add</button>
              <button onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editProduct && (
        <div className="modal">
          <div className="modal-box large">
            <h3>Edit Product</h3>

            <input value={editProduct.title} onChange={(e)=>setEditProduct({...editProduct,title:e.target.value})}/>
            <input value={editProduct.price} type="number" onChange={(e)=>setEditProduct({...editProduct,price:Number(e.target.value)})}/>
            <input value={editProduct.rating} type="number" step="0.1" onChange={(e)=>setEditProduct({...editProduct,rating:Number(e.target.value)})}/>

            <div className="modal-actions">
              <button onClick={updateProduct}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;