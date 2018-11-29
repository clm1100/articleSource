const express = require('express');
const app = express();
const path = require('path');

// app.set('etag', false);
app.use(express.static("./"))
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'ajax缓存.html'));
    // res.send("12345");
})

app.get("/tt",(req,res)=>{
    // console.log(req.headers);
    console.log(req.header("Cookie"));
    res.send("123");
})

app.listen(3000,()=>{
    console.log("running");
})