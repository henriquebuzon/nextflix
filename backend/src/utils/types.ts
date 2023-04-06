declare global {
  namespace Express {
    export interface Request {
      userIsAdmin: Boolean;
    }
  }
}

export interface decodedToken {
  email: string;
  id: string;
  isAdmin: boolean;
}

export interface CreateMovieRequestData {
  title: string;
  genre: string;
  description: string;
  image: string;
  url: string;
}

export interface GetMoviesRequest extends Request {
  query: {
    page: string;
    perPage: string;
    genre?: string;
  };
}
