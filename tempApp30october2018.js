require('dotenv').config();
var express         =require("express"),
    mongoose        =require("mongoose"),
    methodOverride  =require("method-override")
    passport        =require("passport"),
    LocalStrategy   =require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose")
    User            =require("./models/user"),
    LostItem        =require("./models/lost.js"),
    FoundItem       =require("./models/found.js"),
    everyauth       =require("everyauth"),
    middleware      =require("./middleware/middleware.js"),
    Comment         =require("./models/comment"),
    GoogleStrategy  =require('passport-google-oauth').OAuth2Strategy,
    findOrCreate    =require("mongoose-findorcreate"),
    moment          =require("moment"),
    bodyParser      =require("body-parser"),
    flash           =require("connect-flash")

    
var app=express();
app.use(methodOverride("_method"));
app.use(flash());

var itemsRoute=require("./routes/items"),
    indexRoute=require("./routes/index"),
    commentRoute=require("./routes/comment")

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
// mongoose.connect("mongodb://localhost/findDTU",{ useNewUrlParser: true });
 mongoose.connect("mongodb://ashish1:ashish1@ds143593.mlab.com:43593/fmsdtu",{ useNewUrlParser: true });


app.use(require("express-session")({
    secret:"Session for Find My Stuff DTU",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next)
{
    // req.locals.currentUser=req.user;
    res.locals.currentUser=req.user;
    res.locals.ADMIN_SECRET_KEY=process.env.ADMIN_SECRET_KEY;
    res.locals.success= req.flash("success");
    res.locals.error  =req.flash("error");
    res.locals.info   =req.flash("info");
    next(); // this turns on the middle ware
});

// IMPORTANT NOTE -- DO NOT DELETE

// USE THE CURRENT USER ROUTE AFTER APP.USE (PASSPORT) AND BEFOOOOOORE APP.USE (ITEMS ROUTE)
// REFER https://www.udemy.com/the-web-developer-bootcamp/learn/v4/t/lecture/3861700?start=0

app.use(itemsRoute);
app.use(indexRoute);
app.use(commentRoute);

app.listen(process.env.PORT,process.env.IP)
{
    // killall -9 node    Use this in Terminal if the port 3000 is 
    //                    occupied


    console.log("The FindMyStuff server has started!");
};




