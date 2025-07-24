import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Heart, Phone, AlertTriangle, ChevronRight } from "lucide-react";

interface FirstAidGuideProps {
  onBack: () => void;
}

interface EmergencyStep {
  step: number;
  title: string;
  description: string;
  warning?: string;
}

interface FirstAidTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  severity: "high" | "medium" | "low";
  description: string;
  steps: EmergencyStep[];
}

export const FirstAidGuide = ({ onBack }: FirstAidGuideProps) => {
  const [selectedTopic, setSelectedTopic] = useState<FirstAidTopic | null>(null);

  const firstAidTopics: FirstAidTopic[] = [
    {
      id: "burns",
      title: "Burns",
      icon: "🔥",
      severity: "high",
      description: "Treatment for thermal, chemical, or electrical burns",
      steps: [
        {
          step: 1,
          title: "Cool the burn",
          description: "Hold the burned area under cool (not cold) running water for 10-20 minutes or until the pain subsides."
        },
        {
          step: 2,
          title: "Remove jewelry",
          description: "Remove rings, watches, or tight clothing before swelling begins."
        },
        {
          step: 3,
          title: "Protect the burn",
          description: "Cover with sterile gauze bandage. Do not use cotton or apply ice directly.",
          warning: "Do not break blisters or apply butter or oils"
        },
        {
          step: 4,
          title: "Seek medical help",
          description: "For severe burns, burns larger than 3 inches, or burns on face, hands, feet, or genitals."
        }
      ]
    },
    {
      id: "cuts",
      title: "Cuts & Bleeding",
      icon: "🩸",
      severity: "medium",
      description: "How to stop bleeding and treat wounds",
      steps: [
        {
          step: 1,
          title: "Clean your hands",
          description: "Wash your hands thoroughly or use hand sanitizer before treating the wound."
        },
        {
          step: 2,
          title: "Stop the bleeding",
          description: "Apply direct pressure with a clean cloth or sterile gauze."
        },
        {
          step: 3,
          title: "Clean the wound",
          description: "Rinse with clean water. Use tweezers to remove debris if necessary."
        },
        {
          step: 4,
          title: "Apply bandage",
          description: "Cover with adhesive bandage or sterile gauze and tape."
        }
      ]
    },
    {
      id: "choking",
      title: "Choking",
      icon: "🫁",
      severity: "high",
      description: "Emergency response for airway obstruction",
      steps: [
        {
          step: 1,
          title: "Assess the situation",
          description: "If person can cough or speak, encourage coughing. If not, proceed immediately."
        },
        {
          step: 2,
          title: "Give back blows",
          description: "Stand behind person, lean them forward, give 5 sharp blows between shoulder blades."
        },
        {
          step: 3,
          title: "Perform abdominal thrusts",
          description: "Stand behind person, place hands below ribcage, give 5 quick upward thrusts."
        },
        {
          step: 4,
          title: "Call emergency services",
          description: "If obstruction doesn't clear, call emergency immediately and continue alternating steps 2-3.",
          warning: "For pregnant women or obese individuals, use chest thrusts instead"
        }
      ]
    },
    {
      id: "cpr",
      title: "CPR",
      icon: "💔",
      severity: "high",
      description: "Cardiopulmonary resuscitation for unresponsive person",
      steps: [
        {
          step: 1,
          title: "Check responsiveness",
          description: "Tap shoulders and shout 'Are you okay?' Check for breathing for no more than 10 seconds."
        },
        {
          step: 2,
          title: "Call for help",
          description: "Call emergency services immediately. Ask someone to find an AED if available."
        },
        {
          step: 3,
          title: "Position hands",
          description: "Place heel of one hand on center of chest between nipples. Place other hand on top, interlace fingers."
        },
        {
          step: 4,
          title: "Perform compressions",
          description: "Push hard and fast at least 2 inches deep, 100-120 compressions per minute. Allow complete chest recoil."
        }
      ]
    },
    {
      id: "fracture",
      title: "Fractures",
      icon: "🦴",
      severity: "medium",
      description: "Initial care for suspected broken bones",
      steps: [
        {
          step: 1,
          title: "Don't move the person",
          description: "Keep the injured person still unless they are in immediate danger."
        },
        {
          step: 2,
          title: "Immobilize the area",
          description: "Support the injured area with splints or slings to prevent movement."
        },
        {
          step: 3,
          title: "Apply ice",
          description: "Apply ice wrapped in cloth for 15-20 minutes to reduce swelling."
        },
        {
          step: 4,
          title: "Seek medical attention",
          description: "Get immediate medical care. Do not give food or water."
        }
      ]
    },
    {
      id: "fainting",
      title: "Fainting",
      icon: "😵",
      severity: "low",
      description: "Care for someone who has fainted or feels faint",
      steps: [
        {
          step: 1,
          title: "Help them lie down",
          description: "If they feel faint, help them lie down. If they've fainted, check for injuries."
        },
        {
          step: 2,
          title: "Elevate legs",
          description: "Raise their legs 12 inches above heart level to improve blood flow to brain."
        },
        {
          step: 3,
          title: "Loosen clothing",
          description: "Loosen any tight clothing around neck or waist."
        },
        {
          step: 4,
          title: "Monitor and comfort",
          description: "Stay with them until they recover. If no improvement in 2 minutes, call emergency services."
        }
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "default";
      default: return "default";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "high": return "Critical";
      case "medium": return "Urgent";
      case "low": return "Standard";
      default: return "Standard";
    }
  };

  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedTopic(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to First Aid Guide
            </Button>
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedTopic.icon}</div>
              <h1 className="text-3xl font-bold mb-2">{selectedTopic.title}</h1>
              <p className="text-muted-foreground">{selectedTopic.description}</p>
              <Badge 
                variant={getSeverityColor(selectedTopic.severity) as any}
                className="mt-4"
              >
                {getSeverityLabel(selectedTopic.severity)} Priority
              </Badge>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="mb-8 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-4">
                <Phone className="w-6 h-6 text-destructive" />
                <div className="text-center">
                  <p className="font-semibold">Emergency: Call 911 (US) or 108 (India)</p>
                  <p className="text-sm text-muted-foreground">For life-threatening situations, call immediately</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Step-by-Step Instructions</h2>
            {selectedTopic.steps.map((step) => (
              <Card key={step.step} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  {step.warning && (
                    <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-warning">Warning</p>
                        <p className="text-sm text-muted-foreground">{step.warning}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 text-center space-y-4">
            <Button variant="emergency" size="lg" className="w-full sm:w-auto">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Services
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>This information is for educational purposes only.</p>
              <p>Always seek professional medical help for serious injuries.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">First Aid Emergency Guide</h1>
            <p className="text-muted-foreground">Quick access to life-saving first aid instructions</p>
          </div>
        </div>

        {/* Emergency Banner */}
        <Card className="mb-8 border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <Phone className="w-8 h-8 text-destructive mx-auto mb-2" />
              <h3 className="font-bold text-lg mb-2">Emergency Contact Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">🇺🇸 United States: 911</p>
                  <p className="text-muted-foreground">Police, Fire, Medical</p>
                </div>
                <div>
                  <p className="font-semibold">🇮🇳 India: 108</p>
                  <p className="text-muted-foreground">Emergency Medical Services</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Aid Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {firstAidTopics.map((topic) => (
            <Card 
              key={topic.id}
              className="group hover:shadow-float transition-all duration-300 cursor-pointer h-full"
              onClick={() => setSelectedTopic(topic)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {topic.icon}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <Badge variant={getSeverityColor(topic.severity) as any} className="text-xs">
                    {getSeverityLabel(topic.severity)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Instructions
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="mt-12 border-warning bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-2">Important Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  This first aid information is for educational purposes only and should not replace professional medical training. 
                  In any emergency, always call professional emergency services immediately. Consider taking a certified first aid course 
                  for comprehensive training.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};