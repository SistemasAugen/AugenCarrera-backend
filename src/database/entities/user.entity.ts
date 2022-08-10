import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Facturation } from "./facturation.entity";
import { Branch } from "./Pdv.entity";

export enum statusEnum { Activo = 'Activo', Inactivo = 'Inactivo' }
export enum categoryEnum { DOCTORES = 'DOCTORES', CADENAS = 'CADENAS', OFTAMOLOGOS = 'OFTAMÓLOGOS' }

@Entity({ name: 'clients' })
export class User {
  @PrimaryGeneratedColumn({ type: "int" }) // ('uuid') -> genera id aleatorio num y letras
  id: number; // on bd: number

  @Column("varchar", { length: 100, nullable: false })
  name: string; // on bd: string

  @Column("varchar", { length: 100, nullable: false })
  password: string;

  @Column("varchar", { length: 100, nullable: false })
  email: string;

  @Column("varchar", { length: 100, nullable: false })
  phone: string;

  @Column("varchar", { length: 100, nullable: false })
  celphone: string;

  @Column("varchar", { length: 100, nullable: false })
  comertial_name: string;

  @Column("varchar", { length: 100, nullable: false })
  address: string;

  @Column("varchar", { length: 100, nullable: false })
  suburb: string;

  @Column({ type: "int", nullable: false })
  state_id: number;

  @Column({ type: "int", nullable: false })
  town_id: number; // on bd: string

  @Column("varchar", { length: 20, nullable: false })
  postal_code: string; // on bd: string

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @UpdateDateColumn({ nullable: false })
  updated_at: Date;

  @Column({ type: "int", nullable: false })
  branch_id: number;

  @Column("varchar", { length: 100, nullable: false })
  contact_name: string; // on bd: string

  @Column("varchar", { length: 100, nullable: false })
  contact_phone: string; // on bd: string

  @Column("varchar", { length: 100 })
  contact_celphone: string; // on bd: string

  @Column("varchar", { length: 100, nullable: false })
  contact_email: string; // on bd: string

  @Column("varchar", { length: 100, nullable: true })
  payment_plan: string; // on bd: string

  @Column({ type: "enum", enum: statusEnum, default: statusEnum.Activo, nullable: false })
  status: statusEnum; // on bd: enum('Activo', 'Inactivo')

  @Column({ type: "varchar", default: 'DOCTORES', nullable: false })
  category: string;

  @Column({ type: "int", nullable: true })
  position: number;

  @Column({ type: "int", nullable: false })
  reason: string;

  @Column("varchar", { length: 100, nullable: false })
  notification_mail: string;

  @ManyToOne(() => Branch, (branch) => branch.user)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => Facturation, (facturation) => facturation.user)
  facturation: Facturation[];

}

/* representation of the bd */