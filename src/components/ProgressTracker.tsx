
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, CheckCircle2, Clock, ArrowRight, BookOpen, PenTool, Edit } from "lucide-react";
import { useState } from "react";

interface ProgressTrackerProps {
  onNotification: (title: string, description: string) => void;
}

const ProgressTracker = ({ onNotification }: ProgressTrackerProps) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [dreamDetails, setDreamDetails] = useState({
    university: "Harvard University",
    field: "Computer Science",
    country: "United States",
    scholarshipTarget: "Gates Scholarship"
  });
  const [editingDream, setEditingDream] = useState({...dreamDetails});
  const [isEditingStep, setIsEditingStep] = useState<number | null>(null);
  
  const [steps, setSteps] = useState([
    { id: 1, name: "Dream", description: "Define your goals", status: "completed", icon: Target, details: "University selected, Field chosen, Goals defined" },
    { id: 2, name: "Prepare", description: "Build your skills", status: "current", icon: Clock, details: "Taking IELTS prep, Building portfolio, Networking" },
    { id: 3, name: "Apply", description: "Submit applications", status: "upcoming", icon: ArrowRight, details: "Application deadlines tracked, Essays in progress" },
    { id: 4, name: "Win", description: "Achieve your dream", status: "upcoming", icon: CheckCircle2, details: "Scholarship interviews, Final preparations" },
  ]);

  const progress = (currentStep / steps.length) * 100;

  const handleUpdateDream = () => {
    setDreamDetails({...editingDream});
    onNotification(
      "Dream Updated Successfully!",
      `Your dream to study ${editingDream.field} at ${editingDream.university} has been saved. Keep pushing forward!`
    );
  };

  const handleUpdateStep = (stepId: number, newDetails: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? {...step, details: newDetails} : step
    ));
    setIsEditingStep(null);
    onNotification(
      "Step Updated!",
      "Your progress step has been updated successfully."
    );
  };

  const handleStepStatusChange = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return;

    let newStatus = step.status;
    if (step.status === 'upcoming') newStatus = 'current';
    else if (step.status === 'current') newStatus = 'completed';
    else if (step.status === 'completed') newStatus = 'upcoming';

    setSteps(prev => prev.map(s => 
      s.id === stepId ? {...s, status: newStatus} : s
    ));

    // Update current step based on completed steps
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    setCurrentStep(Math.max(1, completedSteps + 1));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-negari-indigo/70">
          <span>Progress</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-xs text-gray-600 mt-2">
          You're doing great! Keep up the momentum towards your dream.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Dialog key={step.id}>
              <DialogTrigger asChild>
                <div
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover-bounce cursor-pointer ${
                    step.status === 'completed'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : step.status === 'current'
                      ? 'bg-negari-orange/10 border-negari-orange text-negari-orange'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                      step.status === 'completed'
                        ? 'bg-green-100'
                        : step.status === 'current'
                        ? 'bg-negari-orange/20'
                        : 'bg-gray-100'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{step.name}</h4>
                      <p className="text-xs opacity-80">{step.description}</p>
                    </div>
                    {step.status === 'completed' && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        ✓ Done
                      </Badge>
                    )}
                    {step.status === 'current' && (
                      <Badge variant="secondary" className="bg-negari-orange/20 text-negari-orange text-xs">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {step.name} Phase Details
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600">{step.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Current Actions:</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingStep(isEditingStep === step.id ? null : step.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    {isEditingStep === step.id ? (
                      <div className="space-y-2">
                        <Input
                          value={step.details}
                          onChange={(e) => setSteps(prev => prev.map(s => 
                            s.id === step.id ? {...s, details: e.target.value} : s
                          ))}
                          placeholder="Enter step details"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStep(step.id, step.details)}
                            className="bg-negari-orange hover:bg-negari-indigo"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingStep(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">{step.details}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStepStatusChange(step.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Mark as {step.status === 'completed' ? 'Pending' : step.status === 'current' ? 'Completed' : 'Current'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-negari-orange to-negari-gold hover:from-negari-gold hover:to-negari-orange text-white font-semibold px-8 py-3 rounded-full hover-bounce transition-all duration-300"
            >
              <Target className="mr-2 h-5 w-5" />
              Update My Dream
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Your Dream Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="university">Target University</Label>
                  <Input
                    id="university"
                    value={editingDream.university}
                    onChange={(e) => setEditingDream({...editingDream, university: e.target.value})}
                    placeholder="Enter target university"
                  />
                </div>
                <div>
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={editingDream.field}
                    onChange={(e) => setEditingDream({...editingDream, field: e.target.value})}
                    placeholder="Enter field of study"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={editingDream.country}
                    onChange={(e) => setEditingDream({...editingDream, country: e.target.value})}
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <Label htmlFor="scholarship">Scholarship Target</Label>
                  <Input
                    id="scholarship"
                    value={editingDream.scholarshipTarget}
                    onChange={(e) => setEditingDream({...editingDream, scholarshipTarget: e.target.value})}
                    placeholder="Enter scholarship target"
                  />
                </div>
              </div>
              <div className="bg-negari-gold/10 p-4 rounded-lg">
                <h4 className="font-semibold text-negari-indigo mb-2">Your Journey Preview:</h4>
                <ul className="text-sm space-y-1">
                  <li>🎯 Dream: {editingDream.field} at {editingDream.university}</li>
                  <li>🌍 Location: {editingDream.country}</li>
                  <li>🏆 Scholarship: {editingDream.scholarshipTarget}</li>
                </ul>
              </div>
              <Button 
                onClick={handleUpdateDream}
                className="w-full bg-negari-orange hover:bg-negari-orange/90"
              >
                Save Dream Updates
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProgressTracker;
