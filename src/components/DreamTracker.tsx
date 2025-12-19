import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Target, Edit3, Save, X, Plus, CheckCircle2 } from 'lucide-react';

interface Dream {
  id: string;
  category: string;
  university: string;
  field_of_study: string;
  country: string;
  scholarship_target: string;
  degree_level: string;
  motivation: string;
  career_goal: string;
  target_timeline: string;
  status: 'dream' | 'prepare' | 'apply' | 'win';
  progress_percentage: number;
}

const DreamTracker: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDream, setEditingDream] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    university: '',
    field_of_study: '',
    country: '',
    scholarship_target: '',
    degree_level: '',
    motivation: '',
    career_goal: '',
    target_timeline: '',
    status: 'dream' as 'dream' | 'prepare' | 'apply' | 'win'
  });

  const dreamCategories = [
    { value: 'education', label: 'Higher Education', icon: '🎓' },
    { value: 'career', label: 'Career Goal', icon: '💼' },
    { value: 'entrepreneurship', label: 'Entrepreneurship', icon: '🚀' },
    { value: 'research', label: 'Research', icon: '🔬' },
    { value: 'other', label: 'Other', icon: '✨' }
  ];

  const timeframes = [
    { value: '1_year', label: '1 Year' },
    { value: '2_years', label: '2 Years' },
    { value: '3_years', label: '3 Years' },
    { value: '4_years', label: '4 Years' },
    { value: '5_plus_years', label: '5+ Years' }
  ];

  const statusOptions = [
    { value: 'dream', label: 'Dream', color: 'bg-gray-100 text-gray-800' },
    { value: 'prepare', label: 'Preparing', color: 'bg-blue-100 text-blue-800' },
    { value: 'apply', label: 'Applying', color: 'bg-orange-100 text-orange-800' },
    { value: 'win', label: 'Achieved!', color: 'bg-green-100 text-green-800' }
  ];

  useEffect(() => {
    if (user) {
      fetchDreams();
    }
  }, [user]);

  const fetchDreams = async () => {
    try {
      // Mock data for now since database tables don't exist yet
      const mockDreams: Dream[] = [
        {
          id: '1',
          category: 'education',
          university: 'Harvard University',
          field_of_study: 'Computer Science',
          country: 'United States',
          scholarship_target: 'Fulbright Scholarship',
          degree_level: 'master',
          motivation: 'To advance my knowledge in AI and machine learning',
          career_goal: 'Become a research scientist in AI',
          target_timeline: '2_years',
          status: 'prepare',
          progress_percentage: 35
        }
      ];
      
      setDreams(mockDreams);
    } catch (error) {
      console.error('Error fetching dreams:', error);
      toast({
        title: "Error",
        description: "Failed to load your dreams.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingDream) {
        // Update existing dream
        setDreams(prev => prev.map(dream => 
          dream.id === editingDream 
            ? { ...dream, ...formData, progress_percentage: dream.progress_percentage }
            : dream
        ));

        toast({
          title: "Dream Updated!",
          description: "Your dream has been updated successfully."
        });
      } else {
        // Add new dream
        const newDream: Dream = {
          id: Date.now().toString(),
          ...formData,
          progress_percentage: 0
        };
        
        setDreams(prev => [newDream, ...prev]);

        toast({
          title: "Dream Added!",
          description: "Your new dream has been saved."
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving dream:', error);
      toast({
        title: "Error",
        description: "Failed to save your dream. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (dream: Dream) => {
    setFormData({
      category: dream.category,
      university: dream.university || '',
      field_of_study: dream.field_of_study || '',
      country: dream.country || '',
      scholarship_target: dream.scholarship_target || '',
      degree_level: dream.degree_level || '',
      motivation: dream.motivation || '',
      career_goal: dream.career_goal || '',
      target_timeline: dream.target_timeline || '',
      status: dream.status
    });
    setEditingDream(dream.id);
    setShowForm(true);
  };

  const updateProgress = async (dreamId: string, newProgress: number) => {
    try {
      setDreams(prev => prev.map(dream => 
        dream.id === dreamId 
          ? { ...dream, progress_percentage: newProgress }
          : dream
      ));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      university: '',
      field_of_study: '',
      country: '',
      scholarship_target: '',
      degree_level: '',
      motivation: '',
      career_goal: '',
      target_timeline: '',
      status: 'dream'
    });
    setEditingDream(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color}>
        {statusConfig?.label}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading your dreams...</div>;
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-negari-indigo">My Dreams & Goals</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-negari-orange hover:bg-negari-indigo"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dream
          </Button>
        </div>
      )}

      {showForm && (
        <Card className="border-2 border-negari-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingDream ? 'Edit Dream' : 'Add New Dream'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Dream Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {dreamCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university">Target University</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    placeholder="e.g., Harvard University"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="e.g., United States"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="field_of_study">Field of Study</Label>
                  <Input
                    id="field_of_study"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <Label htmlFor="degree_level">Degree Level</Label>
                  <Select value={formData.degree_level} onValueChange={(value) => setFormData({...formData, degree_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scholarship_target">Target Scholarship</Label>
                  <Input
                    id="scholarship_target"
                    value={formData.scholarship_target}
                    onChange={(e) => setFormData({...formData, scholarship_target: e.target.value})}
                    placeholder="e.g., Fulbright Scholarship"
                  />
                </div>

                <div>
                  <Label htmlFor="target_timeline">Timeline</Label>
                  <Select value={formData.target_timeline} onValueChange={(value) => setFormData({...formData, target_timeline: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {timeframes.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="motivation">Motivation</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  placeholder="Why is this dream important to you?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="career_goal">Career Goal</Label>
                <Textarea
                  id="career_goal"
                  value={formData.career_goal}
                  onChange={(e) => setFormData({...formData, career_goal: e.target.value})}
                  placeholder="What do you want to achieve with this education?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-negari-orange hover:bg-negari-indigo">
                  <Save className="h-4 w-4 mr-2" />
                  {editingDream ? 'Update Dream' : 'Save Dream'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {dreams.map((dream) => (
          <Card key={dream.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-negari-orange" />
                    {dream.university || dream.field_of_study || 'Untitled Dream'}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(dream.status)}
                    {dream.country && (
                      <Badge variant="outline">{dream.country}</Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(dream)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dream.field_of_study && (
                <p><strong>Field:</strong> {dream.field_of_study}</p>
              )}
              {dream.degree_level && (
                <p><strong>Degree:</strong> {dream.degree_level}</p>
              )}
              {dream.scholarship_target && (
                <p><strong>Target Scholarship:</strong> {dream.scholarship_target}</p>
              )}
              {dream.motivation && (
                <p><strong>Motivation:</strong> {dream.motivation}</p>
              )}
              {dream.career_goal && (
                <p><strong>Career Goal:</strong> {dream.career_goal}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600">{dream.progress_percentage}%</span>
                </div>
                <Progress value={dream.progress_percentage} className="h-2" />
                <div className="flex gap-2 mt-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <Button
                      key={percentage}
                      variant="outline"
                      size="sm"
                      onClick={() => updateProgress(dream.id, percentage)}
                      className={`text-xs ${dream.progress_percentage >= percentage ? 'bg-negari-orange text-white' : ''}`}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {dreams.length === 0 && !showForm && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Dreams Yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first dream or goal!</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-negari-orange hover:bg-negari-indigo"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Dream
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DreamTracker;