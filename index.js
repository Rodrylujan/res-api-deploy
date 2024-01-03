const express = require('express') // require -> commonJS
const crypto = require('node:crypto')
const cors = require('cors')



const movies = require("./movies.json");
const { validateDateMovie,validateDateMoviePartial } = require("./schemas/movies.js");


const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:8080',
      'https://movies.com'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.use(cors())
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const moviesByGenre = movies.filter((m) =>
      m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(moviesByGenre);
  }

  res.json(movies);
});

app.post("/movies", (req, res) => {
  const result = validateDateMovie(req.body)

  if(result.error){
    return res.status(400).json({error: JSON.parse(result.error.message)})
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req,res) =>{

  const result = validateDateMoviePartial(req.body)

  if(result.error){
    return res.status(404).json({error: JSON.parse(result.error.message)})
  }
  
  const {id} = req.params
  const movieindex = movies.findIndex(movie => movie.id === id)
  if(!movieindex=== -1) return res.status(404).json({message: "there is not movie"})

  const movieUpdate = {...movies[movieindex],...result.data}
  movies[movieindex] = movieUpdate

  res.json(movieUpdate)

})

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);
  res.status(404).json({ message: "No se encontro la pelicula" });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});
