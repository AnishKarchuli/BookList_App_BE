const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./db/db.connect');
const Movie = require('./models/movie.model');

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

app.get("/movies", async (req, res) => {
    try {
        const allMovies = await Movie.find();
        res.json(allMovies);
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/movies", async (req, res) => {
    const { title, director, genre } = req.body;
    try {
        const movieData = new Movie({ title, director, genre });
        await movieData.save();
        res.status(201).json({message: "Movie added successfully."})
    } catch (error){
        res.status(500).json({error: "Internal Server Error"});
    }
});

app.delete("/movies/:id", async (req, res) => {
    const movieId = req.params.id;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if(!deletedMovie){
            return res.status(404).json({error: 'Movie not found'});
        }

        res.status(200).json({
            message: "Movie deleted successfully",
            movie: deletedMovie,
        });
    } catch (error){
        console.log(error);
        res.status(500).json({error: "Internal server error"});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})