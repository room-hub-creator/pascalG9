import { Users, Github, Linkedin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CONTRIBUTORS = [
  {
    name: "Member 1",
    role: "Project Lead",
    bio: "Lead architect of the Pascal's Triangle implementation and BigInt optimization logic.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Member 2",
    role: "UI/UX Designer",
    bio: "Focused on creating the premium glassmorphism interface and responsive design.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Member 3",
    role: "Data Analyst",
    bio: "Handled data structures and accuracy testing for large binomial coefficient outputs.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Member 4",
    role: "Project Coordinator",
    bio: "Managed academic documentation and synchronized development phases.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Member 5",
    role: "Algorithm Specialist",
    bio: "Optimized recursive properties and handled edge cases for multi-precision engine.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "Member 6",
    role: "QA Engineer",
    bio: "Conducted rigorous unit testing and validated mathematical proofs.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
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
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
