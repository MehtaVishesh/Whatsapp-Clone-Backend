// importing 
import express from 'express';
import mongoose from 'mongoose';

// app config
const app = express();
const port = process.env.PORT || 9000;

// middleware

// DB config
const connection_url = 'mongodb+srv://admin:53VEmpDyB95GGeaH@cluster0.h86nu.mongodb.net/whatsappdb?retryWrites=true&w=majority';
mongoose.connect(connection_url);

// ?????

//api routes
app.get("/", (req, res) => res.status(200).send('hello world'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`));