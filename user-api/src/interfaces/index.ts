export interface IUser {
    username: string;
    password: string;
    score?: number;
    credits?: number;
    is_admin?: boolean;
    is_reporter?: boolean;
    is_banned?: boolean;
}