import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import { signToken } from "../utils/jwt";

export async function registerUser(
  email: string,
  password: string,
  role: string
) {
  try {
    if (!email.match(/@/) || password.length < 6) {
      throw new Error("Invalid email or password");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, role },
    });

    return { id: user.id, email: user.email, role: user.role };
  } catch (error) {
    throw new Error("Registration failed");
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Wrong password");

  const token = signToken({ id: user.id, role: user.role });
  return { token };
}
