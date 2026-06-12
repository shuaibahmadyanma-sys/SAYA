import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  Users,
  ThumbsUp,
  CheckCircle2,
  Plus,
  Filter
} from 'lucide-react';
import { questions, topics, suggestedUsers } from '../data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function QuestionCard({ question }: { question: typeof questions[0] }) {
  const [upvotedAnswer, setUpvotedAnswer] = useState<string | null>(null);

  return (
    <article className="bg-white border border-[#D9D5CE] rounded-xl p-6 mb-4 hover:shadow-md transition-shadow">
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <Link to={`/profile/${question.author.username}`}>
          <Avatar className="w-10 h-10">
            <AvatarImage src={question.author.avatar} alt={question.author.name} />
            <AvatarFallback>{question.author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link to={`/profile/${question.author.username}`} className="font-semibold text-[#141416] hover:underline">
            {question.author.name}
          </Link>
          {question.author.isVerified && <span className="text-[#B48C5A] ml-1">✓</span>}
          <p className="text-sm text-[#6E6A63]">asked a question</p>
        </div>
        <Button variant="outline" size="sm" className="border-[#D9D5CE] text-[#141416] hover:bg-[#E8E4DE]">
          Follow
        </Button>
      </div>

      {/* Question Title */}
      <Link to={`/question/${question.id}`}>
        <h3 className="text-xl font-semibold text-[#141416] mb-2 hover:text-[#B48C5A] transition-colors">
          {question.title}
        </h3>
      </Link>
      <p className="text-[#6E6A63] mb-4 line-clamp-2">{question.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="bg-[#E8E4DE] text-[#6E6A63] hover:bg-[#D9D5CE]">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-[#6E6A63] mb-4 pb-4 border-b border-[#D9D5CE]">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          <span>{question.answers.length} answers</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{question.views.toLocaleString()} views</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{question.followers} followers</span>
        </div>
      </div>

      {/* Top Answer */}
      {question.answers.length > 0 && (
        <div className="space-y-4">
          {question.answers.slice(0, 1).map(answer => (
            <div key={answer.id} className="bg-[#F4F1EC] rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <Link to={`/profile/${answer.author.username}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={answer.author.avatar} alt={answer.author.name} />
                    <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/profile/${answer.author.username}`} className="font-semibold text-[#141416] hover:underline">
                      {answer.author.name}
                    </Link>
                    {answer.isAccepted && (
                      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Accepted
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#6E6A63]">{answer.author.role}</p>
                </div>
              </div>
              <p className="text-[#141416] mb-3">{answer.content}</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setUpvotedAnswer(upvotedAnswer === answer.id ? null : answer.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    upvotedAnswer === answer.id 
                      ? 'text-[#B48C5A]' 
                      : 'text-[#6E6A63] hover:text-[#B48C5A]'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${upvotedAnswer === answer.id ? 'fill-current' : ''}`} />
                  <span>{answer.upvotes + (upvotedAnswer === answer.id ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <Button variant="outline" className="border-[#D9D5CE] text-[#141416] hover:bg-[#E8E4DE]">
          <MessageSquare className="w-4 h-4 mr-2" />
          Answer
        </Button>
        <Button variant="ghost" className="text-[#6E6A63] hover:text-[#141416]">
          <Eye className="w-4 h-4 mr-2" />
          View all answers
        </Button>
      </div>
    </article>
  );
}

function TopicCard({ topic }: { topic: typeof topics[0] }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="bg-white border border-[#D9D5CE] rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {topic.image && (
          <img 
            src={topic.image} 
            alt={topic.name} 
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-[#141416] mb-1">{topic.name}</h4>
          <p className="text-sm text-[#6E6A63] mb-2">{topic.description}</p>
          <div className="flex items-center gap-4 text-sm text-[#6E6A63]">
            <span>{topic.followers.toLocaleString()} followers</span>
            <span>{topic.posts.toLocaleString()} posts</span>
          </div>
        </div>
        <Button
          onClick={() => setFollowing(!following)}
          variant={following ? 'outline' : 'default'}
          size="sm"
          className={following 
            ? 'border-[#D9D5CE] text-[#141416] hover:bg-[#E8E4DE]' 
            : 'bg-[#141416] text-[#F4F1EC] hover:bg-[#2a2a2c]'
          }
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#D9D5CE] px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-2xl text-[#141416]">Discover</h1>
          <Button className="bg-[#B48C5A] hover:bg-[#9a7550] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ask Question
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6A63]" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, topics, or people..." 
            className="pl-10 bg-white border-[#D9D5CE]"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="questions" className="mt-6">
        <TabsList className="w-full bg-white border-b border-[#D9D5CE] rounded-none h-auto p-0 justify-start px-4">
          <TabsTrigger 
            value="questions" 
            className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Questions
          </TabsTrigger>
          <TabsTrigger 
            value="topics"
            className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Topics
          </TabsTrigger>
          <TabsTrigger 
            value="people"
            className="rounded-none py-4 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#B48C5A] data-[state=active]:shadow-none"
          >
            <Users className="w-4 h-4 mr-2" />
            People
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="questions" className="mt-0 space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" className="border-[#D9D5CE]">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <div className="flex gap-2">
                <Badge className="bg-[#141416] text-[#F4F1EC] cursor-pointer">All</Badge>
                <Badge variant="outline" className="border-[#D9D5CE] text-[#6E6A63] cursor-pointer hover:bg-[#E8E4DE]">Unanswered</Badge>
                <Badge variant="outline" className="border-[#D9D5CE] text-[#6E6A63] cursor-pointer hover:bg-[#E8E4DE]">Trending</Badge>
              </div>
            </div>

            {/* Questions */}
            {questions.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </TabsContent>

          <TabsContent value="topics" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="people" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {suggestedUsers.map(user => (
                <div key={user.id} className="bg-white border border-[#D9D5CE] rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <Link to={`/profile/${user.username}`}>
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${user.username}`} className="font-semibold text-[#141416] hover:underline">
                        {user.name}
                      </Link>
                      {user.isVerified && <span className="text-[#B48C5A] ml-1">✓</span>}
                      <p className="text-sm text-[#6E6A63]">@{user.username}</p>
                      <p className="text-sm text-[#141416] mt-2 line-clamp-2">{user.bio}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-[#6E6A63]">
                        <span>{user.followers.toLocaleString()} followers</span>
                      </div>
                    </div>
                    <Button className="bg-[#141416] text-[#F4F1EC] hover:bg-[#2a2a2c]">
                      Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
