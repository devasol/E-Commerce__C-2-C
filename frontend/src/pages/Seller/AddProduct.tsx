import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI, categoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data.data);
        setCategoriesLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
    document.title = 'Add Product - E-Shop';
  }, []);

  // Product state
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '', // This will now store the category ID
    brand: '',
    stock: 0,
    isActive: true,
    images: [] as string[],
    features: [] as string[],
    specifications: {} as Record<string, string>,
    discount: 0,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    }
  });

  // Form state for features and specifications
  const [newFeature, setNewFeature] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [imageUrls, setImageUrls] = useState(['']);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        name === 'category' ? value : // For category, always use the string value (ObjectId)
        name === 'price' || name === 'stock' || name === 'discount' || name === 'weight' ?
        parseFloat(value) || 0 : value
    }));
  };

  // Handle dimensions changes
  const handleDimensionChange = (dimension: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: parseFloat(value) || 0
      }
    }));
  };

  // Add a new feature
  const addFeature = () => {
    if (newFeature.trim() !== '') {
      setProductData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  // Remove a feature
  const removeFeature = (index: number) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add a specification
  const addSpecification = () => {
    if (specKey.trim() !== '' && specValue.trim() !== '') {
      setProductData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  // Remove a specification
  const removeSpecification = (key: string) => {
    setProductData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  // Add a new image URL field
  const addImageUrl = () => {
    setImageUrls(prev => [...prev, '']);
  };

  // Update image URL at specific index
  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    
    // Update product data
    setProductData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  // Remove an image URL field
  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newUrls = imageUrls.filter((_, i) => i !== index);
      setImageUrls(newUrls);
      
      // Update product data
      setProductData(prev => ({
        ...prev,
        images: newUrls.filter(url => url.trim() !== '')
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare product data
      const productPayload = {
        ...productData,
        seller: authState.user?._id,
        images: productData.images.filter(url => url.trim() !== '')
      };

      // Make API call to create product
      const response = await productAPI.create(productPayload);
      
      if (response.data.success) {
        toast.success('Product added successfully!');
        navigate('/seller/products');
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <button
            onClick={() => navigate('/seller/products')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Basic Information */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category *</label>
                {categoriesLoading ? (
                  <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter brand"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={productData.discount}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter product description"
                />
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Product Images</h2>
            
            <div className="space-y-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter image URL"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Another Image
              </button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Features</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-lg"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {productData.features.map((feature, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span className="mr-2">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Specifications */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg"
                placeholder="Specification name"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg"
                placeholder="Specification value"
              />
            </div>
            
            <button
              type="button"
              onClick={addSpecification}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
            >
              Add Specification
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(productData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dimensions and Weight */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Dimensions & Weight</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Length (cm)</label>
                <input
                  type="number"
                  value={productData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Width (cm)</label>
                <input
                  type="number"
                  value={productData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={productData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  min="0"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={productData.weight}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div className="mb-8" variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Product Status</h2>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={productData.isActive}
                  onChange={handleInputChange}
                  className="mr-2 h-5 w-5 text-blue-600 rounded"
                />
                <span className="text-gray-700">Active (Product is visible to customers)</span>
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/seller/products')}
                className="px-6 py-3 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;