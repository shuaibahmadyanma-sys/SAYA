import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Mail, 
  Repeat2, 
  AtSign,
  Check,
  Settings
} from 'lucide-react';
import { notifications } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const notificationIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  message: Mail,
  repost: Repeat2,
  mention: AtSign,
};

const notificationColors = {
  like: 'text-red-500 bg-red-50',
  comment: 'text-[#B48C5A] bg-[#B48C5A]/10',
  follow: 'text-green-500 bg-green-50',
  message: 'text-blue-500 bg-blue-50',
  repost: 'text-green-600 bg-green-50',
  mention: 'text-purple-500 bg-purple-50',
};

function NotificationItem({ notification }: { notification: typeof notifications[0] }) {
  const [read, setRead] = useState(notification.isRead);
  const Icon = notificationIcons[notification.type];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationText = () => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'message':
        return 'sent you a message';
      case 'repost':
        return 'reposted your post';
      case 'mention':
        return 'mentioned you';
      default:
        return 'interacted with you';
    }
  };

  return (
    <div 
      onClick={() => setRead(true)}
      className={`flex items-start gap-4 p-4 hover:bg-[#E8E4DE]/50 transition-colors cursor-pointer border-b border-[#D9D5CE] ${
        !read ? 'bg-[#B48C5A]/5' : ''
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notificationColors[notification.type]}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start gap-3">
          <Link to={`/profile/${notification.actor.username}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
              <AvatarFallback>{notification.actor.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <p className="text-[#141416]">
              <Link to={`/profile/${notification.actor.username}`} className="font-semibold hover:underline">
                {notification.actor.name}
              </Link>
              {' '}{getNotificationText()}
            </p>
            {notification.content && (
              <p className="text-[#6E6A63] mt-1 text-sm">{notification.content}</p>
            )}
            <span className="text-sm text-[#6E6A63] mt-1">{formatTime(notification.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Unread indicator */}
      {!read && (
        <div className="w-2 h-2 bg-[#B48C5A] rounded-full mt-2" />
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState(notifications);

  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const mentionNotifications = allNotifications.filter(n => n.type === 'mention');

  const markAllAsRead = () => {
    setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-[#141416]">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[#6E6A63]">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-[#6E6A63] hover:text-[#141416]"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-[#E8E4DE]">
              <Settings className="w-5 h-5 text-[#6E6A63]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="w-full bg-white border-b border-[#D9D5CE] rounded-none h-auto p-0">
          <TabsTrigger 
            value="all" 
            className="flex-1 rounded-none py-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
          >
            All
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-[#B48C5A] text-white">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="mentions"
            className="flex-1 rounded-none py-4 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
          >
            Mentions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {allNotifications.length > 0 ? (
            <div>
              {allNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#E8E4DE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[#6E6A63]" />
              </div>
              <h3 className="text-lg font-semibold text-[#141416] mb-2">All caught up!</h3>
              <p className="text-[#6E6A63]">You have no new notifications.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="mentions" className="mt-0">
          {mentionNotifications.length > 0 ? (
            <div>
              {mentionNotifications.map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#E8E4DE] rounded-full flex items-center justify-center mx-auto mb-4">
                <AtSign className="w-8 h-8 text-[#6E6A63]" />
              </div>
              <h3 className="text-lg font-semibold text-[#141416] mb-2">No mentions yet</h3>
              <p className="text-[#6E6A63]">When someone mentions you, you'll see it here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
