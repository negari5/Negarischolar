
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, MapPin, Calendar, Target, BookOpen, Briefcase, 
  GraduationCap, Award, TrendingUp, CheckCircle, Clock 
} from 'lucide-react';

interface Journey {
  id: string;
  title: string;
  type: string;
  description: string;
  startDate: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'paused';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

const JourneyTracker = () => {
  const [journeys, setJourneys] = useState<Journey[]>([
    {
      id: '1',
      title: 'University Application Process',
      type: 'education',
      description: 'Complete university applications for fall semester',
      startDate: '2025-01-01',
      targetDate: '2025-06-01',
      progress: 40,
      status: 'active',
      milestones: [
        { id: '1', title: 'Research Universities', description: 'Research and shortlist 10 universities', completed: true },
        { id: '2', title: 'Prepare Documents', description: 'Gather transcripts, essays, and recommendations', completed: true },
        { id: '3', title: 'Submit Applications', description: 'Submit applications to chosen universities', completed: false, dueDate: '2025-03-01' },
        { id: '4', title: 'Apply for Scholarships', description: 'Apply for financial aid and scholarships', completed: false, dueDate: '2025-04-01' },
        { id: '5', title: 'Make Final Decision', description: 'Choose university based on acceptances', completed: false, dueDate: '2025-05-15' }
      ]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    description: '',
    targetDate: ''
  });

  const { toast } = useToast();

  const journeyTypes = [
    { value: 'education', label: 'Educational Goal', icon: GraduationCap },
    { value: 'career', label: 'Career Development', icon: Briefcase },
    { value: 'skill', label: 'Skill Building', icon: BookOpen },
    { value: 'competition', label: 'Competition/Award', icon: Award },
    { value: 'personal', label: 'Personal Development', icon: Target }
  ];

  const addJourney = () => {
    if (!formData.title || !formData.type || !formData.description || !formData.targetDate) {
      toast({
        title: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const newJourney: Journey = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      description: formData.description,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: formData.targetDate,
      progress: 0,
      status: 'active',
      milestones: []
    };

    setJourneys([...journeys, newJourney]);
    setFormData({ title: '', type: '', description: '', targetDate: '' });
    setShowAddForm(false);
    
    toast({
      title: "Journey Added!",
      description: "Your new journey has been created successfully."
    });
  };

  const toggleMilestone = (journeyId: string, milestoneId: string) => {
    setJourneys(journeys.map(journey => {
      if (journey.id === journeyId) {
        const updatedMilestones = journey.milestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, completed: !milestone.completed }
            : milestone
        );

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newProgress = updatedMilestones.length > 0 
          ? (completedCount / updatedMilestones.length) * 100 
          : 0;

        return {
          ...journey,
          milestones: updatedMilestones,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'active'
        };
      }
      return journey;
    }));

    toast({
      title: "Milestone Updated!",
      description: "Your progress has been updated."
    });
  };

  const getTypeIcon = (type: string) => {
    const journeyType = journeyTypes.find(t => t.value === type);
    return journeyType ? journeyType.icon : Target;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showAddForm) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-negari-indigo">
            <Plus className="h-5 w-5" />
            Add New Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Journey Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Master's Degree Application"
              className="bg-white/80 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Journey Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-white/80 rounded-lg">
                <SelectValue placeholder="Select journey type" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm rounded-lg">
                {journeyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your journey and what you want to achieve..."
              className="bg-white/80 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Target Completion Date</label>
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="bg-white/80 rounded-lg"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={addJourney}
              className="bg-negari-orange hover:bg-negari-indigo text-white"
            >
              Create Journey
            </Button>
            <Button
              onClick={() => setShowAddForm(false)}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedJourney) {
    const journey = journeys.find(j => j.id === selectedJourney);
    if (!journey) return null;

    const Icon = getTypeIcon(journey.type);

    return (
      <div className="space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-negari-indigo">
                <Icon className="h-5 w-5" />
                {journey.title}
              </CardTitle>
              <Button
                onClick={() => setSelectedJourney(null)}
                variant="outline"
                size="sm"
              >
                Back to All Journeys
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">{journey.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Target: {new Date(journey.targetDate).toLocaleDateString()}</span>
                </div>
                <Badge className={getStatusColor(journey.status)}>
                  {journey.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(journey.progress)}%</span>
                </div>
                <Progress value={journey.progress} className="w-full" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-negari-indigo">
              <MapPin className="h-5 w-5" />
              Milestones ({journey.milestones.filter(m => m.completed).length}/{journey.milestones.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {journey.milestones.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No milestones added yet.</p>
                <p className="text-sm">Break down your journey into smaller, achievable milestones.</p>
              </div>
            ) : (
              journey.milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4 p-4 bg-white/80 rounded-lg">
                  <button
                    onClick={() => toggleMilestone(journey.id, milestone.id)}
                    className={`mt-1 p-1 rounded-full transition-colors ${
                      milestone.completed
                        ? 'bg-green-500 text-white'
                        : 'border-2 border-gray-300 hover:border-negari-orange'
                    }`}
                  >
                    {milestone.completed && <CheckCircle className="h-4 w-4" />}
                    {!milestone.completed && <div className="h-4 w-4" />}
                  </button>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${milestone.completed ? 'line-through text-gray-500' : 'text-negari-indigo'}`}>
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                    {milestone.dueDate && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                        <Clock className="h-3 w-3" />
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 font-medium">
                    {index + 1}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-negari-indigo">My Journey Tracker</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-negari-orange hover:bg-negari-indigo text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Journey
        </Button>
      </div>

      {journeys.length === 0 ? (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Your First Journey</h3>
            <p className="text-gray-500 mb-6">Track your progress towards your goals and dreams</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-negari-orange hover:bg-negari-indigo text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Journey
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {journeys.map((journey) => {
            const Icon = getTypeIcon(journey.type);
            const daysLeft = Math.ceil((new Date(journey.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card 
                key={journey.id}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedJourney(journey.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-negari-indigo">
                      <Icon className="h-5 w-5" />
                      {journey.title}
                    </CardTitle>
                    <Badge className={getStatusColor(journey.status)}>
                      {journey.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">{journey.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(journey.progress)}%</span>
                    </div>
                    <Progress value={journey.progress} className="w-full" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{journey.milestones.length} milestones</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JourneyTracker;
