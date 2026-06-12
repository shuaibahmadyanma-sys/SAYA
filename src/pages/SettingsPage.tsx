import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  Eye, 
  Palette, 
  Globe, 
  Shield, 
  ChevronRight,
  Check,
  Moon,
  Sun,
  Monitor,
  Type,
  Volume2,
  Video,
  TrendingUp,
  AtSign,
  Heart,
  MessageCircle,
  Repeat2,
  Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { defaultSettings } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { UserSettings } from '../types';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-lg text-[#141416] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#6E6A63] mb-4">{description}</p>}
      <div className="bg-white border border-[#D9D5CE] rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon?: React.ElementType;
  label: string;
  description?: string;
  value?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsItem({ icon: Icon, label, description, value, action, onClick, danger }: SettingsItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 hover:bg-[#E8E4DE]/50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${danger ? 'text-red-600' : ''}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-[#6E6A63]'}`} />}
        <div>
          <p className={`font-medium ${danger ? 'text-red-600' : 'text-[#141416]'}`}>{label}</p>
          {description && <p className="text-sm text-[#6E6A63]">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-[#6E6A63]">{value}</span>}
        {action}
        {onClick && <ChevronRight className="w-5 h-5 text-[#6E6A63]" />}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('account');

  const updateSetting = <K extends keyof UserSettings>(
    section: K,
    key: keyof UserSettings[K],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-4">
        <div className="flex items-center gap-4">
          <Link to="/feed" className="text-[#141416] hover:text-[#B48C5A] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-xl text-[#141416]">Settings</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 p-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-32 space-y-1">
            <button
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'account' ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Account</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'privacy' ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="font-medium">Privacy</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'notifications' ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="font-medium">Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'appearance' ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'
              }`}
            >
              <Palette className="w-5 h-5" />
              <span className="font-medium">Appearance</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'content' ? 'bg-[#141416] text-[#F4F1EC]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">Content</span>
            </button>
            <button
              onClick={() => setActiveTab('premium')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'premium' ? 'bg-[#B48C5A] text-white' : 'text-[#B48C5A] hover:bg-[#B48C5A]/10'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Premium</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div>
              <SettingsSection title="Account Information" description="Manage your account details">
                <SettingsItem
                  icon={User}
                  label="Username"
                  value={`@${settings.account.username}`}
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  icon={Mail}
                  label="Email"
                  value={settings.account.email}
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  icon={Lock}
                  label="Password"
                  value="••••••••"
                  onClick={() => {}}
                />
              </SettingsSection>

              <SettingsSection title="Account Actions">
                <SettingsItem
                  label="Download your data"
                  description="Get a copy of your information"
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Deactivate account"
                  description="Temporarily disable your account"
                  danger
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Delete account"
                  description="Permanently remove your account and data"
                  danger
                  onClick={() => {}}
                />
              </SettingsSection>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div>
              <SettingsSection title="Privacy" description="Control who can see and interact with you">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Private account</p>
                      <p className="text-sm text-[#6E6A63]">Only approved followers can see your posts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.isPrivate}
                    onCheckedChange={(v) => updateSetting('privacy', 'isPrivate', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Show location</p>
                      <p className="text-sm text-[#6E6A63]">Display your location on your profile</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.showLocation}
                    onCheckedChange={(v) => updateSetting('privacy', 'showLocation', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <ActivityIcon className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Show activity status</p>
                      <p className="text-sm text-[#6E6A63]">Let others know when you're active</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.showActivity}
                    onCheckedChange={(v) => updateSetting('privacy', 'showActivity', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <AtSign className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Allow tagging</p>
                      <p className="text-sm text-[#6E6A63]">Others can tag you in posts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.privacy.allowTagging}
                    onCheckedChange={(v) => updateSetting('privacy', 'allowTagging', v)}
                  />
                </div>
              </SettingsSection>

              <SettingsSection title="Messages" description="Control who can message you">
                <div className="p-4">
                  <p className="font-medium text-[#141416] mb-3">Allow messages from</p>
                  <div className="space-y-2">
                    {(['everyone', 'followers', 'none'] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => updateSetting('privacy', 'allowMessages', option)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          settings.privacy.allowMessages === option
                            ? 'border-[#B48C5A] bg-[#B48C5A]/10'
                            : 'border-[#D9D5CE] hover:bg-[#E8E4DE]'
                        }`}
                      >
                        <span className="capitalize">{option}</span>
                        {settings.privacy.allowMessages === option && (
                          <Check className="w-5 h-5 text-[#B48C5A]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div>
              <SettingsSection title="Notification Preferences">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Email notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(v) => updateSetting('notifications', 'email', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(v) => updateSetting('notifications', 'push', v)}
                  />
                </div>
              </SettingsSection>

              <SettingsSection title="Activity Notifications">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <AtSign className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Mentions</p>
                  </div>
                  <Switch
                    checked={settings.notifications.mentions}
                    onCheckedChange={(v) => updateSetting('notifications', 'mentions', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">New followers</p>
                  </div>
                  <Switch
                    checked={settings.notifications.follows}
                    onCheckedChange={(v) => updateSetting('notifications', 'follows', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Likes</p>
                  </div>
                  <Switch
                    checked={settings.notifications.likes}
                    onCheckedChange={(v) => updateSetting('notifications', 'likes', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Repeat2 className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Reposts</p>
                  </div>
                  <Switch
                    checked={settings.notifications.reposts}
                    onCheckedChange={(v) => updateSetting('notifications', 'reposts', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">Messages</p>
                  </div>
                  <Switch
                    checked={settings.notifications.messages}
                    onCheckedChange={(v) => updateSetting('notifications', 'messages', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#6E6A63]" />
                    <p className="font-medium text-[#141416]">News updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.news}
                    onCheckedChange={(v) => updateSetting('notifications', 'news', v)}
                  />
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <SettingsSection title="Theme">
                <div className="grid grid-cols-3 gap-3 p-4">
                  {([
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'auto', icon: Monitor, label: 'Auto' },
                  ] as const).map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => updateSetting('appearance', 'theme', value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${
                        settings.appearance.theme === value
                          ? 'border-[#B48C5A] bg-[#B48C5A]/10'
                          : 'border-[#D9D5CE] hover:bg-[#E8E4DE]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </SettingsSection>

              <SettingsSection title="Font Size">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <Type className="w-4 h-4 text-[#6E6A63]" />
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="1"
                      value={['small', 'medium', 'large'].indexOf(settings.appearance.fontSize)}
                      onChange={(e) => {
                        const sizes = ['small', 'medium', 'large'];
                        updateSetting('appearance', 'fontSize', sizes[parseInt(e.target.value)]);
                      }}
                      className="flex-1"
                    />
                    <Type className="w-6 h-6 text-[#6E6A63]" />
                  </div>
                  <p className="text-center text-sm text-[#6E6A63] mt-2 capitalize">
                    {settings.appearance.fontSize}
                  </p>
                </div>
              </SettingsSection>

              <SettingsSection title="Accessibility">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Reduce motion</p>
                      <p className="text-sm text-[#6E6A63]">Minimize animations throughout the app</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.appearance.reduceMotion}
                    onCheckedChange={(v) => updateSetting('appearance', 'reduceMotion', v)}
                  />
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Content Settings */}
          {activeTab === 'content' && (
            <div>
              <SettingsSection title="Content Preferences">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Autoplay videos</p>
                      <p className="text-sm text-[#6E6A63]">Videos play automatically in your feed</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.content.autoplayVideos}
                    onCheckedChange={(v) => updateSetting('content', 'autoplayVideos', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Show trending</p>
                      <p className="text-sm text-[#6E6A63]">Display trending topics in your feed</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.content.showTrending}
                    onCheckedChange={(v) => updateSetting('content', 'showTrending', v)}
                  />
                </div>
                <Separator className="bg-[#D9D5CE]" />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[#6E6A63]" />
                    <div>
                      <p className="font-medium text-[#141416]">Sensitive content</p>
                      <p className="text-sm text-[#6E6A63]">Show content that may be sensitive</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.content.sensitiveContent}
                    onCheckedChange={(v) => updateSetting('content', 'sensitiveContent', v)}
                  />
                </div>
              </SettingsSection>

              <SettingsSection title="Language">
                <SettingsItem
                  icon={Globe}
                  label="Display language"
                  value="English"
                  onClick={() => {}}
                />
              </SettingsSection>
            </div>
          )}

          {/* Premium Settings */}
          {activeTab === 'premium' && (
            <div>
              <div className="bg-gradient-to-r from-[#B48C5A] to-[#8B6914] rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <div>
                    <h3 className="font-bold text-xl">SAYA Premium</h3>
                    <p className="text-white/80">Unlock the full potential of your voice</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">Blue</p>
                    <p className="text-sm text-white/80">$8/mo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">Gold</p>
                    <p className="text-sm text-white/80">$16/mo</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">Grey</p>
                    <p className="text-sm text-white/80">Free</p>
                  </div>
                </div>
              </div>

              <SettingsSection title="Your Subscription">
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile?.avatar || ''} alt={profile?.name || ''} />
                      <AvatarFallback>{profile?.name?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#141416]">{profile?.name || 'You'}</p>
                        <Badge className="bg-[#B48C5A] text-white">Gold</Badge>
                      </div>
                      <p className="text-sm text-[#6E6A63]">Premium until Dec 31, 2025</p>
                    </div>
                  </div>
                  <Button className="w-full bg-[#141416] hover:bg-[#2a2a2c] text-[#F4F1EC]">
                    Manage Subscription
                  </Button>
                </div>
              </SettingsSection>

              <SettingsSection title="Premium Features">
                <SettingsItem
                  label="Verification badge"
                  description="Get verified with a blue, gold, or grey checkmark"
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Longer posts"
                  description="Write posts up to 25,000 characters"
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Edit posts"
                  description="Edit your posts within 30 minutes"
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Undo send"
                  description="Undo a post within 30 seconds"
                  onClick={() => {}}
                />
                <Separator className="bg-[#D9D5CE]" />
                <SettingsItem
                  label="Priority support"
                  description="Get faster responses from our team"
                  onClick={() => {}}
                />
              </SettingsSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Additional icons
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
