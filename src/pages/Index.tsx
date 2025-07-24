import { useState } from "react";
import { MedicalDashboard } from "@/components/MedicalDashboard";
import { SymptomChecker } from "@/components/SymptomChecker";
import { MedicationInfo } from "@/components/MedicationInfo";
import { FirstAidGuide } from "@/components/FirstAidGuide";

type ActiveService = 'dashboard' | 'symptoms' | 'medication' | 'firstaid' | 'doctors' | 'faq' | 'tips';

const Index = () => {
  const [activeService, setActiveService] = useState<ActiveService>('dashboard');

  const handleServiceSelect = (service: string) => {
    setActiveService(service as ActiveService);
  };

  const handleBackToDashboard = () => {
    setActiveService('dashboard');
  };

  // Render the appropriate component based on active service
  const renderActiveService = () => {
    switch (activeService) {
      case 'symptoms':
        return <SymptomChecker onBack={handleBackToDashboard} />;
      case 'medication':
        return <MedicationInfo onBack={handleBackToDashboard} />;
      case 'firstaid':
        return <FirstAidGuide onBack={handleBackToDashboard} />;
      case 'doctors':
        // TODO: Implement DoctorFinder component
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Doctor Finder</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Find healthcare providers near you</p>
              <button 
                onClick={handleBackToDashboard}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'faq':
        // TODO: Implement FAQ component
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Health FAQ</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Medical knowledge chatbot</p>
              <button 
                onClick={handleBackToDashboard}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'tips':
        // TODO: Implement Health Tips component
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Health Tips</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Daily wellness advice</p>
              <button 
                onClick={handleBackToDashboard}
                className="text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return <MedicalDashboard onServiceSelect={handleServiceSelect} />;
    }
  };

  return renderActiveService();
};

export default Index;