const express = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
} = require("../controllers/userController");
const router = express.Router();

// router.post("/", createUser);
// router.get("/", getAllUsers);
router.route("/").post(createUser).get(getAllUsers);

router.route("/:id").get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
