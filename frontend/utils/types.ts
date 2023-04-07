export interface User {
  email: string;
  id: string;
  isAdmin: boolean;
}

export interface Movie {
  id: string;
  title: string;
  url: string;
  genre: string;
  description: string;
  image: string;
}

export interface formValues {
  title: string;
  url: string;
  genre: string;
  description: string;
  image: File | undefined;
}

export interface LoggedUserContextType {
  loggedUser: User;
}

export interface MoviesListProps {
  moviesList: Movie[];
  drawerWidth: number;
}
