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
import { FC } from "react";
import { z } from "zod";
import { Page } from "./utils";

const COLUMN_WIDTH = { sm: "8.6%", md: "15.5%", lg: "44.8%" };

const cells = ["Ranking", "Player", "Games", "Score"];

const leaderboardDataSchema = z.object({
  rank: z.number(),
  username: z.string(),
  score: z.number(),
  gamesPlayed: z.number(),
});

export type LeaderboardData = z.infer<typeof leaderboardDataSchema>;

interface Props {
  leaderboard: LeaderboardData;
}

const LeaderboardRow: FC<Props> = ({ leaderboard }) => {
  return (
    <TableRow key={leaderboard.rank}>
      <TableCell component="th" scope="row">
        <Typography variant="body1" color="customGrey.main">
          {leaderboard.rank}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {leaderboard.username}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {leaderboard.gamesPlayed}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body1" color="customGrey.main">
          {leaderboard.score}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

interface LeaderboardProps {
  data: LeaderboardData[];
}

const Leaderboard: FC<LeaderboardProps> = ({ data }) => {
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
          {data.map((leaderboard, index) => (
            <LeaderboardRow key={index} leaderboard={leaderboard} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// TODO: delete fake data
const fakeData: LeaderboardData[] = [
  { rank: 1, score: 42, gamesPlayed: 4, username: "Jinx" },
  { rank: 2, score: 33, gamesPlayed: 3, username: "Vi" },
];

interface LeaderboardPageProps {
  setPage: (page: Page) => void;
}

export const LeaderboardPage: FC<LeaderboardPageProps> = ({ setPage }) => {
  return (
    <Container component="main">
      <Button onClick={() => setPage("score-creation")}>
        Go to score creation
      </Button>
      <Leaderboard data={fakeData} />
    </Container>
  );
};
