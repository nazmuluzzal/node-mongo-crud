const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const password = "2PBs2NsfB8jvBerP";

// ?? Mongo DB
const uri =
  "mongodb+srv://organicUser:2PBs2NsfB8jvBerP@cluster0.dtkkw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
// ?? parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ?? Mongo DB

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");
  // perform actions on the collection object

  //   const product = { name: "modhu", price: 100, quantity: 50 };

  // ?? for create one product in DB
  // app.post("/addProduct", (req, res) => {
  //   productCollection.insertOne(product).then((result) => {
  //     console.log("one product added");
  //   });
  // });

  //
  // ?? save (create) data in DB and read all data

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    //console.log(product);
    productCollection.insertOne(product).then((result) => {
      console.log("Product added successfully");
      // res.send("sucess");
      res.redirect("/");
    });
  });

  //
  // ?? read data from DB
  app.get("/products", (req, res) => {
    productCollection
      .find({})
      // .limit(4)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  // ?? Load Single Product from DB
  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // ? Update or Modify
  app.patch("/update/:id", (req, res) => {
    // console.log(req.body.price);
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        // console.log(result);
        res.send(result.modifiedCount > 0);
      });
  });

  // ?? delete data
  app.delete("/delete/:id", (req, res) => {
    // console.log(req.params.id);
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        // console.log(result);
        res.send(result.deletedCount > 0);
      });
  });

  //
  //   collection.insertOne(product).then((result) => {
  //     console.log("one product added");
  //   });
  console.log("database connected");
  //   client.close();
});

app.listen(3000);
