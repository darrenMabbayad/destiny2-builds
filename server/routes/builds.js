const router = require("express").Router();

// Build model
let Build = require("../models/build.model");

// GET all builds from MongoDB
router.get("/", (request, response) => {
  Build.find() // returns a promise
    .then(builds => response.json(builds))
    .catch(error => response.status(400).json("Error: " + error));
});

// POST a new build to MongoDB
router.post("/add", (request, response) => {
  const name = request.body.name;
  const description = request.body.description;
  const selectedClass = request.body.selectedClass;
  const stats = request.body.stats;
  const weapons = request.body.weapons;
  const armor = request.body.armor;
  const newBuild = new Build({
    name,
    description,
    selectedClass,
    stats,
    weapons,
    armor,
  });

  newBuild
    .save()
    .then(build => response.json(build))
    .catch(error => response.status(400).json("Error: " + error));
});

// GET specific build
router.get("/:id", (request, response) => {
  Build.findById(request.params.id)
    .then(build => response.json(build))
    .catch(error => response.status(400).json("Error: " + error));
});

// DELETE specific build
router.delete("/:id", (request, response) => {
  Build.findByIdAndDelete(request.params.id)
    .then(build => response.json(`Deleted: ${build.name}`))
    .catch(error => response.status(400).json("Error: " + error));
});

// UPDATE existing build
router.post("/update/:id", (request, response) => {
  Build.findById(request.params.id)
    .then(build => {
      build.name = request.body.name;
      build.description = request.body.description;
      build.selectedClass = request.body.selectedClass;
      build.stats = request.body.stats;
      build.weapons = request.body.weapons;
      build.armor = request.body.armor;

      build
        .save()
        .then(build => response.json(`Updated: ${build.name}`))
        .catch(error => response.status(400).json("Error: " + error));
    })
    .catch(error => response.status(400).json("Error: " + error));
});

module.exports = router;
