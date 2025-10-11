// routes/waitingList.js
const express = require("express");
const router = express.Router();
const WaitingList = require("./models/WaitingList");

// Add a customer to the waiting list
router.post("/", async (req, res) => {
  const { placeId, date, guests, customerName, customerEmail } = req.body;

  try {
    // Create a new waiting list entry
    const newEntry = await WaitingList.create({
      placeId,
      date,
      guests,
      customerName,
      customerEmail,
    });

    res.status(201).json({ message: "Added to waiting list", entry: newEntry });
  } catch (error) {
    console.error("Error adding to waiting list:", error);
    res.status(500).json({ message: "Failed to join waiting list" });
  }
});

// Get the waiting list for a specific place
router.get("/:placeId", async (req, res) => {
  const { placeId } = req.params;

  try {
    const waitingList = await WaitingList.find({ placeId }).sort("createdAt");
    res.status(200).json(waitingList);
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    res.status(500).json({ message: "Failed to fetch waiting list" });
  }
});

// Remove an entry from the waiting list (when a table becomes available)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await WaitingList.findByIdAndDelete(id);
    res.status(200).json({ message: "Removed from waiting list" });
  } catch (error) {
    console.error("Error removing from waiting list:", error);
    res.status(500).json({ message: "Failed to remove from waiting list" });
  }
});

module.exports = router;
