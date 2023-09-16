const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');

router.get('/', homeController.home);
router.use('/users', require('./user'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));


//for any further routes , access from here
//router.use('./routerName', require('./routerFile'));

module.exports = router;


