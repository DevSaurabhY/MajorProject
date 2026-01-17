import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";

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
    res.send("I am root!");
});

//show all listings
app.get("/listings", async(req, res) => {
    const lists = await Listing.find();
    res.render("listings/index", {lists});
});

//create new listing (render form)
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

//add new listing to db
app.post("/listings", async (req, res) => {
    // const {title, description, image, price, location, country} = req.body; or
    const newListing = new Listing(req.body.listing)    
    await newListing.save();
    res.redirect("/listings");
});

//show listing details
app.get("/listings/:id", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {
        listing, 
        formatPrice: (p) => p.toLocaleString("en-IN")});
});

//update listing(render form)
app.get("/listings/:id/edit", async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});

//update listing
app.put("/listings/:id", async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete listing
app.delete("/listings/:id", async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
});