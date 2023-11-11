import express from 'express';
import { ObjectId } from 'mongodb';
import {client} from './../mongodb.mjs';
const db = client.db("crudop");
const col = db.collection("posts");
let router = express.Router()

router.post('/post', async (req, res, next) => {
    console.log('Create a Post!', new Date());

    if (!req.body.title || !req.body.text) {
        res.status(403).send({message: `Required paramater missing`});
        return;
    };
    
   try{
    const insertPost = await col.insertOne({
    title: req.body.title,
    text: req.body.text,
    author: req.body.decoded.firstName +" " + req.body.decoded.lastName,
    author_id: new ObjectId(req.body.decoded._id),
    createdAt: new Date(),
   });
   console.log("insertPost ", insertPost);
   res.status(200).send({
    message: 'Post created successfully!'
});
}
   catch(e){
    console.log("Error in Mongodb ", e);
    res.status(500).send({message: "Server Error. Try again later!"})
   }
})


router.put('/post/:postId', async(req, res, next) => {
    const postId = new ObjectId(req.params.postId);
    const { title, text } = req.body;

    if (!title || !text) {
        res.status(403).send({message: 'Required parameters missing. Please provide both "title" and "text".'});
        return;
    }

    try {
        const updateResponse = await col.updateOne({ _id: postId }, { $set: { title, text } });

        if (updateResponse.matchedCount === 1) {
            res.send({message:`Post with id ${postId} updated successfully.`});
        } else {
            res.send({message: 'Post not found with the given id.'});
        }
    } catch (error) {
        console.error(error);
    }
})
router.delete('/post/:postId', async (req, res, next) => {
    console.log('Finding a post!', new Date());
    if(!ObjectId.isValid(req.params.postId)){
        res.status(403).send({message: "Post id must be a valid number!!"});
        console.log({message: "Post id doesnot match!"})
        return;
    }
    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) });
        if (deleteResponse.deletedCount === 1) {
            res.send({message: "Post deleted successfully!"});
            console.log({message: `Post with id ${req.params.postId} deleted successfully.`})
        }else {
            console.log({message: "Post not found with the given id."});
            res.status(500).status({message: 'Server Error ! Try again later..'})
        }
    } catch (error) {
        console.error(error);
    }

});

router.delete('/posts/all', async (req, res, next) => {
    try{
        const deleteResponse = await col.deleteMany({});
        if(deleteResponse.deletedCount > 0){
            res.send({message: `All posts deleted successfully!`});
        }else{
            res.send({message: `No posts found to delete!`});
        }}
        catch(e){
            console.log("Error in Mongodb ", e);
            res.status(500).send({message: "Server Error. Try again later!"})
        };
    });
    

export default router