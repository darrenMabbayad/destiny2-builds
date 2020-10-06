const router = require("express").Router();
const axios = require("axios");

// Setup all Bungie related endpoints, paths, headers, etc.
const type = "DestinyInventoryItemDefinition";

// GET the destiny 2 manifest
router.get("/manifest", async (req, res) => {
  axios({
    method: "get",
    url: `https://www.bungie.net/Platform/Destiny2/Manifest/`,
    headers: {
      "x-api-key": process.env.BUNGIE_API_KEY,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(e => {
      console.error(e);
    });
});

module.exports = router;
