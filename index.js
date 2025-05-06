const express = require ('express');
const mongoose = require ('mongoose');
const app = express();
const { adminRouter } = require ('./routes/admin')

app.use(express.json());
app.use('/admin', adminRouter)

async function connectDb(){
    mongoose.connect("mongodb+srv://user1:CSA123@cluster0.e4e43lo.mongodb.net/blogwebsite")
    app.listen(3000)
    console.log("app is listening at port 3000")
}

connectDb()