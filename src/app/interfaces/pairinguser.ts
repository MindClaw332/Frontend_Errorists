import { Pairinggroup } from "./pairinggroup";
export interface Pairinguser {
    id: number;
    firstname: string;
    average: number;
    weight: number;
    eligible: number;
    groups: Pairinggroup[];
    year: number;
}
