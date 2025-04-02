// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh-secret";

// Simuler une base de données
let users: { username: string; password: string }[] = [];

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  // Hasher le mot de passe et enregistrer l'utilisateur
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  // Générer les tokens
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" });

  // Access db --> users / sessions

  // Stocker les tokens en cookies
  const response = NextResponse.json({ message: "User registered successfully" });
  response.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });

  return response;
}
