import { Chat } from "@/components/app/chat";
import { SessionLogs } from "@/components/app/session-logs";

export default function Home() {
  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-[#04050c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_80%_at_18%_4%,hsl(292_92%_60%/.42),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_90%_at_78%_8%,hsl(252_94%_62%/.38),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_85%_at_50%_100%,hsl(210_95%_56%/.28),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(240_48%_10%)_0%,hsl(232_50%_7%)_45%,hsl(224_52%_5%)_100%)]" />
      <div className="pointer-events-none absolute -left-[18%] top-[-26%] h-[130%] w-[74%] rotate-[24deg] bg-[linear-gradient(90deg,transparent,hsl(272_100%_76%/.34),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute inset-3 rounded-[34px] border border-white/10 bg-white/[0.035] shadow-[0_35px_90px_hsl(245_58%_6%/.35),inset_0_1px_0_hsl(0_0%_100%/.18)] backdrop-blur-3xl backdrop-saturate-150" />
      <div className="pointer-events-none absolute inset-x-3 top-3 h-24 rounded-t-[34px] bg-[linear-gradient(180deg,hsl(0_0%_100%/.1),transparent)]" />
      <div className="relative z-10 h-full max-w-2xl flex-1"></div>
      <div className="relative z-10 h-full max-w-4xl mx-auto flex-1 p-5">
        <Chat />
      </div>
      <div className="relative z-10 h-full max-w-2xl flex-1 p-5">
        <SessionLogs />
      </div>
    </main>
  );
}
