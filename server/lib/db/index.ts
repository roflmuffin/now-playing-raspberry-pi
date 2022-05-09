export const KVStore: { Values: Data } = {
  Values: {},
};

type Data = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
};
