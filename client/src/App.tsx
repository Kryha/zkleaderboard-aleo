import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ScoreCreation } from "./ScoreCreation";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ScoreCreation />
    </ThemeProvider>
  );
}

export default App;
