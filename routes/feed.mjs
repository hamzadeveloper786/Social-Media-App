import express from 'express';
let router = express.Router();
import {client} from './../mongodb.mjs';
const db = client.db("crudop");
const col = db.collection("posts");

router.get('/feeds', async (req, res, next) => {
    console.log('Get all feeds!', new Date());
    const cursor = col.find({})
        .sort({_id:-1})
        .limit(100);
    try{
        let results = await cursor.toArray();
        console.log("results: ", results);
        res.send(results);
    }catch(e){
        console.log("Error in Mongodb ", e);
        res.status(500).send({message: "Server Error. Try again later!"})
    }
})


export default router