import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, TrendingUp, Brain, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; points: number }[];
  category: string;
}

interface SelfAssessmentProps {
  onComplete?: () => void;
}

const questions: Question[] = [
  {
    id: 'academic_readiness',
    question: 'How prepared do you feel academically for competitive scholarship programs?',
    options: [
      { value: 'very_well_prepared', label: 'Very well prepared (Consistently strong results in key subjects)', points: 5 },
      { value: 'well_prepared', label: 'Well prepared (Generally good results with minor gaps)', points: 4 },
      { value: 'moderately_prepared', label: 'Moderately prepared (Average results, need improvement in some areas)', points: 3 },
      { value: 'slightly_prepared', label: 'Slightly prepared (Below-average results, significant gaps)', points: 2 },
      { value: 'not_prepared', label: 'Not prepared yet (Major academic challenges so far)', points: 1 },
    ],
    category: 'Academic',
  },
  {
    id: 'english_proficiency',
    question: 'What is your current English proficiency level?',
    options: [
      { value: 'native', label: 'Native/Near-native speaker', points: 5 },
      { value: 'advanced', label: 'Advanced (Can handle complex topics)', points: 4 },
      { value: 'intermediate', label: 'Intermediate (Can handle daily conversations)', points: 3 },
      { value: 'basic', label: 'Basic (Can handle simple conversations)', points: 2 },
      { value: 'beginner', label: 'Beginner (Limited vocabulary)', points: 1 },
    ],
    category: 'Language',
  },
  {
    id: 'experience_exposure',
    question: 'What level of academic or practical exposure do you have beyond regular classes?',
    options: [
      { value: 'extensive', label: 'Extensive (Research, competitions, certifications, or major projects)', points: 5 },
      { value: 'moderate', label: 'Moderate (1–2 structured projects, internships, or certifications)', points: 4 },
      { value: 'some', label: 'Some (Course projects, volunteer work, or short trainings)', points: 3 },
      { value: 'limited', label: 'Limited (Only standard school assignments)', points: 2 },
      { value: 'none', label: 'None (No exposure beyond classroom learning)', points: 1 },
    ],
    category: 'Experience',
  },
  {
    id: 'leadership_experience',
    question: 'How would you describe your leadership and extracurricular involvement?',
    options: [
      { value: 'extensive', label: 'Extensive (President/leader of multiple organizations)', points: 5 },
      { value: 'moderate', label: 'Moderate (Active member with some leadership roles)', points: 4 },
      { value: 'some', label: 'Some (Participated in clubs/activities)', points: 3 },
      { value: 'limited', label: 'Limited (Minimal involvement)', points: 2 },
      { value: 'none', label: 'None (No extracurricular activities)', points: 1 },
    ],
    category: 'Leadership',
  },
  {
    id: 'financial_preparation',
    question: 'How prepared are you financially for international education?',
    options: [
      { value: 'fully_funded', label: 'Fully funded (Scholarship/family support)', points: 5 },
      { value: 'mostly_funded', label: 'Mostly funded (70-90% covered)', points: 4 },
      { value: 'partially_funded', label: 'Partially funded (40-70% covered)', points: 3 },
      { value: 'limited_funding', label: 'Limited funding (10-40% covered)', points: 2 },
      { value: 'no_funding', label: 'No funding secured yet', points: 1 },
    ],
    category: 'Financial',
  },
];

const SelfAssessment: React.FC<SelfAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = () => {
    let totalScore = 0;
    const categoryScores: Record<string, number> = {};
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.points;
          categoryScores[question.category] = (categoryScores[question.category] || 0) + option.points;
        }
      }
    });

    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;
    
    // Generate recommendations based on score
    const recs: string[] = [];
    
    if (percentage >= 80) {
      recs.push('You are well-prepared for competitive scholarship applications!');
      recs.push('Focus on applying to top-tier universities and prestigious scholarships.');
      recs.push('Consider starting your application process immediately.');
    } else if (percentage >= 60) {
      recs.push('You have a solid foundation but can improve in some areas.');
      recs.push('Focus on strengthening your weakest areas before applying.');
      recs.push('Consider taking English proficiency tests if needed.');
    } else if (percentage >= 40) {
      recs.push('You need significant preparation before applying for scholarships.');
      recs.push('Focus on improving your academic performance and gaining experience.');
      recs.push('Consider taking preparatory courses or gaining more research experience.');
    } else {
      recs.push('You should spend more time preparing before applying for international programs.');
      recs.push('Focus on fundamental academic improvement and skill building.');
      recs.push('Consider seeking mentorship and guidance for your preparation journey.');
    }

    // Add specific recommendations based on category scores
    if (categoryScores['Language'] < 4) {
      recs.push('Take an English proficiency course or practice more English daily.');
    }
    if (categoryScores['Experience'] < 3) {
      recs.push('Seek research opportunities or internships in your field.');
    }
    if (categoryScores['Leadership'] < 3) {
      recs.push('Join student organizations or volunteer for leadership roles.');
    }
    if (categoryScores['Financial'] < 3) {
      recs.push('Research scholarship opportunities and start saving for application costs.');
    }

    return { totalScore, percentage, recommendations: recs };
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const results = calculateResults();
    setScore(results.totalScore);
    setRecommendations(results.recommendations);
    setIsCompleted(true);
    setIsSubmitting(true);

    try {
      if (user) {
        // Store latest assessment locally for the Progress tab
        localStorage.setItem('lastAssessment', JSON.stringify({
          user_id: user.id,
          assessment_data: answers,
          score: results.totalScore,
          max_score: questions.length * 5,
          recommendations: results.recommendations,
          completed_at: new Date().toISOString()
        }));

        toast({
          title: 'Assessment Completed!',
          description: 'Your readiness assessment has been completed.',
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
    setRecommendations([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[questions[currentQuestion]?.id];

  if (isCompleted) {
    const percentage = (score / (questions.length * 5)) * 100;
    
    return (
      <Card className="w-full max-w-2xl mx-auto bg-card border-border mb-40">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-primary">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{percentage.toFixed(0)}%</div>
            <div className="text-muted-foreground">Readiness Score</div>
            <Progress value={percentage} className="mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-border">
              <Target className="w-6 h-6 mx-auto text-primary mb-2" />
              <div className="font-semibold text-sm sm:text-base text-foreground">Score</div>
              <div className="text-xl sm:text-2xl font-bold text-primary">{score}/{questions.length * 5}</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg border border-border">
              <TrendingUp className="w-6 h-6 mx-auto text-secondary mb-2" />
              <div className="font-semibold text-sm sm:text-base text-foreground">Level</div>
              <div className="text-lg font-bold text-secondary">
                {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Needs Work'}
              </div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg border border-border">
              <Brain className="w-6 h-6 mx-auto text-accent mb-2" />
              <div className="font-semibold text-sm sm:text-base text-foreground">Recommendations</div>
              <div className="text-xl sm:text-2xl font-bold text-accent">{recommendations.length}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <BookOpen className="w-5 h-5" />
              Your Personalized Recommendations
            </div>
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                <Badge variant="outline" className="mt-1 shrink-0 text-xs">
                  {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={resetAssessment} variant="outline" className="flex-1 h-10 sm:h-11">
              Retake Assessment
            </Button>
            <Button 
              onClick={() => {
                if (onComplete) {
                  onComplete();
                  return;
                }

                const isLoggedIn = !!user;
                if (isLoggedIn) {
                  navigate('/journey');
                } else {
                  window.dispatchEvent(new CustomEvent('open-auth-modal'));
                }
              }} 
              className="flex-1 h-10 sm:h-11"
            >
              Start Your Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border mb-24">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <Badge variant="outline" className="w-fit border-border text-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          <Badge variant="secondary" className="w-fit">{question.category}</Badge>
        </div>
        <Progress value={progress} className="mb-4" />
        <CardTitle className="text-lg sm:text-xl leading-tight text-primary">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        <RadioGroup
          value={currentAnswer || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
        >
          {question.options.map((option) => (
            <div key={option.value} className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm sm:text-base leading-relaxed text-foreground">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1 h-10 sm:h-11"
            size="default"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="flex-1 h-10 sm:h-11"
            size="default"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfAssessment;