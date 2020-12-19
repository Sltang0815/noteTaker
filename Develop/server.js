//Dependencies (Day 2 > 14) 
const fs = require("fs");
const express = require("express");
const path = require("path");
let db = require("./db/db.json")
const shortid = require('shortid');

console.log(shortid.generate());
// Setting up the Express App (Day 2 > 14)
let app = express();

//This allows you to get the port from the bound environment variable (using process.env.PORT) if it exists, so that when your app starts on heroku's machine it will start listening on the appropriate port. 
let PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//Routes GET, POST, and DELETE
// Example line 45 (day 2 > 14 FinalStarwarsApp)

// GET `/notes` - Should return the `notes.html` file.
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// GET `*` - Should return the `index.html` file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.json(db);
});

//POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
// create a new character example in (day 2 > 14 FinalStarwarsApp )
app.post("/api/notes", function (req, res) {
    let newNote = {
        id: shortid.generate(),
        title: req.body.title,
        text: req.body.text
    };
    console.log(req.body);

    console.log(newNote);
    db.push(newNote)
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
        if (err) throw err;
        return res.json(db);
    });

});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", function (req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        let reWrite = JSON.parse(data);
        console.log(reWrite);
        console.log(req.params)
        reWrite = reWrite.filter(item => item.id !== req.params.id);

        console.log(reWrite);
        fs.writeFile("./db/db.json", JSON.stringify(reWrite), (err) => {
            if (err) throw err;
            // res.json(reWrite)
        });
        res.json({ ok: true });
    });


    // return res.json(db);
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT, http://localhost:" + PORT);
});