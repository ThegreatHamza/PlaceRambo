import AuthForm from "@/components/auth/auth-form";

export const metadata = { title: "Create account — PlaceRambo" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
