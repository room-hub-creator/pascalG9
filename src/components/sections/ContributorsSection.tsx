import { Users, Github, Linkedin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CONTRIBUTORS = [
  {
    name: "ISHIMWE Prince",
    role: "Project Lead",
    bio: "Lead architect of the Pascal's Triangle implementation and BigInt optimization logic.",
    image: "/ISHIMWE.jpg",
  },
  {
    name: "UWERA Deborah",
    role: "UI/UX Designer",
    bio: "Focused on creating the premium glassmorphism interface and responsive design.",
    image: "/UWERA.jpeg",
  },
  {
    name: "UKUNDIMANA Redempta",
    role: "Data Analyst",
    bio: "Handled data structures and accuracy testing for large binomial coefficient outputs.",
    image: "/UKUNDIMANA.jpeg",
  },
  {
    name: "MUTUYIMANA Clemance",
    role: "Project Coordinator",
    bio: "Managed academic documentation and synchronized development phases.",
    image: "/MUTUYIMANA.jpeg",
  },
  {
    name: "TUYISHIME Innocent",
    role: "Algorithm Specialist",
    bio: "Optimized recursive properties and handled edge cases for multi-precision engine.",
    image: "/TUYISHIME.jpeg",
  },
  {
    name: "MBONIGABA Ananie",
    role: "QA Engineer",
    bio: "Conducted rigorous unit testing and validated mathematical proofs.",
    image: "/MBONIGABA.jpeg",
  },
];





export const ContributorsSection = () => {
  return (
    <div className="space-y-12 py-12 animate-fade-in">
      {/* Contributors Title */}
      <section className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
          <Users className="h-3.5 w-3.5" />
          MEET THE TEAM
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Project <span className="text-gradient">Contributors</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          The brilliant minds behind the MA80443 Pascal Coefficient Project. 
          Dedicated to computational excellence and mathematical precision.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CONTRIBUTORS.map((member, idx) => (
          <Card key={idx} className="group overflow-hidden border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-primary/40">
            <CardContent className="p-0">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />


                <div className="absolute bottom-4 left-6">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
