const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const blogCollection = client.db("blogApp").collection("blogs");

    // get 5 recent blogs
    app.get("/recentBlogs", async (req, res) => {
      const result = await blogCollection
        .find()
        .sort({ _id: -1 })
        .limit(4)
        .toArray();
      res.send(result);
    });

    // get 3 recent app category blogs
    app.get("/recentBlogsApps", async (req, res) => {
      const query = { category: "Apps" };
      const result = await blogCollection
        .find(query)
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      res.send(result);
    });

    // get recent one hero blog
    app.get("/recentHeroBlog", async (req, res) => {
      const result = await blogCollection
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
      res.send(result);
    });

    // get recent technology blogs
    app.get("/recentTechnologyBlog", async (req, res) => {
      const query = { category: "Technology" };
      const result = await blogCollection
        .find(query)
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      res.send(result);
    });

    // get recent gadget blogs
    app.get("/recentGadgetBlogs", async (req, res) => {
      const query = { category: "Gadget" };
      const result = await blogCollection
        .find(query)
        .sort({ _id: -1 })
        .limit(2)
        .toArray();
      res.send(result);
    });

    // get single job in blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(`${id}`) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    // similar blogs
    app.get("/similarBlogs/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await blogCollection
        .find(query)
        .sort({ _id: -1 })
        .limit(2)
        .toArray();
      res.send(result);
    });

    // update blog with comments
    app.put("/addComment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const comment = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $push: {
          comments: comment,
        },
      };
      const result = await blogCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    //add blog data to database
    app.post("/addBlog", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    // user specific blogs
    app.get("/userBlogs/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    });

    // get all category wise blogs
    app.get("/categoryBlogs/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const result = await blogCollection.find(query).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Blog app is running");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
