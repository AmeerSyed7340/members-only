const express = require("express")
const router = express.Router();
const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");
const user_middleware = require("../middleware/userMiddleware");

//TEST "/" route
router.get("/", user_controller.index);

//GET request for sign up
router.get('/signup', user_controller.user_create_get);

//POST request for sign up
router.post('/signup', user_controller.user_create_post);

//GET requeset for login
router.get('/login', user_controller.user_login_get);

//POST request for login
router.post('/login', user_controller.user_login_post);

//GET request for logout
router.get('/logout', user_controller.user_logout_get);

//GET request for secret
router.get('/user/:id/secret', user_controller.secret_form_get);

//POST request for secret
router.post('/user/:id/secret', user_controller.secret_form_post);

//GET request for user detail
router.get('/user/:id', user_middleware.checkAuth, user_controller.user_detail);

//POST request for new post in user detail
router.post('/user/:id', post_controller.new_post);

//DELETE request in user detail
router.post('/post/:id/delete',  post_controller.post_delete);

module.exports = router;