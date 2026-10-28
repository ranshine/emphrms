export type LoginRequest = {
  userId: string;
  password: string;
  remember?: boolean;
};

export type AuthUser = {
  userId: string;
};

export type LoginResponse = {
  user: AuthUser;
};
