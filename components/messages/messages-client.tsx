"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Send,
  Paperclip,
  Mic,
  Languages,
  MessageCircle,
  ArrowLeft,
  MoreHorizontal,
  CheckCheck,
  Play,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { SELLERS } from "@/lib/data";
import type { Conversation } from "@/lib/types";
import { cn, relativeTime } from "@/lib/utils";

export default function MessagesClient() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const store = useStore();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversations = store.conversations;

  const active = useMemo<Conversation | undefined>(
    () => conversations.find((c) => c.id === activeId),
    [activeId, conversations]
  );

  useEffect(() => {
    const listing = searchParams.get("listing");
    const seller = searchParams.get("seller");
    const sellerName = seller ? SELLERS.find((s) => s.id === seller)?.name || seller : "";
    if (listing || seller) {
      const existing =
        conversations.find((c) => c.listingId === listing) ||
        (sellerName ? conversations.find((c) => c.participant === sellerName) : undefined);
      if (existing) {
        setActiveId(existing.id);
      } else {
        const id = store.openConversation(listing || "", seller || "");
        setActiveId(id);
      }
    } else if (!activeId && conversations.length) {
      setActiveId(conversations[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, conversations.length]);

  useEffect(() => {
    if (activeId) {
      store.markRead(activeId);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, active?.messages.length]);

  const send = () => {
    if (!activeId || !draft.trim()) return;
    store.sendMessage(activeId, draft);
    setDraft("");
  };

  const recordVoice = () => {
    if (!activeId) return;
    store.sendImage(activeId, "https://images.unsplash.com/photo-1494961104209-3c223057bd26?auto=format&fit=crop&w=300&q=80");
  };

  return (
    <div className="container py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            <MessageCircle className="mr-2 inline h-6 w-6 text-brand" />
            {t("messages.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t("messages.sub")}</p>
        </div>
        <span className="badge badge-green hidden sm:flex">
          <span className="dot" /> {t("common.online")}
        </span>
      </div>

      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white md:h-[calc(100vh-160px)] md:min-h-[560px] lg:grid-cols-[320px_1fr]">
        {/* List */}
        <div className={cn("border-slate-200 md:border-r", activeId ? "hidden md:block" : "block")}>
          <div className="border-b border-slate-100 p-4">
            <div className="input flex items-center gap-2 rounded-xl bg-slate-50">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              <input placeholder={t("messages.type")} className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div className="max-h-[calc(100vh-230px)] overflow-y-auto md:max-h-none">
            {conversations.length === 0 ? (
              <div className="grid place-items-center p-10 text-center text-sm text-slate-500">
                {t("messages.empty")}
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-slate-50 p-4 text-left transition hover:bg-slate-50",
                    c.id === activeId && "bg-teal-50/60"
                  )}
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={c.participantAvatar} alt={c.participant} fill sizes="48px" className="object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-sm font-bold">{c.participant}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">{relativeTime(c.createdAt, lang)}</span>
                    </div>
                    {c.listingTitle && <div className="mt-0.5 truncate text-xs text-slate-400">{c.listingTitle}</div>}
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {c.messages[c.messages.length - 1]?.text || "Media message"}
                    </p>
                  </div>
                  {c.unread ? (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-teal-500 px-1 text-[10px] font-bold text-white">{c.unread}</span>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat */}
        <div className={cn("flex flex-col", activeId ? "block" : "hidden md:flex")}>
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button onClick={() => setActiveId(null)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 md:hidden">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <Image src={active.participantAvatar} alt={active.participant} fill sizes="44px" className="object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-bold">{active.participant}</div>
                    <div className="truncate text-xs text-slate-400">
                      {active.listingTitle ? `Listing: ${active.listingTitle}` : "Conversation"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" title={t("messages.translate")}>
                    <Languages className="h-4 w-4" />
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100" title={t("messages.reported")}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-4">
                <div className="mx-auto max-w-md rounded-2xl bg-white p-3 text-center text-xs text-slate-400">
                  <span className="flex items-center justify-center gap-1"><span className="dot" /> {t("messages.with")} {active.participant}</span>
                </div>
                {active.messages.length === 0 && (
                  <div className="grid place-items-center py-14 text-sm text-slate-400">
                    <MessageCircle className="mb-2 h-10 w-10 text-slate-300" />
                    {t("messages.empty")}
                  </div>
                )}
                {active.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                      m.from === "me"
                        ? "rounded-br-md bg-gradient-to-br from-teal-600 to-teal-700 text-white"
                        : "rounded-bl-md bg-white text-slate-700"
                    )}>
                      {m.kind === "image" && m.src ? (
                        <div className="relative mb-1 h-44 w-60 overflow-hidden rounded-xl">
                          <Image src={m.src} alt="shared" fill sizes="240px" className="object-cover" />
                          <span className="absolute inset-0 grid place-items-center bg-black/25"><Play className="h-10 w-10 fill-white text-white" /></span>
                        </div>
                      ) : m.kind === "voice" ? (
                        <div className="flex items-center gap-2 py-1"><Play className="h-5 w-5" /><div className="h-1 w-36 rounded bg-black/20" /><span className="text-xs">0:12</span></div>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      )}
                      <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", m.from === "me" ? "text-white/70" : "text-slate-400")}>
                        {relativeTime(m.at, lang)}
                        {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                      </div>
                      {m.translated && (
                        <div className="mt-2 rounded-xl bg-white/15 p-2 text-xs italic">
                          🌐 {m.translated}
                        </div>
                      )}
                      {m.from === "them" && (
                        <button onClick={() => store.translateMessage(active.id, m.id)} className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-teal-600">
                          <Languages className="h-3 w-3" /> {t("messages.translate")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 p-3">
                <div className="flex items-end gap-2">
                  <button className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-400 hover:bg-slate-100" title="Attach">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <textarea
                    className="input min-h-[46px] flex-1 resize-none rounded-2xl bg-slate-50 py-2.5"
                    rows={1}
                    placeholder={t("messages.type")}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                  <button onClick={recordVoice} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-slate-400 hover:bg-slate-100" title={t("messages.voice")}>
                    <Mic className="h-4 w-4" />
                  </button>
                  <button onClick={send} className="btn btn-primary h-10 shrink-0 px-3.5">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden place-items-center md:grid">
              <div className="text-center">
                <MessageCircle className="mx-auto h-14 w-14 text-slate-300" />
                <h3 className="mt-4 font-extrabold text-slate-500">{t("messages.placeholder")}</h3>
                <p className="mt-1 text-sm text-slate-400">{t("messages.empty")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
