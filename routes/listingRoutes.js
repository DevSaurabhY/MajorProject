import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, validateListing, isListingOwner } from "../middleware.js";

const router = express.Router();

//show all listings
router.get(
    "/", 
    wrapAsync( async(req, res) => {
    const lists = await Listing.find();

    res.render("listings/index", {lists});
}));

//create new listing (render form)
router.get("/new", 
    isLoggedIn,
    (req, res) => {
    res.render("listings/new");
});

//add new listing to db
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;  // connect Listing to user

    await newListing.save();

    req.flash("success", "listing added successfully!")
    res.redirect("/listings");
  })
);


//show listing details
router.get(
    "/:id",
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate ({path: "reviews",
            populate: {path: "author"}
    });

    if (!listing) {
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", {
        listing, 
        formatPrice: (p) => p.toLocaleString("en-IN")});
}));

//update listing(render form)
router.get(
    "/:id/edit", 
    isLoggedIn,
    isListingOwner,
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "listing you requested for update does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", {listing});
}));

//update listing
router.put(
    "/:id", 
    isLoggedIn,
    isListingOwner,
    validateListing,
    wrapAsync( async (req, res) => {

    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "listing updated successfully!");

    res.redirect(`/listings/${id}`);
}));

//delete listing
router.delete(
    "/:id", 
    isLoggedIn,
    isListingOwner,
    isListingOwner,
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "listing deleted successfully!");

    res.redirect("/listings");
}));

export default router;
