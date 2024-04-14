const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect("mongodb+srv://jitovi308:8H2MOARcsu5ULE6b@clusterdb.0jqayvy.mongodb.net/Node-API?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// Define Schema and Model
const itemSchema = new mongoose.Schema({
    name: String,
    age : Number,
    hobbies: String
});
const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/items', async (req, res) => {
    console.log(req.body);
    const item = new Item({
        name: req.body.name,
        age: req.body.age,
        hobbies:req.body.hobbies
    });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/items/:id', getItem, (req, res) => {
    res.json(res.item);
});

app.put('/api/items/:id', getItem, async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
        
    }
    if (req.body.age != null) {
        res.item.age = req.body.age;
    }
    if (req.body.hobbies != null) {
        res.item.hobbies = req.body.hobbies;
    }

    
    try {
        const updatedItem = await res.item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/items/:id', getItem, async (req, res) => {
    try {
        const {id} = req.params;
        await Item.findByIdAndDelete({_id : id})
        res.json({ message: 'Deleted item' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({ message: 'Cannot find item' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.item = item;
    next();
}

// Start Server
// app.listen(3000, () => {
//     console.log(`Server is running on port ${3000}`);
// });
