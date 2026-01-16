export interface GlossaryTerm {
  id: string;
  slug: string;
  label: {
    no: string;
    en: string;
  };
  title: {
    no: string;
    en: string;
  };
  summary: {
    no: string;
    en: string;
  };
  details: {
    no: string[];
    en: string[];
  };
  heading?: {
    no: string;
    en: string;
  };
  image?: {
    src: string;
    alt: {
      no: string;
      en: string;
    };
    caption?: {
      no: string;
      en: string;
    };
  };
  related?: string[];
}

// Helper function to get image path based on language (import from context when needed)
const getGlossaryImageSrc = (src: string) => src;

export const glossaryItems: GlossaryTerm[] = [
  {
    id: 'attributt',
    slug: 'attributt',
    label: {
      no: 'Attributt',
      en: 'Attribute'
    },
    title: {
      no: 'Attributt',
      en: 'Attribute'
    },
    heading: {
      no: 'Egenskap vs Attributt',
      en: 'Property vs Attribute'
    },
    summary: {
      no: 'En attributt er et forhåndsdefinert felt i IFC-skjemaet som beskriver grunnleggende kjennetegn ved en entitet.',
      en: 'An attribute is a predefined field in the IFC schema that describes fundamental characteristics of an entity.'
    },
    details: {
      no: [
        'I IFC-arbeid brukes ordene «egenskap» og «attributt» ofte side om side, men attributter er innebygde felter i selve standarden og følger alle instanser av entiteten de tilhører.',
        'Et konkret eksempel er attributtet IfcElement.Length som kan beskrive lengden på en bjelke eller et bruelement, mens en egenskap som «MMI» opprettes av modellprodusenten for å kommunisere modenhetsnivå.'
      ],
      en: [
        'In IFC work, the terms "property" and "attribute" are often used interchangeably, but attributes are built-in fields in the standard itself and apply to all instances of the entity they belong to.',
        'A concrete example is the attribute IfcElement.Length which can describe the length of a beam or bridge element, while a property like "MMI" is created by the model producer to communicate maturity level.'
      ]
    },
    image: {
      src: 'Egenskapssett01.png',
      alt: {
        no: 'Illustrasjon av egenskaper og attributter i en modell',
        en: 'Illustration of properties and attributes in a model'
      },
      caption: {
        no: 'Egenskaper og attributter kan kobles til samme IFC-entitet for å beskrive elementet mer presist.',
        en: 'Properties and attributes can be linked to the same IFC entity to describe the element more precisely.'
      }
    },
    related: ['egenskap-property', 'egenskapssett', 'ifc-entitet']
  },
  {
    id: 'ifc-skjema',
    slug: 'ifc-skjema',
    label: {
      no: 'IFC-skjema',
      en: 'IFC Schema'
    },
    title: {
      no: 'IFC-skjema',
      en: 'IFC Schema'
    },
    summary: {
      no: 'Det maskinlesbare rammeverket som beskriver alle entiteter, attributter, relasjoner og strukturer i en gitt IFC-versjon.',
      en: 'The machine-readable framework that describes all entities, attributes, relationships and structures in a given IFC version.'
    },
    details: {
      no: [
        'Et IFC-skjema publiseres som EXPRESS- eller XSD-filer og forklarer hvilke felter som finnes, hvordan de er bygget opp og hvilke verdier som er gyldige.',
        'Når du velger skjema (for eksempel IFC2x3 eller IFC4.3) bestemmer du dermed hvilke data som kan leveres, hvordan de navngis og hvordan de skal tolkes av programvaren.'
      ],
      en: [
        'An IFC schema is published as EXPRESS or XSD files and explains which fields exist, how they are structured and which values are valid.',
        'When you select a schema (for example IFC2x3 or IFC4.3), you determine which data can be delivered, how it is named and how it should be interpreted by the software.'
      ]
    },
    related: ['ifc', 'ifc2x3', 'ifc43']
  },
  {
    id: 'bim-tittelfelt',
    slug: 'bim-tittelfelt',
    label: {
      no: 'BIM tittelfelt',
      en: 'BIM Title Block'
    },
    title: {
      no: 'BIM tittelfelt',
      en: 'BIM Title Block'
    },
    summary: {
      no: 'Metadata-blokken i tegninger og dokumenter som forteller hvem som har laget innholdet, hvilken fase det gjelder og hvilke referanser som er brukt.',
      en: 'The metadata block in drawings and documents that indicates who created the content, which phase it applies to and which references were used.'
    },
    details: {
      no: [
        'Et godt strukturert tittelfelt gir tydelig informasjon om prosjekt, revisjon, ansvarlig fag og koordinatsystem slik at mottakeren kan plassere dokumentet riktig i dokumenthåndteringssystemet.',
        'Når tittelfeltet følger en fast mal kan informasjonen hentes ut automatisk og kontrolleres mot leveransekrav uten at noen må lese PDF-filer manuelt.'
      ],
      en: [
        'A well-structured title block provides clear information about project, revision, responsible discipline and coordinate system so that the recipient can correctly place the document in the document management system.',
        'When the title block follows a fixed template, the information can be extracted automatically and checked against delivery requirements without anyone having to read PDF files manually.'
      ]
    },
    related: ['modell', 'elementinformasjon']
  },
  {
    id: 'ifc-spatial-breakdown-system',
    slug: 'ifc-spatial-breakdown-system',
    label: {
      no: 'IFC Spatial breakdown system',
      en: 'IFC Spatial Breakdown System'
    },
    title: {
      no: 'IFC Spatial breakdown system',
      en: 'IFC Spatial Breakdown System'
    },
    summary: {
      no: 'Hierarkiet som forteller hvordan et prosjekt brytes ned i områder, bygningsdeler og elementer i en IFC-modell.',
      en: 'The hierarchy that defines how a project is broken down into areas, building parts and elements in an IFC model.'
    },
    details: {
      no: [
        'Spatial breakdown system beskriver sammenhengen fra IfcProject via IfcSite, IfcFacility og IfcFacilityPart helt ned til de enkelte IfcElement-instansene.',
        'Ved å modellere denne strukturen kan du filtrere modeller pr. etappe, beregne mengder per område og gjenbruke samme oppsett i flere prosjekter.'
      ],
      en: [
        'Spatial breakdown system describes the relationship from IfcProject through IfcSite, IfcFacility and IfcFacilityPart down to individual IfcElement instances.',
        'By modeling this structure, you can filter models by stage, calculate quantities per area and reuse the same setup in multiple projects.'
      ]
    },
    image: {
      src: 'Spatial_Breakdown_System_01.png',
      alt: {
        no: 'Eksempel på spatial strukturering i IFC',
        en: 'Example of spatial structuring in IFC'
      },
      caption: {
        no: 'Spatial breakdown system gjør det mulig å navigere komplekse modeller ved hjelp av et tydelig hierarki.',
        en: 'Spatial breakdown system enables navigation of complex models using a clear hierarchy.'
      }
    },
    related: ['ifc', 'element', 'informasjonsobjekt' ]
  },
  {
    id: 'bsdd',
    slug: 'bsdd',
    label: {
      no: 'BSDD (buildingSMART Data Dictionary)',
      en: 'BSDD (buildingSMART Data Dictionary)'
    },
    title: {
      no: 'BSDD – buildingSMART Data Dictionary',
      en: 'BSDD – buildingSMART Data Dictionary'
    },
    summary: {
      no: 'Et globalt oppslagsverk for standardiserte begreper, egenskaper og kodelister utviklet av buildingSMART.',
      en: 'A global reference database for standardized concepts, properties and code lists developed by buildingSMART.'
    },
    details: {
      no: [
        'BSDD gjør det mulig å slå opp unike identifikatorer for egenskaper og begreper slik at alle parter refererer til den samme definisjonen, uavhengig av språk.',
        'Når begrepene dine peker til BSDD-IDer kan programvare oversette, validere og berike data automatisk på tvers av prosjekter og systemer.'
      ],
      en: [
        'BSDD enables lookup of unique identifiers for properties and concepts so that all parties refer to the same definition, regardless of language.',
        'When your concepts point to BSDD IDs, software can translate, validate and enrich data automatically across projects and systems.'
      ]
    },
    related: ['egenskap-property', 'egenskapssett', 'ids']
  },
  {
    id: 'ifc-entitet',
    slug: 'ifc-entitet',
    label: {
      no: 'IFC-entitet',
      en: 'IFC Entity'
    },
    title: {
      no: 'IFC-entitet',
      en: 'IFC Entity'
    },
    summary: {
      no: 'En entitet er en typebeskrivelse i IFC som definerer hvilke attributter og relasjoner et objekt eller konsept skal ha.',
      en: 'An entity is a type definition in IFC that specifies which attributes and relationships an object or concept should have.'
    },
    details: {
      no: [
        'Eksempler på entiteter er IfcBridge, IfcElement og IfcPropertySet, og hver av dem beskriver hvilke felter som er tilgjengelige og hvordan de arver egenskaper fra overordnede entiteter.',
        'Når du velger riktig entitet for et objekt sikrer du at mottakeren umiddelbart forstår hvilken funksjon objektet har og hvilke regler som gjelder for dataene.'
      ],
      en: [
        'Examples of entities are IfcBridge, IfcElement and IfcPropertySet, each describing which fields are available and how they inherit properties from parent entities.',
        'When you select the correct entity for an object, you ensure that the recipient immediately understands the function of the object and which rules apply to the data.'
      ]
    },
    related: ['attributt', 'objekt', 'ifc']
  },
  {
    id: 'datastruktur',
    slug: 'datastruktur',
    label: {
      no: 'Datastruktur',
      en: 'Data Structure'
    },
    title: {
      no: 'Datastruktur',
      en: 'Data Structure'
    },
    summary: {
      no: 'Måten informasjon organiseres på slik at relasjoner, lister og hierarki kan leses og valideres.',
      en: 'The way information is organized so that relationships, lists and hierarchies can be read and validated.'
    },
    details: {
      no: [
        'I BIM-sammenheng handler datastruktur om hvordan objekter, egenskaper og dokumentreferanser henger sammen, både i modeller og i tilhørende databaser.',
        'En tydelig struktur gjør det mulig å validere leveranser, transformere data mellom systemer og sikre at alle jobber med samme sannhet.'
      ],
      en: [
        'In a BIM context, data structure refers to how objects, properties and document references are connected, both in models and in associated databases.',
        'A clear structure enables validation of deliveries, data transformation between systems and ensures that everyone works with the same truth.'
      ]
    },
    related: ['informasjonsobjekt', 'objektinformasjon']
  },
  {
    id: 'informasjonsobjekt',
    slug: 'informasjonsobjekt',
    label: {
      no: 'Informasjonsobjekt',
      en: 'Information Object'
    },
    title: {
      no: 'Informasjonsobjekt',
      en: 'Information Object'
    },
    summary: {
      no: 'En samlet pakke med data som beskriver en unik ting, for eksempel en brupilar, en kontraktsetappe eller en sensor.',
      en: 'A comprehensive data package that describes a unique thing, such as a bridge pier, a contract phase or a sensor.'
    },
    details: {
      no: [
        'Et informasjonsobjekt kan bestå av geometri, egenskaper, dokumentreferanser og regler for hvordan innholdet skal oppdateres gjennom livsløpet.',
        'Når objektene identifiseres konsekvent kan de kobles mot andre systemer som FDV, økonomi og tidsplanlegging uten ekstra manuell tilpasning.'
      ],
      en: [
        'An information object can consist of geometry, properties, document references and rules for how the content should be updated throughout the lifecycle.',
        'When objects are consistently identified, they can be linked to other systems such as facility management, finance and scheduling without additional manual adaptation.'
      ]
    },
    related: ['datastruktur', 'ids', 'objektinformasjon']
  },
  {
    id: 'ids',
    slug: 'ids',
    label: {
      no: 'IDS (Information Delivery Specification)',
      en: 'IDS (Information Delivery Specification)'
    },
    title: {
      no: 'IDS – Information Delivery Specification',
      en: 'IDS – Information Delivery Specification'
    },
    summary: {
      no: 'En buildingSMART-standard for å beskrive hvilke objekter, egenskaper og verdier som må være til stede i en leveranse.',
      en: 'A buildingSMART standard for describing which objects, properties and values must be present in a delivery.'
    },
    details: {
      no: [
        'IDS dokumenterer kravene på en maskinlesbar måte slik at modeller kan kontrolleres automatisk før de sendes inn.',
        'Filformatet kan brukes både av modelleringsverktøy og egne QA-verktøy, og sikrer at bestillere og leverandører tolker kravene på samme måte.'
      ],
      en: [
        'IDS documents the requirements in a machine-readable way so that models can be checked automatically before submission.',
        'The file format can be used by both modeling tools and dedicated QA tools, ensuring that clients and suppliers interpret the requirements in the same way.'
      ]
    },
    related: ['bsdd', 'egenskapssett', 'objektinformasjon']
  },
  {
    id: 'egenskap-property',
    slug: 'egenskap-property',
    label: {
      no: 'Egenskap (Engelsk: Property)',
      en: 'Property'
    },
    title: {
      no: 'Egenskap / Property',
      en: 'Property'
    },
    summary: {
      no: 'Et felt som kan legges til et objekt for å beskrive alt fra materialkvalitet til ansvarlig disiplin.',
      en: 'A field that can be added to an object to describe everything from material quality to responsible discipline.'
    },
    details: {
      no: [
        'Egenskaper organiseres ofte i egenskapssett og kan være knyttet til kodelister eller kravdokumenter fra byggherre.',
        'Til forskjell fra attributter kan egenskaper defineres av prosjektet selv, slik at man kan kreve spesifikke felt som «MMI» eller «Prosjekteringsansvarlig».'
      ],
      en: [
        'Properties are often organized in property sets and can be linked to code lists or requirement documents from the client.',
        'Unlike attributes, properties can be defined by the project itself, allowing specific fields such as "MMI" or "Design Manager" to be required.'
      ]
    },
    related: ['attributt', 'egenskapssett', 'bsdd']
  },
  {
    id: 'ifc',
    slug: 'ifc',
    label: {
      no: 'IFC (Industry Foundation Classes)',
      en: 'IFC (Industry Foundation Classes)'
    },
    title: {
      no: 'IFC – Industry Foundation Classes',
      en: 'IFC – Industry Foundation Classes'
    },
    summary: {
      no: 'En åpen standard for modellutveksling fra buildingSMART som gjør det mulig å dele data på tvers av verktøy og fag.',
      en: 'An open standard for model exchange from buildingSMART that enables data sharing across tools and disciplines.'
    },
    details: {
      no: [
        'IFC er fundamentet for openBIM og gir en felles struktur for objekter, egenskaper og relasjoner i bygge- og anleggsprosjekter.',
        'Standarden oppdateres jevnlig og støttes av de fleste programvarer i bransjen, noe som gjør den til en sentral del av mange nasjonale kravsett.'
      ],
      en: [
        'IFC is the foundation for openBIM and provides a common structure for objects, properties and relationships in building and infrastructure projects.',
        'The standard is regularly updated and supported by most software in the industry, making it a central part of many national requirement sets.'
      ]
    },
    related: ['ifc-skjema', 'ifc2x3', 'ifc43']
  },
  {
    id: 'egenskapssett',
    slug: 'egenskapssett',
    label: {
      no: 'Egenskapssett (Engelsk: Pset / PropertySet)',
      en: 'Property Set (Pset)'
    },
    title: {
      no: 'Egenskapssett / Property Set',
      en: 'Property Set'
    },
    summary: {
      no: 'En samling av relaterte egenskaper som hører sammen og kan gjenbrukes i flere modeller.',
      en: 'A collection of related properties that belong together and can be reused across multiple models.'
    },
    details: {
      no: [
        'Eksempler er Pset_BeamCommon eller Pset_BridgePartCommon, som beskriver typiske felt for henholdsvis bjelker og bruelementer.',
        'Ved å gjenbruke standardiserte sett reduseres variasjon og leveranser kan sjekkes automatisk mot kravlister og IDS-filer.'
      ],
      en: [
        'Examples include Pset_BeamCommon or Pset_BridgePartCommon, which describe typical fields for beams and bridge elements respectively.',
        'By reusing standardized sets, variation is reduced and deliveries can be automatically checked against requirement lists and IDS files.'
      ]
    },
    related: ['egenskap-property', 'bsdd', 'ids']
  },
  {
    id: 'ifc-bridge',
    slug: 'ifc-bridge',
    label: {
      no: 'IFC Bridge',
      en: 'IFC Bridge'
    },
    title: {
      no: 'IFC Bridge',
      en: 'IFC Bridge'
    },
    summary: {
      no: 'Utvidelsen av IFC4.3 som beskriver broer og bruelementer med egne entiteter og relasjoner.',
      en: 'The extension of IFC4.3 that describes bridges and bridge elements with dedicated entities and relationships.'
    },
    details: {
      no: [
        'Med IFC Bridge kan du modellere dekker, bæresystemer, kabler og landkar på en måte som gir entydig tolkning på tvers av verktøy.',
        'Utvidelsen knytter også bruer til linje- og flateinfrastruktur gjennom alignments, slik at modellen speiler den virkelige konstruksjonen.'
      ],
      en: [
        'With IFC Bridge, you can model decks, structural systems, cables and abutments in a way that provides unambiguous interpretation across tools.',
        'The extension also links bridges to linear and area infrastructure through alignments, so that the model reflects the actual construction.'
      ]
    },
    related: ['ifc43', 'ifc-spatial-breakdown-system']
  },
  {
    id: 'modell',
    slug: 'modell',
    label: {
      no: 'Modell',
      en: 'Model'
    },
    title: {
      no: 'Modell',
      en: 'Model'
    },
    summary: {
      no: 'En digital representasjon av et prosjekt med geometri, struktur og data som kan brukes i flere faser.',
      en: 'A digital representation of a project with geometry, structure and data that can be used across multiple phases.'
    },
    details: {
      no: [
        'En modell kombinerer 3D-geometri, datastrukturer og dokumentreferanser slik at prosjektdeltakere kan forstå helheten.',
        'For å være nyttig over tid må modellen versjoneres, kvalitetssikres og kobles mot øvrige systemer som planlegging og FDV.'
      ],
      en: [
        'A model combines 3D geometry, data structures and document references so that project participants can understand the whole.',
        'To be useful over time, the model must be versioned, quality-assured and linked to other systems such as planning and facility management.'
      ]
    },
    related: ['objekt', 'objektinformasjon', 'datastruktur']
  },
  {
    id: 'ifc2x3',
    slug: 'ifc2x3',
    label: {
      no: 'IFC2x3',
      en: 'IFC2x3'
    },
    title: {
      no: 'IFC2x3',
      en: 'IFC2x3'
    },
    summary: {
      no: 'En av de mest utbredte IFC-versjonene, publisert i 2006 og fortsatt støttet av de fleste verktøy.',
      en: 'One of the most widely used IFC versions, published in 2006 and still supported by most tools.'
    },
    details: {
      no: [
        'IFC2x3 støtter et bredt spenn av bygningsfaglige prosesser og er grunnlaget for mange etablerte kravsett.',
        'Versjonen har imidlertid begrenset støtte for infrastruktur, noe som er forbedret i de nyere IFC4.x-utgavene.'
      ],
      en: [
        'IFC2x3 supports a wide range of building-related processes and is the basis for many established requirement sets.',
        'However, the version has limited support for infrastructure, which has been improved in the newer IFC4.x releases.'
      ]
    },
    related: ['ifc', 'ifc-skjema']
  },
  {
    id: 'element',
    slug: 'element',
    label: {
      no: 'Element',
      en: 'Element'
    },
    title: {
      no: 'Element',
      en: 'Element'
    },
    summary: {
      no: 'Et fysisk eller logisk element i modellen, som en bjelke, et rom eller en teknisk installasjon.',
      en: 'A physical or logical element in the model, such as a beam, a room or a technical installation.'
    },
    details: {
      no: [
        'Elementer identifiseres gjerne med GUID og kan ha både geometri, egenskaper og tilknyttede dokumenter.',
        'Når elementer navngis og struktureres konsekvent kan de spores gjennom prosessen og kobles til kontrakter, kostnader og vedlikehold.'
      ],
      en: [
        'Elements are typically identified with a GUID and can have geometry, properties and associated documents.',
        'When elements are consistently named and structured, they can be tracked through the process and linked to contracts, costs and maintenance.'
      ]
    },
    related: ['informasjonsobjekt', 'objektinformasjon', 'ifc-entitet']
  },
  {
    id: 'ifc43',
    slug: 'ifc43',
    label: {
      no: 'IFC4.3',
      en: 'IFC4.3'
    },
    title: {
      no: 'IFC4.3',
      en: 'IFC4.3'
    },
    summary: {
      no: 'En nyere versjon av IFC som legger til omfattende støtte for vei, jernbane, bru og annen infrastruktur.',
      en: 'A newer version of IFC that adds comprehensive support for roads, railways, bridges and other infrastructure.'
    },
    details: {
      no: [
        'IFC4.3 innfører nye entiteter for terreng, geoteknikk og lineære konstruksjoner, og bygger bro mellom tradisjonell BIM og anleggsfaget.',
        'Versjonen er grunnlaget for kommende openBIM-krav i flere land og for prosjekter som ønsker mer presis modellutveksling.'
      ],
      en: [
        'IFC4.3 introduces new entities for terrain, geotechnics and linear structures, bridging traditional BIM and civil engineering.',
        'The version forms the basis for upcoming openBIM requirements in several countries and for projects seeking more precise model exchange.'
      ]
    },
    related: ['ifc', 'ifc-bridge', 'ifc-skjema']
  },
  {
    id: 'objektinformasjon',
    slug: 'objektinformasjon',
    label: {
      no: 'Objektinformasjon',
      en: 'Object Information'
    },
    title: {
      no: 'Objektinformasjon',
      en: 'Object Information'
    },
    summary: {
      no: 'Summen av all metadata som beskriver et objekt, inkludert ansvar, status, materialer og planlagt vedlikehold.',
      en: 'The sum of all metadata describing an object, including responsibility, status, materials and planned maintenance.'
    },
    details: {
      no: [
        'Objektinformasjon er det som gjør modellen nyttig utover visualisering, fordi informasjonen kan mates inn i FDV, innkjøp eller analyseverktøy.',
        'Når krav til objektinformasjon beskrives i IDS eller tilsvarende dokumentasjon blir det enkelt å kontrollere om noe mangler før leveranse.'
      ],
      en: [
        'Object information is what makes the model useful beyond visualization, because the information can be fed into facility management, procurement or analysis tools.',
        'When requirements for object information are described in IDS or similar documentation, it becomes easy to check if something is missing before delivery.'
      ]
    },
    related: ['ids', 'egenskap-property', 'modell']
  }
];

export const glossaryBySlug = glossaryItems.reduce<Record<string, GlossaryTerm>>((acc, term) => {
  acc[term.slug] = term;
  return acc;
}, {});
