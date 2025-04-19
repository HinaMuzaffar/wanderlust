const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLogged } = require("../middleware.js");

//function for server-side validation listingSchema
const validateListing = (req, res, next) => {
  let error = listingSchema.validate(req.body);
  if (error && error.details) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new", isLogged, (req, res) => {
  res.render("listings/new.ejs");
});
// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id.trim();
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route

router.post(
  "/",
  isLogged,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLogged,
  wrapAsync(async (req, res) => {
    const id = req.params.id.trim();
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLogged,
  validateListing,
  wrapAsync(async (req, res) => {
    const id = req.params.id.trim();
    const updatedListing = req.body.listing;
    const existingListing = await Listing.findById(id);
    if (!updatedListing.image || updatedListing.image.trim() === "") {
      updatedListing.image = existingListing.image;
    }
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLogged,
  wrapAsync(async (req, res) => {
    const id = req.params.id.trim();
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
