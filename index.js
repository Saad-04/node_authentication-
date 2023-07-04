 import http from 'http';
 import { love } from './module.js';

 const server  = http.createServer((req,res)=>{
         console.log(res.end(`this is ${love()}`))    
 })

 server.listen(5000,()=>{
 console.log("my name is saad")
 })

 const app = express()
 mongoose.connect("mongodb://127.0.0.1:27017", {
                 dbName: "backend",
         }).then(() => console.log("Database Connected")).catch((e) => console.log(e));
        
        //  all middlewares
        app.set("view engine", "ejs")
 app.use(express.static(path.join(path.resolve(), 'public')))
         app.use(express.urlencoded({
         extended: true
 }))
 app.use(cookieParser())
 const isAuthenticated = (req,res,next)=>{
  const token = req.cookies.token
if (token) {
next()
} else {
                res.render("login.ejs")
        }
 }
 app.get('/', isAuthenticated,(req, res) => {
         res.sendStatus(500)}
          res.json({
                  "name": true,
                 "age":23 ,
        })
          const p = path.resolve()
         res.sendFile(path.join(p,'./index.html'))

         res.render('logout')
 })
      email: String,
password: String,
 });

const Message = mongoose.model("Message", userSchema);
// add data in json 
app.get('/user', (req, res) => {
                     res.json(arr) 
                     res.render("user")  
        })
        
      app.post('/', async (rq, rs) => {
                       console.log(rq.body.email)
                       const {
                                     email,
                                       password
                              } = rq.body
                              const done = await Message.create({
                                             email,
                                              password
                                        })
                                     if (done) {
                                                      rs.send('done')
                                                }
                                       })
                                      // login section start here 
                                      app.post('/login', (req, res) => {
                                                      res.cookie("token", "its work", {
                                                                      httpOnly: true,
                                                                      expires: new Date(Date.now() + 60 * 1000)
                                                              });
         res.redirect('/')
 })
 // logout section start here 
app.get('/logout', (req, res) => {
         res.cookie("token", null, {
                 expires: new Date(Date.now())
       });
        res.redirect('/')
})

 app.listen('5000', () => {
        console.log('server start')
 })








import express from "express";
import path from 'path';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
'use strict'
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "faf");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        let user = await User.findOne({ email });


  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password).catch((err)=>{
        console.log(err.message)
  })

  if (!isMatch)
    return res.render("login", { email, name: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "faf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "faf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is working");
});
