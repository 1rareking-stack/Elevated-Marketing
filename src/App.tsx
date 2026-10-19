import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  CirclePlay,
  Clapperboard,
  Clock3,
  Copy,
  Command,
  Download,
  FolderKanban,
  Images,
  Layers3,
  LayoutDashboard,
  Menu,
  Megaphone,
  MessageSquareText,
  MousePointer2,
  PanelLeft,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'

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

type CreativeConcept = {
  id: string
  headline: string
  body: string
  format: string
  angle: string
  status: 'Draft' | 'Approved'
  color: string
}

type StudioProject = {
  id: string
  name: string
  product: string
  audience: string
  objective: string
  tone: string
  channels: string[]
  updatedAt: string
  concepts: CreativeConcept[]
}

const demoProjects: StudioProject[] = [
  {
    id: 'summer-energy',
    name: 'Summer energy launch',
    product: 'Everwell botanical energy drinks',
    audience: 'Creative professionals looking for a cleaner afternoon lift',
    objective: 'Drive trial and product discovery',
    tone: 'Warm, optimistic, grounded',
    channels: ['Instagram', 'TikTok'],
    updatedAt: 'Today',
    concepts: [
      { id: 'reset', headline: 'Meet your 3PM reset.', body: 'Clear energy for the part of the day that needs it most.', format: '9:16', angle: 'Problem / solution', status: 'Approved', color: 'peach' },
      { id: 'ritual', headline: 'Make energy a ritual.', body: 'Botanicals, bright flavor, and a lift that feels like you.', format: '1:1', angle: 'Lifestyle', status: 'Draft', color: 'blue' },
      { id: 'tradeoffs', headline: 'Good energy. No trade-offs.', body: 'A cleaner kind of lift for wherever the day takes you.', format: '4:5', angle: 'Product benefit', status: 'Draft', color: 'lime' },
    ],
  },
  {
    id: 'always-on',
    name: 'Always-on social',
    product: 'Everwell variety pack',
    audience: 'Wellness-curious Gen Z shoppers',
    objective: 'Build awareness',
    tone: 'Playful and direct',
    channels: ['TikTok', 'Instagram'],
    updatedAt: 'Yesterday',
    concepts: [
      { id: 'desk-drawer', headline: 'Your desk drawer deserves better.', body: 'Stock the pick-me-up you will actually look forward to.', format: '9:16', angle: 'Relatable moment', status: 'Draft', color: 'blue' },
      { id: 'fridge', headline: 'The fridge refresh.', body: 'Three bright flavors. One very good decision.', format: '1:1', angle: 'Product showcase', status: 'Approved', color: 'lime' },
    ],
  },
  {
    id: 'retail',
    name: 'Retail campaign',
    product: 'Everwell retail launch',
    audience: 'Premium grocery shoppers',
    objective: 'Drive in-store purchase',
    tone: 'Fresh and confident',
    channels: ['Display', 'Instagram'],
    updatedAt: '3 days ago',
    concepts: [
      { id: 'shelf', headline: 'A brighter choice, in aisle five.', body: 'Find botanical energy with a flavor worth slowing down for.', format: '4:5', angle: 'Retail discovery', status: 'Draft', color: 'lime' },
    ],
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
  const [view, setView] = useState('Overview')
  const [projects, setProjects] = useState<StudioProject[]>(() => {
    try {
      const saved = localStorage.getItem('elevated-projects')
      return saved ? JSON.parse(saved) as StudioProject[] : demoProjects
    } catch {
      return demoProjects
    }
  })
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('elevated-projects', JSON.stringify(projects))
  }, [projects])

  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  const openProject = (id: string) => {
    setSelectedProjectId(id)
    setView('Editor')
  }

  const saveProject = (project: StudioProject) => {
    setProjects((current) => {
      const existing = current.some((item) => item.id === project.id)
      return existing
        ? current.map((item) => item.id === project.id ? project : item)
        : [project, ...current]
    })
    setSelectedProjectId(project.id)
    setView('Editor')
  }

  const selectView = (label: string) => {
    setView(label)
    setSelectedProjectId(null)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top"><Logo /><button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X /></button></div>
        <nav aria-label="Studio navigation">
          {studioNav.map(([Icon, label]) => (
            <button className={view === label ? 'active' : ''} onClick={() => selectView(label)} key={label}><Icon size={19} />{label}</button>
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
          <button className="button button-primary" onClick={() => selectView('Create')}><Plus size={17} /> New project</button>
        </header>
        {view === 'Overview' && <Overview projects={projects} openProject={openProject} onCreate={() => selectView('Create')} onViewAll={() => selectView('Projects')} />}
        {view === 'Projects' && <ProjectsView projects={projects} openProject={openProject} onCreate={() => selectView('Create')} />}
        {view === 'Create' && <CreateView onCreate={saveProject} />}
        {view === 'Brand library' && <BrandLibrary />}
        {view === 'Insights' && <InsightsView projects={projects} />}
        {view === 'Editor' && selectedProject && <ProjectEditor project={selectedProject} onChange={saveProject} onBack={() => selectView('Projects')} />}
      </main>
    </div>
  )
}

function PageIntro({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: ReactNode }) {
  return (
    <div className="welcome-row">
      <div><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>
      {action}
    </div>
  )
}

function ProjectCards({ projects, openProject }: { projects: StudioProject[]; openProject: (id: string) => void }) {
  const colors = ['creative-peach', 'creative-blue', 'creative-lime']
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <button className="project-card" onClick={() => openProject(project.id)} key={project.id}>
          <div className={`project-thumb ${colors[index % colors.length]}`}>
            <div className="can"><small>ELEVATED</small><strong>{index % 3 === 1 ? 'FLOW' : index % 3 === 2 ? 'GLOW' : 'RISE'}</strong></div>
            <span>{project.concepts.length} concepts</span>
          </div>
          <div><h3>{project.name}</h3><p><Clock3 size={13} /> Updated {project.updatedAt.toLowerCase()}</p></div>
        </button>
      ))}
    </div>
  )
}

function Overview({ projects, openProject, onCreate, onViewAll }: { projects: StudioProject[]; openProject: (id: string) => void; onCreate: () => void; onViewAll: () => void }) {
  const assetCount = projects.reduce((sum, project) => sum + project.concepts.length, 0)
  return (
    <div className="studio-content">
      <PageIntro eyebrow="MONDAY, OCTOBER 19" title="Good morning, Alex." copy="Pick up where you left off or make something new." action={<button className="button button-primary" onClick={onCreate}>Create with AI <WandSparkles size={17} /></button>} />
      <div className="stat-grid">
        <div><span><Clapperboard /></span><p>Active projects<strong>{projects.length}</strong></p><small>Stored in this browser</small></div>
        <div><span><MousePointer2 /></span><p>Assets created<strong>{assetCount}</strong></p><small>Across all projects</small></div>
        <div><span><Zap /></span><p>Top creative lift<strong>+31%</strong></p><small>Demo performance data</small></div>
      </div>
      <section className="projects-section">
        <div className="content-heading"><div><h2>Recent projects</h2><p>Your latest creative work</p></div><button onClick={onViewAll}>View all <ArrowRight size={15} /></button></div>
        <ProjectCards projects={projects.slice(0, 3)} openProject={openProject} />
      </section>
    </div>
  )
}

function ProjectsView({ projects, openProject, onCreate }: { projects: StudioProject[]; openProject: (id: string) => void; onCreate: () => void }) {
  return (
    <div className="studio-content">
      <PageIntro eyebrow="WORKSPACE" title="Projects" copy="Campaign concepts, creative variants, and approvals in one place." action={<button className="button button-primary" onClick={onCreate}><Plus size={17} /> New project</button>} />
      <div className="filter-row"><button className="active">All projects <span>{projects.length}</span></button><button>In progress</button><button>Approved</button><SlidersHorizontal size={16} /></div>
      <ProjectCards projects={projects} openProject={openProject} />
    </div>
  )
}

function buildConcepts(product: string, audience: string, tone: string): CreativeConcept[] {
  const shortProduct = product.trim() || 'your product'
  const audienceHint = audience.trim() ? `Made for ${audience.trim().toLowerCase()}.` : 'Made for the moments that matter.'
  return [
    { id: `moment-${Date.now()}`, headline: `The moment ${shortProduct} clicks.`, body: `${audienceHint} Simple, memorable, and ready when you are.`, format: '9:16', angle: 'Problem / solution', status: 'Draft', color: 'peach' },
    { id: `routine-${Date.now() + 1}`, headline: `Make ${shortProduct} part of the ritual.`, body: `A ${tone.toLowerCase() || 'fresh'} take on an everyday routine—built to stop the scroll.`, format: '1:1', angle: 'Lifestyle', status: 'Draft', color: 'blue' },
    { id: `difference-${Date.now() + 2}`, headline: `Feel the ${shortProduct} difference.`, body: 'Lead with the benefit, prove it with the product, and make the next step obvious.', format: '4:5', angle: 'Product benefit', status: 'Draft', color: 'lime' },
  ]
}

function CreateView({ onCreate }: { onCreate: (project: StudioProject) => void }) {
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({ name: '', product: '', audience: '', objective: 'Drive product discovery', tone: 'Warm and optimistic', channels: ['Instagram'] as string[] })

  const update = (field: keyof typeof form, value: string | string[]) => setForm((current) => ({ ...current, [field]: value }))
  const toggleChannel = (channel: string) => update('channels', form.channels.includes(channel) ? form.channels.filter((item) => item !== channel) : [...form.channels, channel])
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }
    setGenerating(true)
    window.setTimeout(() => {
      const id = `${(form.name || form.product || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`
      onCreate({ id, ...form, name: form.name || `${form.product} campaign`, updatedAt: 'Just now', concepts: buildConcepts(form.product, form.audience, form.tone) })
    }, 700)
  }

  return (
    <div className="studio-content create-layout">
      <PageIntro eyebrow={`NEW PROJECT · STEP ${step} OF 2`} title={step === 1 ? 'Start with the essentials.' : 'Shape the creative direction.'} copy={step === 1 ? 'Tell us what you are making and who it needs to move.' : 'Choose the goal, voice, and channels for your first concepts.'} />
      <form className="brief-form" onSubmit={submit}>
        {step === 1 ? (
          <>
            <label>Project name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Summer product launch" /></label>
            <label>What are you promoting?<textarea required value={form.product} onChange={(event) => update('product', event.target.value)} placeholder="Describe the product, offer, or idea..." rows={4} /></label>
            <label>Who is it for?<textarea required value={form.audience} onChange={(event) => update('audience', event.target.value)} placeholder="Describe your ideal audience..." rows={3} /></label>
          </>
        ) : (
          <>
            <label>Campaign objective<select value={form.objective} onChange={(event) => update('objective', event.target.value)}><option>Drive product discovery</option><option>Build brand awareness</option><option>Increase conversions</option><option>Launch a new product</option></select></label>
            <label>Creative tone<select value={form.tone} onChange={(event) => update('tone', event.target.value)}><option>Warm and optimistic</option><option>Bold and direct</option><option>Playful and witty</option><option>Premium and refined</option></select></label>
            <fieldset><legend>Channels</legend><div className="channel-grid">{['Instagram', 'TikTok', 'Meta Ads', 'Display'].map((channel) => <button type="button" className={form.channels.includes(channel) ? 'selected' : ''} onClick={() => toggleChannel(channel)} key={channel}><Check size={15} />{channel}</button>)}</div></fieldset>
          </>
        )}
        <div className="form-actions">{step === 2 && <button type="button" className="button button-secondary" onClick={() => setStep(1)}>Back</button>}<button className="button button-primary" disabled={generating}>{generating ? <><span className="spinner" /> Building concepts…</> : step === 1 ? <>Continue <ArrowRight size={16} /></> : <><WandSparkles size={16} /> Generate concepts</>}</button></div>
      </form>
      <div className="form-assurance"><Sparkles /><div><strong>Deterministic demo generation</strong><p>This prototype generates structured concepts locally. No prompt or brand data leaves your browser.</p></div></div>
    </div>
  )
}

function BrandLibrary() {
  const [brandName, setBrandName] = useState(() => localStorage.getItem('elevated-brand-name') || 'Everwell')
  const [saved, setSaved] = useState(false)
  const save = () => {
    localStorage.setItem('elevated-brand-name', brandName)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1500)
  }
  return (
    <div className="studio-content">
      <PageIntro eyebrow="BRAND SYSTEM" title="Brand library" copy="Keep every concept grounded in the same visual and verbal foundation." />
      <div className="brand-panel">
        <div className="brand-card-preview"><div className="brand-monogram">{brandName.slice(0, 1) || 'E'}</div><div><span>PRIMARY BRAND</span><h2>{brandName || 'Untitled brand'}</h2><p>Warm · Optimistic · Grounded</p></div></div>
        <div className="brand-settings">
          <label>Brand name<input value={brandName} onChange={(event) => setBrandName(event.target.value)} /></label>
          <div className="settings-row"><div><span>Brand colors</span><div className="color-swatches"><i /><i /><i /><i /></div></div><div><span>Type direction</span><strong>Modern + Editorial</strong></div></div>
          <label>Voice notes<textarea rows={4} defaultValue="Clear, warm, and useful. Confident without shouting. Lead with human benefits, then support with product truth." /></label>
          <button className="button button-primary" onClick={save}>{saved ? <><Check size={16} /> Saved</> : 'Save brand'}</button>
        </div>
      </div>
    </div>
  )
}

function InsightsView({ projects }: { projects: StudioProject[] }) {
  const angles = useMemo(() => projects.flatMap((project) => project.concepts.map((concept) => concept.angle)), [projects])
  return (
    <div className="studio-content">
      <PageIntro eyebrow="CREATIVE INTELLIGENCE" title="Insights" copy="A demo performance layer showing how creative learnings can flow back into production." />
      <div className="insights-grid">
        <article className="performance-card"><span>CREATIVE PERFORMANCE</span><h2>Momentum is trending up.</h2><div className="chart-bars">{[35, 42, 38, 55, 49, 68, 76, 71, 87, 94].map((height, index) => <i style={{ height: `${height}%` }} className={index === 9 ? 'active' : ''} key={index} />)}</div><div className="chart-axis"><span>Sep 21</span><span>Oct 19</span></div></article>
        <article className="learning-card"><span>TOP LEARNING</span><div className="learning-icon"><TrendingUp /></div><h2>Benefit-led hooks are winning.</h2><p>Concepts that name the audience’s moment before the product are showing stronger engagement in this demo dataset.</p><strong>+31% <small>click-through lift</small></strong></article>
      </div>
      <section className="angle-table"><div className="content-heading"><div><h2>Creative angles</h2><p>Patterns across {angles.length} generated concepts</p></div></div>{['Problem / solution', 'Lifestyle', 'Product benefit'].map((angle, index) => <div key={angle}><span>{index + 1}</span><strong>{angle}</strong><div><i style={{ width: `${86 - index * 17}%` }} /></div><em>{(4.8 - index * .6).toFixed(1)}% CTR</em></div>)}</section>
    </div>
  )
}

function ProjectEditor({ project, onChange, onBack }: { project: StudioProject; onChange: (project: StudioProject) => void; onBack: () => void }) {
  const [activeId, setActiveId] = useState(project.concepts[0]?.id)
  const [copied, setCopied] = useState(false)
  const active = project.concepts.find((concept) => concept.id === activeId) ?? project.concepts[0]
  if (!active) return null

  const updateConcept = (updates: Partial<CreativeConcept>) => onChange({ ...project, updatedAt: 'Just now', concepts: project.concepts.map((concept) => concept.id === active.id ? { ...concept, ...updates } : concept) })
  const copyText = async () => {
    await navigator.clipboard?.writeText(`${active.headline}\n${active.body}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  const download = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${project.id}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="editor-shell">
      <div className="editor-topbar"><button onClick={onBack}><ArrowRight size={15} /> Projects</button><div><strong>{project.name}</strong><span>Saved locally</span></div><button className="button button-secondary" onClick={download}><Download size={15} /> Export</button></div>
      <div className="editor-workspace">
        <aside className="concept-list"><span>CONCEPTS · {project.concepts.length}</span>{project.concepts.map((concept, index) => <button className={active.id === concept.id ? 'active' : ''} onClick={() => setActiveId(concept.id)} key={concept.id}><i className={`concept-swatch ${concept.color}`} /><div><strong>Concept {index + 1}</strong><small>{concept.angle}</small></div><em>{concept.status}</em></button>)}</aside>
        <div className="editor-stage">
          <div className="canvas-controls"><span>{active.format} · Social ad</span><div><button onClick={copyText}><Copy size={14} />{copied ? 'Copied' : 'Copy'}</button><button><Command size={14} /> Preview</button></div></div>
          <div className={`ad-canvas ${active.color}`}>
            <span className="ad-kicker">BOTANICAL ENERGY</span>
            <h2>{active.headline}</h2>
            <div className="editor-product"><div className="can"><small>ELEVATED</small><strong>RISE</strong><span>BOTANICAL ENERGY</span></div></div>
            <p>{active.body}</p>
            <button>SHOP EVERWELL <ArrowRight size={13} /></button>
          </div>
        </div>
        <aside className="properties-panel">
          <div className="property-heading"><span><Megaphone size={16} /> Creative</span><span><Settings size={16} /></span></div>
          <label>Headline<textarea rows={3} value={active.headline} onChange={(event) => updateConcept({ headline: event.target.value })} /></label>
          <label>Body copy<textarea rows={4} value={active.body} onChange={(event) => updateConcept({ body: event.target.value })} /></label>
          <label>Format<select value={active.format} onChange={(event) => updateConcept({ format: event.target.value })}><option>9:16</option><option>1:1</option><option>4:5</option><option>16:9</option></select></label>
          <label>Creative angle<select value={active.angle} onChange={(event) => updateConcept({ angle: event.target.value })}><option>Problem / solution</option><option>Lifestyle</option><option>Product benefit</option><option>Social proof</option></select></label>
          <button className={`approval-button ${active.status === 'Approved' ? 'approved' : ''}`} onClick={() => updateConcept({ status: active.status === 'Approved' ? 'Draft' : 'Approved' })}><Check size={16} />{active.status === 'Approved' ? 'Approved' : 'Mark approved'}</button>
        </aside>
      </div>
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
