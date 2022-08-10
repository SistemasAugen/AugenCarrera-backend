import { Laboratory } from "src/database/entities/lab.entity";
import { Branch } from "src/database/entities/Pdv.entity";

export class UserDTO {
  id: number;
  name: string;
  branch: Branch;
  laboratory: Laboratory;
}