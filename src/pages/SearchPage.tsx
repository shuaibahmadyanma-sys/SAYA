import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ArrowLeft, 
  X,
  TrendingUp,
  Clock,
  User,
  FileText,
  Hash
} from 'lucide-react';
import { users, posts, topics, questions } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const recentSearches = ['writing tips', 'fintech africa', 'philosophy', 'startup advice'];
const trendingSearches = ['AI writing', 'African tech', 'remote work', 'productivity'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [hasSearched, setHasSearched] = useState(!!searchParams.get('q'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setHasSearched(true);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setHasSearched(false);
    setSearchParams({});
  };

  // Filter results based on query
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase()) ||
    u.bio.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredTopics = topics.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(query.toLowerCase()) ||
    q.content.toLowerCase().includes(query.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-4">
        <div className="flex items-center gap-4">
          <Link to="/feed" className="text-[#141416] hover:text-[#B48C5A] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6A63]" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search SAYA" 
              className="pl-10 pr-10 bg-white border-[#D9D5CE]"
              autoFocus
            />
            {query && (
              <button 
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A63] hover:text-[#141416]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {!hasSearched ? (
        /* Default Search View */
        <div className="p-4">
          {/* Recent Searches */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#141416] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent
              </h3>
              <button className="text-sm text-[#B48C5A] hover:underline">Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(search => (
                <button
                  key={search}
                  onClick={() => { setQuery(search); setHasSearched(true); }}
                  className="px-4 py-2 bg-white border border-[#D9D5CE] rounded-full text-[#141416] hover:bg-[#E8E4DE] transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div>
            <h3 className="font-semibold text-[#141416] flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4" />
              Trending
            </h3>
            <div className="space-y-3">
              {trendingSearches.map((search, index) => (
                <button
                  key={search}
                  onClick={() => { setQuery(search); setHasSearched(true); }}
                  className="w-full flex items-center gap-4 p-3 bg-white border border-[#D9D5CE] rounded-xl hover:bg-[#E8E4DE] transition-colors text-left"
                >
                  <span className="text-[#B48C5A] font-bold">{index + 1}</span>
                  <span className="text-[#141416]">{search}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Topics */}
          <div className="mt-8">
            <h3 className="font-semibold text-[#141416] flex items-center gap-2 mb-4">
              <Hash className="w-4 h-4" />
              Topics for you
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {topics.slice(0, 4).map(topic => (
                <Link
                  key={topic.id}
                  to={`/discover`}
                  className="p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  {topic.image && (
                    <img 
                      src={topic.image} 
                      alt={topic.name} 
                      className="w-10 h-10 rounded-lg object-cover mb-2"
                    />
                  )}
                  <h4 className="font-semibold text-[#141416]">{topic.name}</h4>
                  <p className="text-sm text-[#6E6A63]">{topic.followers.toLocaleString()} followers</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Search Results */
        <Tabs defaultValue="top" className="mt-4">
          <TabsList className="w-full bg-white border-b border-[#D9D5CE] rounded-none h-auto p-0 justify-start px-4">
            <TabsTrigger 
              value="top" 
              className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
            >
              Top
            </TabsTrigger>
            <TabsTrigger 
              value="people"
              className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
            >
              People
            </TabsTrigger>
            <TabsTrigger 
              value="posts"
              className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="topics"
              className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
            >
              Topics
            </TabsTrigger>
            <TabsTrigger 
              value="questions"
              className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
            >
              Questions
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="top" className="mt-0 space-y-4">
              {/* People */}
              {filteredUsers.slice(0, 2).map(user => (
                <Link 
                  key={user.id} 
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#141416]">{user.name}</span>
                      {user.isVerified && <span className="text-[#B48C5A]">✓</span>}
                    </div>
                    <p className="text-sm text-[#6E6A63]">@{user.username}</p>
                    <p className="text-sm text-[#141416] mt-1 line-clamp-1">{user.bio}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#E8E4DE]">
                    <User className="w-3 h-3 mr-1" />
                    Person
                  </Badge>
                </Link>
              ))}

              {/* Posts */}
              {filteredPosts.slice(0, 2).map(post => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`}
                  className="block p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-[#141416]">{post.author.name}</span>
                  </div>
                  <p className="text-[#141416] line-clamp-2">{post.content}</p>
                  <Badge variant="secondary" className="mt-2 bg-[#E8E4DE]">
                    <FileText className="w-3 h-3 mr-1" />
                    Post
                  </Badge>
                </Link>
              ))}

              {/* Topics */}
              {filteredTopics.slice(0, 2).map(topic => (
                <Link 
                  key={topic.id} 
                  to={`/discover`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  {topic.image && (
                    <img 
                      src={topic.image} 
                      alt={topic.name} 
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#141416]">{topic.name}</h4>
                    <p className="text-sm text-[#6E6A63]">{topic.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#E8E4DE]">
                    <Hash className="w-3 h-3 mr-1" />
                    Topic
                  </Badge>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="people" className="mt-0 space-y-4">
              {filteredUsers.map(user => (
                <Link 
                  key={user.id} 
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#141416]">{user.name}</span>
                      {user.isVerified && <span className="text-[#B48C5A]">✓</span>}
                    </div>
                    <p className="text-sm text-[#6E6A63]">@{user.username}</p>
                    <p className="text-sm text-[#141416] mt-1">{user.bio}</p>
                    <p className="text-sm text-[#6E6A63] mt-1">{user.followers.toLocaleString()} followers</p>
                  </div>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="posts" className="mt-0 space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="p-4 bg-white border border-[#D9D5CE] rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/profile/${post.author.username}`} className="font-semibold text-[#141416] hover:underline">
                        {post.author.name}
                      </Link>
                      <p className="text-sm text-[#6E6A63]">@{post.author.username}</p>
                    </div>
                  </div>
                  <p className="text-[#141416] mb-3">{post.content}</p>
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post" 
                      className="rounded-xl max-h-60 w-full object-cover"
                    />
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="topics" className="mt-0 space-y-4">
              {filteredTopics.map(topic => (
                <Link 
                  key={topic.id} 
                  to={`/discover`}
                  className="flex items-center gap-4 p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  {topic.image && (
                    <img 
                      src={topic.image} 
                      alt={topic.name} 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#141416]">{topic.name}</h4>
                    <p className="text-sm text-[#6E6A63]">{topic.description}</p>
                    <p className="text-sm text-[#6E6A63] mt-1">
                      {topic.followers.toLocaleString()} followers · {topic.posts.toLocaleString()} posts
                    </p>
                  </div>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="questions" className="mt-0 space-y-4">
              {filteredQuestions.map(question => (
                <Link 
                  key={question.id} 
                  to={`/question/${question.id}`}
                  className="block p-4 bg-white border border-[#D9D5CE] rounded-xl hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-[#141416] mb-2">{question.title}</h4>
                  <p className="text-[#6E6A63] line-clamp-2 mb-3">{question.content}</p>
                  <div className="flex items-center gap-4 text-sm text-[#6E6A63]">
                    <span>{question.answers.length} answers</span>
                    <span>{question.views.toLocaleString()} views</span>
                  </div>
                </Link>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
