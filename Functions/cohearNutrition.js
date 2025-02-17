const { CohereClient } = require('cohere-ai');

const cohereApiKey = process.env.COHERE_API_KEY || "kPW34bb6SO5DFTXnFT34KIlYl97eLRmfTejHZfJv" || "SUZUCloGKMzCzN35FgfAEeuIeBoemPrAEiXsP3wg";
const cohere = new CohereClient({ token: cohereApiKey });

// Function to generate a meal plan
async function generateMealPlan(weight, height, favoriteFoods, notFavoriteFoods) {
    const systemPrompt = `
        أنا أبحث عن نظام غذائي صحي لمدة شهر. وزني ${weight} كجم وطولي ${height} سم. 
        الأطعمة التي لا أحبها هي: ${notFavoriteFoods}.
        الأطعمة التي أحبها هي: ${favoriteFoods}.
        الرجاء إنشاء نظام غذائي يومي يتضمن ثلاث وجبات رئيسية ووجبتين خفيفتين، مع مراعاة تفضيلاتي الغذائية.
    `;

    try {
        const response = await cohere.chat({
            message: systemPrompt
        });

        if (!response.text) throw new Error("No text returned from Cohere API");

        return response.text;
    } catch (error) {
        console.error("Error generating meal plan:", error.message);
        throw new Error("Failed to generate meal plan: " + error.message);
    }
}

// Function to handle the creation of nutrition plan
async function CreateNutritionByAI(weight, height, favoriteFood, notFavoriteFood) {
    try {

        const mealPlan = await generateMealPlan(weight, height, favoriteFood, notFavoriteFood);
        console.log("Meal Plan Generated:\n", mealPlan);
        return mealPlan;
    } catch (error) {
        console.error("Error in creating nutrition plan:", error.message);
        throw new Error("An error occurred during nutrition plan creation: " + error.message);
    }
}
// // Example usage
// const weight = 100; // وزنك بالكيلوجرام
// const height = 168; // طولك بالسنتيمتر
// const favoriteFood = ["السبانخ", "السلطة (بندورة وخيار)", "كبسة"]; // الأطعمة المفضلة
// const notFavoriteFood = ["الفاصولياء", "العدس", "الكبده", "الجبنه الصفراء", "البيض الني"]; // الأطعمة غير المفضلة

// CreateNutritionByAI(weight, height, favoriteFood, notFavoriteFood)
//     .then(mealPlan => {
//         console.log("Your meal plan for the month is ready!");
//         console.log(mealPlan);
//     })
//     .catch(error => {
//         console.error("Failed to create meal plan:", error);
//     });

module.exports = {
    CreateNutritionByAI
};