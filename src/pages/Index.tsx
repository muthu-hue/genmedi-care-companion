import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { MedicalDashboard } from "@/components/MedicalDashboard";
import { SymptomChecker } from "@/components/SymptomChecker";
import { MedicationInfo } from "@/components/MedicationInfo";
import { FirstAidGuide } from "@/components/FirstAidGuide";
import { LogOut } from 'lucide-react';

type ActiveService = 'dashboard' | 'symptoms' | 'medication' | 'firstaid' | 'doctors' | 'faq' | 'tips';

const Index = () => {
  const [activeService, setActiveService] = useState<ActiveService>('dashboard');
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleServiceSelect = (service: string) => {
    setActiveService(service as ActiveService);
  };

  const handleBackToDashboard = () => {
    setActiveService('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Doctor Finder</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Find healthcare providers near you</p>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Health FAQ</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Medical knowledge chatbot</p>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        );
      case 'tips':
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Health Tips</h2>
              <p className="text-muted-foreground mb-4">Coming soon - Daily wellness advice</p>
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        );
      default:
        return <MedicalDashboard onServiceSelect={handleServiceSelect} />;
    }
  };

  return (
    <MedicalSidebar>
      {renderActiveService()}
    </MedicalSidebar>
  );
};

export default Index;