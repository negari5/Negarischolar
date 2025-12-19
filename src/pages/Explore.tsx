
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Award, Home, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ScholarshipRow = {
  id: string;
  title: string;
  university: string;
  country: string | null;
  amount: string;
  deadline: string;
  application_url: string | null;
  description: string | null;
  requirements: string[] | null;
  eligibility_criteria: string | null;
  status: string | null;
};

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scholarships, setScholarships] = useState<ScholarshipRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const getHomePath = () => {
    if (profile?.user_type === 'student') return '/student';
    if (profile?.user_type === 'mentor') return '/mentor';
    if (profile?.user_type === 'parent') return '/parent';
    if (profile?.user_type === 'school') return '/school';
    if (profile?.is_admin || profile?.is_super_admin) return '/admin';
    return '/';
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('scholarships')
          .select('id,title,university,country,amount,deadline,application_url,description,requirements,eligibility_criteria,status')
          .order('deadline', { ascending: true });

        if (error) throw error;
        if (!isMounted) return;

        const rows = (data || []) as ScholarshipRow[];
        const visible = rows.filter(s => (s.status ?? 'active') !== 'archived');
        setScholarships(visible);
      } catch (e: any) {
        console.error('Failed to load scholarships:', e);
        toast({
          title: 'Error',
          description: 'Failed to load scholarships. Please try again.',
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
  }, [toast]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return scholarships;
    return scholarships.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.university.toLowerCase().includes(q) ||
      (s.country ?? '').toLowerCase().includes(q)
    );
  }, [scholarships, searchTerm]);

  const handleApply = (item: ScholarshipRow) => {
    if (item.application_url) {
      window.open(item.application_url, '_blank');
      return;
    }
    toast({
      title: 'No application link',
      description: 'This scholarship does not have an application URL yet.',
      variant: 'destructive'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 to-purple-50/80">
      <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate(getHomePath())}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-negari-orange hover:text-white text-xs sm:text-sm rounded-lg"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-negari-indigo">Scholarships</h1>
            <p className="text-gray-600 text-sm sm:text-base">Explore real opportunities and apply</p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by scholarship, university, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-negari-orange mx-auto mb-4"></div>
            <p className="text-gray-600">Loading scholarships…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Card key={item.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-negari-indigo text-lg">{item.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{item.country || 'Global'}</span>
                  </div>
                  <div className="text-sm text-gray-600">{item.university}</div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">{item.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-orange-700">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-negari-orange text-negari-orange hover:bg-negari-orange hover:text-white rounded-lg"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-sm rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-negari-indigo">{item.title}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{item.country || 'Global'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                              <span>Amount: {item.amount}</span>
                            </div>
                          </div>

                          {item.description && (
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-gray-700">{item.description}</p>
                            </div>
                          )}

                          {item.eligibility_criteria && (
                            <div>
                              <h4 className="font-semibold mb-2">Eligibility</h4>
                              <p className="text-sm text-gray-700">{item.eligibility_criteria}</p>
                            </div>
                          )}

                          {item.requirements?.length ? (
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.requirements.map((r) => (
                                  <Badge key={r} variant="outline">{r}</Badge>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApply(item)}
                              className="bg-negari-orange hover:bg-negari-indigo text-white rounded-lg"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Apply
                            </Button>
                            <Button
                              onClick={() => toast({
                                title: 'Saved',
                                description: `${item.title} has been saved to your favorites.`
                              })}
                              variant="outline"
                              className="border-negari-orange text-negari-orange hover:bg-negari-orange hover:text-white rounded-lg"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={() => handleApply(item)}
                      size="sm"
                      className="bg-negari-orange hover:bg-negari-indigo text-white rounded-lg"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-gray-600">No scholarships found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
