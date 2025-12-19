import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const FooterSettings: React.FC = () => {
  const [footerCopyright, setFooterCopyright] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'footer_copyright')
        .single();

      if (data) {
        setFooterCopyright(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: rpcError } = await (supabase as any).rpc('set_site_settings', {
        settings: [{ setting_key: 'footer_copyright', setting_value: footerCopyright }]
      });

      if (rpcError) throw rpcError;

      toast({
        title: "Success",
        description: "Footer settings updated successfully."
      });
    } catch (error: any) {
      console.error('Error saving footer settings:', error);
      const rawMsg = error?.message || error?.error || '';
      toast({
        title: "Error",
        description: /forbidden/i.test(rawMsg)
          ? 'Only admins can update footer settings.'
          : (/missing authorization|not authenticated/i.test(rawMsg)
            ? 'You must be signed in to save changes.'
            : (rawMsg || "Failed to update footer settings.")),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading footer settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Footer Copyright Text</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="copyright">Copyright Text</Label>
              <Input
                id="copyright"
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                placeholder="© 2025 Negari. All rights reserved."
                required
              />
              <p className="text-sm text-muted-foreground mt-2">
                This text will appear in the footer of your website.
              </p>
            </div>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Preview:</h4>
            <p className="text-sm text-muted-foreground">{footerCopyright}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FooterSettings;
