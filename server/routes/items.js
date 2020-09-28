const router = require("express").Router();
const axios = require("axios");

// Setup all Bungie related endpoints, paths, headers, etc.
const type = "DestinyInventoryItemDefinition";

// GET the destiny 2 manifest
router.get("/manifest", (req, res) => {
  axios({
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/Manifest/`,
    headers: {
      "x-api-key": process.env.BUNGIE_API_KEY,
    },
  }).then(response => {
    console.log(response);
    res.send(response.data);
  });
});

// Search an item's information from Bungie API
router.post("/items", (req, res) => {
  axios({
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/Armory/Search/${type}/${req.body.query}/`,
    headers: {
      "x-api-key": process.env.BUNGIE_API_KEY,
    },
  }).then(response => {
    console.log(response);
    res.send(response.data);
  });
});

module.exports = router;
