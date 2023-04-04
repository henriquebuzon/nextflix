import axios from "@/pages/api/axios";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FunctionComponent as FC, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CreateMovieForm: FC = () => {
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setImage] = useState<File | null>(null);

  const handleChangeGenre = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGenre(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 1024 * 1024 || file.type !== "image/jpeg") {
        console.log("erro");

        toast.error("Image must be jpeg only and 1 MB max");
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString();
    const url = formData.get("url")?.toString();
    const description = formData.get("description")?.toString();

    if (!title || !url || !genre || !description || !uploadedImage) {
      throw new Error("errou");
    }

    formData.append("genre", genre);
    formData.append("image", uploadedImage);

    console.log(formData);

    try {
      await axios.post("/movies", formData);
      toast.success("New movie created");
    } catch (error) {
      toast.error("Error creating movie");
    }
  };

  return (
    <>
      <Toaster />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField required label="Title" size="small" name="title" />
          <TextField required label="URL" size="small" name="url" />

          <TextField
            required
            select
            label="Genre"
            size="small"
            value={genre}
            onChange={handleChangeGenre}
          >
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
          </TextField>

          <TextField
            required
            multiline
            label="Description"
            name="description"
            id="outlined-multiline-static"
            rows={3}
          />
          {uploadedImage && (
            <Typography color={"primary"}>
              Image uploaded: {uploadedImage.name}
            </Typography>
          )}
          <Button variant="outlined" component="label">
            Upload image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
          </Button>

          <Button variant="contained" type="submit">
            Create movie
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default CreateMovieForm;
