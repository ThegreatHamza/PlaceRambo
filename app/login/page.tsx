import AuthForm from "@/components/auth/auth-form";

export const metadata = { title: "Log in — PlaceRambo" };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
