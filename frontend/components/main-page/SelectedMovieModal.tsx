import theme from "@/MUITheme/theme";
import { SelectedMovieModalProps } from "@/utils/types";
import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FunctionComponent as FC } from "react";
import { useMyListIds } from "@/utils/contexts";
import axios from "@/utils/axios";

const SelectedMovieModal: FC<SelectedMovieModalProps> = ({
  selectedMovie,
  setSelectedMovie,
}) => {
  const { myListIds, setMyListIds } = useMyListIds();

  const handleAddOrRemoveMovieMyList = async () => {
    try {
      if (!myListIds.includes(selectedMovie.id)) {
        setMyListIds((previousList) => [...previousList, selectedMovie.id]);
        await axios.post(`/myList`, { movieId: selectedMovie.id });
      } else {
        setMyListIds((previousList) =>
          previousList.filter((id) => id !== selectedMovie.id)
        );
        await axios.delete(`/myList/${selectedMovie.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {selectedMovie && (
        <Dialog
          open={Boolean(selectedMovie)}
          onClose={() => setSelectedMovie(undefined)}
          maxWidth={false}
          fullScreen={isExtraSmallScreen}
        >
          <Stack
            direction="row"
            color="primary"
            sx={{
              backgroundColor: "black",
              width: { xs: "100%", sm: "100%", md: "500px", lg: "900px" },
              height: { xs: "100%", sm: "100%", md: "600px", lg: "650px" },
            }}
          >
            <CardMedia
              component="img"
              image={`http://localhost:80/${selectedMovie.image}`}
              sx={{
                height: "100%",
                display: { xs: "none", sm: "none", md: "none", lg: "block" },
              }}
            />

            <Stack spacing={1} padding={4}>
              <Button
                sx={{
                  position: "fixed",
                  left: "20px",
                  display: { md: "none" },
                }}
                onClick={() => setSelectedMovie(undefined)}
                disableRipple
              >
                <ArrowBackIcon />
              </Button>

              <DialogContent
                sx={{ padding: 1, paddingTop: { xs: 8, sm: 8, md: 0 } }}
              >
                <Stack spacing={1}>
                  <Typography gutterBottom variant="h5" component="div">
                    {selectedMovie.title}
                  </Typography>
                  <Typography paddingBottom={1} color={"primary"}>
                    {selectedMovie.genre}
                  </Typography>
                  <Typography color={"primary"}>
                    {selectedMovie.description}
                  </Typography>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ padding: 0 }}>
                <Stack spacing={2} width={"100%"}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={handleAddOrRemoveMovieMyList}
                  >
                    {myListIds.includes(selectedMovie.id)
                      ? "remove from my list"
                      : "watch later"}
                  </Button>
                  <Button fullWidth variant="contained" color="secondary">
                    watch now
                  </Button>
                </Stack>
              </DialogActions>
            </Stack>
          </Stack>
        </Dialog>
      )}
    </>
  );
};

export default SelectedMovieModal;
