import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, ArrowRight, Camera, CarFront, Check, CircleAlert, ExternalLink,
  Fuel, Headset, Home as HomeIcon, KeyRound, Mail, MapPin, Phone, ShieldCheck,
  TriangleAlert, Waves, Wrench,
} from 'lucide-react';
import {
  Link, Route, Switch, useLocation, useParams, Router as WouterRouter,
} from 'wouter';
import cleanExample from './assets/clean-example.jpg';
import dirtyExample from './assets/dirty-example.jpg';
import {
  languageOptions, officeNames, translations,
  type Language, type OfficeSlug,
} from './i18n';

const queryClient = new QueryClient();
const languages = languageOptions.map((option) => option.code);

type Office = {
  slug: OfficeSlug;
  address: string;
  phone: string;
  mapQuery: string;
  airport?: boolean;
  pin: { left: string; top: string };
  pinLeft?: boolean;
};

const offices: Office[] = [
  { slug: 'sassari', address: 'Viale Caprera 8/a, 07100 Sassari (SS)', phone: '+39 079 291113', mapQuery: 'Sassari', pin: { left: '43%', top: '27%' } },
  { slug: 'olbia-aeroporto', address: 'Via degli Astronomi, 07026 Olbia (SS)', phone: '+39 0789 69367', mapQuery: 'Olbia aeroporto', airport: true, pin: { left: '77%', top: '29%' } },
  { slug: 'cagliari-aeroporto', address: 'Via dei Trasvolatori, 09067 Elmas (CA)', phone: '+39 070 240444', mapQuery: 'Cagliari aeroporto Elmas', airport: true, pin: { left: '49%', top: '82%' }, pinLeft: true },
  { slug: 'alghero-aeroporto', address: 'Regione Nuraghe Biancu, 07041 Alghero (SS)', phone: '+39 079 935060', mapQuery: 'Alghero aeroporto Fertilia', airport: true, pin: { left: '28%', top: '34%' } },
  { slug: 'alghero', address: 'Via Garibaldi 113, 07041 Alghero (SS)', phone: '+39 079 987403', mapQuery: 'Alghero centro', pin: { left: '21%', top: '43%' }, pinLeft: true },
  { slug: 'palau', address: 'Via Nazionale 95, 07020 Palau (SS)', phone: '+39 0789 709083', mapQuery: 'Palau', pin: { left: '77%', top: '15%' } },
  { slug: 'santa-teresa-di-gallura', address: 'Via Maria Teresa 29, 07028 Santa Teresa Gallura (SS)', phone: '+39 0789 759090', mapQuery: 'Santa Teresa di Gallura', pin: { left: '63%', top: '10%' } },
  { slug: 'oristano', address: 'Via Cagliari 440, 09170 Oristano (OR)', phone: '+39 0783 779106', mapQuery: 'Oristano', pin: { left: '41%', top: '56%' } },
];

type GuideKey = 'departure' | 'during' | 'return';
const guideSections: { key: GuideKey; slug: string; icon: typeof CarFront }[] = [
  { key: 'departure', slug: 'partenza', icon: CarFront },
  { key: 'during', slug: 'durante-il-noleggio', icon: Wrench },
  { key: 'return', slug: 'riconsegna', icon: KeyRound },
];

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const mapsDirections = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
const bySlug = (slug?: string) => offices.find((office) => office.slug === slug);
const format = (text: string, values: Record<string, string>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, value), text);
const officeName = (office: Office, language: Language) =>
  officeNames[language][office.slug];
const isLanguage = (value: string | null): value is Language =>
  value !== null && languages.includes(value as Language);

type LocaleContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};
const LocaleContext = createContext<LocaleContextValue | null>(null);

function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('Language context is not available.');
  return value;
}

function useCopy() {
  return translations[useLocale().language];
}

function Header() {
  const { language, setLanguage } = useLocale();
  const copy = useCopy();
  return <header className="topbar">
    <Link href="/" className="brand" data-testid="link-brand-home">
      <span className="brand-mark"><Waves size={18} /></span>
      <span>Sardinya</span>
    </Link>
    <label className="language-picker">
      <span>{copy.languageLabel}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        aria-label={copy.languageLabel}
        data-testid="select-language"
      >
        {languageOptions.map((option) =>
          <option key={option.code} value={option.code}>{option.label}</option>,
        )}
      </select>
    </label>
  </header>;
}

function BottomNav() {
  const [path] = useLocation();
  const copy = useCopy();
  const nav = [
    { href: '/', title: copy.nav.home, icon: HomeIcon, active: path === '/' || path.startsWith('/sede/') },
    { href: '/contatti', title: copy.nav.contacts, icon: Phone, active: path === '/contatti' },
    { href: '/assistenza', title: copy.nav.assistance, icon: Headset, active: path === '/assistenza' },
  ];
  return <nav className="bottom-nav" aria-label={copy.nav.label}>
    {nav.map(({ href, title, icon: Icon, active }) =>
      <Link
        key={href}
        href={href}
        className={active ? 'active' : ''}
        aria-current={active ? 'page' : undefined}
        data-testid={`link-nav-${href === '/' ? 'home' : href.slice(1)}`}
      >
        <Icon /><span>{title}</span>
      </Link>,
    )}
  </nav>;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Header /><main>{children}</main><BottomNav /></div>;
}

function HeadOfficeBadge() {
  const copy = useCopy();
  return <small className="office-role">{copy.office.headOffice}</small>;
}

function Home() {
  const copy = useCopy();
  const { language } = useLocale();
  return <Shell><div className="page-wrap home-page">
    <p className="guide-only-note" data-testid="text-guide-only">{copy.home.guideOnly}</p>
    <section aria-labelledby="locations-title">
      <div className="section-head">
        <h1 id="locations-title" className="page-title section-title">{copy.home.listTitle}</h1>
      </div>
      <div className="location-list">
        {offices.map((office, index) =>
          <Link
            key={office.slug}
            href={`/sede/${office.slug}`}
            className="location-chip"
            data-testid={`link-office-${office.slug}`}
          >
            <span className="chip-n">{String(index + 1).padStart(2, '0')}</span>
            <span className="location-copy">
              <strong>{officeName(office, language)}</strong>
              {office.slug === 'sassari' && <HeadOfficeBadge />}
            </span>
            <ArrowRight size={15} className="location-arrow" />
          </Link>,
        )}
      </div>
    </section>
  </div></Shell>;
}

function OfficeChooser() {
  const params = useParams<{ slug: string }>();
  const office = bySlug(params.slug);
  const copy = useCopy();
  const { language } = useLocale();
  if (!office) return <NotFound />;
  return <Shell><div className="page-wrap">
    <Link href="/" className="back-link" data-testid="link-back-offices">
      <ArrowLeft size={16} />{copy.general.allOffices}
    </Link>
    <div className="eyebrow">{copy.office.kicker}</div>
    <h1 className="page-title">{officeName(office, language)}</h1>
    <p className="lead">{copy.office.intro}</p>
    <div className="office-banner">
      <div>
        <small>{copy.office.selected}</small>
        <strong>{officeName(office, language)}</strong>
        {office.slug === 'sassari' && <span className="banner-role">{copy.office.headOffice}</span>}
        <p>{office.address}</p>
      </div>
      <a href={mapsDirections(office.address)} target="_blank" rel="noreferrer" data-testid="link-office-map">
        <MapPin size={16} />{copy.office.map}<ExternalLink size={13} />
      </a>
    </div>
    <h2 className="section-prompt">{copy.office.prompt}</h2>
    <div className="guide-grid">
      {guideSections.map(({ key, slug, icon: Icon }) =>
        <Link
          key={slug}
          href={`/sede/${office.slug}/${slug}`}
          className="guide-card"
          data-testid={`link-guide-${slug}`}
        >
          <span className="guide-icon"><Icon size={21} /></span>
          <h2>{copy.sections[key].title}</h2>
          <p>{copy.sections[key].summary}</p>
          <span className="card-arrow"><span>{copy.sections[key].hint}</span><ArrowRight size={16} /></span>
        </Link>,
      )}
    </div>
    <p className="office-footer-note">{copy.office.footer}</p>
  </div></Shell>;
}

function OfficeHeading({ office, title }: { office: Office; title: string }) {
  const copy = useCopy();
  const { language } = useLocale();
  return <>
    <Link href={`/sede/${office.slug}`} className="back-link" data-testid="link-back-office">
      <ArrowLeft size={16} />{officeName(office, language)}
    </Link>
    <div className="eyebrow">{officeName(office, language)}</div>
    <h1 className="page-title">{title}</h1>
  </>;
}

function StartGuide({ office }: { office: Office }) {
  const copy = useCopy();
  const { language } = useLocale();
  return <>
    <div className="content-card">
      <h2>{copy.start.title}</h2>
      <p>{copy.start.intro}</p>
      <a className="contact-action" href={mapsDirections(office.address)} target="_blank" rel="noreferrer" data-testid="link-pickup-maps">
        <MapPin />
        <span>
          <strong>{format(copy.start.locationLink, { office: officeName(office, language) })}</strong>
          <span>{office.address} · {copy.general.openMaps}</span>
        </span>
        <ExternalLink size={15} />
      </a>
    </div>
    <div className="content-card">
      <h2>{copy.start.checklistTitle}</h2>
      <p>{copy.start.checklistIntro}</p>
      <ol className="step-list">
        {copy.start.steps.map((step, index) => <li key={step} data-testid={`text-pickup-step-${index + 1}`}>{step}</li>)}
      </ol>
      <div className="callout">
        <Camera size={20} />
        <div><strong>{copy.start.noteTitle}</strong><p>{copy.start.noteText}</p></div>
      </div>
    </div>
  </>;
}

function DuringGuide() {
  const copy = useCopy();
  const warningIcons = [CircleAlert, Wrench, TriangleAlert, Fuel];
  return <>
    <div className="callout danger-callout">
      <TriangleAlert size={21} />
      <div><strong>{copy.during.safetyTitle}</strong><p>{copy.during.safetyText}</p></div>
    </div>
    <div className="content-card">
      <h2>{copy.during.warningTitle}</h2>
      <div className="subsection-grid">
        {copy.during.warnings.map((warning, index) => {
          const Icon = warningIcons[index];
          return <div className="subsection" key={warning.title}>
            <h3><Icon size={16} />{warning.title}</h3><p>{warning.text}</p>
          </div>;
        })}
      </div>
    </div>
    <div className="content-card">
      <h2>{copy.during.accidentTitle}</h2>
      <p>{copy.during.accidentIntro}</p>
      <div className="subsection-grid">
        {copy.during.accidents.map((accident) =>
          <div className="subsection" key={accident.title}>
            <h3>{accident.title}</h3><p>{accident.text}</p>
          </div>,
        )}
      </div>
      <div className="callout">
        <ShieldCheck size={20} />
        <div><strong>{copy.during.evidenceTitle}</strong><p>{copy.during.evidenceText}</p></div>
      </div>
    </div>
    <div className="content-card">
      <h2>{copy.during.helpTitle}</h2>
      <p>{copy.during.helpText}</p>
      <Link className="contact-action" href="/assistenza" data-testid="link-assistance-help">
        <Headset />
        <span><strong>{copy.assistance.title}</strong><span>{copy.during.helpLink}</span></span>
        <ArrowRight size={15} />
      </Link>
    </div>
  </>;
}

function ReturnGuide({ office }: { office: Office }) {
  const copy = useCopy();
  const { language } = useLocale();
  const name = officeName(office, language);
  const airportSearch = `${office.mapQuery} area autonoleggi riconsegna`;
  return <>
    <div className="content-card">
      <h2>{copy.returns.fuelTitle}</h2>
      <p>{copy.returns.fuelText}</p>
      <a className="contact-action" href={mapsSearch(`distributore carburante vicino a ${office.address}`)} target="_blank" rel="noreferrer" data-testid="link-nearby-fuel">
        <Fuel />
        <span><strong>{copy.returns.fuelLink}</strong><span>{copy.general.mapsLabel} · {name}</span></span>
        <ExternalLink size={15} />
      </a>
    </div>
    <div className="content-card">
      <h2>{copy.returns.cleanTitle}</h2>
      <p>{copy.returns.cleanIntro}</p>
      <div className="cleaning-examples">
        <div className="clean-example">
          <img src={cleanExample} alt={copy.returns.cleanGoodText} />
          <div className="clean-caption"><strong><Check size={16} color="#477961" />{copy.returns.cleanGood}</strong><p>{copy.returns.cleanGoodText}</p></div>
        </div>
        <div className="clean-example">
          <img src={dirtyExample} alt={copy.returns.cleanBadText} />
          <div className="clean-caption"><strong><CircleAlert size={16} color="#a65d36" />{copy.returns.cleanBad}</strong><p>{copy.returns.cleanBadText}</p></div>
        </div>
      </div>
      <a className="contact-action" href={mapsSearch(`autolavaggio self service vicino a ${office.address}`)} target="_blank" rel="noreferrer" data-testid="link-nearby-carwash">
        <Waves />
        <span><strong>{copy.returns.washLink}</strong><span>{copy.general.mapsLabel} · {name}</span></span>
        <ExternalLink size={15} />
      </a>
      <p className="fineprint">{copy.returns.charges}</p>
    </div>
    {office.airport && <div className="content-card">
      <h2>{copy.returns.airportTitle}</h2>
      <p>{copy.returns.airportText}</p>
      {[
        { label: copy.returns.airportArea, query: airportSearch, id: 'area' },
        { label: copy.returns.p1, query: `${office.mapQuery} parcheggio P1 autonoleggi`, id: 'p1' },
        { label: copy.returns.p2, query: `${office.mapQuery} parcheggio P2 autonoleggi`, id: 'p2' },
      ].map((destination) =>
        <a
          key={destination.id}
          className="contact-action"
          href={mapsSearch(destination.query)}
          target="_blank"
          rel="noreferrer"
          data-testid={`link-airport-${destination.id}`}
        >
          <MapPin />
          <span><strong>{destination.label}</strong><span>{name} · {copy.general.openMaps}</span></span>
          <ExternalLink size={15} />
        </a>,
      )}
    </div>}
    <div className="callout">
      <KeyRound size={19} />
      <div><strong>{copy.returns.lastTitle}</strong><p>{copy.returns.lastText}</p></div>
    </div>
  </>;
}

function GuidePage({ section }: { section: GuideKey }) {
  const params = useParams<{ slug: string }>();
  const office = bySlug(params.slug);
  const copy = useCopy();
  const { language } = useLocale();
  if (!office) return <NotFound />;
  return <Shell><div className="page-wrap guide-content">
    <OfficeHeading office={office} title={copy.sections[section].title} />
    {section === 'departure' && <StartGuide office={office} />}
    {section === 'during' && <DuringGuide />}
    {section === 'return' && <ReturnGuide office={office} />}
    <Link href={`/sede/${office.slug}`} className="back-link guide-back" data-testid="link-back-guide">
      <ArrowLeft size={16} />{copy.office.allOffices}: {officeName(office, language)}
    </Link>
  </div></Shell>;
}

function Contacts() {
  const copy = useCopy();
  const { language } = useLocale();
  const contactEmail = copy.contacts.emailAddress;
  return <Shell><div className="page-wrap">
    <div className="eyebrow">{copy.contacts.kicker}</div>
    <h1 className="page-title">{copy.contacts.title}</h1>
    <p className="lead">{copy.contacts.intro}</p>
    <div className="contact-email-highlight" data-testid="contact-head-office-email">
      <Mail size={22} />
      <div>
        <strong>{copy.contacts.emailPurpose}</strong>
        <p>{copy.contacts.emailNote}</p>
        <a href={`mailto:${contactEmail}`} data-testid="link-email-central">{contactEmail}</a>
      </div>
    </div>
    <div className="content-card contact-general">
      <h2>{copy.contacts.centralPhone}</h2>
      <a className="contact-action" href="tel:+39079291113" data-testid="link-call-general">
        <Phone />
        <span><strong>+39 079 291113</strong><span>{copy.contacts.centralPhoneNote}</span></span>
      </a>
    </div>
    <div className="content-card">
      <h2>{copy.contacts.officesTitle}</h2>
      <div className="contact-office-list">
        {offices.map((office) =>
          <div key={office.slug} className="contact-office" data-testid={`contact-office-${office.slug}`}>
            <div>
              <strong>{officeName(office, language)}</strong>
              {office.slug === 'sassari' && <HeadOfficeBadge />}
              <span className="contact-office-address">{office.address}</span>
              <span className="contact-office-phone">{office.phone}</span>
            </div>
            <div className="contact-office-actions">
              <a href={`tel:${office.phone.replace(/\s/g, '')}`} data-testid={`link-call-office-${office.slug}`}><Phone size={14} />{copy.contacts.call}</a>
              <a href={mapsDirections(office.address)} target="_blank" rel="noreferrer" data-testid={`link-contact-location-${office.slug}`}><MapPin size={14} />{copy.contacts.maps}</a>
            </div>
          </div>,
        )}
      </div>
    </div>
  </div></Shell>;
}

function Assistance() {
  const copy = useCopy();
  return <Shell><div className="page-wrap">
    <div className="eyebrow">{copy.assistance.kicker}</div>
    <h1 className="page-title">{copy.assistance.title}</h1>
    <p className="lead">{copy.assistance.intro}</p>
    <div className="content-card">
      <h2>{copy.assistance.stepsTitle}</h2>
      <ol className="step-list">
        {copy.assistance.steps.map((step, index) => <li key={step} data-testid={`text-assistance-step-${index + 1}`}>{step}</li>)}
      </ol>
      <div className="callout danger-callout">
        <TriangleAlert size={20} />
        <div><strong>{copy.assistance.repairTitle}</strong><p>{copy.assistance.repairText}</p></div>
      </div>
    </div>
    <div className="content-card">
      <h2>{copy.assistance.contactTitle}</h2>
      <p>{copy.assistance.contactText}</p>
      <a className="contact-action emergency-action" href="tel:112" data-testid="link-call-emergency">
        <Phone />
        <span><strong>{copy.assistance.emergency}</strong><span>{copy.assistance.emergencyNote}</span></span>
      </a>
      <Link className="contact-action" href="/contatti" data-testid="link-assistance-contacts">
        <Headset />
        <span><strong>{copy.assistance.office}</strong><span>{copy.assistance.officeNote}</span></span>
        <ArrowRight size={15} />
      </Link>
    </div>
  </div></Shell>;
}

function NotFound() {
  const copy = useCopy();
  return <Shell><div className="page-wrap error-page">
    <div className="eyebrow">404 · {copy.notFound.kicker}</div>
    <h1 className="page-title">{copy.notFound.title}</h1>
    <p className="lead">{copy.notFound.text}</p>
    <Link href="/" data-testid="link-not-found-home"><ArrowLeft size={16} />{copy.notFound.home}</Link>
  </div></Shell>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/sede/:slug" component={OfficeChooser} />
    <Route path="/sede/:slug/partenza">{() => <GuidePage section="departure" />}</Route>
    <Route path="/sede/:slug/durante-il-noleggio">{() => <GuidePage section="during" />}</Route>
    <Route path="/sede/:slug/riconsegna">{() => <GuidePage section="return" />}</Route>
    <Route path="/contatti" component={Contacts} />
    <Route path="/assistenza" component={Assistance} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary>;
}

function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('sardinya-language');
      return isLanguage(saved) ? saved : 'it';
    } catch {
      return 'it';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `Sardinya · ${translations[language].home.title}`;
    try {
      window.localStorage.setItem('sardinya-language', language);
    } catch {
      // The selected language still works for this session if storage is unavailable.
    }
  }, [language]);

  return <LocaleContext.Provider value={{ language, setLanguage }}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </LocaleContext.Provider>;
}

export default App;
