const jwt = require('jsonwebtoken');
const { Nutrition } = require('../modules/Nutrition');

function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token){
        try{
            const decoded = jwt.verify(token, process.env.JWR_SECRET);
            req.user = decoded;
            next();
        }catch(error){
            res.status(401).json({message: 'Invalid token'});
        }
    }else{
        res.status(401).json({message: 'no token provided'});
    }
}

// Verify token & Authorization the user
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
     if(req.user.id === req.params.id 
        || req.user.isAdmin){
         next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}

// verify token and admin and owner of the nutrition
async function verifyTokenAndAuthorizationByNutrition(req, res, next) {
    // Retrieve nutritionId from request parameters
    const nutritionId = req.params.id;

    try{
        // Find the nutrition by its ID
        const nutrition = await Nutrition.findById(nutritionId);
        verifyToken(req, res, () => {
            if(req.user.isAdmin || req.user.id === nutrition.userId.toString()){
                next();
            }else{
                res.status(403).json({message: 'You are not allowed '});
            }
        });
    }catch(error){
        res.status(404).json({message: 'Nutrition not found', error: error});
    }
    
}
// Verify token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}

// Verify token & Authorization the user
function verifyTokenAndCreateUser(req, res, next) {
    verifyToken(req, res, () => {
     if(req.user.id === req.body.ownerId
        || req.user.id === req.body.userId){
         next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}



module.exports = {
    verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin,
    verifyTokenAndCreateUser,
    verifyTokenAndAuthorizationByNutrition
};
