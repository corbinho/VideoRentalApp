const Joi = require('joi');
const express = require('express')
const app = express();

app.use(express.json());

//declare array of objects with the genres
const genres = [{
        id: 1,
        name: "genre 1"
    },
    {
        id: 2,
        name: "genre 2"
    },
    {
        id: 3,
        name: "genre 3"
    }
]

//default get request to return hello world
app.get('/', (req, res) => {
    res.send("Hello world!!!!");
});

//return all the genres
app.get('/api/genres', (req, res) => {
    res.send(genres)
})

//take in the id from the url
app.get('/api/genres/:id', (req, res) => {
    //return the genre object associated with that id, this Find function returns the first in the array that matches the id
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if (!genre) {
        //if that genre doesnt exist, send 404 and return
        res.status(404).send("the genre with the given id was not found");
        return
    } else {
        //return back the genre
        res.send(genre)
    }
})

//post request
app.post('/api/genres', (req, res) => {
    //validate if theres an error in the posting body, else, post the body
    const {error} = validateGenre(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    } else {
        const genre = {
            id: genres.length + 1,
            name: req.body.name,
        };
        genres.push(genre);
        res.send(genre);
    }
})

//update the genre
app.put('/api/genres/:id', (req, res) => {
    //look up genre id
    //if it does not exist, give 404
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if (!genre) {
        res.status(404).send("the genre with the given id was not found");
        return;
    }
    //validate
    //if invalid, give 400
    const {error} = validateGenre(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    //update genre
    genre.name = req.body.name;

    //return updated genre to client
    res.send(genre)
})

//function to validate if the body is valid using Joi
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema)
}

//delete a genre
app.delete('/api/genres/:id', (req, res) => {
    //lookup genre
    //return 404 if doesnt exist
    //get the genre object based on the id input into the url
    const genre = genres.find(c => c.id === parseInt(req.params.id))
    if (!genre) {
        res.status(404).send("the genre with the given id was not found");
        return
    }
    //delete the object that matches the id of of the url input
    const index = genres.indexOf(genre);
    genres.splice(index, 1)
    //return the same genre
    res.send(genre);
})




//PORT variable
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})