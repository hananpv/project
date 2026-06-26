const mongoose = require("mongoose");
const Game = require("./models/Game");

async function fix() {
  await mongoose.connect("mongodb://127.0.0.1:27017/gameStore");
  console.log("Connected to MongoDB!");
  
  const games = await Game.find();
  let updatedCount = 0;

  for (const game of games) {
    if (game.image) {
      // Find the filename by looking at what is after 'products/'
      let newPath = game.image;
      if (game.image.includes("products/")) {
        const parts = game.image.split("products/");
        const filename = parts[parts.length - 1];
        newPath = "/products/" + filename;
      }
      
      if (game.image !== newPath) {
        console.log(`Fixing image path: "${game.image}" -> "${newPath}"`);
        game.image = newPath;
        await game.save();
        updatedCount++;
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} games.`);
  process.exit(0);
}

fix().catch(err => {
  console.error("Error running fix:", err);
  process.exit(1);
});