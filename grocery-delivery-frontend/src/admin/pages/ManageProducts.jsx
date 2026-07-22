import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, createProductAPI, updateProductAPI, deleteProductAPI } from '../../services/api';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(prodRes.data?.data || []);
      setCategories(catRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load products or categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        image: product.image || '',
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: categories.length > 0 ? categories[0]._id : '',
        price: '',
        stock: '',
        image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProductAPI(editingProduct._id, formData);
        alert('Product updated successfully!');
      } else {
        await createProductAPI(formData);
        alert('Product created successfully!');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductAPI(id);
        alert('Product deleted successfully');
        loadData();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-gray-800">Manage Products</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-green-100 flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-medium">Loading products...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <th className="p-4 font-bold text-sm">Image</th>
                <th className="p-4 font-bold text-sm">Name</th>
                <th className="p-4 font-bold text-sm">Category</th>
                <th className="p-4 font-bold text-sm">Price</th>
                <th className="p-4 font-bold text-sm">Stock</th>
                <th className="p-4 font-bold text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No img</div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">{product.category?.name || 'Uncategorized'}</span>
                    </td>
                    <td className="p-4 font-bold text-green-600">Rs. {product.price}</td>
                    <td className="p-4 text-sm text-gray-600">{product.stock} units</td>
                    <td className="p-4 text-center space-x-3">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-red-500 transition bg-white rounded-full p-1 shadow-sm border border-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Product Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="E.g. Fresh Apples" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    name="category"
                    value={formData.category} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Price (Rs.)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={formData.stock} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Image URL</label>
                <input 
                  type="text" 
                  name="image"
                  value={formData.image} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                  placeholder="https://example.com/image.jpg" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea 
                  name="description"
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" 
                  placeholder="Enter product details..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-gray-600 font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 text-white font-bold bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-100 transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;