import {listingSchema,reviewSchema} from "./schema.js";
import ExpressError from "./utils/ExpressError.js";
import Review from "./models/reviews.js";
import Listing from "./models/listing.js";

export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl; // save URL

        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

export const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// export const isReviewAuthor = async (req, res, next) => {
//     const review = await Review.findById(req.params.reviewId);

//     if(!review.author.equals(req.session.userId)){
//         req.flash("error", "You are not authorized!");
//         return res.redirect("back");
//     }
//     next();
// };

export const isListingOwner = async (req, res, next) => {
    const {id} = req.params;

    const listing = await Listing.findById(id);

    if(!listing.owner || !listing.owner.equals(req.user._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

export const isReviewAuthor = async (req, res, next) => {

  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};