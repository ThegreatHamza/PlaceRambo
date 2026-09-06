"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t } = useI18n();
  const router = useRouter();
  const { user, login, register, demoLogin } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const isLogin = mode === "login";

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || (!isLogin && (!form.name || !form.phone))) {
      setError(t("auth.error"));
      return;
    }
    if (isLogin) {
      const u = login(form.email, form.password);
      if (!u) {
        setError("No account found. Please register first.");
        return;
      }
      router.push("/account");
    } else {
      const u = register(form);
      if (!u) {
        setError("An account with this email already exists.");
        return;
      }
      router.push("/account");
    }
  };

  return (
    <div className="container grid min-h-[70vh] place-items-center py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-800 p-10 text-white lg:block">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15">
                <Store className="h-5 w-5" />
              </span>
              <span className="text-xl font-extrabold">PlaceRambo</span>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold leading-tight">
                {t("auth.registerTitle")}
              </h2>
              <p className="mt-3 text-white/80">{t("auth.registerSub")}</p>
              <div className="mt-6 space-y-3 text-sm text-white/90">
                {["Post listings in 2 minutes", "Chat securely with buyers", "Reach thousands in Djibouti"].map((x) => (
                  <div key={x} className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">✓</span>
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl border border-white/20 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15"><Sparkles className="h-5 w-5" /></span>
                <p className="text-xs leading-relaxed text-white/85">
                  PlaceRambo is the #1 marketplace in Djibouti — trusted by 3,000+ verified sellers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-10">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-teal-500 text-white"><Store className="h-4 w-4" /></span>
            <span className="font-extrabold">PlaceRambo</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {isLogin ? t("auth.loginSub") : t("auth.registerSub")}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && (
              <div>
                <label className="label">{t("auth.name")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="input pl-10" placeholder="Amina Hassan" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
            )}
            <div>
              <label className="label">{t("auth.email")}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="input pl-10" type="email" placeholder="you@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            {!isLogin && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">{t("auth.username")}</label>
                  <input className="input" placeholder="amina" value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div>
                  <label className="label">{t("auth.phone")}</label>
                  <input className="input" placeholder="+253 77 00 00 00" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            )}
            <div>
              <label className="label">{t("auth.password")}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="input pl-10 pr-10" type={show ? "text" : "password"} placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <div className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-600">{error}</div>}

            <button type="submit" className="btn btn-primary mt-2 w-full py-3 text-base">
              {isLogin ? t("auth.login") : t("auth.register")}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-slate-200" /> {t("auth.or")} <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            onClick={() => {
              demoLogin();
              router.push("/account");
            }}
            className="btn btn-ghost w-full"
          >
            <Sparkles className="h-4 w-4 text-teal-600" />
            {t("auth.demo")}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            {isLogin ? t("auth.needAccount") : t("auth.haveAccount")}{" "}
            <Link href={isLogin ? "/register" : "/login"} className="font-bold text-teal-700 hover:underline">
              {isLogin ? t("auth.signup") : t("auth.signin")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
