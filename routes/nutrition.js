const express = require('express');
const router = express.Router();
const { createNutrition,getAllNutritions,getNutritionByID,getNutritionByUserID } = require('../controllers/nutritionController');
const { verifyTokenAndAdmin,verifyTokenAndAuthorization,verifyTokenAndAuthorizationByNutrition,verifyTokenAndCreateUser } = require('../middleware/verify')

//function to validate Register
router.route('/create').post(verifyTokenAndCreateUser,createNutrition);
router.route('/all').get(verifyTokenAndAdmin,getAllNutritions);
router.route('/byId/:id').get(verifyTokenAndAuthorizationByNutrition,getNutritionByID);
router.route('/byUserId/:id').get(verifyTokenAndAuthorization,getNutritionByUserID);




// export router
module.exports = router;