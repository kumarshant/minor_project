const express=require('express');
const router=express.Router();
const auth = require('../middleware/auth');



router.post('/upload',auth,);
router.post('/analyze-skin-tone',auth,);
router.post('analyze-colors',auth,);

module.exports=router;
