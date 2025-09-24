const express=require('express');
const router= express.Router();
const auth=require('../middleware/auth');
const {
     signup,
    login,
    getProfile,
    editProfile,
    deleteProfile
}= require('../controller/userController')


router.post('/register',signup );
router.post('/login',login);
router.get('/profile',auth,getProfile);
router.put('/profile',auth,editProfile);
router.delete('/delete',auth, deleteProfile);




module.exports=router;