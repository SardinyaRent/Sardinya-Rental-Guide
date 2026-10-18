import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft, ArrowRight, Camera, CarFront, Check, CircleAlert, Clock3, Compass,
  ExternalLink, Fuel, Headset, Home as HomeIcon, KeyRound, MapPin, Phone, ShieldCheck,
  TriangleAlert, Wrench, Mail, Waves,
} from 'lucide-react';
import {
  Link, Route, Switch, useLocation, useParams, Router as WouterRouter,
} from 'wouter';
import cleanExample from './assets/clean-example.jpg';
import dirtyExample from './assets/dirty-example.jpg';

const queryClient = new QueryClient();
const official = 'https://www.autonoleggiosardinya.it';
const offices = [
  { slug:'olbia-aeroporto', name:'Olbia aeroporto', address:'Via degli Astronomi, 07026 Olbia (SS)', phone:'+39 0789 69367', city:'Olbia', airport:true, pin:{left:'77%',top:'29%'} },
  { slug:'sassari', name:'Sassari', address:'Viale Caprera 8/a, 07100 Sassari (SS)', phone:'+39 079 291113', city:'Sassari', pin:{left:'43%',top:'27%'} },
  { slug:'cagliari-aeroporto', name:'Cagliari aeroporto', address:'Via dei Trasvolatori, 09067 Elmas (CA)', phone:'+39 070 240444', city:'Cagliari Elmas', airport:true, pin:{left:'49%',top:'82%'} },
  { slug:'alghero-aeroporto', name:'Alghero aeroporto', address:'Regione Nuraghe Biancu, 07041 Alghero (SS)', phone:'+39 079 935060', city:'Alghero airport', airport:true, pin:{left:'28%',top:'34%'} },
  { slug:'alghero', name:'Alghero', address:'Via Garibaldi 113, 07041 Alghero (SS)', phone:'+39 079 987403', city:'Alghero', pin:{left:'21%',top:'43%'} },
  { slug:'palau', name:'Palau', address:'Via Nazionale 95, 07020 Palau (SS)', phone:'+39 0789 709083', city:'Palau', pin:{left:'77%',top:'15%'} },
  { slug:'santa-teresa-di-gallura', name:'Santa Teresa di Gallura', address:'Via Maria Teresa 29, 07028 Santa Teresa Gallura (SS)', phone:'+39 0789 759090', city:'Santa Teresa di Gallura', pin:{left:'63%',top:'10%'} },
  { slug:'oristano', name:'Oristano', address:'Via Cagliari 440, 09170 Oristano (OR)', phone:'+39 0783 779106', city:'Oristano', pin:{left:'41%',top:'56%'} },
];
const sections = [
  { slug:'partenza', title:'Partenza', subtitle:'Ritiro e controllo del veicolo', text:'Trova il punto di ritiro e prenditi qualche minuto per documentare le condizioni dell’auto.', icon:CarFront },
  { slug:'durante-il-noleggio', title:'Durante il noleggio', subtitle:'Se qualcosa non va, passo dopo passo', text:'Indicazioni pratiche per avvisi sul cruscotto, pneumatici e imprevisti su strada.', icon:Wrench },
  { slug:'riconsegna', title:'Riconsegna', subtitle:'Un rientro semplice e senza sorprese', text:'Carburante, pulizia e indicazioni per raggiungere l’area corretta di riconsegna.', icon:KeyRound },
];
const mapsSearch = (query:string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const mapsDirections = (destination:string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
const bySlug = (slug?:string) => offices.find((office) => office.slug === slug);

function Header() {
  return <header className="topbar">
    <Link href="/" className="brand" data-testid="link-brand-home"><span className="brand-mark"><Waves size={18}/></span><span>Sardinya</span></Link>
    <span className="top-note">La guida, al tuo fianco</span>
  </header>;
}

function BottomNav() {
  const [path] = useLocation();
  const nav = [
    { href:'/', title:'Home', icon:HomeIcon, active:path==='/' || path.startsWith('/sede/') },
    { href:'/contatti', title:'Contatti', icon:Phone, active:path==='/contatti' },
    { href:'/assistenza', title:'Assistenza', icon:Headset, active:path==='/assistenza' },
  ];
  return <nav className="bottom-nav" aria-label="Navigazione principale">
    {nav.map(({href,title,icon:Icon,active})=><Link key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined} data-testid={`link-nav-${title.toLowerCase()}`}><Icon/><span>{title}</span></Link>)}
  </nav>;
}

function Shell({children}:{children:ReactNode}) {
  return <div className="app-shell"><Header/><main>{children}</main><BottomNav/></div>;
}

function OfficeMap() {
  return <div className="map-card" aria-label="Mappa schematica degli uffici Sardinya in Sardegna">
    <div className="map-top"><span>Gli uffici in Sardegna</span><span>8 punti · 1 isola</span></div>
    <div className="map-art">
      <div className="island" aria-hidden="true"/>
      <span className="sea-label" style={{left:'4%',top:'75%'}}>Mar di Sardegna</span>
      <span className="sea-label" style={{right:'5%',top:'36%'}}>Tirreno</span>
      {offices.map((office,index)=><Link key={office.slug} href={`/sede/${office.slug}`} className={`map-pin ${index===2||index===4?'pin-left':''}`} style={office.pin} aria-label={`Scegli l’ufficio ${office.name}`} data-testid={`link-map-pin-${office.slug}`}>
        <span className="pin-dot"><MapPin size={11}/></span>{office.name}
      </Link>)}
      <span className="map-help">Tocca un punto per scegliere l’ufficio</span>
    </div>
  </div>;
}

function Home() {
  return <Shell><div className="page-wrap">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="hero-tag"><Compass size={14}/> La tua guida al noleggio</span>
        <div className="eyebrow">Benvenuti in Sardegna</div>
        <h1 className="page-title">La strada è tua.<br/>Noi ci siamo.</h1>
        <p className="lead">I passaggi importanti, spiegati con chiarezza. Scegli l’ufficio del tuo noleggio per trovare le indicazioni giuste, dal ritiro alla riconsegna.</p>
      </div>
      <OfficeMap/>
    </section>
    <section aria-labelledby="locations-title">
      <div className="section-head"><div><div className="eyebrow">Dove ti aspettiamo</div><h2 id="locations-title" className="page-title" style={{fontSize:27,marginBottom:0}}>Scegli il tuo ufficio</h2></div><span className="fineprint">Seleziona una sede per continuare</span></div>
      <div className="location-list">{offices.map((office,index)=><Link key={office.slug} href={`/sede/${office.slug}`} className="location-chip" data-testid={`link-office-${office.slug}`}><span className="chip-n">0{index+1}</span><span>{office.name}</span><ArrowRight size={15} style={{marginLeft:'auto',color:'#a86238'}}/></Link>)}</div>
    </section>
    <p className="fineprint" style={{marginTop:24}}>Guida informativa per i clienti Sardinya. Per condizioni e dettagli del tuo noleggio, fai riferimento al contratto e alle istruzioni di prenotazione.</p>
  </div></Shell>;
}

function OfficeChooser() {
  const params = useParams<{slug:string}>();
  const office = bySlug(params.slug);
  if (!office) return <NotFound/>;
  return <Shell><div className="page-wrap">
    <Link href="/" className="back-link" data-testid="link-back-offices"><ArrowLeft size={16}/>Tutti gli uffici</Link>
    <div className="eyebrow">La tua sede</div><h1 className="page-title">{office.name}</h1>
    <p className="lead">Cosa ti serve in questo momento? Trovi qui le indicazioni pratiche per il tuo noleggio.</p>
    <div className="office-banner"><div><small>Ufficio selezionato</small><strong>{office.name}</strong><p style={{margin:'6px 0 0',fontSize:13,color:'#ced9d0'}}>{office.address}</p></div><a href={mapsDirections(office.address)} target="_blank" rel="noreferrer" data-testid="link-office-map"><MapPin size={16}/>Indicazioni Maps<ExternalLink size={13}/></a></div>
    <div className="guide-grid">{sections.map(({slug,title,subtitle,text,icon:Icon},i)=><Link key={slug} href={`/sede/${office.slug}/${slug}`} className="guide-card" data-testid={`link-guide-${slug}`}><span className="guide-icon"><Icon size={21}/></span><h2>{title}</h2><p>{subtitle}. {text}</p><span className="card-arrow"><span>{i===0?'Prima di partire':i===1?'In viaggio':'A fine noleggio'}</span><ArrowRight size={16}/></span></Link>)}</div>
    <p className="fineprint" style={{marginTop:18}}>Il tuo ufficio resta selezionato in tutte le indicazioni di questa guida.</p>
  </div></Shell>;
}

function OfficeHeading({office,sectionTitle}:{office:typeof offices[number];sectionTitle:string}) {
  return <><Link href={`/sede/${office.slug}`} className="back-link" data-testid="link-back-office"><ArrowLeft size={16}/>{office.name}</Link><div className="eyebrow">{office.name} · Guida</div><h1 className="page-title">{sectionTitle}</h1></>;
}

function StartGuide({office}:{office:typeof offices[number]}) {
  return <>
    <div className="content-card"><h2>Raggiungi il punto di ritiro</h2><p>Apri la sede selezionata su Google Maps e segui il percorso indicato. Per aeroporti, verifica anche le istruzioni ricevute con la prenotazione e la segnaletica presente sul posto.</p>
      <a className="contact-action" href={mapsDirections(office.address)} target="_blank" rel="noreferrer" data-testid="link-pickup-maps"><MapPin/><span><strong>Indicazioni per {office.name}</strong><span>{office.address} · Apri Google Maps</span></span><ExternalLink size={15}/></a>
    </div>
    <div className="content-card"><h2>Prima di lasciare l’ufficio</h2><p>Dedica qualche minuto al controllo: documentare le condizioni iniziali ti aiuta a segnalare subito eventuali differenze.</p><ol className="step-list">
      <li>Scatta foto ampie di tutta la carrozzeria, da ogni lato, e degli interni.</li>
      <li>Fai primi piani nitidi di ogni graffio, ammaccatura, macchia o traccia di sporco già presente.</li>
      <li>Fotografa il livello indicato dal display o dall’indicatore del carburante.</li>
      <li>Se noti una differenza rispetto alla documentazione, segnalala al personale prima di partire.</li>
      <li>Conserva le foto e ogni comunicazione fino alla chiusura del noleggio.</li>
    </ol>
    <div className="callout"><Camera size={20}/><div><strong>Un piccolo controllo, una buona prova</strong><p>Assicurati che le foto siano leggibili e con data/ora attive. Non partire finché una discrepanza non è stata condivisa con l’ufficio.</p></div></div>
    </div>
  </>;
}

function DuringGuide() {
  return <>
    <div className="callout danger-callout"><TriangleAlert size={21}/><div><strong>La sicurezza viene prima</strong><p>Se il veicolo non è sicuro da guidare, fermati in un luogo sicuro, accendi le luci di emergenza e non proseguire. Non effettuare riparazioni sul bordo strada.</p></div></div>
    <div className="content-card"><h2>Spie e problemi del veicolo</h2><div className="subsection-grid">
      <div className="subsection"><h3><CircleAlert size={16}/> Spia dell’olio</h3><p>Accosta appena puoi in sicurezza e spegni il motore. Non continuare a guidare: contatta l’assistenza stradale indicata nei documenti del noleggio e segui le istruzioni ricevute.</p></div>
      <div className="subsection"><h3><Wrench size={16}/> Luci non funzionanti</h3><p>Fermati in un luogo sicuro. Non guidare se la visibilità o la segnalazione del veicolo è compromessa; contatta l’assistenza prima di ripartire.</p></div>
      <div className="subsection"><h3><TriangleAlert size={16}/> Pressione pneumatici</h3><p>Riduci la velocità e fermati in sicurezza per controllare. Se la gomma appare sgonfia o danneggiata, non proseguire e chiama l’assistenza stradale.</p></div>
      <div className="subsection"><h3><Fuel size={16}/> Altri avvisi</h3><p>Consulta il manuale del veicolo senza distrarti dalla guida. In caso di dubbio, fermati in sicurezza e chiedi supporto.</p></div>
    </div></div>
    <div className="content-card"><h2>In caso di incidente</h2><p>Metti in sicurezza le persone e l’area. Accendi le luci di emergenza e non eseguire riparazioni sul posto.</p><div className="subsection-grid">
      <div className="subsection"><h3>Collisione con un altro veicolo</h3><p>Se ci sono feriti o pericolo immediato chiama il 112. Scambia con l’altra parte i dati di contatto, del veicolo e dell’assicurazione; raccogli foto e dettagli e compila la documentazione prevista. Avvisa l’assistenza indicata nei documenti del noleggio.</p></div>
      <div className="subsection"><h3>Urto contro un oggetto, senza altri veicoli</h3><p>Fermati e valuta se l’auto è sicura. Fotografa il contesto e i danni, annota luogo e ora e contatta l’assistenza indicata nel contratto. Se c’è rischio, danno a terzi o necessità di intervento, chiama le autorità competenti.</p></div>
    </div>
    <div className="callout"><ShieldCheck size={20}/><div><strong>Raccogli le informazioni, senza rischiare</strong><p>Fotografa i veicoli e la scena solo da una posizione sicura. Non ammettere responsabilità sul posto; segui le indicazioni dell’assistenza e delle autorità.</p></div></div></div>
    <div className="content-card"><h2>Serve aiuto?</h2><p>Per l’assistenza stradale usa il contatto riportato nel contratto o nei documenti di consegna: non tutte le situazioni hanno lo stesso recapito.</p><Link className="contact-action" href="/assistenza" data-testid="link-assistance-help"><Headset/><span><strong>Apri la pagina assistenza</strong><span>Trova i riferimenti ufficiali e le istruzioni utili</span></span><ArrowRight size={15}/></Link></div>
  </>;
}

function ReturnGuide({office}:{office:typeof offices[number]}) {
  const airportSearch = office.airport ? `${office.city} aeroporto area riconsegna autonoleggi` : '';
  return <>
    <div className="content-card"><h2>Carburante: riconsegna allo stesso livello</h2><p>Prima del rientro, confronta il livello di carburante con quello documentato alla partenza e pianifica il rifornimento necessario. Fai una foto dell’indicatore prima di consegnare l’auto.</p><a className="contact-action" href={mapsSearch(`stazione di servizio vicino a ${office.address}`)} target="_blank" rel="noreferrer" data-testid="link-nearby-fuel"><Fuel/><span><strong>Cerca un distributore vicino</strong><span>Google Maps · {office.name}</span></span><ExternalLink size={15}/></a></div>
    <div className="content-card"><h2>Riconsegna gli interni in ordine</h2><p>Rimuovi rifiuti e oggetti personali e lascia l’abitacolo in condizioni ragionevoli. Queste immagini sono esempi generici a scopo illustrativo, non veicoli Sardinya.</p>
      <div className="cleaning-examples">
        <div className="clean-example"><img src={cleanExample} alt="Esempio illustrativo di interni ordinati e pronti alla riconsegna"/><div className="clean-caption"><strong><Check size={16} color="#477961"/> Esempio: in ordine</strong><p>Abitacolo senza rifiuti e superfici ragionevolmente pulite.</p></div></div>
        <div className="clean-example"><img src={dirtyExample} alt="Esempio illustrativo di sabbia e residui sugli interni da pulire"/><div className="clean-caption"><strong><CircleAlert size={16} color="#a65d36"/> Esempio: da pulire</strong><p>Sabbia, residui o sporco evidente: valuta una pulizia prima del rientro.</p></div></div>
      </div>
      <a className="contact-action" href={mapsSearch(`autolavaggio self service vicino a ${office.address}`)} target="_blank" rel="noreferrer" data-testid="link-nearby-carwash"><Waves/><span><strong>Cerca un autolavaggio self-service</strong><span>Google Maps · {office.name}</span></span><ExternalLink size={15}/></a>
      <p className="fineprint">Eventuali addebiti aggiuntivi possono applicarsi secondo quanto previsto dal contratto di noleggio. Per i dettagli, fai riferimento alle condizioni della tua prenotazione.</p>
    </div>
    {airportSearch && <div className="content-card"><h2>Rientro in aeroporto</h2><p>Apri la ricerca Google Maps per l’area autonoleggi e verifica quale parcheggio è indicato nella tua prenotazione. P1 e P2 sono ricerche distinte: usa solo quella prevista per la tua riconsegna e segui la segnaletica aeroportuale.</p>
      <a className="contact-action" href={mapsSearch(airportSearch)} target="_blank" rel="noreferrer" data-testid="link-airport-return"><MapPin/><span><strong>Area riconsegna autonoleggi</strong><span>{office.name} · Google Maps</span></span><ExternalLink size={15}/></a>
      <a className="contact-action" href={mapsSearch(`${office.city} aeroporto parcheggio P1 autonoleggi`)} target="_blank" rel="noreferrer" data-testid="link-airport-parking-p1"><MapPin/><span><strong>Parcheggio P1</strong><span>Apri la ricerca in Google Maps</span></span><ExternalLink size={15}/></a>
      <a className="contact-action" href={mapsSearch(`${office.city} aeroporto parcheggio P2 autonoleggi`)} target="_blank" rel="noreferrer" data-testid="link-airport-parking-p2"><MapPin/><span><strong>Parcheggio P2</strong><span>Apri la ricerca in Google Maps</span></span><ExternalLink size={15}/></a>
    </div>}
    <div className="callout"><KeyRound size={19}/><div><strong>Prima di lasciare l’auto</strong><p>Rimuovi tutti i bagagli e gli effetti personali. Porta le chiavi al desk e conserva la documentazione di riconsegna.</p></div></div>
  </>;
}

function GuidePage({section}:{section:string}) {
  const params=useParams<{slug:string}>();
  const office=bySlug(params.slug);
  const detail=sections.find(item=>item.slug===section);
  if(!office||!detail) return <NotFound/>;
  return <Shell><div className="page-wrap guide-content">
    <OfficeHeading office={office} sectionTitle={detail.title}/>
    <p className="lead">{detail.text}</p>
    {section==='partenza'&&<StartGuide office={office}/>}
    {section==='durante-il-noleggio'&&<DuringGuide/>}
    {section==='riconsegna'&&<ReturnGuide office={office}/>}
    <Link href={`/sede/${office.slug}`} className="back-link" style={{marginTop:18}} data-testid="link-back-guide"><ArrowLeft size={16}/>Torna alle indicazioni di {office.name}</Link>
  </div></Shell>;
}

function Contacts() {
  return <Shell><div className="page-wrap">
    <div className="eyebrow">Siamo qui per te</div><h1 className="page-title">Contatti</h1><p className="lead">Per prenotazioni e informazioni generali, parla direttamente con il team Sardinya. Per assistenza sul veicolo, consulta anche i contatti riportati nei documenti del noleggio.</p>
    <div className="contact-grid"><div className="content-card"><h2>Contatti generali</h2>
      <a className="contact-action" href="tel:+39079291113" data-testid="link-call-general"><Phone/><span><strong>+39 079 291113</strong><span>Chiamate per informazioni e prenotazioni</span></span></a>
      <a className="contact-action" href="mailto:info@autonoleggiosardinya.it" data-testid="link-email-general"><Mail/><span><strong>info@autonoleggiosardinya.it</strong><span>Scrivi al team Sardinya</span></span></a>
      <a className="contact-action" href={`${official}/uffici/`} target="_blank" rel="noreferrer" data-testid="link-official-offices"><MapPin/><span><strong>Indirizzi e recapiti degli uffici</strong><span>Sito ufficiale Sardinya</span></span><ExternalLink size={15}/></a>
      <a className="contact-action" href={`${official}/faq/`} target="_blank" rel="noreferrer" data-testid="link-official-faq"><ShieldCheck/><span><strong>Domande frequenti</strong><span>FAQ aggiornate sul sito ufficiale</span></span><ExternalLink size={15}/></a>
      <a className="contact-action" href={`${official}/condizioni/`} target="_blank" rel="noreferrer" data-testid="link-official-policies"><ShieldCheck/><span><strong>Condizioni di noleggio</strong><span>Leggi le condizioni ufficiali Sardinya</span></span><ExternalLink size={15}/></a>
    </div><aside className="official-card"><div className="eyebrow" style={{color:'#f4bd8e'}}>Informazioni ufficiali</div><h2 style={{fontFamily:'var(--app-font-serif)',fontSize:23,margin:'10px 0'}}>Tutto in chiaro.</h2><p>Consulta le FAQ e le condizioni ufficiali per trovare risposte aggiornate su documenti, pagamenti, coperture e regole del noleggio.</p><a href={`${official}/contatti`} target="_blank" rel="noreferrer" data-testid="link-official-contact">Visita il sito ufficiale <ExternalLink size={13}/></a></aside></div>
     <div className="content-card"><h2>Uffici in Sardegna</h2><div className="contact-office-list">{offices.map(o=><div key={o.slug} className="contact-office" data-testid={`contact-office-${o.slug}`}>
       <div><strong>{o.name}</strong><span className="contact-office-address">{o.address}</span><span className="contact-office-phone">{o.phone}</span></div>
       <div className="contact-office-actions"><a href={`tel:${o.phone.replace(/\s/g,'')}`} data-testid={`link-call-office-${o.slug}`}><Phone size={14}/>Chiama</a><a href={mapsDirections(o.address)} target="_blank" rel="noreferrer" data-testid={`link-contact-location-${o.slug}`}><MapPin size={14}/>Maps</a></div>
     </div>)}</div></div>
  </div></Shell>;
}

function Assistance() {
  return <Shell><div className="page-wrap">
    <div className="eyebrow">Supporto durante il viaggio</div><h1 className="page-title">Assistenza</h1><p className="lead">Se hai un imprevisto, mettiti al sicuro prima di tutto. I recapiti validi per il tuo veicolo sono quelli indicati nel contratto e nei documenti di consegna.</p>
    <div className="contact-grid">
      <div className="content-card"><h2>Un problema su strada?</h2><ol className="step-list"><li>Accosta in un luogo sicuro e attiva le luci di emergenza.</li><li>Se c’è un pericolo immediato o una persona è ferita, chiama il 112.</li><li>Per assistenza al veicolo, usa il numero indicato nei documenti del noleggio.</li><li>Descrivi la situazione e la posizione; invia foto solo se puoi farlo in sicurezza.</li></ol><div className="callout danger-callout"><TriangleAlert size={20}/><div><strong>Non improvvisare riparazioni</strong><p>Non intervenire sul veicolo o sul bordo strada. Attendi le istruzioni dell’assistenza.</p></div></div></div>
      <div><div className="official-card"><Headset size={23} color="#f4bd8e"/><h2 style={{fontFamily:'var(--app-font-serif)',fontSize:22}}>Il riferimento corretto</h2><p>Il numero di assistenza stradale dipende dalla documentazione del tuo noleggio. Controlla voucher, contratto o documenti ricevuti al ritiro.</p><a href={`${official}/contatti`} target="_blank" rel="noreferrer" data-testid="link-assistance-official">Apri contatti e FAQ ufficiali <ExternalLink size={13}/></a></div>
        <a className="contact-action" href="tel:112" data-testid="link-call-emergency"><Phone/><span><strong>Emergenza immediata: 112</strong><span>Solo in caso di pericolo o necessità urgente</span></span></a>
        <a className="contact-action" href={`${official}/faq/`} target="_blank" rel="noreferrer" data-testid="link-assistance-faq"><ShieldCheck/><span><strong>Domande frequenti</strong><span>Indicazioni aggiornate Sardinya</span></span><ExternalLink size={15}/></a>
        <a className="contact-action" href={`${official}/condizioni/`} target="_blank" rel="noreferrer" data-testid="link-assistance-policies"><ShieldCheck/><span><strong>Condizioni di noleggio</strong><span>Consulta le regole ufficiali della prenotazione</span></span><ExternalLink size={15}/></a>
        <Link href="/contatti" className="contact-action" data-testid="link-assistance-contacts"><Clock3/><span><strong>Contatti generali Sardinya</strong><span>Informazioni e recapiti degli uffici</span></span><ArrowRight size={15}/></Link>
      </div>
    </div>
  </div></Shell>;
}

function NotFound() {
  return <Shell><div className="page-wrap error-page"><div className="eyebrow">404 · Pagina non trovata</div><h1 className="page-title">Facciamo un passo indietro.</h1><p className="lead" style={{margin:'auto'}}>Questa indicazione non è disponibile. Torna agli uffici e scegli la tua sede.</p><Link href="/" data-testid="link-not-found-home"><ArrowLeft size={16}/>Torna alla guida</Link></div></Shell>;
}

function RoutedErrorBoundary({children}:{children:ReactNode}) {
  const [location]=useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home}/>
    <Route path="/sede/:slug" component={OfficeChooser}/>
    <Route path="/sede/:slug/partenza">{()=> <GuidePage section="partenza"/>}</Route>
    <Route path="/sede/:slug/durante-il-noleggio">{()=> <GuidePage section="durante-il-noleggio"/>}</Route>
    <Route path="/sede/:slug/riconsegna">{()=> <GuidePage section="riconsegna"/>}</Route>
    <Route path="/contatti" component={Contacts}/>
    <Route path="/assistenza" component={Assistance}/>
    <Route component={NotFound}/>
  </Switch></RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default App;
