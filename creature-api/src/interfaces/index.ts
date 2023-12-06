export interface ICreature {
    id: number;
    name: string;
    price: number;
    health: number;
    attack: number;
    defence: number;
    speed: number;
    magic: number;
}

export interface IUserCreature {
    id: number;
    username: string;
    creature_id: number;
}