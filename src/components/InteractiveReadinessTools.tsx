import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Play, BookOpen, Target, Users, Trophy, Brain, Clock } from 'lucide-react';

interface InteractiveReadinessToolsProps {
  onNotification: (title: string, description: string) => void;
}

const InteractiveReadinessTools = ({ onNotification }: InteractiveReadinessToolsProps) => {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const quizQuestions = [
    {
      question: "How confident are you about your academic goals?",
      options: ["Very confident", "Somewhat confident", "Not sure", "Need guidance"],
      scores: [4, 3, 2, 1]
    },
    {
      question: "How prepared are you for standardized tests (SAT, TOEFL, etc.)?",
      options: ["Fully prepared", "Mostly prepared", "Somewhat prepared", "Not prepared"],
      scores: [4, 3, 2, 1]
    },
    {
      question: "How strong is your English proficiency?",
      options: ["Native/Fluent", "Advanced", "Intermediate", "Beginner"],
      scores: [4, 3, 2, 1]
    },
    {
      question: "How well do you understand university application processes?",
      options: ["Very well", "Somewhat", "Little knowledge", "No knowledge"],
      scores: [4, 3, 2, 1]
    },
    {
      question: "How prepared are you financially for your education goals?",
      options: ["Fully prepared", "Mostly prepared", "Partially prepared", "Not prepared"],
      scores: [4, 3, 2, 1]
    }
  ];

  const readinessTools = [
    {
      id: 'self-assessment',
      title: 'Self-Assessment Quiz',
      description: 'Evaluate your current readiness level',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      type: 'quiz'
    },
    {
      id: 'goal-setting',
      title: 'Goal Setting Workshop',
      description: 'Set SMART goals for your educational journey',
      icon: Target,
      color: 'from-green-500 to-teal-600',
      type: 'workshop'
    },
    {
      id: 'study-plan',
      title: 'Study Plan Creator',
      description: 'Create a personalized study schedule',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      type: 'planner'
    },
    {
      id: 'skill-assessment',
      title: 'Skill Gap Analysis',
      description: 'Identify areas for improvement',
      icon: Trophy,
      color: 'from-purple-500 to-pink-600',
      type: 'assessment'
    },
    {
      id: 'time-management',
      title: 'Time Management Tools',
      description: 'Learn to manage your time effectively',
      icon: Clock,
      color: 'from-indigo-500 to-blue-600',
      type: 'tools'
    },
    {
      id: 'networking',
      title: 'Networking Guide',
      description: 'Build professional connections',
      icon: Users,
      color: 'from-teal-500 to-green-600',
      type: 'guide'
    }
  ];

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex];
    setQuizAnswers(newAnswers);

    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      // Calculate score
      const totalScore = newAnswers.reduce((sum, answerIdx, questionIdx) => {
        return sum + quizQuestions[questionIdx].scores[answerIdx];
      }, 0);
      const maxScore = quizQuestions.length * 4;
      const percentage = (totalScore / maxScore) * 100;
      
      setShowQuizResult(true);
      onNotification(
        "Quiz Completed!",
        `Your readiness score: ${percentage.toFixed(0)}%. Based on your results, we'll recommend personalized resources.`
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setQuizAnswers([]);
    setShowQuizResult(false);
  };

  const handleToolClick = (toolId: string, toolTitle: string) => {
    setActiveSection(toolId);
    onNotification(
      `${toolTitle} Started`,
      `You've accessed the ${toolTitle}. Complete the activities to improve your readiness!`
    );
  };

  const markTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
      onNotification(
        "Task Completed!",
        "Great job! You're making progress on your readiness journey."
      );
    }
  };

  const getReadinessScore = () => {
    if (quizAnswers.length === 0) return 0;
    const totalScore = quizAnswers.reduce((sum, answerIdx, questionIdx) => {
      return sum + quizQuestions[questionIdx].scores[answerIdx];
    }, 0);
    const maxScore = quizQuestions.length * 4;
    return (totalScore / maxScore) * 100;
  };

  const renderQuizSection = () => {
    if (showQuizResult) {
      const score = getReadinessScore();
      const level = score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';
      const levelColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-negari-indigo mb-4">Your Readiness Assessment</h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-4xl font-bold mb-2 text-negari-orange">{score.toFixed(0)}%</div>
              <div className={`text-lg font-semibold ${levelColor} mb-4`}>
                {level} Readiness Level
              </div>
              <Progress value={score} className="mb-4" />
              <p className="text-gray-600 mb-6">
                {score >= 80 
                  ? "Excellent! You're well-prepared for your educational journey."
                  : score >= 60 
                  ? "Good start! There are some areas where you can improve."
                  : "Don't worry! We'll help you build the skills you need."
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  Retake Quiz
                </Button>
                <Button onClick={() => setActiveSection(null)}>
                  Explore Tools
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-negari-indigo mb-2">Self-Assessment Quiz</h3>
          <p className="text-gray-600">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
          <Progress value={(currentQuizIndex / quizQuestions.length) * 100} className="mt-2" />
        </div>
        
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg text-negari-indigo">
              {quizQuestions[currentQuizIndex].question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizQuestions[currentQuizIndex].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto hover:bg-negari-orange/10"
                  onClick={() => handleQuizAnswer(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWorkshopSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-negari-indigo mb-4">Goal Setting Workshop</h3>
      <div className="grid gap-4">
        {[
          { id: 'smart-goals', title: 'Learn SMART Goal Framework', description: 'Understand Specific, Measurable, Achievable, Relevant, Time-bound goals' },
          { id: 'vision-board', title: 'Create Your Vision Board', description: 'Visualize your future success' },
          { id: 'action-plan', title: 'Develop Action Plan', description: 'Break down big goals into actionable steps' },
          { id: 'milestone-tracking', title: 'Set Milestones', description: 'Create checkpoints to track progress' }
        ].map((task) => (
          <Card key={task.id} className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {completedTasks.includes(task.id) ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-negari-indigo">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => markTaskComplete(task.id)}
                  disabled={completedTasks.includes(task.id)}
                  className="bg-negari-orange hover:bg-negari-orange/90"
                >
                  {completedTasks.includes(task.id) ? 'Completed' : 'Start'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderToolsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {readinessTools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Card key={tool.id} className="bg-white/80 backdrop-blur-sm border-0 hover:shadow-xl transition-all duration-300 hover-bounce cursor-pointer">
            <CardContent className="p-6" onClick={() => handleToolClick(tool.id, tool.title)}>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-negari-indigo mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                </div>
                <Button className="w-full bg-negari-orange hover:bg-negari-orange/90">
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {activeSection === 'self-assessment' && renderQuizSection()}
      {activeSection === 'goal-setting' && renderWorkshopSection()}
      {activeSection && activeSection !== 'self-assessment' && activeSection !== 'goal-setting' && (
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-negari-indigo mb-4">
            {readinessTools.find(t => t.id === activeSection)?.title}
          </h3>
          <p className="text-gray-600 mb-6">This tool is being developed. Check back soon!</p>
          <Button onClick={() => setActiveSection(null)}>Back to Tools</Button>
        </div>
      )}
      {!activeSection && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-negari-indigo mb-2">Interactive Readiness Tools</h2>
            <p className="text-gray-600">Take control of your educational journey with these interactive tools</p>
          </div>
          {renderToolsGrid()}
          {completedTasks.length > 0 && (
            <Card className="bg-gradient-to-r from-negari-gold/20 to-negari-orange/20 border-0">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 text-negari-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-negari-indigo mb-2">Great Progress!</h3>
                <p className="text-gray-600">
                  You've completed {completedTasks.length} readiness tasks. Keep going!
                </p>
                <Badge className="mt-3 bg-negari-gold text-white">
                  {completedTasks.length} Tasks Completed
                </Badge>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default InteractiveReadinessTools;
