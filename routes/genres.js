const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

//store the schema
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 50
    }
})

const Genre = mongoose.model('Genre', genreSchema);

//return all the genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

//post request
router.post('/', async (req, res) => {
    //validate if theres an error in the posting body, else, post the body
    const {
        error
    } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({name: req.body.name});
    genre = await genre.save()
    res.send(genre);

})

//take in the id from the url
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    //return the genre object associated with that id, this Find function returns the first in the array that matches the id
    if (!genre) {
        //if that genre doesnt exist, send 404 and return
        res.status(404).send("the genre with the given id was not found");
        return
    } else {
        //return back the genre
        res.send(genre)
    }
})

//update the genre
router.put('/:id', async (req, res) => {
    const {
        error
    } = validateGenre(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {
        new: true
    })
    //look up genre id
    //if it does not exist, give 404
    if (!genre) {
        res.status(404).send("the genre with the given id was not found");
        return;
    }

    //return updated genre to client
    res.send(genre)
})

//delete a genre
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    //lookup genre
    //return 404 if doesnt exist
    //get the genre object based on the id input into the url
    if (!genre) {
        res.status(404).send("the genre with the given id was not found");
        return
    }
    //return the same genre
    res.send(genre);
})

//function to validate if the body is valid using Joi
function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(genre, schema)
}

module.exports = router;