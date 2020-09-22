// app/routes.js
module.exports = function(app, passport) {

app.get("/", (req,res) => {
    res.render('index')
})

app.get("/signup", (req,res) => {
    res.render("signup", {message : req.flash("s'inscire")})
})

app.post("/singup", passport.authenticate("local-signup",
{
    successRedirect : "/profile",
    failureRedirect : "/signup",
    failureFlash : true
}
))

app.get("/profile",  isLoggedIn,(req,res) => {
    res.render("profile", {
        user : req.user
    })
})
function isLoggedIn (req, res, next){
    if(req.isAthenticated())
    return next();
    res.redirect("/")
}
}
