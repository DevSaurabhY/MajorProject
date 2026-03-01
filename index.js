import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import {listingSchema,reviewSchema} from "./schema.js";
import Review from "./models/reviews.js";

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Connection error"));

// const list1 = new listing({
//     title: "New Garava",
//     description: "Pure Veg",
//     // image: "www.image.com",
//     price: 2980,
//     location: "lan:983524, lat:365199",
//     country: "India"
// });
// await list1.save();

app.get("/", (req, res) => {
    res.redirect("/listings");
});

//show all listings
app.get(
    "/listings", 
    wrapAsync( async(req, res) => {
    const lists = await Listing.find();
    res.render("listings/index", {lists});
}));

//create new listing (render form)
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//add new listing to db
app.post(
  "/listings", 
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);


//show listing details
app.get(
    "/listings/:id", 
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", {
        listing, 
        formatPrice: (p) => p.toLocaleString("en-IN")});
}));

//update listing(render form)
app.get(
    "/listings/:id/edit", 
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
}));

//update listing
app.put(
    "/listings/:id", 
    validateListing,
    wrapAsync( async (req, res) => {

    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete listing
app.delete(
    "/listings/:id", 
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//add review
app.post(
    "/listings/:id/reviews",
    validateReview,
    wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//delete reviews route
app.delete("/listings/:id/reviews/:reviewId", async (req, res, next) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  // Delete review document
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
});

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


//custom error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error", {message});
})

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});