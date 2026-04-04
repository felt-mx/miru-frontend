import { Chat } from "@/components/app/chat";

export default function Home() {
  return (
    <main className="h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
      <div className="h-full max-w-4xl mx-auto">
        <Chat />
      </div>
    </main>
  );
}
