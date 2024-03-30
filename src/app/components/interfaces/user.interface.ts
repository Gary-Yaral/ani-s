export interface UserData {
  token: string|number,
  refreshToken: string,
}

export type UserKey = keyof UserData
