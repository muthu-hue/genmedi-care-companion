import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pill, Search, Clock, AlertTriangle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MedicationInfoProps {
  onBack: () => void;
}

interface MedicationDetails {
  name: string;
  genericName: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
}

interface Reminder {
  id: number;
  medicine: string;
  time: string;
  frequency: string;
  notes: string;
}

export const MedicationInfo = ({ onBack }: MedicationInfoProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [medicationDetails, setMedicationDetails] = useState<MedicationDetails | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicine: "",
    time: "",
    frequency: "daily",
    notes: ""
  });
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Please enter a medication name",
        description: "Enter the name of the medication you want to search for.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      const mockMedication: MedicationDetails = {
        name: "Paracetamol",
        genericName: "Acetaminophen",
        uses: [
          "Pain relief (headaches, muscle aches, backaches)",
          "Fever reduction",
          "Arthritis pain relief",
          "Post-surgical pain management"
        ],
        dosage: "Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day",
        sideEffects: [
          "Nausea (rare)",
          "Skin rash (rare)",
          "Liver damage (with overdose)",
          "Allergic reactions (very rare)"
        ],
        warnings: [
          "Do not exceed recommended dose",
          "Avoid alcohol while taking this medication",
          "Consult doctor if you have liver disease",
          "Not suitable for children under 3 months"
        ],
        interactions: [
          "Warfarin (blood thinner)",
          "Alcohol (increases liver damage risk)",
          "Other acetaminophen-containing medications"
        ]
      };
      
      setMedicationDetails(mockMedication);
      setIsSearching(false);
      
      toast({
        title: "Medication found",
        description: "Information loaded successfully.",
      });
    }, 1500);
  };

  const handleAddReminder = () => {
    if (!newReminder.medicine.trim() || !newReminder.time) {
      toast({
        title: "Please fill required fields",
        description: "Medicine name and time are required.",
        variant: "destructive"
      });
      return;
    }

    const reminder: Reminder = {
      id: Date.now(),
      ...newReminder
    };

    setReminders([...reminders, reminder]);
    setNewReminder({ medicine: "", time: "", frequency: "daily", notes: "" });
    setShowReminderForm(false);
    
    toast({
      title: "Reminder added",
      description: `Reminder set for ${newReminder.medicine} at ${newReminder.time}`,
    });
  };

  const removeReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({
      title: "Reminder removed",
      description: "The medication reminder has been deleted.",
    });
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
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Medication Information</h1>
            <p className="text-muted-foreground">Search for drug information and manage medication reminders</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle>Search Medication</CardTitle>
            <CardDescription>
              Enter the name of a medication to get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Label htmlFor="search">Medication name</Label>
                <Input
                  id="search"
                  placeholder="e.g., Paracetamol, Aspirin, Ibuprofen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="medical" 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medication Details */}
        {medicationDetails && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{medicationDetails.name}</CardTitle>
                  <CardDescription className="text-base">
                    Generic name: {medicationDetails.genericName}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReminderForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Set Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Uses */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Uses</h3>
                <div className="grid gap-2">
                  {medicationDetails.uses.map((use, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{use}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dosage */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Dosage</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{medicationDetails.dosage}</p>
                </div>
              </div>

              {/* Side Effects */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Possible Side Effects</h3>
                <div className="grid gap-2">
                  {medicationDetails.sideEffects.map((effect, index) => (
                    <Badge key={index} variant="secondary" className="w-fit">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center">
                  <AlertTriangle className="w-5 h-5 text-warning mr-2" />
                  Important Warnings
                </h3>
                <div className="grid gap-2">
                  {medicationDetails.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-warning rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-sm">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drug Interactions */}
              <div>
                <h3 className="font-semibold mb-3 text-lg">Drug Interactions</h3>
                <div className="grid gap-2">
                  {medicationDetails.interactions.map((interaction, index) => (
                    <Badge key={index} variant="outline" className="w-fit border-destructive text-destructive">
                      {interaction}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reminder Form */}
        {showReminderForm && (
          <Card className="mb-8 shadow-card border-primary">
            <CardHeader>
              <CardTitle>Set Medication Reminder</CardTitle>
              <CardDescription>
                Add a reminder to help you take your medication on time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder-medicine">Medicine name *</Label>
                  <Input
                    id="reminder-medicine"
                    placeholder="e.g., Paracetamol 500mg"
                    value={newReminder.medicine}
                    onChange={(e) => setNewReminder({...newReminder, medicine: e.target.value})}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="reminder-time">Time *</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reminder-frequency">Frequency</Label>
                <Select value={newReminder.frequency} onValueChange={(value) => setNewReminder({...newReminder, frequency: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice-daily">Twice daily</SelectItem>
                    <SelectItem value="three-times">Three times daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="reminder-notes">Notes (optional)</Label>
                <Input
                  id="reminder-notes"
                  placeholder="e.g., Take with food"
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}
                  className="mt-2"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button variant="medical" onClick={handleAddReminder}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
                <Button variant="outline" onClick={() => setShowReminderForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Reminders */}
        {reminders.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Your Medication Reminders
              </CardTitle>
              <CardDescription>
                Manage your current medication schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{reminder.medicine}</h4>
                      <p className="text-sm text-muted-foreground">
                        {reminder.time} - {reminder.frequency}
                        {reminder.notes && ` (${reminder.notes})`}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeReminder(reminder.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};