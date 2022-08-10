import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Laboratory } from "./lab.entity";
import { User } from "./user.entity";

@Entity({ name: 'branches' })
export class Branch {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 191, nullable: false })
  name: string;

  @Column({ type: "int", nullable: false })
  state_id: number;

  @Column({ type: "int", nullable: false })
  town_id: number;

  @Column("varchar", { length: 191, nullable: false })
  address: string;

  @Column({ type: "int", nullable: false })
  laboratory_id: number;

  @Column("varchar", { length: 191, nullable: false, default: 'America/Mexico_City' })
  timezone: string;

  @Column({ type: "decimal", nullable: false })
  base: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => User, (user) => user.branch)
  user: User[];

  @ManyToOne(() => Laboratory, (laboratory) => laboratory.branch)
  @JoinColumn({ name: 'laboratory_id' })
  laboratory: Laboratory;

}