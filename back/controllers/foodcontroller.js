import foodModel from "../models/foodModel.js" 
import fs from 'fs'



const addFood = async (req, res) => {
    console.log(req.file);  // Log to check if file is present


    
   
    let image_filename = `${req.file.filename}`
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occurred" });
    }
};
//all food list
const listFood = async(req,res) =>{

    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//remove food items
const removeFood = async (req,res)=>{
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"food removed"})

    }catch(error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        

    }

}
// Edit food item by ID
const editFood = async (req, res) => {
    const { id, name, description, price, category } = req.body;
  
    try {
      const food = await foodModel.findById(id);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }
  
      // Handle image replacement if a new file is uploaded
      let image_filename = food.image;  // Default to existing image
      if (req.file) {
        fs.unlink(`uploads/${food.image}`, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
        image_filename = req.file.filename;
      }
  
      // Update food item fields
      food.name = name;
      food.description = description;
      food.price = price;
      food.category = category;
      food.image = image_filename;
  
      await food.save();
      res.json({ success: true, message: "Food item updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Error updating food item" });
    }
  };


export {addFood,listFood,removeFood,editFood}