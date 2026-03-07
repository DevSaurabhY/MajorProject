import express from "express";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, validateReview, isReviewAuthor, saveRedirectUrl } from "../middleware.js";

const router = express.Router({mergeParams: true});

//add review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id; // connect user to review

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${listing._id}`);
}));

//delete reviews route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    async (req, res, next) => {
    const { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
});

export default router;