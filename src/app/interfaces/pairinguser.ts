import { Pairinggroup } from "./pairinggroup";
export interface Pairinguser {
    id: number;
    average: number;
    weight: number;
    eligible: number;
    groups: Pairinggroup[];
    year: number;
}
