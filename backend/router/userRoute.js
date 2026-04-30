const express=require('express');
const router= express.Router();
const auth=require('../middleware/auth');

const {
    signup,
    login,
    getProfile,
    editProfile,
    deleteProfile,
    getPremium
}= require('../controller/userController')


router.post('/register',signup );
router.post('/login',login);
router.get('/me',auth,getProfile);
router.put('/me',auth,editProfile);
router.delete('/me',auth, deleteProfile);

//for user to get premium
router.post('/getPremium',auth , getPremium);



module.exports=router;