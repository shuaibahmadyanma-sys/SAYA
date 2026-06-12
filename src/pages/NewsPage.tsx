import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Share2, 
  Bookmark,
  Play,
  Filter
} from 'lucide-react';
import { newsItems, topics } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryColors = {
  breaking: 'bg-red-500 text-white',
  tech: 'bg-blue-500 text-white',
  business: 'bg-green-500 text-white',
  culture: 'bg-purple-500 text-white',
  science: 'bg-cyan-500 text-white',
};

const categoryLabels = {
  breaking: 'Breaking',
  tech: 'Technology',
  business: 'Business',
  culture: 'Culture',
  science: 'Science',
};

function NewsCard({ item, featured = false }: { item: typeof newsItems[0]; featured?: boolean }) {
  const [bookmarked, setBookmarked] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (featured) {
    return (
      <article className="relative bg-white border border-[#D9D5CE] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-64 md:h-80">
          {item.video ? (
            <>
              <img 
                src={item.image || item.videoThumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-16 h-16 text-white" />
              </div>
            </>
          ) : (
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-4 left-4">
            <Badge className={categoryColors[item.category]}>
              {categoryLabels[item.category]}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${item.author.username}`} className="font-medium text-[#141416] hover:underline">
                {item.author.name}
              </Link>
              {item.source && (
                <>
                  <span className="text-[#6E6A63] mx-1">·</span>
                  <span className="text-sm text-[#6E6A63]">{item.source}</span>
                </>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[#141416] mb-2 hover:text-[#B48C5A] transition-colors cursor-pointer">
            {item.title}
          </h2>
          <p className="text-[#6E6A63] mb-4">{item.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-[#6E6A63]">
              <span>{formatDate(item.publishedAt)}</span>
              <span>{item.views.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-[#B48C5A]' : 'text-[#6E6A63] hover:bg-[#E8E4DE]'}`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg text-[#6E6A63] hover:bg-[#E8E4DE] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex gap-4 bg-white border border-[#D9D5CE] rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge className={`${categoryColors[item.category]} text-xs`}>
            {categoryLabels[item.category]}
          </Badge>
          <span className="text-sm text-[#6E6A63]">{formatDate(item.publishedAt)}</span>
        </div>
        <h3 className="font-semibold text-[#141416] mb-1 hover:text-[#B48C5A] transition-colors cursor-pointer">
          {item.title}
        </h3>
        <p className="text-sm text-[#6E6A63] line-clamp-2 mb-2">{item.excerpt}</p>
        <div className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={item.author.avatar} alt={item.author.name} />
            <AvatarFallback className="text-xs">{item.author.name[0]}</AvatarFallback>
          </Avatar>
          <Link to={`/profile/${item.author.username}`} className="text-sm text-[#6E6A63] hover:underline">
            {item.author.name}
          </Link>
        </div>
      </div>
      {(item.image || item.videoThumbnail) && (
        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative rounded-lg overflow-hidden">
          <img 
            src={item.image || item.videoThumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          {item.video && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const featuredNews = newsItems[0];
  const otherNews = newsItems.slice(1);

  const filteredNews = activeTab === 'all' 
    ? otherNews 
    : otherNews.filter(item => item.category === activeTab);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-2xl text-[#141416] flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            News
          </h1>
          <Button variant="outline" size="sm" className="border-[#D9D5CE]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-transparent h-auto p-0 justify-start gap-2 overflow-x-auto">
            <TabsTrigger 
              value="all" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-[#141416] data-[state=active]:text-[#F4F1EC] data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="breaking" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              Breaking
            </TabsTrigger>
            <TabsTrigger 
              value="tech" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              Tech
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              Business
            </TabsTrigger>
            <TabsTrigger 
              value="culture" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              Culture
            </TabsTrigger>
            <TabsTrigger 
              value="science" 
              className="px-4 py-2 rounded-full data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:border data-[state=inactive]:border-[#D9D5CE]"
            >
              Science
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Featured News */}
        <NewsCard item={featuredNews} featured />

        {/* News Grid */}
        <div>
          <h2 className="font-semibold text-lg text-[#141416] mb-4">Latest Stories</h2>
          <div className="space-y-4">
            {filteredNews.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white border border-[#D9D5CE] rounded-xl p-4">
          <h2 className="font-semibold text-lg text-[#141416] mb-4">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {topics.slice(0, 6).map(topic => (
              <Link 
                key={topic.id}
                to={`/discover`}
                className="px-4 py-2 bg-[#E8E4DE] rounded-full text-[#141416] hover:bg-[#D9D5CE] transition-colors"
              >
                #{topic.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-[#B48C5A] to-[#8B6914] rounded-xl p-6 text-white">
          <h2 className="text-xl font-bold mb-2">Stay Informed</h2>
          <p className="text-white/80 mb-4">Get the latest news and updates delivered to your inbox.</p>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30"
            />
            <Button className="bg-white text-[#B48C5A] hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
