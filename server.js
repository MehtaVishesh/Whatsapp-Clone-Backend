// importing 
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import Cors from 'cors';

// app config
const app = express();
const port = process.env.port || 9000

const pusher = new Pusher({
    appId: "1278066",
    key: "cae233d07340d41a40ad",
    secret: "5fa0b2eb45f92184e2d0",
    cluster: "ap2",
    useTLS: true,
  });

// middleware
app.use(express.json())
app.use(Cors())

// DB config
const connection_url = `mongodb+srv://admin:u62vzsamA4VxDDKA@cluster0.tma5d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(connection_url, {})
const db = mongoose.connection
db.once('open', ()=> {
    console.log('Database connected');

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => {
        console.log('A change occured', change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            })
        }else{
            console.log('Error triggering Pusher')
        }
    })
})
// ?????

//api routes
app.get('/', (req, res)=>res.status(200).send('hello world'))

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    
    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port, ()=>console.log(`Listening on localhost: ${port}`));
