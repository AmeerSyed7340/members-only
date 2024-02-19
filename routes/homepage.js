const express = require("express")
const router = express.Router();

const user_controller = require("../controllers/userController");

//TEST "/" route
router.get("/", user_controller.index);

router.get('/signup', user_controller.user_create_get);

router.post('/signup', user_controller.user_create_post);

router.get('/login', user_controller.user_login_get);

module.exports = router;