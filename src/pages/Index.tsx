import { useState } from "react";
import { SiteHeader, type Section } from "@/components/SiteHeader";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { ExpansionSection } from "@/components/sections/ExpansionSection";
import { TutorSection } from "@/components/sections/TutorSection";
import { HistorySection } from "@/components/sections/HistorySection";
import { BlueprintSection } from "@/components/sections/BlueprintSection";

const Index = () => {
  const [section, setSection] = useState<Section>("calculator");

  return (
    <div className="min-h-screen">
      <SiteHeader active={section} onChange={setSection} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        {section === "calculator" && <CalculatorSection />}
        {section === "expansion" && <ExpansionSection />}
        {section === "tutor" && <TutorSection />}
        {section === "history" && <HistorySection />}
        {section === "blueprint" && <BlueprintSection />}
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        MA80443 · Project 1 · Built with React + BigInt · AI tutor by Groq
      </footer>
    </div>
  );
};

export default Index;
