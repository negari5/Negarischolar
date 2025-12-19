import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, Quote, ExternalLink } from "lucide-react";

interface SuccessStoriesProps {
  onNotification: (title: string, description: string) => void;
}

const SuccessStories = ({ onNotification }: SuccessStoriesProps) => {
  const stories = [
    {
      id: 1,
      name: "Fatima Okonkwo",
      university: "Harvard University",
      field: "Medicine",
      country: "Nigeria",
      scholarship: "Gates Cambridge Scholarship",
      quote: "Negari helped me believe that my dreams were not just possible, but inevitable. The guidance and support I received made all the difference.",
      image: "photo-1649972904349-6e44c42644a7",
      videoAvailable: true,
      fullStory: "From a small town in Lagos, Fatima overcame financial challenges and cultural barriers to become one of Harvard's most celebrated medical students. Her journey began with a single dream and the unwavering support of the Negari community."
    },
    {
      id: 2,
      name: "Kofi Asante",
      university: "MIT",
      field: "Engineering",
      country: "Ghana",
      scholarship: "Rhodes Scholarship",
      quote: "From a small village in Ghana to MIT - this journey taught me that with the right support, any dream is achievable.",
      image: "photo-1581091226825-a6a2a5aee158",
      videoAvailable: false,
      fullStory: "Growing up without electricity, Kofi built his first computer from scraps. His innovation and determination caught the attention of MIT admissions, leading to a full scholarship and now he's developing sustainable technology for rural communities."
    },
    {
      id: 3,
      name: "Amara Diallo",
      university: "Oxford University",
      field: "Economics",
      country: "Senegal",
      scholarship: "Mandela Rhodes Scholarship",
      quote: "Negari didn't just help me get to Oxford; it prepared me to thrive there. The community support was incredible.",
      image: "photo-1649972904349-6e44c42644a7",
      videoAvailable: true,
      fullStory: "Amara's passion for economic development in Africa led her to Oxford, where she's now researching sustainable development models. Her work has already influenced policy in three African countries."
    },
  ];

  const handlePlayVideo = (name: string) => {
    onNotification(
      "Playing Success Story",
      `Watch ${name}'s inspiring journey from dream to achievement. Get motivated and learn from their experience!`
    );
  };

  const handleReadFullStory = (name: string) => {
    onNotification(
      "Full Story Opened",
      `Reading ${name}'s complete journey. Discover the challenges they overcame and strategies they used to succeed.`
    );
  };

  const handleViewMoreStories = () => {
    onNotification(
      "More Success Stories",
      "Discover hundreds more inspiring stories from African students who achieved their dreams through Negari!"
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-bounce">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-negari-indigo/20 to-negari-orange/20 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-negari-gold to-negari-orange rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {story.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              {story.videoAvailable && (
                <Button
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  onClick={() => handlePlayVideo(story.name)}
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-negari-indigo">{story.name}</h3>
                  <p className="text-sm text-gray-600">{story.university}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="bg-negari-gold/20 text-negari-indigo text-xs">
                      {story.field}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {story.country}
                    </Badge>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="h-6 w-6 text-negari-gold/30 absolute -top-2 -left-1" />
                  <p className="text-sm text-gray-700 italic pl-6 leading-relaxed">
                    {story.quote}
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-negari-orange font-medium">
                    {story.scholarship}
                  </p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-negari-indigo border-negari-indigo/30 hover:bg-negari-indigo/5 hover-bounce"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Read Full Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{story.name}'s Success Story</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-negari-gold to-negari-orange rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{story.name}</h3>
                          <p className="text-gray-600">{story.university} • {story.field}</p>
                          <Badge className="mt-1 bg-negari-gold/20 text-negari-indigo">
                            {story.scholarship}
                          </Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Quote className="h-6 w-6 text-negari-gold/50 mb-2" />
                        <p className="italic text-gray-700">{story.quote}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">The Full Journey</h4>
                        <p className="text-gray-600 leading-relaxed">{story.fullStory}</p>
                      </div>
                      <Button 
                        onClick={() => handleReadFullStory(story.name)}
                        className="w-full bg-negari-orange hover:bg-negari-orange/90"
                      >
                        Get Inspired by This Story
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-2 border-negari-orange text-negari-orange hover:bg-negari-orange hover:text-white hover-bounce transition-all duration-300"
          onClick={handleViewMoreStories}
        >
          View More Success Stories
        </Button>
      </div>
    </div>
  );
};

export default SuccessStories;
