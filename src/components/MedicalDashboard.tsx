import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Pill, Shield, MapPin, MessageCircle, Heart } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  variant?: "default" | "medical" | "emergency" | "safe";
  onClick: () => void;
}

const ServiceCard = ({ icon, title, description, buttonText, variant = "medical", onClick }: ServiceCardProps) => (
  <Card className="group hover:shadow-float transition-all duration-300 bg-gradient-card border-0 h-full">
    <CardHeader className="text-center pb-4">
      <div className="mx-auto mb-3 p-3 rounded-full bg-primary/10 text-primary w-fit group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <CardDescription className="text-sm">{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <Button 
        variant={variant} 
        className="w-full" 
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

interface MedicalDashboardProps {
  onServiceSelect: (service: string) => void;
}

export const MedicalDashboard = ({ onServiceSelect }: MedicalDashboardProps) => {
  const services = [
    {
      icon: <Stethoscope className="w-6 h-6" />,
      title: "Symptom Checker",
      description: "Describe your symptoms and get possible conditions to discuss with your doctor",
      buttonText: "Check Symptoms",
      variant: "medical" as const,
      service: "symptoms"
    },
    {
      icon: <Pill className="w-6 h-6" />,
      title: "Medication Info",
      description: "Get information about medicines and set medication reminders",
      buttonText: "Medicine Info",
      variant: "default" as const,
      service: "medication"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "First Aid Help",
      description: "Quick access to emergency first aid instructions and tips",
      buttonText: "Get Help",
      variant: "emergency" as const,
      service: "firstaid"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Find a Doctor",
      description: "Locate nearby healthcare providers and specialists in your area",
      buttonText: "Find Doctors",
      variant: "safe" as const,
      service: "doctors"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Health FAQ",
      description: "Get answers to common health questions from our medical knowledge base",
      buttonText: "Ask Questions",
      variant: "default" as const,
      service: "faq"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health Tips",
      description: "Daily health tips and wellness advice for better living",
      buttonText: "View Tips",
      variant: "safe" as const,
      service: "tips"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              GenMediBot
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Your Intelligent Medical Assistant
            </p>
            <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
              Get instant medical guidance, symptom checking, medication information, and emergency assistance - all powered by AI
            </p>
            <Button 
              variant="medical" 
              size="lg"
              onClick={() => onServiceSelect("symptoms")}
              className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold px-8 py-4 text-lg"
            >
              Start Health Check
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Can I Help You Today?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our range of medical assistance services designed to support your health and wellness journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                buttonText={service.buttonText}
                variant={service.variant}
                onClick={() => onServiceSelect(service.service)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">Trusted Medical Assistance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Privacy First</h4>
              <p className="text-muted-foreground text-sm">Your health data is encrypted and stored securely</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Medical Grade</h4>
              <p className="text-muted-foreground text-sm">Information sourced from trusted medical databases</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Available</h4>
              <p className="text-muted-foreground text-sm">Get medical assistance whenever you need it</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};