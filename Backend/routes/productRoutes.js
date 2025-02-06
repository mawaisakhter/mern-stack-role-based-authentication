const express = require('express');
const {
  createproduct, 
  getProducts, 
  updateProduct,
  Updateimages,
  getProductById, 
  deleteProduct,
  deletesingleimage } = require('../controllers/productController');
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware"); 
const upload = require('../middleware/upload');

const router = express.Router();

router.post("/", authenticate, authorize(["User", "Admin", "SuperAdmin"]), upload.fields([
    { name: 'multipleimages', maxCount: 10 },
  ]),  createproduct);
  router.get("/", authenticate, authorize(["User", "Admin", "SuperAdmin"]), getProducts);
  router.get("/:id", authenticate, authorize(["User","Admin","SuperAdmin"]), getProductById);
  router.put("/:id/update-product", authenticate, authorize(["User","Admin","SuperAdmin"]), updateProduct);
  router.put("/:id/update-images", authenticate, authorize(["User","Admin","SuperAdmin"]), upload.array('multipleimages', 10), Updateimages);
  router.put("/:id/delete-image", authenticate, authorize(["User","Admin","SuperAdmin"]), deletesingleimage);
  router.delete("/:id/delete-product", authenticate, authorize(["User", "Admin", "SuperAdmin"]), deleteProduct);
module.exports = router;
