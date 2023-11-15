import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Page } from "./utils";
import { Leadeboard, Player, getLeaderboard, storeLeaderboard } from "./db";
import { sdk } from "./sdk";

const COLUMN_WIDTH = { sm: "8.6%", md: "15.5%", lg: "44.8%" };

const cells = ["Ranking", "Player", "Games", "Score"];

interface Props {
  player: Player;
}

const LeaderboardRow: FC<Props> = ({ player }) => {
  return (
    <TableRow key={player.position}>
      <TableCell component="th" scope="row">
        <Typography variant="body1" color="customGrey.main">
          {player.position}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {player.username}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {player.gamesPlayed}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {player.score}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface LeaderboardProps {
  leaderboard: Leadeboard;
}

const LeaderboardTable: FC<LeaderboardProps> = ({ leaderboard }) => {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <colgroup>
          <col width={COLUMN_WIDTH.sm} />
          <col width={COLUMN_WIDTH.lg} />
          <col width={COLUMN_WIDTH.md} />
          <col width={COLUMN_WIDTH.md} />
        </colgroup>
        <TableHead>
          <TableRow>
            {cells.map((cell, index) => (
              <TableCell key={index} sx={{ padding: 1 }}>
                <Typography variant="overline">{cell}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.players.map((player, index) => (
            <LeaderboardRow key={index} player={player} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

interface LeaderboardPageProps {
  setPage: (page: Page) => void;
}

export const LeaderboardPage: FC<LeaderboardPageProps> = ({ setPage }) => {
  const [leaderboard, setLeaderboard] = useState<Leadeboard>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const lb = getLeaderboard();
    setLeaderboard(lb);
  }, []);

  const refreshLeaderboard = async () => {
    setIsLoading(true);
    try {
      const lb = await sdk.retrieveLeaderboard();
      storeLeaderboard(lb);
      setLeaderboard(lb);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Container component="main">
      <Button onClick={() => setPage("score-creation")}>
        Go to score creation
      </Button>

      <Button variant="contained" onClick={() => refreshLeaderboard()}>
        Refresh Leaderboard
      </Button>

      {isLoading ? (
        <Typography>Calculating leaderboard 🧮</Typography>
      ) : leaderboard ? (
        <LeaderboardTable leaderboard={leaderboard} />
      ) : (
        <Typography>No leaderboard found 😔</Typography>
      )}
    </Container>
  );
};
