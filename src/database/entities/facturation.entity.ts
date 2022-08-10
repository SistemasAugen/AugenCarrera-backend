import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'facturacions' })
export class Facturation {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int", nullable: false })
  client_id: number;

  @Column("varchar", { length: 191 })
  name: string;

  @Column("varchar", { length: 191 })
  email: string;

  @Column("varchar", { length: 191 })
  phone: string;

  @Column("varchar", { length: 191 })
  celphone: string;

  @Column("varchar", { length: 191 })
  rfc: string;

  @Column("varchar", { length: 191 })
  address: string;

  @Column("varchar", { length: 191 })
  suburb: string;

  @Column({ type: "int" })
  state_id: number;

  @Column({ type: "int" })
  town_id: number;

  @Column({ type: "int" })
  postal_code: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.facturation)
  @JoinColumn({ name: 'client_id' })
  user: User;
}