const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
//  emon45088
//  uhIYElyREcvMNsiy



const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
const uri = "mongodb+srv://emon45088:jQ4KEnDwdEewSQL7@cluster0.hxrsyqo.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");

    const userCollection = database.collection("user");

    app.get('/user' , async(req , res)=>{
      const curser = userCollection.find();
      const result = await curser.toArray();
      res.send(result);
     })

     app.get('/user/:id' , async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
     })

    app.post('/user' , async(req , res)=>{
        const user = req.body;
        console.log(user)
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.put('/user/:id' , async(req,res)=>{
      const id = req.params.id;
      const user = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert : true}
      const updatedUser ={
        $set :{
          name : user.name,
          email : user.email
        }
      }
      const result = await userCollection.updateOne(filter,updatedUser,options);
      res.send(result);
    })

    app.delete('/user/:id' , async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('SIMPLE CRUD IS RUNNING')
});

app.listen(port,()=>{
    console.log(`SIMPLE CRUD is running port, ${port}`)
})