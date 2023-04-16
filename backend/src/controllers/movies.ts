import { Request, Response } from "express";
import prisma from "../../prisma/client";
import tryCatch from "../error-handling/tryCatch";
import { CreateUpdateMovieRequestBody } from "../utils/types";
import CustomError from "../error-handling/customError";
import {
  allowedGenres,
  validateMovie,
  validateSkip,
} from "../utils/validators";
import { getBase64Image } from "../utils/multer";

export const getMovies = tryCatch(async (req: Request, res: Response) => {
  const genre = req.query.genre?.toString();
  if (genre && !allowedGenres.includes(genre))
    throw new CustomError("Invalid genre", 400);

  const skip = validateSkip(req.query.skip);

  const title = req.query.title?.toString();

  const oneSliceOfMoviesRaw = await prisma.movie.findMany({
    where: {
      AND: [
        genre ? { genre } : {},
        title ? { title: { contains: title, mode: "insensitive" } } : {},
      ],
    },
    skip,
  });

  if (oneSliceOfMoviesRaw.length === 0) return res.sendStatus(204);

  const totalAmountOfMovies = await prisma.movie.count({
    where: {
      AND: [
        genre ? { genre } : {},
        title ? { title: { contains: title, mode: "insensitive" } } : {},
      ],
    },
  });

  const oneSliceOfMovies = oneSliceOfMoviesRaw.map((movie) => {
    const base64Image = movie.image.toString("base64");
    return { ...movie, image: base64Image };
  });

  res.status(200).json({ oneSliceOfMovies, totalAmountOfMovies });
});

export const createMovie = tryCatch(async (req: Request, res: Response) => {
  const { title, url, description, genre }: CreateUpdateMovieRequestBody =
    req.body;
  const image = req.file?.buffer;

  if (!title || !url || !genre || !description || !image)
    throw new CustomError("All fields are required", 400);

  validateMovie({ title, url, genre, description });

  await prisma.movie.create({
    data: {
      title,
      genre,
      description,
      image,
      url,
    },
  });

  res.sendStatus(201);
});

export const updateMovie = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw new CustomError("A movie id is required", 400);

  const { title, url, genre, description }: CreateUpdateMovieRequestBody =
    req.body;
  const image: Buffer = req.body.buffer;

  if (!title && !url && !genre && !description && !image)
    throw new CustomError("No changes to be made", 400);

  validateMovie({ title, url, genre, description });

  const updatedMovie = await prisma.movie.update({
    where: {
      id,
    },
    data: {
      title,
      url,
      genre,
      description,
      image,
    },
  });

  res.status(200).json(updatedMovie.title);
});

export const getMovieById = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw new CustomError("A movie id is required", 400);

  const movieFound = await prisma.movie.findUnique({
    where: { id },
  });

  if (!movieFound) return res.sendStatus(204);

  const base64Image = movieFound.image.toString("base64");

  res.status(200).json({ ...movieFound, image: base64Image });
});

export const deleteMovie = tryCatch(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw new CustomError("A movie id is required", 400);

  await prisma.movie.delete({
    where: {
      id,
    },
  });

  res.sendStatus(204);
});
