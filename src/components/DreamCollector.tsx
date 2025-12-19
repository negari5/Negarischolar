import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Target, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DreamCollectorProps {
  onComplete: () => void;
}

const DreamCollector: React.FC<DreamCollectorProps> = ({ onComplete }) => {
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setLoading(true);
    try {
      // For now, store dream in localStorage until we can update the schema
      localStorage.setItem(`dream_${user?.id}`, dream.trim());
      
      // Also try to save to profile notes or create a separate record
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString(),
          // Store dream in area_of_living temporarily until schema is updated
          area_of_living: `${dream.trim()}`
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Dream Saved! ✨",
        description: "Your educational dream has been saved to your profile.",
        className: "border-green-200 bg-green-50 text-green-800"
      });

      onComplete();
    } catch (error) {
      console.error('Error saving dream:', error);
      toast({
        title: "Error",
        description: "Failed to save your dream. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Target className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-accent animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary mb-4">
            What's Your Educational Dream?
          </CardTitle>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Share your aspirations with us. This will help us personalize your journey and track your progress towards achieving your goals.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="dream" className="text-lg font-medium flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Describe Your Dream
              </Label>
              <Textarea
                id="dream"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="I dream of studying computer science at MIT because I want to develop technology that helps people in developing countries..."
                rows={6}
                className="resize-none text-base leading-relaxed"
                required
              />
              <p className="text-sm text-muted-foreground">
                Be specific about what you want to study, where you'd like to go, and why it matters to you.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
              <h4 className="font-semibold text-primary mb-3">💡 Tips for sharing your dream:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Include your field of study or career goal</li>
                <li>• Mention specific universities or countries you're interested in</li>
                <li>• Explain why this dream is important to you</li>
                <li>• Share how you plan to make a difference</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6 text-lg font-semibold"
                disabled={loading || !dream.trim()}
              >
                {loading ? 'Saving Your Dream...' : 'Save My Dream & Continue'}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="text-muted-foreground hover:text-primary"
            >
              Skip for now (you can add this later)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DreamCollector;