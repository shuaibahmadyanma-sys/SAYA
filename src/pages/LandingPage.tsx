import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Menu, X, Twitter, Linkedin, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

/* ============================
   AUTH DIALOG COMPONENT
   ============================ */
function AuthDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signup(name, username, email, password);
        if (error) setError(error);
        else {
          onOpenChange(false);
          navigate('/feed');
        }
      } else {
        const { error } = await login(email, password);
        if (error) setError(error);
        else {
          onOpenChange(false);
          navigate('/feed');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#F4F1EC] border-none max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold text-[#141416] text-center">
            {mode === 'signup' ? 'Create your account' : 'Sign in to SAYA'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <>
              <div>
                <label className="text-sm font-medium text-[#6E6A63] mb-2 block">Full Name</label>
                <Input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name" 
                  required
                  className="bg-white border-[#D9D5CE] focus:border-[#B48C5A] focus:ring-[#B48C5A]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#6E6A63] mb-2 block">Username</label>
                <Input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username" 
                  required
                  className="bg-white border-[#D9D5CE] focus:border-[#B48C5A] focus:ring-[#B48C5A]"
                />
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-[#6E6A63] mb-2 block">Email</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required
              className="bg-white border-[#D9D5CE] focus:border-[#B48C5A] focus:ring-[#B48C5A]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[#6E6A63] mb-2 block">Password</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters" 
              required
              minLength={6}
              className="bg-white border-[#D9D5CE] focus:border-[#B48C5A] focus:ring-[#B48C5A]"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </Button>
          <p className="text-center text-sm text-[#6E6A63]">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button"
              onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); }}
              className="text-[#B48C5A] font-medium hover:underline"
            >
              {mode === 'signup' ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============================
   LANDING PAGE
   ============================ */
export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative">
      <LandingNav onSignInClick={() => setAuthOpen(true)} />
      <main className="relative">
        <HeroSection onCreateAccount={() => setAuthOpen(true)} />
        {/* Feature sections */}
        <FeatureSection id="readers" headline={['A SPACE','FOR READERS']} body="Follow writers, publications, and topics. Your feed stays readable—no noise, no endless widgets." cta="Explore the feed" imageSrc="/feature_readers_feed.jpg" imagePosition="left" zIndex={20} />
        <FeatureSection id="writers" headline={['A SPACE','FOR WRITERS']} body="A clean editor, instant preview, and publishing that puts your words first. No clutter. No distractions." cta="Start writing" imageSrc="/feature_writers_editor.jpg" imagePosition="right" zIndex={30} />
        <FeatureSection headline={['CREATE','AN ACCOUNT','WITH EMAIL']} body="One email, one password. No complex setups. Start reading and writing in under a minute." cta="Get started" imageSrc="/feature_account_onboarding.jpg" imagePosition="left" zIndex={40} />
        <FeatureSection headline={['FOLLOW','AND','MESSAGE']} body="Build your circle. Send messages to collaborators, subscribers, or new connections—without leaving the platform." cta="See how it works" imageSrc="/feature_follow_message.jpg" imagePosition="right" zIndex={50} />
        <FeatureSection headline={['FOR PROS','EXECS','HIGH-EDUCATION','NETWORKS']} body="Share expertise, publish research, and connect with serious readers—academics, operators, analysts, builders." cta="Learn more" imageSrc="/feature_pros_network.jpg" imagePosition="left" zIndex={60} />
        <FeatureSection id="debate" headline={['REAL-TIME','DEBATE','AND DISCUSSION']} body="Comment threads that stay readable. Quote posts. Reply with context. Keep the conversation civil—and on point." cta="Join a discussion" imageSrc="/feature_debate_discussion.jpg" imagePosition="left" zIndex={80} />
        <FeatureSection id="discovery" headline={['KNOWLEDGE','SEEKING','AND DISCOVERY']} body="Find answers from people who've done the work. Search by topic, author, or thread—and save what matters." cta="Search topics" imageSrc="/feature_knowledge_search.jpg" imagePosition="right" zIndex={90} />
        <ClosingCTA onCreateAccount={() => setAuthOpen(true)} />
        <FooterSection />
      </main>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}

/* ============================
   SUB-COMPONENTS
   ============================ */

function LandingNav({ onSignInClick }: { onSignInClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100]">
        <div className="flex items-center justify-between px-[7vw] py-5">
          <span className="font-display text-2xl font-bold tracking-tight text-[#141416]">SAYA</span>
          <div className="flex items-center gap-6">
            <button onClick={() => setMenuOpen(true)} className="flex items-center gap-2 text-sm font-medium text-[#141416] hover:text-[#B48C5A]">
              <Menu className="w-5 h-5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
            <button onClick={onSignInClick} className="text-sm font-medium text-[#141416] hover:text-[#B48C5A]">Sign in</button>
          </div>
        </div>
      </nav>
      <div className={`fixed inset-0 z-[200] bg-[#0B0B0D] transition-transform duration-500 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full px-[7vw] py-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-[#F4F1EC]">SAYA</span>
            <button onClick={() => setMenuOpen(false)} className="text-[#F4F1EC]"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {['Readers','Writers','Debate','Discovery'].map(l => (
              <span key={l} className="font-display text-4xl md:text-6xl font-bold text-[#F4F1EC] uppercase">{l}</span>
            ))}
          </div>
          <button onClick={() => { setMenuOpen(false); onSignInClick(); }} className="btn-primary w-full md:w-auto">Create account</button>
        </div>
      </div>
    </>
  );
}

function HeroSection({ onCreateAccount }: { onCreateAccount: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    if (!section || !headline || !image || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(headline.querySelectorAll('.headline-line'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 })
        .fromTo(image, { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, '-=0.6')
        .fromTo(content.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4');

      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6,
          onLeaveBack: () => { gsap.set([headline, image, content], { clearProps: 'all' }); tl.progress(1); }
        }
      });
      scrollTl.fromTo(headline, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(image, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(content, { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-paper z-10">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full md:w-1/2 px-[7vw]">
          <div className="micro-label text-[#6E6A63] mb-8">SAYA / PLATFORM</div>
          <div ref={headlineRef} className="mb-8">
            <h1 className="headline-hero text-[clamp(48px,7vw,100px)] text-[#141416]">
              <span className="headline-line block">WRITE</span>
              <span className="headline-line block">FOLLOW</span>
              <span className="headline-line block">MESSAGE</span>
            </h1>
          </div>
          <div ref={contentRef}>
            <p className="text-[#6E6A63] text-lg md:text-xl max-w-md mb-8 leading-relaxed">
              A calm place to publish, follow writers, and message people who read thoughtfully.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={onCreateAccount} className="btn-primary">Create account</button>
              <button onClick={onCreateAccount} className="text-[#141416] font-medium hover:text-[#B48C5A]">Sign in</button>
            </div>
          </div>
        </div>
        <div ref={imageRef} className="hidden md:block absolute right-[6vw] top-[14vh] w-[42vw] h-[72vh]">
          <div className="image-card w-full h-full">
            <img src="/hero_reading_feed.jpg" alt="SAYA Platform" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ id, headline, body, cta, imageSrc, imagePosition, zIndex }: any) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headlineEl = headlineRef.current;
    const imageEl = imageRef.current;
    const contentEl = contentRef.current;
    if (!section || !headlineEl || !imageEl || !contentEl) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 } });
      const hX = imagePosition === 'left' ? '-60vw' : '60vw';
      const iX = imagePosition === 'left' ? '60vw' : '-60vw';
      const eH = imagePosition === 'left' ? '-18vw' : '18vw';
      const eI = imagePosition === 'left' ? '18vw' : '-18vw';

      scrollTl.fromTo(headlineEl, { x: hX, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(imageEl, { x: iX, opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0)
        .fromTo(contentEl, { y: '10vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.05)
        .fromTo(headlineEl, { x: 0, opacity: 1 }, { x: eH, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(imageEl, { x: 0, opacity: 1 }, { x: eI, opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(contentEl, { y: 0, opacity: 1 }, { y: '8vh', opacity: 0, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, [imagePosition]);

  const isLeft = imagePosition === 'left';
  return (
    <section ref={sectionRef} id={id} className="section-pinned bg-paper" style={{ zIndex }}>
      <div className="absolute inset-0 flex items-center">
        <div ref={imageRef} className={`hidden md:block absolute ${isLeft ? 'left-[7vw]' : 'right-[6vw]'} top-[14vh] w-[44vw] h-[72vh]`}>
          <div className="image-card w-full h-full">
            <img src={imageSrc} alt={headline.join(' ')} className="w-full h-full object-cover" />
          </div>
        </div>
        <div className={`w-full md:w-1/2 px-[7vw] ${isLeft ? 'md:ml-auto' : ''}`}>
          <div ref={headlineRef} className="mb-8">
            <h2 className="headline-section text-[clamp(36px,5vw,72px)] text-[#141416]">
              {headline.map((line: string, i: number) => <span key={i} className="block">{line}</span>)}
            </h2>
          </div>
          <div ref={contentRef}>
            <p className="text-[#6E6A63] text-lg max-w-md mb-8 leading-relaxed">{body}</p>
            <span className="link-arrow cursor-pointer">{cta} <ArrowRight className="w-4 h-4" /></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingCTA({ onCreateAccount }: { onCreateAccount: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const card = cardRef.current;
    if (!section || !headline || !card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headline, { x: '-10vw', opacity: 0 }, { x: 0, opacity: 1, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 35%', scrub: 0.5 } });
      gsap.fromTo(card, { x: '10vw', opacity: 0, scale: 0.98 }, { x: 0, opacity: 1, scale: 1, scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 35%', scrub: 0.5 } });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-ink py-20">
      <div className="px-[7vw]">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          <div>
            <div ref={headlineRef} className="mb-12">
              <h2 className="headline-section text-[clamp(42px,5vw,84px)] text-[#F4F1EC]">
                <span className="block">READY</span>
                <span className="block">WHEN</span>
                <span className="block">YOU ARE</span>
              </h2>
            </div>
            <p className="text-[#A9A59D] text-lg max-w-md mb-8 leading-relaxed">
              Start writing, follow great readers, and message the people who challenge you to think clearer.
            </p>
            <button onClick={onCreateAccount} className="btn-primary">Create free account</button>
          </div>
          <div ref={cardRef} className="flex justify-center md:justify-end">
            <div className="bg-[#F4F1EC] rounded-[10px] p-8 md:p-12 w-full max-w-md">
              <h3 className="font-display text-2xl font-bold text-[#141416] mb-4">Have a publication in mind?</h3>
              <p className="text-[#6E6A63] mb-8 leading-relaxed">Tell us what you want to build. We'll help you migrate, format, and launch.</p>
              <button className="w-full py-3 px-6 rounded-lg bg-[#0B0B0D] text-[#F4F1EC] font-medium hover:bg-[#141416] transition-colors">Request a demo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-ink py-16">
      <div className="px-[7vw]">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-display text-lg font-bold text-[#F4F1EC] mb-4">Contact</h4>
            <div className="space-y-2">
              <a href="mailto:hello@saya.pub" className="block text-[#A9A59D] hover:text-[#B48C5A]">hello@saya.pub</a>
              <a href="mailto:support@saya.pub" className="block text-[#A9A59D] hover:text-[#B48C5A]">support@saya.pub</a>
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features','Pricing','Import','API'] },
            { title: 'Community', links: ['Guidelines','Discussions','Writers','Support'] },
            { title: 'Legal', links: ['Privacy','Terms','Cookies'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display text-lg font-bold text-[#F4F1EC] mb-4">{col.title}</h4>
              <div className="space-y-2">
                {col.links.map(link => <a key={link} href="#" className="block text-[#A9A59D] hover:text-[#B48C5A]">{link}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#F4F1EC]/10">
          <span className="text-[#A9A59D] mb-4 md:mb-0">© SAYA</span>
          <div className="flex items-center gap-6">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" className="text-[#A9A59D] hover:text-[#B48C5A]"><Icon className="w-5 h-5" /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
