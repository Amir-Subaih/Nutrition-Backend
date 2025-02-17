const asyncHandler = require('express-async-handler');
const { Nutrition,validateCreateNutrition,validateUpdatNutrition } = require('../modules/Nutrition');
const { CreateNutritionByAI } = require('../Functions/cohearNutrition');

/**
 * @desc    Create a new feedback
 * @route   POST /api/feedback
 * @method  POST
 * @access  Private
 */

module.exports.createNutrition = asyncHandler(async (req, res) => {
    const { error } = validateCreateNutrition(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const { Weight, Length, FavoriteFood, NotFavoriteFood } = req.body;


    const result = await CreateNutritionByAI(Weight, Length, FavoriteFood, NotFavoriteFood);

    const nutrition = new Nutrition({
        userId : req.body.userId,
        Weight: Weight,
        Length: Length,
        FavoriteFood: FavoriteFood,
        NotFavoriteFood: NotFavoriteFood,
        Result: result
    });

    const resultAll = await nutrition.save();

    if (!resultAll) {
        res.status(400).json({ message: 'failed' });
    } else {
        res.status(201).json({ resultAll, message: 'success' });
    }
});


/**
 * @desc    Get all nutritions
 * @route   GET /api/nutrition
 * @method  GET
 * @access  Private(admin)
 */

module.exports.getAllNutritions = asyncHandler (async (req, res) => {
    let nutritions ;
    const {pageNum} = req.query;

    if(pageNum){
        const nutritionsPerPage =4;
        nutritions = await Nutrition.find().populate('userId', [
            "_id",
            "name"
        ]).skip((pageNum - 1))
        .limit(nutritionsPerPage)
        .sort({ createdAt: -1 });
    }else{
        nutritions = await Nutrition.find()
        .sort({ createdAt: -1 }).populate('userId', [
            "_id",
            "name"
        ]);

    }

    res.status(200).json({nutritions, message: 'success'});
});

/**
 * @desc    Get nutrition by ID
 * @route   GET /api/nutrition/:id
 * @method  GET
 * @access  Private(admin)
 */

module.exports.getNutritionByID = asyncHandler (async (req, res) => {
    const nutrition = await Nutrition.findById(req.params.id)
    .sort({ createdAt: -1 });
    if (!nutrition) return res.status(404).json({message: 'Nutrition not found'});
    res.status(200).json({nutrition, message: 'success'});
});

/**
 * @desc    Get All nutritions by userId
 * @route   GET /api/nutrition/user/:id
 * @method  GET
 * @access  Private (user and admin)
 */

module.exports.getNutritionByUserID = asyncHandler (async (req, res) => {
    const nutritions = await Nutrition.find({userId : req.params.id}).sort('-date');
    if (!nutritions) return res.status(404).json({message: 'Nutrition not found'});
    res.status(200).json({nutritions, message: 'success'});
});