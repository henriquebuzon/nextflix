import { Router } from "express";
import { getAllMovies, createMovie, updateMovie } from "../controllers/movies";

const router = Router();

router.get("/", getAllMovies).post("/", createMovie).patch("/:id", updateMovie);

export default router;
