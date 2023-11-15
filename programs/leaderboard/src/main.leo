program leaderboard.aleo {
    struct User {
        score: u64;
        games_played: u64;
    }

    mapping users: field => User;

    transition update_score(user_id: field, new_score: u64) {
        assert_eq(self.caller, self.signer);
        return then finalize(user_id, new_score);
    }

    finalize update_score(user_id: field, new_score: u64) {
        let current_user: User = Mapping::get_or_use(users, user_id, User {
            score: 0u64,
            games_played: 0u64
        });

        Mapping::set(users, user_id, User {
            score: current_user.score + new_score,
            games_played: current_user.games_played + 1u64
        });
    }
}
