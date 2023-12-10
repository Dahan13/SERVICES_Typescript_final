export interface IMatch {
    id: number;
    host: string;
    challenger: number;
    status: number;
    winner: string;
    creation_date: Date;
    beginning_date: Date;
    ending_date: Date;
}

export interface IRound {
    id: number;
    match_id: number;
    host_creature: number;
    challenger_creature: number;
    status: number;
    winner: string;
}