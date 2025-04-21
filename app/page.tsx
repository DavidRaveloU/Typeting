import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import TypingArea from "@/components/TypingArea";
import { TypingConfigProvider } from "@/context/TypingConfigContext";

export default function Home() {
  return (
    <TypingConfigProvider>
      <Navbar />
      <Header />
      <TypingArea />
    </TypingConfigProvider>
  );
}
