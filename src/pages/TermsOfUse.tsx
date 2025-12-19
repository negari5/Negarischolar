import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const TermsOfUse = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'legal_terms_of_use')
          .single();
        if (error) throw error;
        setContent(data?.setting_value ?? '');
      } catch (e) {
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/80 to-purple-50/80">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:px-8 sm:py-10">
        <Card className="border-0 shadow-lg bg-white/90 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-negari-indigo text-2xl">Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700">
            {loading ? (
              <p>Loading…</p>
            ) : content?.trim() ? (
              <div className="whitespace-pre-wrap">{content}</div>
            ) : (
              <>
                <p>
                  These Terms of Use govern your access to and use of Negari. By using the platform, you agree to these terms.
                </p>
                <p>
                  This page is a placeholder. Replace the content with your formal Terms of Use.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfUse;
