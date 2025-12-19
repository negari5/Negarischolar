import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, AlertCircle, Calendar, Video, ExternalLink } from "lucide-react";

interface UpdatesAnnouncementsProps {
  onNotification: (title: string, description: string) => void;
}

const UpdatesAnnouncements = ({ onNotification }: UpdatesAnnouncementsProps) => {
  const updates = [
    {
      id: 1,
      type: "deadline",
      title: "Chevening Scholarship Deadline Extended",
      description: "Application deadline has been extended to November 15th. Don't miss this opportunity!",
      date: "2 hours ago",
      urgent: true,
      category: "Scholarship",
      fullDetails: "The Chevening Scholarship application deadline has been extended by 2 weeks due to technical issues with their online portal. This gives you extra time to perfect your application essays and gather additional recommendations.",
      actionItems: [
        "Review your application essays",
        "Request additional recommendation letters",
        "Complete your academic transcripts",
        "Prepare for potential interviews"
      ]
    },
    {
      id: 2,
      type: "exam",
      title: "IELTS Test Date Changes",
      description: "New test dates available for October. Book your slot now.",
      date: "1 day ago",
      urgent: false,
      category: "Exam",
      fullDetails: "Additional IELTS test dates have been added for October 2024 due to high demand. New slots are available on October 14, 21, and 28. Academic and General Training modules are both available.",
      actionItems: [
        "Check available test centers in your area",
        "Book your preferred test date",
        "Prepare required identification documents",
        "Review IELTS preparation materials"
      ]
    },
    {
      id: 3,
      type: "workshop",
      title: "Virtual Workshop: Scholarship Essay Writing",
      description: "Learn from experts how to write compelling scholarship essays. Free for all Negari students.",
      date: "2 days ago",
      urgent: false,
      category: "Workshop",
      hasVideo: true,
    },
    {
      id: 4,
      type: "webinar",
      title: "Study in Germany: Complete Guide",
      description: "Everything you need to know about studying in Germany. Live Q&A session included.",
      date: "3 days ago",
      urgent: false,
      category: "Webinar",
      hasVideo: true,
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Scholarship":
        return "bg-negari-gold/20 text-negari-indigo";
      case "Exam":
        return "bg-red-100 text-red-800";
      case "Workshop":
        return "bg-blue-100 text-blue-800";
      case "Webinar":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return AlertCircle;
      case "exam":
        return Calendar;
      case "workshop":
      case "webinar":
        return Video;
      default:
        return Clock;
    }
  };

  const handleViewDetails = (update: typeof updates[0]) => {
    onNotification(
      "Update Details Opened",
      `Reading detailed information about: ${update.title}`
    );
  };

  const handleViewAllUpdates = () => {
    onNotification(
      "All Updates",
      "Viewing all updates and announcements. Stay informed about important deadlines and opportunities!"
    );
  };

  return (
    <div className="space-y-4">
      {updates.map((update) => {
        const Icon = getIcon(update.type);
        return (
          <Card 
            key={update.id} 
            className={`hover:shadow-md transition-all duration-300 hover-bounce ${
              update.urgent ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  update.urgent ? 'bg-red-100' : 'bg-negari-gold/20'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    update.urgent ? 'text-red-600' : 'text-negari-orange'
                  }`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-negari-indigo">{update.title}</h4>
                      {update.urgent && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getCategoryColor(update.category)} text-xs`}
                      >
                        {update.category}
                      </Badge>
                      {update.hasVideo && (
                        <Video className="h-4 w-4 text-negari-orange" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {update.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {update.date}
                    </span>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-negari-orange hover:text-negari-indigo hover:bg-negari-gold/10 hover-bounce"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {update.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={getCategoryColor(update.category)}
                            >
                              {update.category}
                            </Badge>
                            {update.urgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed">
                            {update.fullDetails}
                          </p>
                          
                          {update.actionItems && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-800 mb-2">Action Items:</h4>
                              <ul className="space-y-1">
                                {update.actionItems.map((item, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-2 h-2 bg-negari-orange rounded-full"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => handleViewDetails(update)}
                            className="w-full bg-negari-orange hover:bg-negari-orange/90"
                          >
                            Take Action
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <div className="text-center pt-4">
        <Button 
          variant="outline" 
          className="border-2 border-negari-indigo/30 text-negari-indigo hover:bg-negari-indigo hover:text-white hover-bounce transition-all duration-300"
          onClick={handleViewAllUpdates}
        >
          View All Updates
        </Button>
      </div>
    </div>
  );
};

export default UpdatesAnnouncements;
