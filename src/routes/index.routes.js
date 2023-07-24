const { Router } = require('express'); // Import of a module function 
const router = Router(); // Instance of Router
const { logicSIM } = require('../controllers/index.controller')

router.get('/', logicSIM);

module.exports = router;