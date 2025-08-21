import jwt from "jsonwebtoken";
 
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
}

export function signToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

