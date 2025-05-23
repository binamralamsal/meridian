/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = "admin" | "user";

export interface Email {
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<number>;
  isPrimary: Generated<boolean>;
  isVerified: Generated<boolean>;
  updatedAt: Generated<Timestamp>;
  userId: number;
}

export interface Session {
  city: string | null;
  country: Generated<string>;
  createdAt: Generated<Timestamp>;
  expiresAt: Timestamp;
  id: string;
  ip: string;
  region: string | null;
  updatedAt: Generated<Timestamp>;
  userAgent: string;
  userId: number;
}

export interface User {
  createdAt: Generated<Timestamp>;
  id: Generated<number>;
  name: string;
  password: string;
  role: Generated<UserRole>;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  emails: Email;
  sessions: Session;
  users: User;
}
