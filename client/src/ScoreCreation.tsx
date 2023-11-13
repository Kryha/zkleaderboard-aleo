import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { getUserMappingId } from "./db";
import { Page } from "./utils";
import { FC, useState } from "react";
import { sdk } from "./sdk";

interface Props {
  setPage: (page: Page) => void;
}

export const ScoreCreationPage: FC<Props> = ({ setPage }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const un = data.get("username");
      const sc = data.get("score");

      if (!un || !sc) throw new Error("Missing inputs");

      const username = un.toString();
      const score = parseInt(sc.toString());

      const mappingId = getUserMappingId(username);
      await sdk.updateScore(mappingId, score);

      console.log(`${username} stored with id ${mappingId}`);
    } catch (error) {
      console.error("On submit error:", error);
    }
    setIsLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isLoading ? "Submitting user score..." : "Create user score"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="score"
            label="Score"
            type="number"
            id="score"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit Score
          </Button>
          <Button
            disabled={isLoading}
            fullWidth
            onClick={() => setPage("leaderboard")}
          >
            Leaderboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
