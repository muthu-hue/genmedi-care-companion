import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  MessageSquare, 
  Activity, 
  Shield, 
  Search,
  Home,
  X,
  RefreshCw
} from "lucide-react";

interface MedicalSidebarProps {
  children: React.ReactNode;
}

interface SidebarSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

const sidebarSections: SidebarSection[] = [
  {
    id: "chatbot",
    title: "Medical Chatbot",
    description: "AI-powered medical consultation",
    icon: <MessageSquare className="h-4 w-4" />,
    url: "https://v0-medical-chatbot-website-six.vercel.app/"
  },
  {
    id: "risk-prediction",
    title: "Disease Risk Prediction",
    description: "Predict disease risk factors",
    icon: <Activity className="h-4 w-4" />,
    url: "https://v0-disease-risk-prediction.vercel.app/"
  },
  {
    id: "first-aid",
    title: "Dynamic First Aid Guide",
    description: "Interactive first aid assistance",
    icon: <Shield className="h-4 w-4" />,
    url: "https://v0-dynamic-first-aid-guide.vercel.app/"
  },
  {
    id: "disease-identifier",
    title: "Disease Identifier AI",
    description: "AI-powered disease identification",
    icon: <Search className="h-4 w-4" />,
    url: "https://v0-disease-identifier-ai.vercel.app/"
  }
];

export const MedicalSidebar = ({ children }: MedicalSidebarProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    const newSection = activeSection === sectionId ? null : sectionId;
    setActiveSection(newSection);
    
    if (newSection) {
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
      // Set a timeout to hide loading after 5 seconds regardless
      setTimeout(() => setIsLoading(false), 5000);
    }
  };

  const handleBackToHome = () => {
    setActiveSection(null);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 5000);
  };

  const currentSection = sidebarSections.find(s => s.id === activeSection);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-semibold">
                Medical Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleBackToHome}
                      isActive={activeSection === null}
                      className="w-full justify-start"
                    >
                      <Home className="h-4 w-4" />
                      <span>Dashboard Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {sidebarSections.map((section) => (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton
                        onClick={() => handleSectionClick(section.id)}
                        isActive={activeSection === section.id}
                        className="w-full justify-start"
                      >
                        {section.icon}
                        <span>{section.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <h1 className="text-lg font-semibold">
                {activeSection 
                  ? currentSection?.title 
                  : "MediCare AI Dashboard"
                }
              </h1>
              {activeSection && (
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToHome}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              )}
            </div>
          </header>

          <main className="flex-1">
            {activeSection ? (
              <div className="h-full">
                <div className="p-4 border-b bg-muted/50">
                  <div className="max-w-4xl">
                    <h2 className="text-xl font-semibold mb-2">
                      {currentSection?.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {currentSection?.description}
                    </p>
                  </div>
                </div>
                
                <div className="relative" style={{ height: 'calc(100vh - 180px)' }}>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading {currentSection?.title}...</p>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    key={`${activeSection}-${iframeKey}`}
                    src={currentSection?.url}
                    className="w-full h-full border-0 bg-white"
                    title={currentSection?.title}
                    onLoad={handleIframeLoad}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 h-full overflow-auto">
                {children}
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};