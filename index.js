let express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const sanitizeHtml = require('sanitize-html');


let app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const uri = "mongodb+srv://amojabbari:ilonatoth@cluster0.3ajb0df.mongodb.net/todo?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function run() {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    //spot the wanted collection
    var myDB = await client.db();
    
    //fetch all docs & log them
    app.get("/", async (req, res) => {
        const docs = await myDB.collection('articles').find().toArray();       
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Simple To-Do App</title>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
                </head>
            <body>
            <div class="container">
                <h1 class="display-4 text-center py-1">To-Do App</h1>
                
                <div class="jumbotron p-3 shadow-sm">
                <form>
                    <div class="d-flex align-items-center">
                    <input name="title" id="insert-txt" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                    <button class="btn btn-primary insert-btn">Add New Item</button>
                    </div>
                </form>
                </div>
                
                <ul class="list-group pb-5" id="myList">
                    ${
                        docs.map(item => {
                            return `
                            <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                                <span class="item-text">${item.title}</span>
                                <div>
                                <button data-itemid="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                                <button data-itemid="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                                </div>
                            </li>`
                        }).join("")
                    }
                </ul>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
            <script src="/main.js"></script>
            </body>
            </html>
        `);
    });
        
    //Add record
    app.post('/add-item', async (req, res) => {
        let safeText = sanitizeHtml(req.body.title, {allowedTags: [], allowedAttributes: {} });
        let result = await myDB.collection('articles').insertOne({title: safeText})
        res.send(result);
    })

    app.post('/update', (req, res)=>{
        let safeText = sanitizeHtml(req.body.title, {allowedTags: [], allowedAttributes: {} });
        myDB.collection('articles').findOneAndUpdate(
            { _id: new ObjectId(req.body.id) }, // filter
            { $set: { title: safeText } }
          );
          
        res.send('Update ok')
    })

    app.post('/delete-item', (req, res)=>{
        myDB.collection('articles').findOneAndDelete(
            { _id: new ObjectId(req.body.id) }
        );
          
        res.send('Delete ok')
    })
}

run();

app.listen(3000)



