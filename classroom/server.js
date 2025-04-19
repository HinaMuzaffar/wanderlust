const express = require("express");
const app = express();

app.get("/" , (req,res) => {
    res.send("Hi, I am root!");
});

//Index Route 
app.get("/users" , (req,res) => {
    res.send("get for users");
});

//show route 
app.get("/users/:id" , (req,res) => {
    res.send("get for user id");
});

//Post route 
app.post("/users" , (req,res) => {
    res.send("POST for users");
});

//Delete route 
app.delete("/users/:id" , (req,res) => {
    res.send("Delete for user id");
});


app.listen(3000 , () => {
    console.log("server is listening to 3000");
});