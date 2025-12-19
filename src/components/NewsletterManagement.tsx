import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const NewsletterManagement: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({
    title: '',
    content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch subscribers
      const { data: subscribersData } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('is_active', true)
        .order('subscribed_at', { ascending: false });
      setSubscribers(subscribersData || []);

      // Fetch sent newsletters
      const { data: newslettersData } = await supabase
        .from('newsletters')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(10);
      setNewsletters(newslettersData || []);
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterForm.title || !newsletterForm.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setSendingNewsletter(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Save newsletter to database
      const { error } = await supabase
        .from('newsletters')
        .insert({
          title: newsletterForm.title,
          content: newsletterForm.content,
          sent_by: user?.id,
          recipient_count: subscribers.length
        });

      if (error) throw error;

      toast({
        title: "Newsletter Sent!",
        description: `Newsletter sent to ${subscribers.length} subscribers.`
      });

      setNewsletterForm({ title: '', content: '' });
      fetchData();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to send newsletter.",
        variant: "destructive"
      });
    } finally {
      setSendingNewsletter(false);
    }
  };

  const handleUnsubscribe = async (subscriberId: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('id', subscriberId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscriber removed."
      });
      fetchData();
    } catch (error) {
      console.error('Error removing subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to remove subscriber.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading newsletter data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{subscribers.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Active email subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Newsletters Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newsletters.length}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total newsletters sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Last Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {newsletters.length > 0
                ? new Date(newsletters[0].sent_at).toLocaleDateString()
                : 'Never'}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {newsletters.length > 0 ? newsletters[0].title : 'No newsletters yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <Label htmlFor="title">Newsletter Title</Label>
                <Input
                  id="title"
                  value={newsletterForm.title}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                  placeholder="Enter newsletter title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newsletterForm.content}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                  placeholder="Write your newsletter content..."
                  rows={8}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={sendingNewsletter}
              >
                <Send className="h-4 w-4 mr-2" />
                {sendingNewsletter ? 'Sending...' : `Send to ${subscribers.length} Subscribers`}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers List</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {subscribers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No subscribers yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{subscriber.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Subscribed: {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnsubscribe(subscriber.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Newsletters History</CardTitle>
        </CardHeader>
        <CardContent>
          {newsletters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No newsletters sent yet
            </p>
          ) : (
            <div className="space-y-3">
              {newsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{newsletter.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {newsletter.content.substring(0, 150)}...
                      </p>
                    </div>
                    <Badge variant="outline">
                      {newsletter.recipient_count} recipients
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Sent: {new Date(newsletter.sent_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;
