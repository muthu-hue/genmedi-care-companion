import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertTriangle, Search, Stethoscope, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomCheckerProps {
  onBack: () => void;
}

interface SymptomResult {
  condition: string;
  probability: string;
  description: string;
  recommendations: string[];
}

export const SymptomChecker = ({ onBack }: SymptomCheckerProps) => {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SymptomResult[]>([]);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your symptoms to get started with the analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: SymptomResult[] = [
        {
          condition: "Common Cold",
          probability: "High (75%)",
          description: "A viral infection of the upper respiratory tract, typically mild and self-limiting.",
          recommendations: [
            "Rest and drink plenty of fluids",
            "Consider over-the-counter pain relievers",
            "Monitor for worsening symptoms",
            "Consult a doctor if symptoms persist beyond 10 days"
          ]
        },
        {
          condition: "Seasonal Allergies",
          probability: "Medium (45%)",
          description: "Allergic reaction to environmental allergens like pollen or dust.",
          recommendations: [
            "Identify and avoid allergen triggers",
            "Consider antihistamines",
            "Keep windows closed during high pollen days",
            "Consult an allergist for testing"
          ]
        },
        {
          condition: "Viral Respiratory Infection",
          probability: "Medium (35%)",
          description: "Various viral infections affecting the respiratory system.",
          recommendations: [
            "Rest and supportive care",
            "Stay hydrated",
            "Monitor temperature",
            "Seek medical care if breathing difficulties occur"
          ]
        }
      ];
      
      setResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Your symptom analysis is ready. Please review the results below.",
      });
    }, 2000);
  };

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
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Symptom Checker</h1>
            <p className="text-muted-foreground">Describe your symptoms to get possible conditions and next steps</p>
          </div>
        </div>

        {/* Input Form */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Tell me about your symptoms</CardTitle>
            <CardDescription>
              Please provide as much detail as possible for a more accurate analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="symptoms">Describe your symptoms *</Label>
              <Textarea
                id="symptoms"
                placeholder="e.g., I have been experiencing headache, runny nose, and fatigue for the past 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="mt-2 min-h-24"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">How long?</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">A few hours</SelectItem>
                    <SelectItem value="1-day">1 day</SelectItem>
                    <SelectItem value="2-3-days">2-3 days</SelectItem>
                    <SelectItem value="1-week">About a week</SelectItem>
                    <SelectItem value="more-week">More than a week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              variant="medical" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing symptoms...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
              <p className="text-muted-foreground">Based on your symptoms, here are some possible conditions:</p>
            </div>

            {/* Disclaimer */}
            <Card className="border-warning bg-warning/5">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Important Medical Disclaimer</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This analysis is for informational purposes only and is not a medical diagnosis. 
                      Please consult with a healthcare professional for proper medical advice, 
                      diagnosis, and treatment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{result.condition}</CardTitle>
                      <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {result.probability}
                      </span>
                    </div>
                    <CardDescription>{result.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-medium mb-2">Recommended next steps:</h4>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg">
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Doctors
              </Button>
              <Button variant="outline" size="lg">
                Get Second Opinion
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};