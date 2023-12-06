export interface ICreature {
    id: number;
    name: string;
    price: number;
    health: number;
    attack: number;
    defense: number
    magic: number;
    speed: number;
}

export interface IUserCreature {
    id: number;
    username: string;
    creature_id: number;
}