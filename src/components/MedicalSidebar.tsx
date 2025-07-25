import { useState, useEffect } from "react";
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
    url: "https://v0-medical-chatbot-website-six.vercel.app"
  },
  {
    id: "risk-prediction",
    title: "Disease Risk Prediction",
    description: "Predict disease risk factors",
    icon: <Activity className="h-4 w-4" />,
    url: "https://v0-disease-risk-prediction.vercel.app"
  },
  {
    id: "first-aid",
    title: "Dynamic First Aid Guide",
    description: "Interactive first aid assistance",
    icon: <Shield className="h-4 w-4" />,
    url: "https://v0-dynamic-first-aid-guide.vercel.app"
  },
  {
    id: "disease-identifier",
    title: "Disease Identifier AI",
    description: "AI-powered disease identification",
    icon: <Search className="h-4 w-4" />,
    url: "https://v0-disease-identifier-ai.vercel.app"
  }
];

export const MedicalSidebar = ({ children }: MedicalSidebarProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSectionClick = (sectionId: string) => {
    const newSection = activeSection === sectionId ? null : sectionId;
    setActiveSection(newSection);
    setHasError(false);
    
    if (newSection) {
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
    }
  };

  const handleBackToHome = () => {
    setActiveSection(null);
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log(`Iframe loaded successfully: ${activeSection}`);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error(`Iframe failed to load: ${activeSection}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey(prev => prev + 1);
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

          <main className="flex-1 overflow-hidden">
            {activeSection ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-muted/50 flex-shrink-0">
                  <div className="max-w-4xl">
                    <h2 className="text-xl font-semibold mb-2">
                      {currentSection?.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {currentSection?.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 relative bg-white">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading {currentSection?.title}...</p>
                      </div>
                    </div>
                  )}
                  
                  {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                      <div className="text-center">
                        <p className="text-sm text-destructive mb-2">Failed to load {currentSection?.title}</p>
                        <Button onClick={handleRefresh} size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <iframe
                    key={`${activeSection}-${iframeKey}`}
                    src={currentSection?.url}
                    className="w-full h-full border-0"
                    title={currentSection?.title}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-modals"
                    allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="eager"
                    style={{ 
                      minHeight: 'calc(100vh - 200px)',
                      display: hasError ? 'none' : 'block'
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