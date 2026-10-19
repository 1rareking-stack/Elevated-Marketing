import { useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CirclePlay,
  Clapperboard,
  Clock3,
  Command,
  FolderKanban,
  Images,
  Layers3,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MousePointer2,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'

const concepts = [
  {
    title: 'Quiet morning ritual',
    format: '9:16 UGC',
    metric: '+31% CTR',
    className: 'creative-peach',
    eyebrow: 'Slow mornings, better focus.',
  },
  {
    title: 'Built for the 3PM reset',
    format: '1:1 Product',
    metric: '+24% CVR',
    className: 'creative-blue',
    eyebrow: 'Meet your new afternoon ritual.',
  },
  {
    title: 'Good energy, no trade-offs',
    format: '4:5 Editorial',
    metric: 'Top pick',
    className: 'creative-lime',
    eyebrow: 'A cleaner kind of lift.',
  },
]

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo ${inverse ? 'logo-inverse' : ''}`} to="/" aria-label="Elevated home">
      <span className="logo-mark"><span /></span>
      <span>Elevated</span>
    </Link>
  )
}

function ButtonLink({
  to,
  children,
  variant = 'primary',
}: {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'light'
}) {
  return (
    <Link className={`button button-${variant}`} to={to}>
      {children}
    </Link>
  )
}

function PublicHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header className="public-header">
      <div className="nav-container">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#workflow">How it works</a>
          <a href="#results">Results</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="desktop-actions">
          <Link className="text-link" to="/studio">Sign in</Link>
          <ButtonLink to="/studio">Start creating <ArrowRight size={16} /></ButtonLink>
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#platform" onClick={() => setOpen(false)}>Platform</a>
          <a href="#workflow" onClick={() => setOpen(false)}>How it works</a>
          <a href="#results" onClick={() => setOpen(false)}>Results</a>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
          <ButtonLink to="/studio">Start creating <ArrowRight size={16} /></ButtonLink>
        </nav>
      )}
    </header>
  )
}

function CreativeCard({ concept, index }: { concept: typeof concepts[number]; index: number }) {
  return (
    <article className={`creative-card ${concept.className}`}>
      <div className="creative-topline">
        <span>{concept.format}</span>
        <span className="metric-pill"><TrendingUp size={12} /> {concept.metric}</span>
      </div>
      <div className="product-visual" aria-hidden="true">
        <div className="product-shadow" />
        <div className="can">
          <small>ELEVATED</small>
          <strong>{index === 1 ? 'FLOW' : index === 2 ? 'GLOW' : 'RISE'}</strong>
          <span>BOTANICAL ENERGY</span>
        </div>
        <Sparkles className="sparkle sparkle-one" size={20} />
        <Sparkles className="sparkle sparkle-two" size={14} />
      </div>
      <div>
        <p>{concept.eyebrow}</p>
        <h3>{concept.title}</h3>
      </div>
    </article>
  )
}

function LandingPage() {
  return (
    <div className="landing-page">
      <PublicHeader />
      <main>
        <section className="hero">
          <div className="hero-orb hero-orb-left" />
          <div className="hero-orb hero-orb-right" />
          <div className="hero-content">
            <div className="eyebrow-chip"><span /> Creative intelligence, built in</div>
            <h1>Turn your best ideas into <em>ads that perform.</em></h1>
            <p className="hero-copy">
              Elevated is the creative workspace that helps marketing teams go from product
              insight to on-brand, campaign-ready ads—without the production bottleneck.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/studio">Create your first ad <ArrowRight size={17} /></ButtonLink>
              <a className="button button-secondary" href="#workflow">
                <CirclePlay size={17} /> See how it works
              </a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>MK</span><span>AN</span><span>JP</span><span>+</span>
              </div>
              <p><strong>Loved by creative teams</strong><br />4.9/5 from 200+ marketers</p>
            </div>
          </div>
          <div className="studio-preview" aria-label="Elevated studio preview">
            <div className="preview-toolbar">
              <div className="preview-dots"><span /><span /><span /></div>
              <span className="preview-title">Summer energy campaign</span>
              <button><CirclePlay size={14} /> Preview</button>
            </div>
            <div className="preview-body">
              <aside className="preview-sidebar">
                <Logo />
                {[LayoutDashboard, FolderKanban, Sparkles, Images].map((Icon, index) => (
                  <span className={index === 2 ? 'active' : ''} key={index}><Icon size={17} /></span>
                ))}
              </aside>
              <div className="preview-canvas">
                <div className="preview-heading">
                  <div><small>CREATIVE EXPLORATION</small><h2>Your concepts</h2></div>
                  <div className="view-buttons"><span /><span /><span /></div>
                </div>
                <div className="creative-grid">
                  {concepts.map((concept, index) => (
                    <CreativeCard concept={concept} index={index} key={concept.title} />
                  ))}
                </div>
              </div>
            </div>
            <div className="floating-note">
              <span><WandSparkles size={16} /></span>
              <div><small>Elevated suggestion</small><strong>3 new hooks ready to review</strong></div>
              <ChevronRight size={15} />
            </div>
          </div>
        </section>

        <section className="logo-cloud" aria-label="Trusted companies">
          <p>Built for teams moving culture forward</p>
          <div>
            <strong>ARC&CO</strong><strong>NORTH/</strong><strong>ōnda</strong>
            <strong>MODE</strong><strong>FIELD</strong><strong>form</strong>
          </div>
        </section>

        <section className="section feature-section" id="platform">
          <div className="section-heading">
            <span className="kicker">ONE CREATIVE SYSTEM</span>
            <h2>From brief to breakthrough,<br /><em>all in one flow.</em></h2>
            <p>Bring strategy, generation, feedback, and performance together so every campaign gets smarter.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card feature-card-large">
              <div className="feature-icon"><WandSparkles /></div>
              <div>
                <span className="step-label">01 / CREATE</span>
                <h3>Ideas that start with your brand</h3>
                <p>Turn a product URL or brief into strategic concepts, tailored hooks, and ready-to-edit creative.</p>
                <a href="#workflow">Explore creation <ArrowRight size={15} /></a>
              </div>
              <div className="prompt-demo">
                <div className="prompt-label"><Sparkles size={14} /> CREATE WITH ELEVATED</div>
                <p>Launch a summer campaign for our botanical energy drink focused on the 3PM slump.</p>
                <div className="prompt-tags"><span>Instagram</span><span>UGC</span><span>9:16</span></div>
                <button aria-label="Submit prompt"><ArrowRight /></button>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon violet"><Layers3 /></div>
              <span className="step-label">02 / ADAPT</span>
              <h3>Every format. One idea.</h3>
              <p>Resize, rewrite, and remix winning concepts for every placement in a few clicks.</p>
              <div className="format-stack">
                <span className="format portrait">9:16</span>
                <span className="format square">1:1</span>
                <span className="format landscape">16:9</span>
              </div>
            </article>
            <article className="feature-card dark-card" id="results">
              <div className="feature-icon dark"><BarChart3 /></div>
              <span className="step-label">03 / LEARN</span>
              <h3>Know what makes creative win.</h3>
              <p>Connect performance to creative choices and turn every campaign into your next advantage.</p>
              <div className="insight-card">
                <div><small>TOP PERFORMING HOOK</small><strong>“The 3PM reset”</strong></div>
                <span>+31%</span>
              </div>
            </article>
          </div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="workflow-copy">
            <span className="kicker">BUILT FOR MOMENTUM</span>
            <h2>Your next campaign,<br /><em>minus the chaos.</em></h2>
            <div className="workflow-steps">
              {[
                ['01', 'Add your product', 'Drop in a URL, upload assets, or start with a simple brief.'],
                ['02', 'Choose a direction', 'Explore on-brand concepts grounded in proven creative patterns.'],
                ['03', 'Make it yours', 'Refine copy, layouts, and formats with full creative control.'],
                ['04', 'Ship and learn', 'Export campaign-ready assets and track what resonates.'],
              ].map(([number, title, body]) => (
                <div className="workflow-step" key={number}>
                  <span>{number}</span><div><h3>{title}</h3><p>{body}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="workflow-visual">
            <div className="asset-window">
              <div className="asset-bar"><span>Brand assets</span><MoreDots /></div>
              <div className="brand-row"><div className="mini-logo">E</div><div><strong>Everwell</strong><small>Brand connected</small></div><Check /></div>
              <p>RECENT ASSETS</p>
              <div className="asset-grid"><span /><span /><span /><span /></div>
            </div>
            <div className="campaign-tile">
              <span>READY TO EXPORT</span>
              <h3>Summer<br />Energy</h3>
              <div><small>12 assets</small><button><ArrowRight /></button></div>
            </div>
          </div>
        </section>

        <section className="testimonial section">
          <blockquote>“Elevated gives our team back the time to think. We’re creating more, learning faster, and the work actually feels like us.”</blockquote>
          <div className="quote-person"><span>JL</span><div><strong>Jamie Lin</strong><small>VP Marketing, Onda</small></div></div>
          <div className="quote-metrics">
            <div><strong>3.4×</strong><span>More concepts tested</span></div>
            <div><strong>62%</strong><span>Faster production</span></div>
            <div><strong>28%</strong><span>Lower creative CPA</span></div>
          </div>
        </section>

        <section className="cta-section" id="pricing">
          <div className="cta-glow" />
          <span className="kicker">YOUR BEST CREATIVE IS AHEAD</span>
          <h2>Make work that<br /><em>moves people.</em></h2>
          <p>Start creating for free. No credit card required.</p>
          <ButtonLink to="/studio" variant="light">Start creating <ArrowRight size={17} /></ButtonLink>
        </section>
      </main>
      <footer>
        <Logo inverse />
        <p>Creative intelligence for ambitious brands.</p>
        <nav aria-label="Footer navigation"><a href="#platform">Platform</a><a href="#workflow">How it works</a><a href="#results">Results</a></nav>
        <span>© 2026 Elevated</span>
      </footer>
    </div>
  )
}

function MoreDots() {
  return <span className="more-dots" aria-hidden="true">•••</span>
}

const studioNav = [
  [LayoutDashboard, 'Overview'],
  [FolderKanban, 'Projects'],
  [Sparkles, 'Create'],
  [Images, 'Brand library'],
  [BarChart3, 'Insights'],
] as const

function StudioPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top"><Logo /><button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X /></button></div>
        <nav aria-label="Studio navigation">
          {studioNav.map(([Icon, label], index) => (
            <NavLink className={index === 0 ? 'active' : ''} to="/studio" key={label}><Icon size={19} />{label}</NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <a href="#settings"><Settings size={18} /> Settings</a>
          <Link to="/"><ArrowRight className="back-arrow" size={18} /> Back to website</Link>
          <div className="profile-chip"><span>AK</span><div><strong>Alex Kim</strong><small>Personal workspace</small></div></div>
        </div>
      </aside>
      <main className="studio-main">
        <header className="studio-header">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><PanelLeft /></button>
          <div className="studio-search"><Search size={17} /><span>Search projects and assets</span><kbd>⌘ K</kbd></div>
          <button className="icon-button" aria-label="Messages"><MessageSquareText /></button>
          <button className="button button-primary"><Plus size={17} /> New project</button>
        </header>
        <div className="studio-content">
          <div className="welcome-row">
            <div><span className="kicker">MONDAY, OCTOBER 19</span><h1>Good morning, Alex.</h1><p>Pick up where you left off or make something new.</p></div>
            <ButtonLink to="/studio">Create with AI <WandSparkles size={17} /></ButtonLink>
          </div>
          <div className="stat-grid">
            <div><span><Clapperboard /></span><p>Active projects<strong>8</strong></p><small>2 updated today</small></div>
            <div><span><MousePointer2 /></span><p>Assets created<strong>126</strong></p><small>+18 this week</small></div>
            <div><span><Zap /></span><p>Top creative lift<strong>+31%</strong></p><small>Last 30 days</small></div>
          </div>
          <section className="projects-section">
            <div className="content-heading"><div><h2>Recent projects</h2><p>Your latest creative work</p></div><button>View all <ArrowRight size={15} /></button></div>
            <div className="project-grid">
              {concepts.map((concept, index) => (
                <article className="project-card" key={concept.title}>
                  <div className={`project-thumb ${concept.className}`}><div className="can"><small>ELEVATED</small><strong>{index === 1 ? 'FLOW' : index === 2 ? 'GLOW' : 'RISE'}</strong></div><span>{concept.metric}</span></div>
                  <div><h3>{index === 0 ? 'Summer energy launch' : index === 1 ? 'Always-on social' : 'Retail campaign'}</h3><p><Clock3 size={13} /> Updated {index + 1} day{index ? 's' : ''} ago</p></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
