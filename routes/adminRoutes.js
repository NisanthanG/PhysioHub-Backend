const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const controller = require("../controllers/adminController");

router.use(auth, role("admin"));
router.get("/dashboard", controller.dashboard);
router.patch("/physios/:id/review", controller.reviewPhysio);
router.post("/products", controller.createProduct);
router.patch("/products/:id", controller.updateProduct);
router.delete("/products/:id", controller.deleteProduct);

module.exports = router;