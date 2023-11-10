import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ScoreCreation } from "./ScoreCreation";
import { Leaderboard } from "./Leaderboard";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ScoreCreation />
      <Leaderboard />
    </ThemeProvider>
  );
}

export default App;
