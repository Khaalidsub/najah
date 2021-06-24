const express = require("express");
const router = new express.Router();
const Cart = require("../models/cart");
const passport = require("passport");
const User = require("../models/User");
const isauthenticated = require("../middlewares/checkAuthentication");
const nodemailer = require("nodemailer");
const connectEmail = require("../config/mail");
const equipmentDA = require("../viewModel/equipmentDA");
const paymentDA = require("../viewModel/PaymentDA");
const userDA = require("../viewModel/UserDA");
const PackageDA = require("../viewModel/packagesDA");
const getUserCarts = require("../viewModel/cartDA");

router.get("/", async(req, res) => {
    const equs = await equipmentDA.viewEquipment();
    res.render("Home", { equ: equs });
});
router.get("/loginpage", (req, res) => {
    res.render("login", { error: req.flash("error") });
});

// ! LARGE METHOD
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/loginPage",
        failureFlash: true,
    }),
    async(req, res) => {
        //res.send('you are loggedin as adeen' + req.user.name);

        const profile = req.user;
        profile.password = "";

        const userCart = await getUserCarts(profile.id);

        if (userCart) {
            await profile.populate("cartItems").execPopulate();
            if (profile.cartItems[0].totalItems) {
                req.session.vals = { items: userCart.totalItems };
                res.locals.val = req.session.vals;
            }
        }
        //pages rendering depending on the user roles
        if (profile.role == "user") {
            switch (profile.status) {
                case "pending":
                    req.flash(
                        "pending",
                        "Your application is still being reviewed by the admins."
                    );
                    res.render("member/pendingProfile", {
                        pending: req.flash("pending"),
                        user: profile,
                    });
                    break;
                case "deactivated":
                    req.flash(
                        "deactivated",
                        "Your Account has been deactivated, Would you like to re-apply?"
                    );
                    res.render("login");
                    break;
                default:
                    const payment = await paymentDA.fetchPayments(profile.id);
                    console.log(payment);

                    payment && (await checkPayment(payment, req)); // && is similar to if statement

                    res.redirect("/member/memberProfile");
                    break;
            }
        } else if (profile.role == "admin") {
            res.render("admin/adminProfile", { admin: profile });
        } else {
            console.log(`error, no user role found : ${profile.role}`);
        }
    }
);

const checkPayment = async function(payment, req) {
    if (payment.transactions.length > 0) {
        const sortedTransaction = payment.transactions.reverse();
        const prevDate = new Date(sortedTransaction[0].Date).getTime();
        const currDate = new Date().getTime();
        const differenceTime = currDate - prevDate;
        const differenceDays = differenceTime / (1000 * 3600 * 24);

        console.log(currDate, "  ", prevDate);
        console.log("timeee", differenceDays);

        if (differenceDays > 30) {
            const package = await PackageDA.getPackage(req.user.package);
            const cost = package.price;
            //? problem arising : payment is stil above 30 and he logs in,payment add again
            await paymentDA.updatePayment(req.user.id, cost);
        }
    }
};

router.get("/recoveryPage", (req, res) => {
    res.render("recoveryPage", {
        emailError: req.flash("emailError"),
        emailSuccess: req.flash("emailSuccess"),
    });
});

router.post("/recovery", async(req, res) => {
    const email = req.body.email;
    try {
        const response = await userDA.passwordRecovery(email);
        if (response != null) {
            req.flash("emailError", "Email Does not Exist!");
        } else res.flash("emailSuccess", "Email Does not Exist!");

        req.get("referer");
    } catch (error) {
        console.log(error);
        res.flash("emailError", error);
    }
});

router.get("/logout", isauthenticated, async(req, res) => {
    await req.session.destroy();
    console.log(req.session);
    //delete req.session
    console.log("logged out " + req.user.name);
    res.render("Home");
});

router.get("/attendence/:id", async(req, res) => {
    console.log(req.params.id);
    const user = await userDA.findByCard(req.params.id);
    console.log(user);
    const pay = await paymentDA.findPaymentById(user._id);
    const name = user.name.toString();
    const amount = pay.amount.toString();
    const det = { name, amount };

    res.send(det);
});

module.exports = router;