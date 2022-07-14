import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/shared/interfaces/roles.enum';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import normalizeEmail from 'validator/lib/normalizeEmail';
import { fromHash, toHash } from './password.transformer';

@Exclude()
@Entity()
export class User extends BaseEntity {
  constructor(args: any = {}) {
    super();
    Object.assign(this, args);
  }

  // *** Important ***
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  // *** Important ***
  @DeleteDateColumn()
  deleted_at: Date;

  // *** Important ***
  @Expose()
  @Column()
  username: string;

  // *** Important ***
  @Column({ unique: true })
  normalizedUsername: string;

  // *** Important ***
  @Expose()
  @Column()
  email: string;

  // *** Important ***
  @Column({
    unique: true,
  })
  normalizedEmail: string;

  // *** Important ***
  @Expose()
  @Column({
    default: false,
  })
  hasVerifiedEmail: boolean;

  // *** Important ***
  @Column({
    nullable: true,
    transformer: {
      from: fromHash,
      to: toHash,
    },
  })
  password?: string;

  // *** Important ***
  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'role',
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  // *** Important ***
  @CreateDateColumn()
  created_at: Date;

  // *** Important ***
  @UpdateDateColumn()
  updated_at: Date;

  // *** Important ***
  @Column({ nullable: true })
  google?: string;

  // *** Important ***
  @Column({ nullable: true })
  facebook?: string;

  // *** Important ***
  @Column({ nullable: true })
  github?: string;

  // *** Important ***
  @Column({ nullable: true })
  twitter?: string;

  // *** Important ***
  @Column('json', { nullable: true })
  tokens?: Record<string, unknown>;

  // *** Important ***
  @BeforeInsert()
  @BeforeUpdate()
  normalize(): void {
    this.normalizedEmail = normalizeEmail(this.email) as string;
    this.normalizedUsername = this.username.toLowerCase();
  }

  // *** Important ***
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
