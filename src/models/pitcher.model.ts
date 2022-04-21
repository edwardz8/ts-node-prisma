import { Comment } from "./comment.model";

export interface Pitcher {
    id: number;
    name: string;
    team: string;
    wins: number;
    losses: number;
    era: number;
    games: number;
    games_started: number;
    saves: number;
    innings_pitched: number;
    hits: number;
    earned_runs: number;
    home_runs_allowed: number;
    strikeouts: number;
    walks: number;
    whip: number;
    ks_per_nine: number;
    walks_per_nine: number;
    fip: number;
    war: number;
    ra_nine_war: number;
    adp: number;
    comments: Comment[];
    favorited: boolean;
}
