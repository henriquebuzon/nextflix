import axios from '@/utils/axios'
import {
  passwordErrorToBoolean,
  usernameErrorToBoolean,
  usernameHelperTextToBoolean,
  validateCredentialsLength,
  validatePasswordsMatch,
} from '@/utils/validators'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  CardMedia,
  Container,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { NextPageContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import React, { useEffect, useState } from 'react'

export async function getServerSideProps(context: NextPageContext) {
  const { ['accessToken-Nextflix']: accessToken } = parseCookies(context)

  if (accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return { props: { userIsLoggedIn: true } }
}

const Auth = () => {
  const [selectedForm, setSelectedForm] = useState('Sign in')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [helperText, setHelperText] = useState('')
  const [loading, setLoading] = useState(false)
  const nextRouter = useRouter()

  useEffect(() => resetStates(), [selectedForm])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!username) {
      setHelperText(
        `Please enter ${selectedForm === 'Sign in' ? 'your' : 'a'} username`
      )
      setLoading(false)
      return
    }

    const credentialsLengthIsValid = validateCredentialsLength(
      username,
      password,
      selectedForm,
      setHelperText,
      setLoading
    )
    if (!credentialsLengthIsValid) return

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    if (selectedForm === 'Sign in') {
      try {
        const response = await axios.post('/auth', {
          username,
          password,
        })
      } catch (error) {
        console.log(error)
        setLoading(false)
        setHelperText('Invalid credentials')
        return
      }
    }

    if (selectedForm === 'Sign up') {
      formData.append('password-confirm', passwordConfirm)

      const passwordsMatch = validatePasswordsMatch(
        password,
        passwordConfirm,
        setHelperText,
        setLoading
      )
      if (!passwordsMatch) return

      try {
        const response = await axios.post('/users', {
          username,
          password,
        })

        console.log(response)
        await axios.post('/auth', {
          username,
          password,
        })
      } catch (error: any) {
        if (error.response?.status === 409) {
          setHelperText('Username unavailable')
        } else {
          console.log(error)
          setHelperText('Invalid credentials')
        }

        setLoading(false)
        return
      }
    }

    nextRouter.push('/')
  }

  const resetStates = () => {
    setHelperText('')
    setLoading(false)
    setUsername('')
    setPassword('')
    setPasswordConfirm('')
  }

  return (
    <>
      <Head>
        <title>Login - Nextflix</title>
      </Head>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/images/Logo1.png"
            alt="Logo"
            style={{
              marginTop: 60,
              marginBottom: 80,
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
            width={245}
            height={245}
            priority={true}
          />

          <Typography component="h1" variant="h4" alignSelf="flex-start">
            {selectedForm === 'Sign in'
              ? 'Welcome back'
              : 'Create your account'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="dense"
              required
              fullWidth
              label="Username"
              name="username"
              size="small"
              type="username"
              helperText={usernameHelperTextToBoolean(helperText) && helperText}
              error={usernameErrorToBoolean(helperText)}
              disabled={loading}
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUsername(event.target.value)
              }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              label="Password"
              type="password"
              name="password"
              size="small"
              helperText={
                selectedForm === 'Sign in' &&
                passwordErrorToBoolean(helperText) &&
                helperText
              }
              error={passwordErrorToBoolean(helperText)}
              disabled={loading}
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(event.target.value)
              }}
            />
            {selectedForm === 'Sign up' && (
              <TextField
                margin="dense"
                required
                fullWidth
                label="Confirm password"
                type="password"
                size="small"
                name="password-confirm"
                error={passwordErrorToBoolean(helperText)}
                helperText={passwordErrorToBoolean(helperText) && helperText}
                disabled={loading}
                value={passwordConfirm}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPasswordConfirm(event.target.value)
                }}
              />
            )}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                my: 1,
              }}
              color="secondary"
              loading={loading}
              data-cy="sigin-button"
            >
              {selectedForm}
            </LoadingButton>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography
                variant="body2"
                onClick={() =>
                  !loading &&
                  setSelectedForm((currentForm) =>
                    currentForm === 'Sign in' ? 'Sign up' : 'Sign in'
                  )
                }
                style={{
                  cursor: !loading ? 'pointer' : 'default',
                }}
                color={'primary'}
              >
                {selectedForm === 'Sign in'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 12, mb: 2 }}
          >
            Henrique Buzon, 2023
          </Typography>
          <Stack direction={'row'} spacing={2}>
            <Link
              href="https://www.github.com/henriquebuzon"
              rel="noreferrer"
              target="_blank"
            >
              <CardMedia
                component="img"
                src="/images/github.png"
                alt="GitHub"
                sx={{
                  width: '2.2rem',
                }}
              />
            </Link>
            <Link
              href="https://www.linkedin.com/in/henriquebuzon"
              rel=""
              target="_blank"
            >
              <CardMedia
                component="img"
                src="/images/linkedin.png"
                alt="Linkedin"
                sx={{
                  width: '2.2rem',
                }}
              />
            </Link>
          </Stack>
        </Box>
      </Container>
    </>
  )
}

export default Auth
