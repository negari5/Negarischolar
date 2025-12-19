import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, MapPin, GraduationCap, Globe, Calendar, ExternalLink, User } from 'lucide-react';

interface SuccessStory {
  id: string;
  title: string;
  student_name: string;
  student_photo: string;
  university: string;
  country: string;
  field_of_study: string;
  degree_level: string;
  scholarship_received: string;
  story_content: string;
  key_advice: string[];
  timeline_years: number;
  original_city: string;
  current_status: string;
  contact_available: boolean;
  contact_email: string;
  linkedin_url: string;
  featured: boolean;
}

const EnhancedSuccessStories: React.FC = () => {
  const { toast } = useToast();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  useEffect(() => {
    fetchSuccessStories();
  }, []);

  const fetchSuccessStories = async () => {
    try {
      // Mock success stories data for now
      const mockStories: SuccessStory[] = [
        {
          id: '1',
          title: 'From Addis Ababa to Harvard: My Journey in Public Health',
          student_name: 'Hana Tesfaye',
          student_photo: '',
          university: 'Harvard University',
          country: 'United States',
          field_of_study: 'Public Health',
          degree_level: 'master',
          scholarship_received: 'Fulbright Scholarship',
          story_content: 'Growing up in Addis Ababa, I always dreamed of making a difference in healthcare. After completing my undergraduate degree in Biology at Addis Ababa University, I worked for two years at a local NGO focusing on maternal health. This experience opened my eyes to the global health challenges our country faces and motivated me to pursue advanced studies abroad.',
          key_advice: [
            'Start your application process at least 18 months in advance',
            'Focus on gaining relevant work experience before applying',
            'Practice English daily and take the TOEFL multiple times if needed'
          ],
          timeline_years: 3,
          original_city: 'Addis Ababa',
          current_status: 'Currently studying at Harvard School of Public Health',
          contact_available: false,
          contact_email: '',
          linkedin_url: '',
          featured: true
        },
        {
          id: '2',
          title: 'Breaking Barriers: My Engineering Journey to MIT',
          student_name: 'Samuel Girma',
          student_photo: '',
          university: 'Massachusetts Institute of Technology',
          country: 'United States',
          field_of_study: 'Electrical Engineering',
          degree_level: 'phd',
          scholarship_received: 'MIT Fellowship',
          story_content: 'My journey to MIT began during my undergraduate studies at Addis Ababa Institute of Technology. As one of the few students interested in renewable energy systems, I spent countless hours in the lab working on solar energy projects.',
          key_advice: [
            'Excel in your undergraduate coursework and build strong relationships with professors',
            'Gain research experience as early as possible',
            'Prepare thoroughly for standardized tests like GRE and TOEFL'
          ],
          timeline_years: 5,
          original_city: 'Bahir Dar',
          current_status: 'PhD candidate at MIT, expected graduation 2025',
          contact_available: false,
          contact_email: '',
          linkedin_url: '',
          featured: true
        }
      ];
      
      setStories(mockStories);
    } catch (error) {
      console.error('Error fetching success stories:', error);
      toast({
        title: "Error",
        description: "Failed to load success stories.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getDegreeLevel = (level: string) => {
    switch (level) {
      case 'bachelor': return "Bachelor's";
      case 'master': return "Master's";
      case 'phd': return 'PhD';
      case 'certificate': return 'Certificate';
      case 'diploma': return 'Diploma';
      default: return level;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-negari-orange mx-auto mb-4"></div>
        <p className="text-negari-indigo font-medium">Loading success stories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-negari-indigo mb-2">Success Stories</h2>
        <p className="text-gray-600">Real stories from students who achieved their international education dreams</p>
      </div>

      {/* Featured Stories */}
      {stories.some(story => story.featured) && (
        <div>
          <h3 className="text-lg font-semibold text-negari-indigo mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-negari-gold" />
            Featured Stories
          </h3>
          <div className="grid gap-6">
            {stories
              .filter(story => story.featured)
              .map((story) => (
                <Card key={story.id} className="border-2 border-negari-gold/30 bg-gradient-to-r from-negari-gold/5 to-transparent">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {story.student_photo ? (
                          <img
                            src={story.student_photo}
                            alt={story.student_name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-negari-indigo/20 flex items-center justify-center">
                            <User className="h-8 w-8 text-negari-indigo" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-negari-indigo flex items-center gap-2">
                          {story.title}
                          <Badge className="bg-negari-gold text-white">Featured</Badge>
                        </CardTitle>
                        <p className="text-lg font-semibold text-negari-orange">{story.student_name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {getDegreeLevel(story.degree_level)} in {story.field_of_study}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {story.university}, {story.country}
                          </Badge>
                          {story.original_city && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              From {story.original_city}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {story.scholarship_received && (
                      <div className="p-3 bg-negari-gold/10 rounded-lg">
                        <h4 className="font-semibold text-negari-indigo mb-1">Scholarship Received</h4>
                        <p className="text-sm">{story.scholarship_received}</p>
                      </div>
                    )}
                    
                    <p className="text-gray-700">{story.story_content}</p>
                    
                    {story.key_advice && story.key_advice.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-negari-indigo mb-2">Key Advice</h4>
                        <ul className="space-y-1">
                          {story.key_advice.map((advice, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="w-2 h-2 bg-negari-orange rounded-full mt-2"></span>
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                      {story.timeline_years && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {story.timeline_years} years
                        </Badge>
                      )}
                      {story.current_status && (
                        <Badge className="bg-green-100 text-green-800">
                          {story.current_status}
                        </Badge>
                      )}
                    </div>

                    {(story.contact_available && story.linkedin_url) && (
                      <div className="flex gap-2">
                        {story.linkedin_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(story.linkedin_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Regular Stories Grid */}
      <div>
        <h3 className="text-lg font-semibold text-negari-indigo mb-4">All Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories
            .filter(story => !story.featured)
            .map((story) => (
              <Card 
                key={story.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedStory(story)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {story.student_photo ? (
                      <img
                        src={story.student_photo}
                        alt={story.student_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-negari-indigo/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-negari-indigo" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-negari-indigo text-sm">{story.student_name}</h3>
                      <p className="text-xs text-gray-600">{story.university}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {getDegreeLevel(story.degree_level)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {story.country}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {story.story_content}
                  </p>
                  
                  <Button variant="ghost" size="sm" className="w-full text-negari-orange hover:text-negari-indigo">
                    Read Full Story
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {selectedStory.student_photo ? (
                    <img
                      src={selectedStory.student_photo}
                      alt={selectedStory.student_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-negari-indigo/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-negari-indigo" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-negari-indigo">{selectedStory.title}</CardTitle>
                    <p className="text-lg font-semibold text-negari-orange">{selectedStory.student_name}</p>
                    <p className="text-sm text-gray-600">{selectedStory.university}, {selectedStory.country}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStory(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getDegreeLevel(selectedStory.degree_level)} in {selectedStory.field_of_study}</Badge>
                {selectedStory.original_city && (
                  <Badge variant="outline">From {selectedStory.original_city}</Badge>
                )}
                {selectedStory.timeline_years && (
                  <Badge variant="outline">{selectedStory.timeline_years} years</Badge>
                )}
              </div>

              {selectedStory.scholarship_received && (
                <div className="p-3 bg-negari-gold/10 rounded-lg">
                  <h4 className="font-semibold text-negari-indigo mb-1">Scholarship Received</h4>
                  <p className="text-sm">{selectedStory.scholarship_received}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-negari-indigo mb-2">Story</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedStory.story_content}</p>
              </div>

              {selectedStory.key_advice && selectedStory.key_advice.length > 0 && (
                <div>
                  <h4 className="font-semibold text-negari-indigo mb-2">Key Advice</h4>
                  <ul className="space-y-2">
                    {selectedStory.key_advice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-negari-orange rounded-full mt-2"></span>
                        <span className="text-sm">{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedStory.current_status && (
                <div>
                  <h4 className="font-semibold text-negari-indigo mb-1">Current Status</h4>
                  <Badge className="bg-green-100 text-green-800">{selectedStory.current_status}</Badge>
                </div>
              )}

              {(selectedStory.contact_available && selectedStory.linkedin_url) && (
                <div className="flex gap-2 pt-4 border-t">
                  {selectedStory.linkedin_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(selectedStory.linkedin_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect on LinkedIn
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {stories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No success stories yet</h3>
            <p className="text-gray-500">Check back soon for inspiring stories from our community!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSuccessStories;