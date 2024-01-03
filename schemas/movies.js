const z = require("zod");

const movieSchema = z.object({
  title: z.string(),
  director: z.string(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  poster: z.string().url(),
  genre: z.array(
    z.enum([
      "Fantasy",
      "Biography",
      "Animation",
      "Romance",
      "Crime",
      "Sci-Fi",
      "Adventure",
      "Crime",
      "Action",
      "Drama",
    ])
  ),
});

function validateDateMovie(objectMovie) {
  return movieSchema.safeParse(objectMovie);
}

function validateDateMoviePartial(objectMovie){
  return movieSchema.partial().safeParse(objectMovie)
}

module.exports = { validateDateMovie,validateDateMoviePartial };
