import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import path from "path";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import listings from "./routes/listingRoutes.js";
import reviews from "./routes/reviewRoutes.js";
import users from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";

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
app.use(cookieParser("secretKey123"));

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Connection error"));

const sessionOption = {
    secret: "mysecretkey",
    resave:false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60
    }
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make flash available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // res.locals are accesible in ejs template
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  res.locals.redirectUrl = req.session.redirectUrl;

  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

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