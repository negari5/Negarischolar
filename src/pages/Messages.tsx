import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Messages = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) {
        setLoading(false);
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        if (!isMounted) return;
        const rows = (data || []) as any[];
        setMessages(rows);
        setSelectedMessageId(rows[0]?.id ?? null);
      } catch (e: any) {
        console.error(e);
        toast({ title: 'Error', description: 'Failed to load messages.', variant: 'destructive' });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => { isMounted = false; };
  }, [toast, user]);

  const filteredMessages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(m =>
      (m.content || '').toLowerCase().includes(q) ||
      (m.subject || '').toLowerCase().includes(q)
    );
  }, [messages, searchTerm]);

  const selectedMessage = useMemo(() => {
    return messages.find(m => m.id === selectedMessageId) || null;
  }, [messages, selectedMessageId]);

  return (
    <div className="min-h-screen bg-sunrise-gradient cultural-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Messages</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow students, mentors, and study groups
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <Card className="negari-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-negari-indigo">
                <Users className="h-5 w-5" />
                Inbox
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center text-muted-foreground">Loading…</div>
              ) : (
                <div className="space-y-1">
                  {filteredMessages.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMessageId(m.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedMessageId === m.id ? 'bg-negari-orange/10 border-l-4 border-l-negari-orange' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>MSG</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{m.subject || 'Message'}</h3>
                            <span className="text-xs text-gray-500">
                              {m.created_at ? new Date(m.created_at).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{m.content}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredMessages.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">No messages yet.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="negari-card lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-negari-indigo">
                <MessageSquare className="h-5 w-5" />
                Message
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {selectedMessage ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : ''}
                    </div>
                    <div className="p-4 rounded-lg bg-gray-100 text-gray-800 whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">Select a message to read.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
