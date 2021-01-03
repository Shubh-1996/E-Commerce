const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const helper = require('./helperFunction');
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const User = require("./models/User");
const mongoose = require("mongoose");
const Token = require("./models/Token");
const Product = require("./models/Product");

//connection to db
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(process.env.PORT || 3000, () => console.log("Mongoose Server Up and running"));
})
// Register with JWT token
app
    .route("/register")
    .post(async (req, res) => {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            address : req.body.address,
             userType : req.body.userType,
        });
        try {
            User.find({ email: req.body.email }, async (err, obj) => {
                if (obj.length) {
                    res.send("Email already exist")
                } else {
                    await user.save();
                    console.log("registered");
                    const tok = helper.generateJWTToken(req.body.email);
                    console.log("user saved and token ", tok);
                    const token = new Token({
                        email: req.body.email,
                        token: tok,
                        userType : req.body.userType,
                    });
                    token.save();
                    res.json({
                        "data": {
                            "token": tok
                        }
                    });
                }
            })
        } catch (err) {
            console.log("inside catch", err);
            res.send({ "error": err });
        }
    });

  //  console.log(process.env.TOKEN_SECRET);
// console.log(require('crypto').randomBytes(64).toString('hex'));

// Login 

app
    .route("/login")
    .post(async (req, res) => {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
        });
        try {
    
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const validate = helper.genricJWTValidator(token);
            const tok = helper.generateJWTToken(req.body.email);
            let result;
            if(validate){
               result = res.json({"data": {
                "token": tok
                }})
            } else {
                console.log("token is not passed so checking from token table");
                Token.find({ email: req.body.email }, async( err,obj) => {
                        console.log(obj);
                        if(obj.length>0) {

                            result = res.json({"data": {
                                "token": tok
                            }})
    
                        } else{
                            result = res.sendStatus(403);
    
                        }
                    } )
            } 
            console.log("result ", result);
            return result;
        } catch (err) {
            res.send({ "error": err });
        }
    });

    //Product add 

    app
    .route("/product")
    .post(async (req, res) => {
        // console.log("req.body ", req)
        const product = new Product({
            itemCost: req.body.itemCost,
            itemName: req.body.itemName,
            sellerName: req.body.sellerName,
        });
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            console.log("token ", token);
            const response = helper.genricJWTValidator(token);
            console.log("response ", response);
            if (response) {
                Object.assign(product, { userEmail: response })
                product.save();
                res.send("Product saved");
            } else if (response === null) {
                res.send("token required")
            } else {
                res.send("Invalid token")
            }
        } catch (err) {
            res.send({ "error": err });
        }
    })