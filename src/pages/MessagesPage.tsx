import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Phone, 
  Video,
  Image as ImageIcon,
  Smile,
  Send,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { conversations } from '../data/mockData';
import type { Conversation } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect 
}: { 
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const { user: currentUser } = useAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-[#D9D5CE]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6A63]" />
          <Input 
            placeholder="Search messages" 
            className="pl-10 bg-white border-[#D9D5CE]"
          />
        </div>
      </div>

      <div>
        {conversations.map(convo => {
          const otherUser = convo.participants[0];
          const isSelected = selectedId === convo.id;
          const isLastMessageFromMe = convo.lastMessage.senderId === currentUser?.id;

          return (
            <button
              key={convo.id}
              onClick={() => onSelect(convo.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-[#E8E4DE]/50 transition-colors text-left ${
                isSelected ? 'bg-[#E8E4DE]' : ''
              }`}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#141416] truncate">{otherUser.name}</span>
                  <span className="text-xs text-[#6E6A63]">{formatTime(convo.lastMessage.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isLastMessageFromMe && (
                    convo.lastMessage.isRead ? (
                      <CheckCheck className="w-4 h-4 text-[#B48C5A]" />
                    ) : (
                      <Check className="w-4 h-4 text-[#6E6A63]" />
                    )
                  )}
                  <p className={`text-sm truncate ${convo.unreadCount > 0 ? 'text-[#141416] font-medium' : 'text-[#6E6A63]'}`}>
                    {convo.lastMessage.content}
                  </p>
                </div>
              </div>

              {convo.unreadCount > 0 && (
                <span className="bg-[#B48C5A] text-white text-xs font-medium px-2 py-1 rounded-full">
                  {convo.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChatArea({ conversationId }: { conversationId: string }) {
  const { user: currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const otherUser = conversation?.participants[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const handleSend = () => {
    if (!message.trim()) return;
    // In a real app, this would send the message
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation || !otherUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#6E6A63]">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#D9D5CE] bg-white">
        <div className="flex items-center gap-3">
          <Link to="/messages" className="lg:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link to={`/profile/${otherUser.username}`} className="font-semibold text-[#141416] hover:underline">
              {otherUser.name}
            </Link>
            <p className="text-xs text-[#6E6A63]">@{otherUser.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
            <Phone className="w-5 h-5 text-[#6E6A63]" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
            <Video className="w-5 h-5 text-[#6E6A63]" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
            <MoreHorizontal className="w-5 h-5 text-[#6E6A63]" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;
          const showAvatar = index === 0 || conversation.messages[index - 1].senderId !== msg.senderId;

          return (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {!isMe && showAvatar ? (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
                </Avatar>
              ) : !isMe && <div className="w-8" />}

              <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-4 py-2 rounded-2xl ${
                    isMe 
                      ? 'bg-[#141416] text-[#F4F1EC] rounded-br-md' 
                      : 'bg-white border border-[#D9D5CE] text-[#141416] rounded-bl-md'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-xs text-[#6E6A63] ${isMe ? 'justify-end' : ''}`}>
                  <span>{formatTime(msg.createdAt)}</span>
                  {isMe && (
                    msg.isRead ? (
                      <CheckCheck className="w-3 h-3 text-[#B48C5A]" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#D9D5CE] bg-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
            <ImageIcon className="w-5 h-5 text-[#6E6A63]" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
            <Smile className="w-5 h-5 text-[#6E6A63]" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-white border-[#D9D5CE]"
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-[#B48C5A] hover:bg-[#9a7550] text-white disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { conversationId } = useParams();
  const [selectedId, setSelectedId] = useState(conversationId || conversations[0]?.id);

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-64px)]">
      <div className="grid lg:grid-cols-3 h-full border border-[#D9D5CE] rounded-xl overflow-hidden bg-white">
        {/* Conversation List - Hidden on mobile when chat is open */}
        <div className={`lg:block ${selectedId ? 'hidden' : 'block'} border-r border-[#D9D5CE]`}>
          <div className="p-4 border-b border-[#D9D5CE] flex items-center justify-between">
            <Link to="/feed" className="lg:hidden">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display font-bold text-xl text-[#141416]">Messages</h1>
            <div className="w-5" />
          </div>
          <ConversationList 
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-2 ${selectedId ? 'block' : 'hidden lg:block'}`}>
          {selectedId ? (
            <ChatArea conversationId={selectedId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-[#E8E4DE] rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-[#B48C5A]" />
              </div>
              <h2 className="text-xl font-semibold text-[#141416] mb-2">Your Messages</h2>
              <p className="text-[#6E6A63] max-w-sm">
                Send private messages to writers, thinkers, and connections on SAYA.
              </p>
              <Button className="mt-6 bg-[#B48C5A] hover:bg-[#9a7550] text-white">
                Start a conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
