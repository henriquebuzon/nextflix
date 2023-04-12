import { Dispatch, SetStateAction } from "react";

export interface User {
  email: string;
  id: string;
  isAdmin: boolean;
  myListIds: string[];
}

export interface Movie {
  id: string;
  title: string;
  url: string;
  genre: string;
  description: string;
  image: string;
}

export interface FormValues {
  title: string;
  url: string;
  genre: string;
  description: string;
  image: File | undefined;
}

export interface LoggedUserContextType {
  loggedUser: User;
}
export interface MyListIdsContextType {
  myListIds: string[];
  setMyListIds: Dispatch<SetStateAction<string[]>>;
}

export interface MoviesListContainerProps {
  moviesRendered: Movie[];
  drawerWidth: number;
  totalAmountOfMovies: number;
  fetchMovies: () => Promise<void>;
}

export interface ResponseDataFromFetchMovies {
  oneSliceOfMovies: Movie[];
  totalAmountOfMovies: number;
}

export interface SidebarProps {
  setSelectedGenre: (value: string) => void;
  selectedGenre: string | null;
  setMoviesRendered: (previousMovies: Movie[]) => void;
  searchTitle: string;
  setSearchTitle: (newSearchTitle: string) => void;
}

export interface AdminPanelProps {
  adminModalIsOpen: boolean;
  handleOpenCloseAdminModal: () => void;
}

export interface SelectedMovieModalProps {
  selectedMovie: Movie;
  setSelectedMovie: (value: Movie | undefined) => void;
}

export interface AdminPanelFormProps {
  selectedAction: string;
}

export interface ResponseDataFromFetchMyListIds {
  moviesIdsFound: string[];
}

export interface AddRemoveToMyListContextType {
  setMoviesRendered: Dispatch<SetStateAction<Movie[]>>;
  setTotalAmountOfMovies: Dispatch<SetStateAction<number>>;
  selectedGenre: string;
}

export interface MessageAlertContextType {
  setMessageAlert: (newMessageAlert: string) => void;
}
