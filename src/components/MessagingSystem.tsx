import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle, Reply, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  message_type: string;
  is_read: boolean;
  parent_message_id: string;
  created_at: string;
  sender: {
    full_name: string;
    email: string;
    user_type: string;
  };
  recipient: {
    full_name: string;
    email: string;
    user_type: string;
  };
}

const MessagingSystem: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const [messageForm, setMessageForm] = useState({
    recipient_email: '',
    subject: '',
    content: '',
    message_type: 'direct'
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      // Mock messages data for now
      const mockMessages: Message[] = [
        {
          id: '1',
          sender_id: 'user1',
          recipient_id: user?.id || '',
          subject: 'Welcome to Negari!',
          content: 'Welcome to the Negari platform! We\'re excited to help you on your journey to international education.',
          message_type: 'system',
          is_read: false,
          parent_message_id: '',
          created_at: new Date().toISOString(),
          sender: {
            full_name: 'Negari Team',
            email: 'team@negari.com',
            user_type: 'admin'
          },
          recipient: {
            full_name: profile?.full_name || 'User',
            email: user?.email || '',
            user_type: profile?.user_type || 'starter'
          }
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Mock sending message
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        recipient_id: 'recipient-id',
        subject: messageForm.subject,
        content: messageForm.content,
        message_type: messageForm.message_type,
        is_read: false,
        parent_message_id: replyTo || '',
        created_at: new Date().toISOString(),
        sender: {
          full_name: profile?.full_name || user.email || 'You',
          email: user.email || '',
          user_type: profile?.user_type || 'starter'
        },
        recipient: {
          full_name: 'Recipient',
          email: messageForm.recipient_email,
          user_type: 'starter'
        }
      };

      setMessages(prev => [newMessage, ...prev]);

      toast({
        title: "Success",
        description: "Message sent successfully."
      });

      resetForm();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const resetForm = () => {
    setMessageForm({
      recipient_email: '',
      subject: '',
      content: '',
      message_type: 'direct'
    });
    setShowCompose(false);
    setReplyTo(null);
  };

  const handleReply = (message: Message) => {
    setMessageForm({
      recipient_email: message.sender.email,
      subject: message.subject.startsWith('Re: ') ? message.subject : `Re: ${message.subject}`,
      content: '',
      message_type: 'direct'
    });
    setReplyTo(message.id);
    setShowCompose(true);
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'announcement': return 'bg-green-100 text-green-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-negari-orange mx-auto mb-4"></div>
        <p className="text-negari-indigo font-medium">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-negari-indigo">Messages</h2>
        <Button
          onClick={() => setShowCompose(true)}
          className="bg-negari-orange hover:bg-negari-indigo"
        >
          <Send className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {showCompose && (
        <Card className="border-2 border-negari-orange/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{replyTo ? 'Reply to Message' : 'Compose New Message'}</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">To (Email)</label>
                <Input
                  type="email"
                  value={messageForm.recipient_email}
                  onChange={(e) => setMessageForm({...messageForm, recipient_email: e.target.value})}
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({...messageForm, subject: e.target.value})}
                  placeholder="Message subject"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm({...messageForm, content: e.target.value})}
                  placeholder="Type your message here..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-negari-orange hover:bg-negari-indigo">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="font-semibold text-negari-indigo mb-4">Inbox</h3>
          {messages.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id ? 'border-negari-orange bg-negari-orange/5' : ''
                } ${!message.is_read && message.recipient_id === user?.id ? 'border-l-4 border-l-negari-orange' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.is_read && message.recipient_id === user?.id) {
                    markAsRead(message.id);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {message.sender_id === user?.id 
                          ? `To: ${message.recipient.full_name || message.recipient.email}`
                          : `From: ${message.sender.full_name || message.sender.email}`
                        }
                      </p>
                      <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.is_read && message.recipient_id === user?.id && (
                        <div className="w-2 h-2 bg-negari-orange rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(message.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getMessageTypeColor(message.message_type)} variant="outline">
                      {message.message_type}
                    </Badge>
                    <Badge variant="outline">
                      {message.sender_id === user?.id ? message.recipient.user_type : message.sender.user_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-negari-indigo">{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>
                        {selectedMessage.sender_id === user?.id 
                          ? `To: ${selectedMessage.recipient.full_name || selectedMessage.recipient.email}`
                          : `From: ${selectedMessage.sender.full_name || selectedMessage.sender.email}`
                        }
                      </span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {selectedMessage.sender_id !== user?.id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReply(selectedMessage)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-64 flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;