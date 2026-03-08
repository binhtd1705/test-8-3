import { Suspense } from "react";
import { WeddingPage } from "@/components/WeddingPage";

export default function Home() {
  return (
    <Suspense fallback={<div className="wedding-bg min-h-screen flex items-center justify-center">
      <div className="text-white text-2xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
        Đang tải...
      </div>
    </div>}>
      <WeddingPage />
    </Suspense>
  );
}
