import axios from '@/utils/axios'
import {
  useAddRemoveToMyList,
  useMessageAlert,
  useMyListIds,
} from '@/utils/contexts'
import { SelectedMovieProps } from '@/utils/types'
import { genericErrorAlert } from '@/utils/validators'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Button,
  CardMedia,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { FunctionComponent as FC } from 'react'

/* 

This modal component opens up when the user selects a movie from the list.
It contains the movie title, genre, description and two buttons: "Watch now",
and "Watch later" (or "Remove from my list").

On large screen sizes it also contains the movie image.

*/

const SelectedMovie: FC<SelectedMovieProps> = ({
  selectedMovie,
  setSelectedMovie,
}) => {
  const { myListIds, setMyListIds } = useMyListIds()
  const { setMoviesRendered, setTotalAmountOfMovies, selectedGenre } =
    useAddRemoveToMyList()
  const { setMessageAlert } = useMessageAlert()
  const nextRouter = useRouter()

  const handleAddOrRemoveMovieMyList = async () => {
    try {
      if (!myListIds.includes(selectedMovie.id)) {
        setMyListIds((previousList) => [...previousList, selectedMovie.id])
        if (selectedGenre === 'My list') {
          setMoviesRendered((previousList) => [...previousList, selectedMovie])
          setTotalAmountOfMovies((previousValue) => previousValue + 1)
        }

        await axios.post(`/myList`, { movieId: selectedMovie.id })
      } else {
        setMyListIds((previousList) =>
          previousList.filter((id) => id !== selectedMovie.id)
        )
        if (selectedGenre === 'My list') {
          setMoviesRendered((previousList) =>
            previousList.filter((movie) => movie.id !== selectedMovie.id)
          )
          setTotalAmountOfMovies((previousValue) => previousValue - 1)
        }

        await axios.delete(`/myList/${selectedMovie.id}`)
      }
    } catch (error) {
      setMessageAlert(genericErrorAlert)
      console.log(error)
    }
  }

  return (
    <>
      <Stack
        direction="row"
        color="primary"
        sx={{
          backgroundColor: '#060606',
          width: { xs: '100%', sm: '100%', md: '500px', lg: '900px' },
          height: { xs: '100%', sm: '100%', md: '600px', lg: '650px' },
        }}
      >
        <CardMedia
          component="img"
          image={`data:image/jpeg;base64,${selectedMovie.image}`}
          sx={{
            display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' },
            height: '100%',
          }}
        />
        <Stack spacing={1} padding={4} width={'100%'}>
          <Button
            sx={{
              position: 'fixed',
              left: '20px',
              display: { md: 'none' },
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
              <Typography paddingBottom={1} color={'primary'}>
                {selectedMovie.genre}
              </Typography>
              <Typography color={'primary'}>
                {selectedMovie.description}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ padding: 0 }}>
            <Stack spacing={2} width={'100%'}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleAddOrRemoveMovieMyList}
              >
                {myListIds && myListIds.includes(selectedMovie.id)
                  ? 'remove from my list'
                  : 'watch later'}
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => nextRouter.push(`/${selectedMovie.id}`)}
                data-cy="watch-button"
              >
                Watch now
              </Button>
            </Stack>
          </DialogActions>
        </Stack>
      </Stack>
    </>
  )
}

export default SelectedMovie
