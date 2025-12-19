
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, GraduationCap, Calendar, BookmarkPlus, Heart, DollarSign, Users, Clock } from "lucide-react";
import { useState } from "react";

interface ScholarshipExplorerProps {
  onNotification: (title: string, description: string) => void;
}

const ScholarshipExplorer = ({ onNotification }: ScholarshipExplorerProps) => {
  const [bookmarkedScholarships, setBookmarkedScholarships] = useState<number[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<any[]>([]);

  const scholarships = [
    {
      id: 1,
      name: "Gates Cambridge Scholarship",
      country: "United Kingdom",
      university: "University of Cambridge",
      deadline: "Dec 15, 2024",
      field: "All Fields",
      amount: "Full Funding",
      gpaReq: "3.8+",
      description: "Prestigious scholarship for outstanding academic achievement and leadership potential.",
      benefits: ["Full tuition coverage", "Living stipend", "Travel allowance", "Academic development fund"],
      requirements: ["Bachelor's degree", "Strong academic record", "Leadership experience", "Community service"],
      applicationSteps: ["Online application", "Academic references", "Personal statement", "Interview process"],
      successRate: "2%",
      recipients: "80 per year"
    },
    {
      id: 2,
      name: "Fulbright Program",
      country: "United States",
      university: "Various Universities",
      deadline: "Oct 15, 2024",
      field: "All Fields",
      amount: "$25,000",
      gpaReq: "3.5+",
      description: "Cultural exchange program promoting mutual understanding between nations.",
      benefits: ["Tuition assistance", "Living stipend", "Health insurance", "Cultural immersion"],
      requirements: ["Bachelor's degree", "English proficiency", "Cultural ambassador potential", "Clear study plan"],
      applicationSteps: ["Initial application", "Country selection", "Host institution contact", "Interview"],
      successRate: "20%",
      recipients: "4,000 per year"
    },
    {
      id: 3,
      name: "Chevening Scholarship",
      country: "United Kingdom",
      university: "Various UK Universities",
      deadline: "Nov 2, 2024",
      field: "All Fields",
      amount: "Full Funding",
      gpaReq: "3.7+",
      description: "UK government's flagship scholarship program for future leaders.",
      benefits: ["Full tuition", "Living allowance", "Return flights", "Visa support"],
      requirements: ["Work experience", "Leadership potential", "Return to home country", "English proficiency"],
      applicationSteps: ["Online application", "Three references", "Personal essays", "Interview process"],
      successRate: "3%",
      recipients: "1,500 per year"
    },
  ];

  const handleBookmark = (scholarshipId: number, scholarshipName: string) => {
    setBookmarkedScholarships(prev => {
      const isBookmarked = prev.includes(scholarshipId);
      const newBookmarks = isBookmarked 
        ? prev.filter(id => id !== scholarshipId)
        : [...prev, scholarshipId];
      
      onNotification(
        isBookmarked ? "Bookmark Removed" : "Scholarship Bookmarked!",
        isBookmarked 
          ? `${scholarshipName} removed from your bookmarks`
          : `${scholarshipName} added to your bookmarks for easy access`
      );
      
      return newBookmarks;
    });
  };

  const handleStartApplication = (scholarshipName: string) => {
    onNotification(
      "Application Started!",
      `You're now beginning your application for ${scholarshipName}. We'll guide you through each step!`
    );
  };

  const handleLoadMore = () => {
    onNotification(
      "Loading More Scholarships",
      "Discovering more scholarship opportunities tailored to your profile..."
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select onValueChange={(value) => onNotification("Filter Applied", `Showing scholarships for ${value}`)}>
          <SelectTrigger className="border-2 border-negari-gold/30 hover:border-negari-gold/50">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="usa">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="canada">Canada</SelectItem>
            <SelectItem value="germany">Germany</SelectItem>
            <SelectItem value="australia">Australia</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onNotification("Field Selected", `Filtering by ${value} programs`)}>
          <SelectTrigger className="border-2 border-negari-gold/30 hover:border-negari-gold/50">
            <SelectValue placeholder="Field of Study" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="arts">Arts & Humanities</SelectItem>
            <SelectItem value="sciences">Sciences</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onNotification("GPA Filter", `Showing scholarships for ${value} GPA range`)}>
          <SelectTrigger className="border-2 border-negari-gold/30 hover:border-negari-gold/50">
            <SelectValue placeholder="GPA Range" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="high">3.8 - 4.0</SelectItem>
            <SelectItem value="good">3.5 - 3.7</SelectItem>
            <SelectItem value="average">3.0 - 3.4</SelectItem>
            <SelectItem value="minimum">2.5 - 2.9</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scholarship Cards */}
      <div className="space-y-4">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id} className="border-2 border-negari-gold/20 hover:border-negari-orange/30 hover:shadow-lg transition-all duration-300 hover-bounce">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-negari-orange/20 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-negari-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-negari-indigo mb-1">{scholarship.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{scholarship.university}, {scholarship.country}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="secondary" className="bg-negari-gold/20 text-negari-indigo">
                      <Calendar className="h-3 w-3 mr-1" />
                      {scholarship.deadline}
                    </Badge>
                    <Badge variant="secondary" className="bg-negari-orange/20 text-negari-indigo">
                      {scholarship.field}
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      GPA: {scholarship.gpaReq}
                    </Badge>
                  </div>
                  
                  <p className="text-lg font-semibold text-negari-orange mb-2">
                    Funding: {scholarship.amount}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{scholarship.description}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`border-negari-gold text-negari-indigo hover:bg-negari-gold/10 hover-bounce ${
                      bookmarkedScholarships.includes(scholarship.id) ? 'bg-negari-gold/20' : ''
                    }`}
                    onClick={() => handleBookmark(scholarship.id, scholarship.name)}
                  >
                    {bookmarkedScholarships.includes(scholarship.id) ? (
                      <Heart className="h-4 w-4 mr-2 fill-current" />
                    ) : (
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                    )}
                    {bookmarkedScholarships.includes(scholarship.id) ? 'Bookmarked' : 'Bookmark'}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="border-negari-indigo text-negari-indigo hover:bg-negari-indigo/10 hover-bounce"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{scholarship.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Success Rate
                            </h4>
                            <p className="text-xl font-bold text-blue-600">{scholarship.successRate}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-semibold text-green-800 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Recipients/Year
                            </h4>
                            <p className="text-xl font-bold text-green-600">{scholarship.recipients}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                          <ul className="space-y-1">
                            {scholarship.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Requirements</h4>
                          <ul className="space-y-1">
                            {scholarship.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Application Process</h4>
                          <div className="space-y-2">
                            {scholarship.applicationSteps.map((step, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                <div className="w-6 h-6 bg-negari-orange text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {index + 1}
                                </div>
                                <span className="text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    className="bg-negari-orange hover:bg-negari-orange/90 text-white hover-bounce"
                    onClick={() => handleStartApplication(scholarship.name)}
                  >
                    Start Application
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-2 border-negari-gold/30 text-negari-indigo hover:bg-negari-gold/10 hover-bounce"
          onClick={handleLoadMore}
        >
          Load More Scholarships
        </Button>
      </div>
    </div>
  );
};

export default ScholarshipExplorer;
