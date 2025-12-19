import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Globe, Calendar, DollarSign, ExternalLink, Star } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  country: string;
  university: string;
  field_of_study: string[];
  degree_level: string[];
  amount_min: number;
  amount_max: number;
  currency: string;
  application_deadline: string;
  rating: number;
  difficulty_level: string;
  featured: boolean;
  application_url: string;
  requirements: string[];
  eligibility_criteria: string[];
}

const ScholarshipDatabase: React.FC = () => {
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState('');

  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'Netherlands', 'Sweden', 'France'];
  const fields = ['Engineering', 'Computer Science', 'Medicine', 'Business', 'Economics', 'Law', 'Sciences', 'Arts'];
  const degreeLevels = ['bachelor', 'master', 'phd', 'certificate'];

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    filterScholarships();
  }, [scholarships, searchQuery, selectedCountry, selectedField, selectedDegreeLevel]);

  const fetchScholarships = async () => {
    try {
      // Mock scholarship data for now
      const mockScholarships: Scholarship[] = [
        {
          id: '1',
          title: 'Fulbright Foreign Student Program',
          description: 'The flagship international educational exchange program sponsored by the U.S. government and is designed to increase mutual understanding between the people of the United States and the people of other countries.',
          provider: 'U.S. State Department',
          country: 'United States',
          university: 'Various Universities',
          field_of_study: ['All Fields'],
          degree_level: ['master', 'phd'],
          amount_min: 25000,
          amount_max: 50000,
          currency: 'USD',
          application_deadline: '2024-10-15',
          rating: 4.8,
          difficulty_level: 'very_hard',
          featured: true,
          application_url: 'https://foreign.fulbrightonline.org',
          requirements: ['Bachelor\'s degree', 'English proficiency', 'Leadership experience'],
          eligibility_criteria: ['Ethiopian citizenship', 'Academic excellence', 'Return to home country for 2 years']
        },
        {
          id: '2',
          title: 'Chevening Scholarships',
          description: 'UK government\'s global scholarship programme, funded by the Foreign and Commonwealth Office (FCO) and partner organisations.',
          provider: 'UK Government',
          country: 'United Kingdom',
          university: 'Various UK Universities',
          field_of_study: ['All Fields'],
          degree_level: ['master'],
          amount_min: 30000,
          amount_max: 45000,
          currency: 'GBP',
          application_deadline: '2024-11-02',
          rating: 4.7,
          difficulty_level: 'very_hard',
          featured: true,
          application_url: 'https://www.chevening.org',
          requirements: ['Bachelor\'s degree', 'Work experience', 'English proficiency'],
          eligibility_criteria: ['Ethiopian citizenship', 'Leadership potential', 'Return to home country']
        }
      ];
      
      setScholarships(mockScholarships);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast({
        title: "Error",
        description: "Failed to load scholarships.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterScholarships = () => {
    let filtered = [...scholarships];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(scholarship =>
        scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.field_of_study?.some(field => 
          field.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter(scholarship => 
        scholarship.country === selectedCountry
      );
    }

    // Field filter
    if (selectedField) {
      filtered = filtered.filter(scholarship =>
        scholarship.field_of_study?.includes(selectedField)
      );
    }

    // Degree level filter
    if (selectedDegreeLevel) {
      filtered = filtered.filter(scholarship =>
        scholarship.degree_level?.includes(selectedDegreeLevel)
      );
    }

    setFilteredScholarships(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedField('');
    setSelectedDegreeLevel('');
  };

  const formatAmount = (min: number, max: number, currency: string) => {
    if (!min && !max) return 'Amount varies';
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    }
    return `Up to ${currency} ${max.toLocaleString()}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'very_hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-negari-orange mx-auto mb-4"></div>
        <p className="text-negari-indigo font-medium">Loading scholarships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-negari-indigo mb-4">Scholarship Database</h2>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger>
                <SelectValue placeholder="All Fields" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="">All Fields</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={selectedDegreeLevel} onValueChange={setSelectedDegreeLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Degree Level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">All Levels</SelectItem>
                  {degreeLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredScholarships.length} of {scholarships.length} scholarships
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              disabled={!searchQuery && !selectedCountry && !selectedField && !selectedDegreeLevel}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Scholarships */}
      {filteredScholarships.some(s => s.featured) && (
        <div>
          <h3 className="text-lg font-semibold text-negari-indigo mb-4">Featured Scholarships</h3>
          <div className="grid gap-4">
            {filteredScholarships
              .filter(scholarship => scholarship.featured)
              .map((scholarship) => (
                <Card key={scholarship.id} className="border-2 border-negari-gold/30 bg-gradient-to-r from-negari-gold/5 to-transparent">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-negari-indigo flex items-center gap-2">
                          {scholarship.title}
                          <Badge className="bg-negari-gold text-white">Featured</Badge>
                        </CardTitle>
                        <p className="text-gray-600 font-medium">{scholarship.provider}</p>
                      </div>
                      {scholarship.rating && renderStars(scholarship.rating)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{scholarship.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-negari-orange" />
                        <span className="text-sm">
                          {scholarship.country}
                          {scholarship.university && ` • ${scholarship.university}`}
                        </span>
                      </div>
                      
                      {(scholarship.amount_min || scholarship.amount_max) && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-negari-gold" />
                          <span className="text-sm">
                            {formatAmount(scholarship.amount_min, scholarship.amount_max, scholarship.currency)}
                          </span>
                        </div>
                      )}
                      
                      {scholarship.application_deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-red-500" />
                          <span className="text-sm">
                            Due: {new Date(scholarship.application_deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {scholarship.field_of_study?.map((field) => (
                        <Badge key={field} variant="outline">{field}</Badge>
                      ))}
                      {scholarship.degree_level?.map((level) => (
                        <Badge key={level} variant="outline">
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Badge>
                      ))}
                      <Badge className={getDifficultyColor(scholarship.difficulty_level)}>
                        {scholarship.difficulty_level?.replace('_', ' ')}
                      </Badge>
                    </div>

                    {scholarship.application_url && (
                      <Button 
                        className="bg-negari-orange hover:bg-negari-indigo w-full md:w-auto"
                        onClick={() => window.open(scholarship.application_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Regular Scholarships */}
      <div>
        <h3 className="text-lg font-semibold text-negari-indigo mb-4">All Scholarships</h3>
        <div className="grid gap-4">
          {filteredScholarships
            .filter(scholarship => !scholarship.featured)
            .map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-negari-indigo">{scholarship.title}</CardTitle>
                      <p className="text-gray-600 font-medium">{scholarship.provider}</p>
                    </div>
                    {scholarship.rating && renderStars(scholarship.rating)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {scholarship.description && (
                    <p className="text-gray-700">{scholarship.description}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-negari-orange" />
                      <span className="text-sm">
                        {scholarship.country}
                        {scholarship.university && ` • ${scholarship.university}`}
                      </span>
                    </div>
                    
                    {(scholarship.amount_min || scholarship.amount_max) && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-negari-gold" />
                        <span className="text-sm">
                          {formatAmount(scholarship.amount_min, scholarship.amount_max, scholarship.currency)}
                        </span>
                      </div>
                    )}
                    
                    {scholarship.application_deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className="text-sm">
                          Due: {new Date(scholarship.application_deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scholarship.field_of_study?.map((field) => (
                      <Badge key={field} variant="outline">{field}</Badge>
                    ))}
                    {scholarship.degree_level?.map((level) => (
                      <Badge key={level} variant="outline">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    ))}
                    <Badge className={getDifficultyColor(scholarship.difficulty_level)}>
                      {scholarship.difficulty_level?.replace('_', ' ')}
                    </Badge>
                  </div>

                  {scholarship.application_url && (
                    <Button 
                      variant="outline"
                      className="w-full md:w-auto"
                      onClick={() => window.open(scholarship.application_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {filteredScholarships.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No scholarships found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScholarshipDatabase;