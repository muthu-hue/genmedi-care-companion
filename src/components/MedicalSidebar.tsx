import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  X
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

  const handleSectionClick = (sectionId: string) => {
    const newSection = activeSection === sectionId ? null : sectionId;
    setActiveSection(newSection);
    // Force iframe reload by changing key
    if (newSection) {
      setIframeKey(prev => prev + 1);
    }
  };

  const handleBackToHome = () => {
    setActiveSection(null);
    setIframeKey(prev => prev + 1);
  };

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
                  ? sidebarSections.find(s => s.id === activeSection)?.title 
                  : "MediCare AI Dashboard"
                }
              </h1>
              {activeSection && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToHome}
                  className="ml-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 min-h-0">
            {activeSection ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-muted/50 flex-shrink-0">
                  <div className="max-w-4xl">
                    <h2 className="text-xl font-semibold mb-2">
                      {sidebarSections.find(s => s.id === activeSection)?.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {sidebarSections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-h-0 iframe-container">
                  <iframe
                    key={`iframe-${activeSection}-${iframeKey}`}
                    src={sidebarSections.find(s => s.id === activeSection)?.url}
                    className="w-full h-full border-0 bg-white"
                    title={sidebarSections.find(s => s.id === activeSection)?.title}
                    allow="camera; microphone; geolocation; fullscreen; payment; autoplay; encrypted-media"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-modals"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ minHeight: '600px' }}
                    onLoad={() => console.log(`Iframe loaded: ${activeSection}`)}
                    onError={(e) => console.error(`Iframe error: ${activeSection}`, e)}
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