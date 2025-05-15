const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 5000;
const apiKey = "AIzaSyCfMTL3vN0srsTQv0IUNbdWwGnv9pQgyj4";

app.use(cors());

// GET list of places
app.get("/places", async (req, res) => {
  const searchQuery = req.query.search || "food";

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${apiKey}`; //&location=43.7,-79.42&radius=5000

  try {
    const response = await axios.get(url);
    const places = response.data.results; // includes ALL places, even non-restaurants
    const validTypes = [
      "restaurant",
      "bakery",
      "cafe",
      "bar",
      "meal_delivery",
      "meal_takeaway",
    ];

    // get only dining establishments
    const foodPlaces = places.filter((place) => {
      return place.types.some((type) => validTypes.includes(type));
    });
    res.json(foodPlaces);
  } catch (error) {
    console.error("Error fetching places:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch places", details: error.message });
  }
});

// GET details of selected place
app.get("/place-details", async (req, res) => {
  const placeId = req.query.place_id;
  const details_url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  try {
    const response = await axios.get(details_url);
    const placeDetails = response.data.result;
    res.json(placeDetails);
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
