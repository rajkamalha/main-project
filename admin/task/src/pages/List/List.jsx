import React, { useEffect, useState } from 'react';
import './List.css';
import axios from "axios";
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track the item being edited
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [image, setImage] = useState(null); // New image file for editing

  // Predefined categories
  const categories = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Server error while fetching list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      toast.error("Server error while removing food");
    }
  };

  const handleEdit = (item) => {
    setEditMode(item._id);
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the new image file
  };

  const saveEdit = async (foodId) => {
    const data = new FormData();
    data.append('id', foodId);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (image) data.append('image', image); // Add new image if selected

    try {
      const response = await axios.post(`${url}/api/food/edit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditMode(null);
        fetchList();
      } else {
        toast.error("Error updating food item");
      }
    } catch (error) {
      toast.error("Server error while updating food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p style={{fontSize:"30px"}}>All Foods List</p>
      <div className='list-table'>
        <div className='list-table-format title'>
          <b>Image</b>
          <b id='Na'>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/` + item.image} alt="" />
            {editMode === item._id ? (
              <>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} />
                <input type="file" name="image" onChange={handleImageChange} />
                <button className='savv' onClick={() => saveEdit(item._id)}>Save</button>
                <button className='savv' onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{item.name}</p>
                <p>{item.description}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p id='curs' onClick={() => removeFood(item._id)}>X</p>
                <button id='sav' onClick={() => handleEdit(item)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;

