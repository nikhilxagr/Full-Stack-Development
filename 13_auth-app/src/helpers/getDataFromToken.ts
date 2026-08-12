import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      throw new Error("Authentication token is missing. Please log in.");
    }

    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("Server configuration error: TOKEN_SECRET is not defined.");
    }

    const decodedToken: any = jwt.verify(token, secret);

    if (!decodedToken?.id) {
      throw new Error("Invalid token payload");
    }

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
