import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const url = "https://forkify-api.herokuapp.com/api/get";
    try {
      const res = await axios(`${url}?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.ingredients = res.data.recipe.ingredients;
      this.url = res.data.recipe.source_url;
    } catch (error) {
      console.log("something wen't wrong: " + error);
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitLong = [
      "tablespoons",
      "tablespoon",
      "whole medium",
      "whole",
      "ounces",
      "ounce",
      "cups",
      "pounds",
      "teaspoons",
      "teaspoon",
      "package",
    ];
    const unitShort = [
      "tbs",
      "tbs",
      "",
      "",
      "oz",
      "oz",
      "cup",
      "pound",
      "tsp",
      "tsp",
      "pack",
    ];
    const countLong = ["1/4", " 3/4", " 1/2", "1/2", ","];
    const countShort = [".25", ".75", ".5", "0.5", ""];
    const exceptions = ["butter cup", "____"];
    const filterOut = ["for the", "____"];
    //Arr of Str

    let newIngredients = this.ingredients;
    console.log(newIngredients);

    // filter out any ingredient which includes filterOut arr
    newIngredients = newIngredients.filter(
      (e) => !filterOut.some((e2) => e.toLowerCase().includes(e2))
    );

    newIngredients = newIngredients.map((el) => {
      //all ing to lowercase
      let ingredient = el.toLowerCase();

      //uniform units
      unitLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });
      //uniform count (remove fractions)
      countLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, countShort[i]);
      });

      // remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ").trim();

      //// Parse ingredients into count, unit, & ingredients

      //find unit index
      const arrIng = ingredient.split(" ");
      let unitIndex;
      const exception = exceptions.some((e) => ingredient.includes(e));
      //console.log(exception)

      if (!exception) {
        unitIndex = arrIng.findIndex((e2) => {
          return unitShort.includes(e2);
        });
      } else {
        unitIndex = -1;
      }

      let objIng;
      if (unitIndex > -1) {
        //unit was found
        objIng = {
          count: parseFloat(arrIng.slice(0, unitIndex).join(" ")) || 1,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(2).join(" "),
        };
      } else if (!isNaN(arrIng[0])) {
        objIng = {
          count: parseFloat(arrIng[0]),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        //no unit
        objIng = {
          count: 1,
          unit: "",
          ingredient, //ingredient: ingredient
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    //Ingredients & time
    this.ingredients.forEach((ing) => {
      ing.count =
        Math.round(
          (ing.count * (newServings / this.servings) + Number.EPSILON) * 100
        ) / 100;
      //(ing.count*(newServings / this.servings));
    });
    this.time = Math.round(this.time * (newServings / this.servings));
    this.servings = newServings;
  }
}
