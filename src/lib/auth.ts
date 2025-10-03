import jwt, {SignOptions} from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET not set");

export const signToken = (payload: object, exp = "1d") =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: exp } as SignOptions);

export const verifyJwt = (token: string) => 
    jwt.verify(token, JWT_SECRET);