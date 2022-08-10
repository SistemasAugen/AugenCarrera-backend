import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Branch } from "./Pdv.entity";

@Entity({ name: 'laboratories' })
export class Laboratory {
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

  @CreateDateColumn()
  created_at: number;

  @UpdateDateColumn()
  updated_at: number;

  @OneToMany(() => Branch, (branch) => branch.laboratory)
  branch: Branch[];
}