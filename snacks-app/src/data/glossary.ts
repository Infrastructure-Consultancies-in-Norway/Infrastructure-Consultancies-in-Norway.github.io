export interface GlossaryTerm {
  id: string;
  slug: string;
  label: string;
  title: string;
  summary: string;
  details: string[];
  heading?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  related?: string[];
}

export const glossaryItems: GlossaryTerm[] = [
  {
    id: 'attributt',
    slug: 'attributt',
    label: 'Attributt',
    title: 'Attributt',
    heading: 'Egenskap vs Attributt',
    summary:
      'Et attributt er et forhåndsdefinert felt i IFC-skjemaet som beskriver grunnleggende kjennetegn ved en entitet.',
    details: [
      'I IFC-arbeid brukes ordene «egenskap» og «attributt» ofte side om side, men attributter er innebygde felter i selve standarden og følger alle instanser av entiteten de tilhører.',
      'Et konkret eksempel er attributtet IfcElement.Length som kan beskrive lengden på en bjelke eller et bruelement, mens en egenskap som «MMI» opprettes av modellprodusenten for å kommunisere modenhetsnivå.'
    ],
    image: {
      src: '/Egenskapssett01.png',
      alt: 'Illustrasjon av egenskaper og attributter i en modell',
      caption: 'Egenskaper og attributter kan kobles til samme IFC-entitet for å beskrive objektet mer presist.'
    },
    related: ['egenskap-property', 'egenskapssett', 'ifc-entitet']
  },
  {
    id: 'ifc-skjema',
    slug: 'ifc-skjema',
    label: 'IFC-skjema',
    title: 'IFC-skjema',
    summary:
      'Det maskinlesbare rammeverket som beskriver alle entiteter, attributter, relasjoner og strukturer i en gitt IFC-versjon.',
    details: [
      'Et IFC-skjema publiseres som EXPRESS- eller XSD-filer og forklarer hvilke felter som finnes, hvordan de er bygget opp og hvilke verdier som er gyldige.',
      'Når du velger skjema (for eksempel IFC2x3 eller IFC4.3) bestemmer du dermed hvilke data som kan leveres, hvordan de navngis og hvordan de skal tolkes av programvaren.'
    ],
    related: ['ifc', 'ifc2x3', 'ifc43']
  },
  {
    id: 'bim-tittelfelt',
    slug: 'bim-tittelfelt',
    label: 'BIM tittelfelt',
    title: 'BIM tittelfelt',
    summary:
      'Metadata-blokken i tegninger og dokumenter som forteller hvem som har laget innholdet, hvilken fase det gjelder og hvilke referanser som er brukt.',
    details: [
      'Et godt strukturert tittelfelt gir tydelig informasjon om prosjekt, revisjon, ansvarlig fag og koordinatsystem slik at mottakeren kan plassere dokumentet riktig i dokumenthåndteringssystemet.',
      'Når tittelfeltet følger en fast mal kan informasjonen hentes ut automatisk og kontrolleres mot leveransekrav uten at noen må lese PDF-filer manuelt.'
    ],
    related: ['modell', 'objektinformasjon']
  },
  {
    id: 'ifc-spatial-breakdown-system',
    slug: 'ifc-spatial-breakdown-system',
    label: 'IFC Spatial breakdown system',
    title: 'IFC Spatial breakdown system',
    summary:
      'Hierarkiet som forteller hvordan et prosjekt brytes ned i områder, bygningsdeler og objekter i en IFC-modell.',
    details: [
      'Spatial breakdown system beskriver sammenhengen fra IfcProject via IfcSite, IfcFacility og IfcFacilityPart helt ned til de enkelte IfcElement-instansene.',
      'Ved å modellere denne strukturen kan du filtrere modeller pr. etappe, beregne mengder per område og gjenbruke samme oppsett i flere prosjekter.'
    ],
    image: {
      src: '/Spatial_Breakdown_System_01.png',
      alt: 'Eksempel på spatial strukturering i IFC',
      caption: 'Spatial breakdown system gjør det mulig å navigere komplekse modeller ved hjelp av et tydelig hierarki.'
    },
    related: ['ifc', 'objekt', 'informasjonsobjekt']
  },
  {
    id: 'bsdd',
    slug: 'bsdd',
    label: 'BSDD (BuildingSMART Data Dictionary)',
    title: 'BSDD – BuildingSMART Data Dictionary',
    summary:
      'Et globalt oppslagsverk for standardiserte begreper, egenskaper og kodelister utviklet av buildingSMART.',
    details: [
      'BSDD gjør det mulig å slå opp unike identifikatorer for egenskaper og begreper slik at alle parter refererer til den samme definisjonen, uavhengig av språk.',
      'Når begrepene dine peker til BSDD-IDer kan programvare oversette, validere og berike data automatisk på tvers av prosjekter og systemer.'
    ],
    related: ['egenskap-property', 'egenskapssett', 'ids']
  },
  {
    id: 'ifc-entitet',
    slug: 'ifc-entitet',
    label: 'IFC-entitet',
    title: 'IFC-entitet',
    summary:
      'En entitet er en typebeskrivelse i IFC som definerer hvilke attributter og relasjoner et objekt eller konsept skal ha.',
    details: [
      'Eksempler på entiteter er IfcBridge, IfcElement og IfcPropertySet, og hver av dem beskriver hvilke felter som er tilgjengelige og hvordan de arver egenskaper fra overordnede entiteter.',
      'Når du velger riktig entitet for et objekt sikrer du at mottakeren umiddelbart forstår hvilken funksjon objektet har og hvilke regler som gjelder for dataene.'
    ],
    related: ['attributt', 'objekt', 'ifc']
  },
  {
    id: 'datastruktur',
    slug: 'datastruktur',
    label: 'Datastruktur',
    title: 'Datastruktur',
    summary:
      'Måten informasjon organiseres på slik at relasjoner, lister og hierarki kan leses og valideres.',
    details: [
      'I BIM-sammenheng handler datastruktur om hvordan objekter, egenskaper og dokumentreferanser henger sammen, både i modeller og i tilhørende databaser.',
      'En tydelig struktur gjør det mulig å validere leveranser, transformere data mellom systemer og sikre at alle jobber med samme sannhet.'
    ],
    related: ['informasjonsobjekt', 'objektinformasjon']
  },
  {
    id: 'informasjonsobjekt',
    slug: 'informasjonsobjekt',
    label: 'Informasjonsobjekt',
    title: 'Informasjonsobjekt',
    summary:
      'En samlet pakke med data som beskriver en unik ting, for eksempel en brupilar, en kontraktsetappe eller en sensor.',
    details: [
      'Et informasjonsobjekt kan bestå av geometri, egenskaper, dokumentreferanser og regler for hvordan innholdet skal oppdateres gjennom livsløpet.',
      'Når objektene identifiseres konsekvent kan de kobles mot andre systemer som FDV, økonomi og tidsplanlegging uten ekstra manuell tilpasning.'
    ],
    related: ['datastruktur', 'ids', 'objektinformasjon']
  },
  {
    id: 'ids',
    slug: 'ids',
    label: 'IDS (Information Delivery Specification)',
    title: 'IDS – Information Delivery Specification',
    summary:
      'En buildingSMART-standard for å beskrive hvilke objekter, egenskaper og verdier som må være til stede i en leveranse.',
    details: [
      'IDS dokumenterer kravene på en maskinlesbar måte slik at modeller kan kontrolleres automatisk før de sendes inn.',
      'Filformatet kan brukes både av modelleringsverktøy og egne QA-verktøy, og sikrer at bestillere og leverandører tolker kravene på samme måte.'
    ],
    related: ['bsdd', 'egenskapssett', 'objektinformasjon']
  },
  {
    id: 'egenskap-property',
    slug: 'egenskap-property',
    label: 'Egenskap (Engelsk: Property)',
    title: 'Egenskap / Property',
    summary:
      'Et felt som kan legges til et objekt for å beskrive alt fra materialkvalitet til ansvarlig disiplin.',
    details: [
      'Egenskaper organiseres ofte i egenskapssett og kan være knyttet til kodelister eller kravdokumenter fra byggherre.',
      'Til forskjell fra attributter kan egenskaper defineres av prosjektet selv, slik at man kan kreve spesifikke felt som «MMI» eller «Prosjekteringsansvarlig».'
    ],
    related: ['attributt', 'egenskapssett', 'bsdd']
  },
  {
    id: 'ifc',
    slug: 'ifc',
    label: 'IFC (Industry Foundation Classes)',
    title: 'IFC – Industry Foundation Classes',
    summary:
      'En åpen standard for modellutveksling fra buildingSMART som gjør det mulig å dele data på tvers av verktøy og fag.',
    details: [
      'IFC er fundamentet for openBIM og gir en felles struktur for objekter, egenskaper og relasjoner i bygge- og anleggsprosjekter.',
      'Standarden oppdateres jevnlig og støttes av de fleste programvarer i bransjen, noe som gjør den til en sentral del av mange nasjonale kravsett.'
    ],
    related: ['ifc-skjema', 'ifc2x3', 'ifc43']
  },
  {
    id: 'egenskapssett',
    slug: 'egenskapssett',
    label: 'Egenskapssett (Engelsk: Pset / PropertySet)',
    title: 'Egenskapssett / Property Set',
    summary:
      'En samling av relaterte egenskaper som hører sammen og kan gjenbrukes i flere modeller.',
    details: [
      'Eksempler er Pset_BeamCommon eller Pset_BridgePartCommon, som beskriver typiske felt for henholdsvis bjelker og bruelementer.',
      'Ved å gjenbruke standardiserte sett reduseres variasjon og leveranser kan sjekkes automatisk mot kravlister og IDS-filer.'
    ],
    related: ['egenskap-property', 'bsdd', 'ids']
  },
  {
    id: 'ifc-bridge',
    slug: 'ifc-bridge',
    label: 'IFC Bridge',
    title: 'IFC Bridge',
    summary:
      'Utvidelsen av IFC4.3 som beskriver broer og bruelementer med egne entiteter og relasjoner.',
    details: [
      'Med IFC Bridge kan du modellere dekker, bæresystemer, kabler og landkar på en måte som gir entydig tolkning på tvers av verktøy.',
      'Utvidelsen knytter også bruer til linje- og flateinfrastruktur gjennom alignments, slik at modellen speiler den virkelige konstruksjonen.'
    ],
    related: ['ifc43', 'ifc-spatial-breakdown-system']
  },
  {
    id: 'modell',
    slug: 'modell',
    label: 'Modell',
    title: 'Modell',
    summary:
      'En digital representasjon av et prosjekt med geometri, struktur og data som kan brukes i flere faser.',
    details: [
      'En modell kombinerer 3D-geometri, datastrukturer og dokumentreferanser slik at prosjektdeltakere kan forstå helheten.',
      'For å være nyttig over tid må modellen versjoneres, kvalitetssikres og kobles mot øvrige systemer som planlegging og FDV.'
    ],
    related: ['objekt', 'objektinformasjon', 'datastruktur']
  },
  {
    id: 'ifc2x3',
    slug: 'ifc2x3',
    label: 'IFC2x3',
    title: 'IFC2x3',
    summary:
      'En av de mest utbredte IFC-versjonene, publisert i 2006 og fortsatt støttet av de fleste verktøy.',
    details: [
      'IFC2x3 støtter et bredt spenn av bygningsfaglige prosesser og er grunnlaget for mange etablerte kravsett.',
      'Versjonen har imidlertid begrenset støtte for infrastruktur, noe som er forbedret i de nyere IFC4.x-utgavene.'
    ],
    related: ['ifc', 'ifc-skjema']
  },
  {
    id: 'objekt',
    slug: 'objekt',
    label: 'Objekt',
    title: 'Objekt',
    summary:
      'Et fysisk eller logisk element i modellen, som en bjelke, et rom eller en teknisk installasjon.',
    details: [
      'Objekter identifiseres gjerne med GUID og kan ha både geometri, egenskaper og tilknyttede dokumenter.',
      'Når objekter navngis og struktureres konsekvent kan de spores gjennom prosessen og kobles til kontrakter, kostnader og vedlikehold.'
    ],
    related: ['informasjonsobjekt', 'objektinformasjon', 'ifc-entitet']
  },
  {
    id: 'ifc43',
    slug: 'ifc43',
    label: 'IFC4.3',
    title: 'IFC4.3',
    summary:
      'En nyere versjon av IFC som legger til omfattende støtte for vei, jernbane, bru og annen infrastruktur.',
    details: [
      'IFC4.3 innfører nye entiteter for terreng, geoteknikk og lineære konstruksjoner, og bygger bro mellom tradisjonell BIM og anleggsfaget.',
      'Versjonen er grunnlaget for kommende openBIM-krav i flere land og for prosjekter som ønsker mer presis modellutveksling.'
    ],
    related: ['ifc', 'ifc-bridge', 'ifc-skjema']
  },
  {
    id: 'objektinformasjon',
    slug: 'objektinformasjon',
    label: 'Objektinformasjon',
    title: 'Objektinformasjon',
    summary:
      'Summen av all metadata som beskriver et objekt, inkludert ansvar, status, materialer og planlagt vedlikehold.',
    details: [
      'Objektinformasjon er det som gjør modellen nyttig utover visualisering, fordi informasjonen kan mates inn i FDV, innkjøp eller analyseverktøy.',
      'Når krav til objektinformasjon beskrives i IDS eller tilsvarende dokumentasjon blir det enkelt å kontrollere om noe mangler før leveranse.'
    ],
    related: ['ids', 'egenskap-property', 'modell']
  }
];

export const glossaryBySlug = glossaryItems.reduce<Record<string, GlossaryTerm>>((acc, term) => {
  acc[term.slug] = term;
  return acc;
}, {});
