import express from "express";
import User from "../models/user.js";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import { saveRedirectUrl } from "../middleware.js";

const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync (async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
    
    req.login(registeredUser, (err) => { // Automatically login after signup

        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wandelust!");
        res.redirect("/listings");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
    res.render("users/logout");
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", "Logged You Out");
        res.redirect("/listings");
    });
});

export default router;