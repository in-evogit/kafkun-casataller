import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
