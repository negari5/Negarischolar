import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Users, MessageCircle, Star, MapPin, 
  GraduationCap, Calendar, Video, Coffee, BookOpen, ArrowLeft 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Mentor {
  id: string;
  name: string;
  title: string;
  university: string;
  field: string;
  country: string;
  rating: number;
  sessions: number;
  languages: string[];
  specialties: string[];
  available: boolean;
  bio: string;
  image: string;
  matchScore: number;
}

const ConnectMentor: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-mentors' | 'sessions'>('browse');
  const [messageMentor, setMessageMentor] = useState<Mentor | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [bookingMentor, setBookingMentor] = useState<Mentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [booking, setBooking] = useState(false);

  const userGoalTokens = useMemo(() => {
    const raw: string[] = [];
    if (profile?.preferred_fields?.length) raw.push(...profile.preferred_fields);
    if (profile?.career_interests?.length) raw.push(...profile.career_interests);
    if (profile?.dream_major) raw.push(profile.dream_major);
    if (profile?.target_country) raw.push(profile.target_country);
    return raw
      .map(s => (s || '').toString().trim().toLowerCase())
      .filter(Boolean);
  }, [profile]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, first_name, last_name, user_type, school_name, country, city, career_interests, preferred_fields')
          .eq('user_type', 'mentor');

        if (error) throw error;
        if (!isMounted) return;

        const rows = (data || []) as any[];
        const mapped: Mentor[] = rows.map((m) => {
          const name = m.full_name || [m.first_name, m.last_name].filter(Boolean).join(' ') || 'Mentor';
          const specialtiesRaw: string[] = [
            ...(Array.isArray(m.preferred_fields) ? m.preferred_fields : []),
            ...(Array.isArray(m.career_interests) ? m.career_interests : []),
          ];
          const specialties = specialtiesRaw
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
            .slice(0, 6);

          const tokens = specialtiesRaw
            .map((s) => (s || '').toString().trim().toLowerCase())
            .filter(Boolean);
          const overlap = userGoalTokens.length
            ? tokens.filter((t: string) => userGoalTokens.includes(t)).length
            : 0;
          const matchScore = userGoalTokens.length ? overlap / userGoalTokens.length : 0;

          return {
            id: m.id,
            name,
            title: 'Mentor',
            university: m.school_name || '—',
            field: specialties[0] || 'General',
            country: m.country || 'Global',
            rating: 4.7,
            sessions: 0,
            languages: ['English'],
            specialties,
            available: true,
            bio: 'Available to support your journey.',
            image: '/api/placeholder/64/64',
            matchScore,
          };
        });

        mapped.sort((a, b) => b.matchScore - a.matchScore);
        setMentors(mapped);
      } catch (e: any) {
        console.error('Failed to load mentors:', e);
        toast({
          title: 'Error',
          description: 'Failed to load mentors. Please try again.',
          variant: 'destructive'
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [toast, userGoalTokens]);

  const fields = useMemo(() => {
    const set = new Set<string>();
    mentors.forEach(m => set.add(m.field));
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mentors.filter((mentor) => {
      const matchesSearch =
        !q ||
        mentor.name.toLowerCase().includes(q) ||
        mentor.field.toLowerCase().includes(q) ||
        mentor.university.toLowerCase().includes(q) ||
        mentor.specialties.some(s => s.toLowerCase().includes(q));

      const matchesField = selectedField === 'all' || mentor.field === selectedField;
      return matchesSearch && matchesField;
    });
  }, [mentors, searchQuery, selectedField]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate('/student');
              }}
              variant="outline"
              size="sm"
              className="rounded-lg gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>

            <div className="flex-1 text-center">
              <h1 className="text-base sm:text-xl font-bold text-primary">Connect with Mentors</h1>
            </div>

            <div className="w-[44px] sm:w-[88px]" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-4">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Get guidance from successful professionals and students who've walked your path
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="border-b w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-1 mb-6">
            <TabsList className="inline-flex w-max min-w-full gap-1 bg-transparent">
              <TabsTrigger value="browse" className="flex items-center gap-2 whitespace-nowrap">
                <Search className="h-4 w-4" />
                Browse Mentors
              </TabsTrigger>
              <TabsTrigger value="my-mentors" className="flex items-center gap-2 whitespace-nowrap">
                <Users className="h-4 w-4" />
                My Mentors
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="h-4 w-4" />
                Upcoming Sessions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, field, or university..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {fields.map((field) => (
                      <Button
                        key={field}
                        variant={selectedField === field ? "default" : "outline"}
                        onClick={() => setSelectedField(field)}
                        size="sm"
                      >
                        {field === 'all' ? 'All Fields' : field}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentors Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-negari-orange mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading mentors…</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor) => (
                <Card key={mentor.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{mentor.name}</h3>
                          {mentor.available && (
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{mentor.title}</p>
                        <p className="text-sm font-medium text-primary">{mentor.university}</p>
                        {profile?.has_completed_profile && userGoalTokens.length > 0 && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Match: {Math.round(mentor.matchScore * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{mentor.rating}</span>
                        <span className="text-muted-foreground">({mentor.sessions} sessions)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{mentor.country}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{mentor.bio}</p>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {mentor.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mentor.languages.map((language) => (
                          <Badge key={language} variant="outline" className="text-xs">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        disabled={!mentor.available}
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: 'Please sign in',
                              description: 'You need an account to message a mentor.',
                              variant: 'destructive'
                            });
                            return;
                          }
                          setMessageMentor(mentor);
                          setMessageText('');
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={!mentor.available}
                        onClick={() => {
                          if (!user) {
                            toast({
                              title: 'Please sign in',
                              description: 'You need an account to book a session.',
                              variant: 'destructive'
                            });
                            return;
                          }
                          setBookingMentor(mentor);
                          setBookingTopic('');
                          setBookingDate('');
                          setBookingTime('');
                        }}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="my-mentors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No mentors yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with mentors to get personalized guidance on your educational journey.
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>Browse Mentors</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground mb-4">
                    Book a session with a mentor to get started on your journey.
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>Find Mentors</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!messageMentor} onOpenChange={(open) => { if (!open) setMessageMentor(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Message {messageMentor?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your message..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setMessageMentor(null)}>
                  Cancel
                </Button>
                <Button
                  disabled={sendingMessage || !messageText.trim()}
                  onClick={async () => {
                    if (!user || !messageMentor) return;
                    setSendingMessage(true);
                    try {
                      const { error } = await supabase.from('messages').insert({
                        sender_id: user.id,
                        recipient_id: messageMentor.id,
                        content: messageText.trim(),
                        subject: null,
                        read: false,
                      });
                      if (error) throw error;
                      toast({ title: 'Message sent', description: `Your message was sent to ${messageMentor.name}.` });
                      setMessageMentor(null);
                    } catch (e: any) {
                      console.error(e);
                      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
                    } finally {
                      setSendingMessage(false);
                    }
                  }}
                >
                  {sendingMessage ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!bookingMentor} onOpenChange={(open) => { if (!open) setBookingMentor(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Book a session with {bookingMentor?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                placeholder="Session topic (e.g., Scholarships, Applications)"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                <Input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setBookingMentor(null)}>
                  Cancel
                </Button>
                <Button
                  disabled={booking || !bookingTopic.trim() || !bookingDate || !bookingTime}
                  onClick={async () => {
                    if (!user || !bookingMentor) return;
                    setBooking(true);
                    try {
                      const { error } = await supabase.from('mentor_sessions').insert({
                        mentor_id: bookingMentor.id,
                        student_id: user.id,
                        topic: bookingTopic.trim(),
                        session_date: bookingDate,
                        session_time: bookingTime,
                        status: 'requested',
                        meeting_link: null,
                        notes: null,
                      });
                      if (error) throw error;
                      toast({ title: 'Request sent', description: 'Your session request has been created.' });
                      setBookingMentor(null);
                      setActiveTab('sessions');
                    } catch (e: any) {
                      console.error(e);
                      toast({ title: 'Error', description: 'Failed to book session.', variant: 'destructive' });
                    } finally {
                      setBooking(false);
                    }
                  }}
                >
                  {booking ? 'Booking...' : 'Request Session'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ConnectMentor;