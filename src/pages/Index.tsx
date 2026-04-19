import { useState } from "react";
import { SiteHeader, type Section } from "@/components/SiteHeader";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { ExpansionSection } from "@/components/sections/ExpansionSection";
import { TutorSection } from "@/components/sections/TutorSection";
import { HistorySection } from "@/components/sections/HistorySection";
import { DocumentationSection } from "@/components/sections/DocumentationSection";
import { ContributorsSection } from "@/components/sections/ContributorsSection";
import { AIAssistant } from "@/components/AIAssistant";

const Index = () => {
  const [section, setSection] = useState<Section>("calculator");

  console.log("Pascal's Brain: Index Rendering Section:", section);

  return (
    <div className="min-h-screen">
      <SiteHeader active={section} onChange={setSection} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">



        {section === "calculator" && <CalculatorSection />}
        {section === "expansion" && <ExpansionSection />}
        {section === "tutor" && <TutorSection />}
        {section === "history" && <HistorySection />}
        {section === "documentation" && <DocumentationSection />}
        {section === "contributors" && <ContributorsSection />}
      </main>
      
      {/* Persistent AI Tutor for all navs */}
      <AIAssistant />

      <footer className="border-t border-border/60 py-6 text-center text-[10px] tracking-widest text-muted-foreground uppercase bg-secondary/20">
        MA80443 · Group 9 · Academic Year 2025/2026 · Multi-Precision Engine
      </footer>
    </div>
  );
};

export default Index;
