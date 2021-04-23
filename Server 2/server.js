const express = require('express');
const app = new express();
var redis = require('redis');
var client = redis.createClient(6379, '54.196.251.70');
var sha1 = require('sha1');

const MongoClient = require('mongodb').MongoClient;
const DB_URI = 'mongodb+srv://root:1234@cluster0.a9nae.mongodb.net/labso1?retryWrites=true&w=majority';

var db;
MongoClient.connect(DB_URI, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("labso1");
});
  

app.use(express.json({ limit: '5mb', extended: true }));

app.post('/', async (req, res) => {
    const data = req.body;
    data['second'] = 'Server 2'
    let result = {};
    try {
        var hash = sha1(JSON.stringify(data));
        data['hash'] = hash;
        let collection = db.collection("estudiantes");
        let result = await collection.insertOne(data);
        client.set(hash, JSON.stringify(data));
        res.json(result.ops[0]);
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ 'message': 'failed' });
    }
});

app.get('/', (req, res) => {
    res.json({message: 'OK'})
});

app.listen(5000);