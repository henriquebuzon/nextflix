import axios from "@/utils/axios";
import { User } from "@/utils/types";
import validateEmail from "@/utils/validateEmail";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import * as React from "react";
import { FunctionComponent as FC, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type LoginFormProps = {
  toggleSelectedForm: () => void;
};

const LoginForm: FC<LoginFormProps> = ({ toggleSelectedForm }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const nextRouter = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString() as string;

    const emailIsValid = validateEmail(email, setError, setLoading);
    if (!emailIsValid) return;

    try {
      await axios.post("/auth", {
        email,
        password,
      });
    } catch (error) {
      console.log(error, "Invalid credentials");
      setLoading(false);
      setError("Invalid credentials");
      return;
    }

    setLoading(false);
    setError("");
    nextRouter.push("/");
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        align="left"
        marginTop={4}
        marginBottom={1}
      >
        Welcome back
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="dense"
          required
          fullWidth
          label="Email Address"
          name="email"
          size="small"
          type="email"
          helperText={error === "Invalid email address" && error}
          error={
            error === "Invalid email address" || error === "Invalid credentials"
          }
          disabled={loading}
        />
        <TextField
          margin="dense"
          required
          fullWidth
          label="Password"
          type="password"
          name="password"
          size="small"
          helperText={error === "Invalid credentials" && error}
          error={error === "Invalid credentials"}
          disabled={loading}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
          }}
          color="secondary"
          disabled={loading}
        >
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Typography
              variant="body2"
              onClick={toggleSelectedForm}
              style={{
                cursor: "pointer",
                color: "#87CEFA",
              }}
            >
              Don't have an account? Sign Up
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Toaster />
    </>
  );
};

export default LoginForm;
