import { Chat } from "@/components/app/chat";
import { SessionLogs } from "@/components/app/session-logs";

export default function Home() {
  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-[#080b1a] text-white">
      <div className="ambient-orb-a pointer-events-none absolute inset-0 bg-[radial-gradient(85%_80%_at_18%_4%,hsl(292_92%_66%/.58),transparent_58%)]" />
      <div className="ambient-orb-b pointer-events-none absolute inset-0 bg-[radial-gradient(95%_90%_at_78%_8%,hsl(252_94%_68%/.52),transparent_60%)]" />
      <div className="ambient-orb-c pointer-events-none absolute inset-0 bg-[radial-gradient(95%_85%_at_50%_100%,hsl(210_95%_62%/.42),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(242_50%_14%)_0%,hsl(232_50%_10%)_45%,hsl(224_52%_8%)_100%)]" />
      <div className="ambient-sheen pointer-events-none absolute -left-[18%] top-[-26%] h-[130%] w-[74%] rotate-[24deg] bg-[linear-gradient(90deg,transparent,hsl(272_100%_78%/.46),transparent)] blur-3xl" />
      <div className="pointer-events-none absolute inset-3 rounded-[34px] border border-white/14 bg-white/[0.06] shadow-[0_35px_90px_hsl(245_58%_8%/.38),inset_0_1px_0_hsl(0_0%_100%/.22)] backdrop-blur-3xl backdrop-saturate-150" />
      <div className="pointer-events-none absolute inset-x-3 top-3 h-24 rounded-t-[34px] bg-[linear-gradient(180deg,hsl(0_0%_100%/.16),transparent)]" />
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
