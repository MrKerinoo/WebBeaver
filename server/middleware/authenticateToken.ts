import jwt from "jsonwebtoken";

export default function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies.accessToken;

  if (token == null) {
    res.status(401).json({
      status: "error",
      type: "token",
      message: "Token is required",
    });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, user: any) => {
      if (err) {
        res.status(401).json({
          status: "error",
          type: "token",
          message: "Token is invalid",
        });
        return;
      }
      console.log("USER MIDDLEWARE", user);
      req.user = user.user || user;
      next();
    }
  );
}
