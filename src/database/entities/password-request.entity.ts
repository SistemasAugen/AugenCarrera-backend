import { Column, CreateDateColumn, Entity } from "typeorm";

@Entity({ name: 'password_resets' })
export class PasswordResets {

  @Column("varchar", { length: 191, primary: true })
  email: string;

  @Column("varchar", { length: 191 })
  token: string;

  @CreateDateColumn()
  created_at: Date;
}
