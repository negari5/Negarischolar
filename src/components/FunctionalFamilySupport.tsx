
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, UserPlus, MessageCircle, Heart, CheckCircle, 
  Clock, Target, Star, Send, Phone, Mail 
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'family' | 'peer' | 'mentor';
  completed: boolean;
  dueDate?: string;
}

interface SupportConnection {
  id: string;
  name: string;
  relationship: string;
  status: 'pending' | 'connected' | 'active';
}

const FunctionalFamilySupport = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Share your goals with family',
      description: 'Have a conversation with your family about your educational and career goals',
      category: 'family',
      completed: false,
      dueDate: '2025-01-15'
    },
    {
      id: '2',
      title: 'Find a study buddy',
      description: 'Connect with a peer who shares similar academic interests',
      category: 'peer',
      completed: false
    },
    {
      id: '3',
      title: 'Schedule weekly check-ins',
      description: 'Set up regular progress discussions with your support network',
      category: 'family',
      completed: false
    },
    {
      id: '4',
      title: 'Join a study group',
      description: 'Participate in or create a study group for mutual support',
      category: 'peer',
      completed: false
    }
  ]);

  const [connections, setConnections] = useState<SupportConnection[]>([
    { id: '1', name: 'Family Member', relationship: 'Parent/Guardian', status: 'pending' },
    { id: '2', name: 'Study Group', relationship: 'Peer Group', status: 'connected' }
  ]);

  const [newConnectionName, setNewConnectionName] = useState('');
  const [newConnectionRelation, setNewConnectionRelation] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'connections' | 'messages'>('tasks');

  const { toast } = useToast();

  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast({
        title: "Task Completed! 🎉",
        description: `Great job completing: ${task.title}`
      });
    }
  };

  const addConnection = () => {
    if (!newConnectionName.trim() || !newConnectionRelation.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Name and relationship are required",
        variant: "destructive"
      });
      return;
    }

    const newConnection: SupportConnection = {
      id: Date.now().toString(),
      name: newConnectionName,
      relationship: newConnectionRelation,
      status: 'pending'
    };

    setConnections([...connections, newConnection]);
    setNewConnectionName('');
    setNewConnectionRelation('');
    
    toast({
      title: "Invitation Sent!",
      description: `${newConnectionName} will receive an invitation to join your support network`
    });
  };

  const sendSupportMessage = () => {
    if (!supportMessage.trim()) {
      toast({
        title: "Please write a message",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Your message has been shared with your support network"
    });
    setSupportMessage('');
  };

  const activateConnection = (connectionId: string) => {
    setConnections(connections.map(conn =>
      conn.id === connectionId
        ? { ...conn, status: 'active' }
        : conn
    ));
    toast({
      title: "Connection Activated!",
      description: "You're now actively connected and can receive support"
    });
  };

  const categories = [
    { key: 'family', label: 'Family Tasks', icon: Heart, color: 'bg-pink-50 border-pink-200' },
    { key: 'peer', label: 'Peer Tasks', icon: Users, color: 'bg-blue-50 border-blue-200' },
    { key: 'mentor', label: 'Mentor Tasks', icon: Star, color: 'bg-yellow-50 border-yellow-200' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-negari-indigo">
            <Users className="h-5 w-5" />
            Family & Peer Support Network
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {completedTasks}/{tasks.length} tasks completed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/50 backdrop-blur-sm p-1 rounded-lg">
        {[
          { key: 'tasks', label: 'Support Tasks', icon: Target },
          { key: 'connections', label: 'My Network', icon: Users },
          { key: 'messages', label: 'Messages', icon: MessageCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-negari-orange text-white shadow-sm'
                  : 'text-negari-indigo hover:bg-white/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {categories.map(category => {
            const categoryTasks = tasks.filter(task => task.category === category.key);
            if (categoryTasks.length === 0) return null;

            const Icon = category.icon;
            return (
              <Card key={category.key} className={`${category.color}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-negari-indigo text-lg">
                    <Icon className="h-5 w-5" />
                    {category.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-4 bg-white/80 rounded-lg">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-1 p-1 rounded-full transition-colors ${
                          task.completed
                            ? 'bg-green-500 text-white'
                            : 'border-2 border-gray-300 hover:border-negari-orange'
                        }`}
                      >
                        {task.completed && <CheckCircle className="h-4 w-4" />}
                        {!task.completed && <div className="h-4 w-4" />}
                      </button>
                      
                      <div className="flex-1">
                        <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-negari-indigo'}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                            <Clock className="h-3 w-3" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo">
                <UserPlus className="h-5 w-5" />
                Add New Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Name (e.g., Mom, John, Study Group)"
                  value={newConnectionName}
                  onChange={(e) => setNewConnectionName(e.target.value)}
                  className="bg-white/80 rounded-lg"
                />
                <Input
                  placeholder="Relationship (e.g., Parent, Friend, Classmate)"
                  value={newConnectionRelation}
                  onChange={(e) => setNewConnectionRelation(e.target.value)}
                  className="bg-white/80 rounded-lg"
                />
              </div>
              <Button 
                onClick={addConnection}
                className="w-full bg-negari-orange hover:bg-negari-indigo text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-negari-indigo">My Support Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connections.map(connection => (
                <div key={connection.id} className="flex items-center justify-between p-4 bg-white/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-negari-orange/20 rounded-full">
                      <Users className="h-4 w-4 text-negari-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-negari-indigo">{connection.name}</h4>
                      <p className="text-sm text-gray-600">{connection.relationship}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        connection.status === 'active' ? 'bg-green-100 text-green-800' :
                        connection.status === 'connected' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {connection.status}
                    </Badge>
                    {connection.status === 'connected' && (
                      <Button
                        size="sm"
                        onClick={() => activateConnection(connection.id)}
                        className="bg-negari-orange hover:bg-negari-indigo text-white"
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-negari-indigo">
                <MessageCircle className="h-5 w-5" />
                Send Support Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your progress, ask for help, or send an encouraging message to your support network..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="bg-white/80 rounded-lg min-h-[100px]"
              />
              <Button 
                onClick={sendSupportMessage}
                className="w-full bg-negari-orange hover:bg-negari-indigo text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-negari-indigo">Recent Support Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-white/80 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Mom</p>
                    <p className="text-sm text-gray-700">"So proud of your progress! Keep up the great work. 💪"</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-white/80 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Study Group</p>
                    <p className="text-sm text-gray-700">"Don't forget our study session tomorrow at 3 PM! 📚"</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FunctionalFamilySupport;
