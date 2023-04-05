import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FunctionComponent as FC, useState } from "react";
import Sidebar from "./Sidebar";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const Main: FC = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  return (
    <>
      <CssBaseline />
      <Sidebar
        sidebarIsOpen={sidebarIsOpen}
        setSidebarIsOpen={setSidebarIsOpen}
      />
      <AppBar position="fixed">
        <Toolbar sx={{ bgcolor: "#000000" }}>
          <IconButton
            onClick={() => setSidebarIsOpen(true)}
            size="large"
            sx={{ marginLeft: "-12px" }}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ flex: 1 }} />

          <CardMedia
            component="img"
            sx={{ width: "300px", marginTop: "1px" }}
            image="/images/logo3.png"
          />

          <div style={{ flex: 1 }} />
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container mt={4} spacing={4}>
          {cards.map((card) => (
            <Grid item key={card} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardActionArea>
                  <CardMedia component="img" image="/images/pigeon2.jpg" />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h4"
                      component="div"
                      sx={{ fontSize: "1.0rem" }}
                    >
                      The Time-travelling Pigeon
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      Drama
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ p: 20 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Nextflix
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Your next type of movie streaming platform.
        </Typography>
        <Typography
          mt={1}
          variant="body2"
          color="text.secondary"
          align="center"
        >
          Copyright © Nextflix 2023
        </Typography>
      </Box>
    </>
  );
};

export default Main;
