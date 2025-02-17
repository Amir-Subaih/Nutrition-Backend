const mongoose = require('mongoose');
const Joi = require('joi');

// Nutrition Schema
const NutritionSchema = new mongoose.Schema({
    userId : {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "Users"
        },
    Weight : {
        type : Number,
        required : true,
        minlength : 1,
        maxlength : 300,
    },
    Length : {
        type : Number,
        required : true,
        minlength : 1,
        maxlength : 300,
    },
    FavoriteFood : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 255,
    },
    NotFavoriteFood : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 255,
    },
    Result:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100000,
        trim: true
    }
}, {timestamps : true});


// Nutrition Model
const Nutrition = mongoose.model('Nutritions', NutritionSchema);


//function to validate Register
function validateCreateNutrition(obj){
    const schema = Joi.object({
        userId : Joi.string().required(),
        Weight : Joi.number().min(1).max(300).required(),
        Length : Joi.number().min(1).max(300).required(),
        FavoriteFood : Joi.string().min(3).max(255).trim().required(),
        NotFavoriteFood : Joi.string().min(3).max(255).trim().required(),
        Result : Joi.string().min(1).max(255).trim(),
    });
    return schema.validate(obj);
}

//function to validate update the Nutrition
function validateUpdatNutrition(obj){
    const schema = Joi.object({
        userId : Joi.string().required(),
        Weight : Joi.number().min(1).max(5),
        Length : Joi.number().min(1).max(5),
        FavoriteFood : Joi.string().min(3).max(255).trim(),
        NotFavoriteFood : Joi.string().min(3).max(255).trim(),
        Result : Joi.string().min(1).max(255).trim(),
    });
    return schema.validate(obj);
}

//Export Nutrition Model
module.exports = {
    Nutrition,
    validateCreateNutrition,
    validateUpdatNutrition,
};
