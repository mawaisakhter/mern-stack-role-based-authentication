const Product = require('../models/Product');

  const createproduct = async (req, res) => {
    try {
        
        const { productname, productcontent, productprice } = req.body;
        const multipleimages = req.files && req.files['multipleimages']
            ? req.files['multipleimages'].map(file => file.path)
            : [];

        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "Unauthorized: User ID missing" });
        }

        const newProduct = await Product.create({
            productname,
            productcontent,
            productprice,
            multipleimages,
            createdBy: req.user.id,
        });

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: "Failed to Create New Product", details: err.message });
    }
};

  // Get all products (Admin, SuperAdmin) or user's products (User role)
  const getProducts = async (req, res) => {
    try {
      let products;
      if (req.user.role === "User") {
        products = await Product.find({ createdBy: req.user.id });
      } else {
        products = await Product.find().populate("createdBy", "name email"); 
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  };

  // Fetch Single Product by ID
  const getProductById = async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const deletesingleimage = async (req, res) =>{
    const{ id } = req.params;
    const{ imageUrl } = req.body;
    // console.log(id);
    // console.log(imageUrl);
    try {
      const updatedObject = await Product.findByIdAndUpdate(
        id,
        { $pull: { multipleimages: imageUrl } },
        { new: true }
    );
    if (!updatedObject) {
      return res.status(404).send({ message: 'Object not found' });
    }

    if (req.user.role !== "SuperAdmin" && req.user.role !== "Admin" && product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    res.send(updatedObject);
    } catch (error) {
      res.status(500).send({ message: error.message});
    }
  }; 

  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const product = await Product.findByIdAndDelete(id);
      // findByIdAndDelete
      // console.log(post);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (req.user.role !== "SuperAdmin" && req.user.role !== "Admin" && product.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "You are not authorized to delete this product" });
      }
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };

  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productname, productcontent, productprice } = req.body;
    const updateData = {
      productname,
      productcontent,
      productprice,
    };
  
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedProduct) {
        return res.status(404).send('Product not found');
      }
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const Updateimages = async (req, res) => {
    const { id } = req.params;
    const images = req.files.map(file => file.path); 
    try {
        const updatedObject = await Product.findByIdAndUpdate(
            id,
            { $push: { multipleimages: { $each: images } } }, 
            { new: true }
        );
        if (!updatedObject) {
            return res.status(404).send({ message: 'Object not found' });
        }
        res.send(updatedObject);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
  };

module.exports = {
    createproduct,
    getProducts,
    getProductById,
    updateProduct,
    Updateimages,
    deletesingleimage,
    deleteProduct,

};
