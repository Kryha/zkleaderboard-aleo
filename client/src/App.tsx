import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ScoreCreationPage } from "./ScoreCreation";
import { LeaderboardPage } from "./Leaderboard";
import { useState } from "react";
import { type Page } from "./utils";

const theme = createTheme();

function App() {
  const [page, setPage] = useState<Page>("score-creation");

  return (
    <ThemeProvider theme={theme}>
      {page === "score-creation" ? (
        <ScoreCreationPage setPage={setPage} />
      ) : (
        <LeaderboardPage setPage={setPage} />
      )}
    </ThemeProvider>
  );
}

export default App;
