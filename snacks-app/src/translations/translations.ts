export const translations = {
  no: {
    // Navbar
    'nav.properties': 'Egenskapssett',
    'nav.home': 'Hjem',
    'nav.standardization1': 'Standardisering del 1',
    'nav.standardization2': 'Standardisering del 2',
    'nav.history': 'Historie',
    'nav.download': 'Last ned',
    'nav.glossary': 'Begrepsforklaring',
    'nav.additional': 'Tilleggsinformasjon',
    'nav.contact': 'Kontakt',
    'nav.approval': 'Godkjennelse iht. N400',

    // Main
    'main.title': 'SNACKS',
    'main.intro': 'SNACKS er et samarbeid mellom Sweco, Norconsult, Aas-Jakobsen og Cowi med mål å standardisere IFC-modeller av bruer og andre samferdselskonstruksjoner.',
    'main.std1': 'Standardisering del 1:',
    'main.std1.subtitle': 'SNACKS-strukturen',
    'main.std2': 'Standardisering del 2:',
    'main.std2.subtitle1': 'Standardisert Elementnavn',
    'main.std2.subtitle2': 'Standardisert Materialliste',

    // Standardization Part 1
    'std1.title': 'Standardisering del 1: SNACKS-strukturen',
    'std1.intro': 'SNACKS-strukturen definerer hvordan informasjon i IFC-modeller av bruer skal organiseres. De viktigste definisjonene er:',
    'std1.list1': 'Navn på egenskaper og egenskapssett',
    'std1.list2': 'Gruppering av egenskaper i egenskapssett',
    'std1.list3': 'Tillatte egenskapsverdier der dette er relevant',
    'std1.list4': 'Hvilket nivå egenskapssett tilhører i IFC Spatial Breakdown System',
    'std1.list5': 'SNACKS kan brukes for både Ifc2x3 og Ifc4.3',
    'std1.purpose.title': 'Formål',
    'std1.purpose.text': 'Formålet med SNACKS-strukturen er å effektivisere modellproduksjon, redusere usikkerhet i verifikasjonsprosesser, og forenkle bruken av Ifc-modeller under bygging og drift av bruer. Konsekvent bruk av SNACKS-strukturen vil også gjøre det enklere for bransjen å utvikle og vedlikeholde gjenbrukbare systemer og arbeidsmetoder.',
    'std1.spatial.title': 'Ifc Spatial Breakdown System',
    'std1.spatial.text': 'Ifc Spatial Breakdown System er en funksjonalitet i IFC-formatet som definerer flere nivåer av informasjon, også omtalt som et informasjonshierarki. Egenskaper plassert høyt i hierarkiet arves av elementer lenger ned i hierarkiet. Dette gjør at generell informasjon kan lagres ett sted fremfor å måtte tillegges hvert enkelt element.',
    'std1.spatial.text1': 'IFC Spatial Breakdown System er en funksjonalitet i IFC-formatet som definerer flere nivåer av informasjon, også kalt et informasjonshierarki.',
    'std1.spatial.text2': 'Egenskaper som plasseres høyt i hierarkiet arves av elementer lenger ned i hierarkiet. Dette gjør at egenskaper som beskriver generell informasjon kan samles på en plass i stedet for å måtte knyttes til hvert enkelt element.',
    'std1.facility.title': 'Egenskaper på modellnivå',
    'std1.facility.subtitle': 'Egenskapssett på modellnivå',
    'std1.facility.modelinfo': 'BIM_Modellinfo *',
    'std1.facility.note': '* Egenskapssett skal alltid inkluderes',
    'std1.facility.text': 'I SNACKS-strukturen er overordnede egenskaper plassert på «konstruksjonsnivå» og samlet i egenskapssettet «BIM_Modellinfo».',
    'std1.facility.example': 'Koordinatsystem er et eksempel på en egenskap som knyttes til modellen på «konstruksjonsnivå».',
    'std1.element.title': 'Egenskaper på elementnivå',
    'std1.element.subtitle': 'Egenskapssett på elementnivå',
    'std1.element.text': 'I SNACKS strukturen legges egenskaper knyttet til egenskapssett på elementer på «elementnivå». Det er i SNACKS strukturen kun mulig å knytte egenskaper til elementer på «elementnivå».',
    'std1.element.text2': 'Det er ikke mulig å knytte egenskaper til elementer på «sammensatt elementnivå».',
    'std1.element.note1': '* Egenskapssett skal alltid inkluderes',
    'std1.element.note2': '** Egenskapssett inkluderes kun for relevante elementer',
    'std1.deviations.title': 'Avvik fra Ifc-skjemaet',
    'std1.deviations.intro': 'SNACKS-strukturen avviker fra Ifc-skjema på følgende punkter:',
    'std1.deviations.naming.title': 'Navngivning av egenskaper:',
    'std1.deviations.naming.text': 'Navn på egenskapene i SNACKS-strukturen avviker fra standard navngivning i Ifc-skjemaet.',
    'std1.deviations.reason1.title': 'Årsak 1:',
    'std1.deviations.reason1.text': 'Standardegenskaper i Ifc-skjemaet har engelske navn. For å lette forståelsen av hva egenskapene beskriver bruker SNACKS-strukturen norske navn på egenskaper.',
    'std1.deviations.reason2.title': 'Årsak 2:',
    'std1.deviations.reason2.text': 'Standardegenskaper i Ifc-skjemaet har navn som ofte ikke gir en god forståelse av hva egenskapen gir informasjon om. For å lette forståelsen av hva egenskapene beskriver bruker SNACKS-strukturen norske navn på egenskaper.',
    'std1.deviations.reason3.title': 'Årsak 3:',
    'std1.deviations.reason3.text': 'Standardegenskaper i Ifc-skjemaet har navn uten prefiks. Navn på egenskapene i SNACKS-strukturen har prefiks som gir informasjon om hvilke egenskapssett egenskapen tilhører.',
    'std1.deviations.assembly.title': 'Egenskaper kun på elementnivå:',
    'std1.deviations.assembly.text': 'SNACKS-strukturen legger ikke opp til egenskaper på «sammensatt elementnivå» i Ifc-skjemaet.',
    'std1.deviations.assembly.reason1.title': 'Årsak 1:',
    'std1.deviations.assembly.reason1.text': 'Egenskaper på «sammensatt elementnivå» i Ifc-skjemaet kan være vanskelig å finne i mange visningsverktøy.',
    'std1.deviations.assembly.reason2.title': 'Årsak 2:',
    'std1.deviations.assembly.reason2.text': 'Motsigende informasjon på «elementnivå» og «sammensatt elementnivå» i Ifc-skjemaet skaper tvetydighet. Et eksempel er objekter som har en materialkvalitet på «elementnivå» og en annen materialkvalitet på «sammensatt elementnivå».',

    // Property Set Names
    'propset.BIM_Beskrivelse': 'BIM_Beskrivelse',
    'propset.BIM_FDV': 'BIM_FDV',
    'propset.BIM_Tverrfaglig': 'BIM_Tverrfaglig',
    'propset.KON_Felles': 'KON_Felles',
    'propset.KON_Armering': 'KON_Armering',
    'propset.KON_Betong': 'KON_Betong',
    'propset.KON_Festemidler': 'KON_Festemidler',
    'propset.KON_Fuger': 'KON_Fuger',
    'propset.KON_Geometri': 'KON_Geometri',
    'propset.KON_Lager': 'KON_Lager',
    'propset.KON_Løsmasser': 'KON_Løsmasser',
    'propset.KON_Peler': 'KON_Peler',
    'propset.KON_Spennarmering': 'KON_Spennarmering',
    'propset.KON_Stål': 'KON_Stål',
    'propset.KON_Sveis': 'KON_Sveis',
    'propset.KON_Tre': 'KON_Tre',

    // Validation / N400
    'validation.n400.text': 'SNACKS-strukturen ivaretar krav til elementinformasjon i henhold til N400',
    'validation.n400.link': 'Les mer her',
    'validation.svv.text': 'SNACKS-strukturen er utarbeidet i samarbeid med Statens vegvesen Vegdirektoratet',
    'validation.modal.close': 'Lukk',

    // Standardization Part 2
    'std2.title': 'Standardisering del 2: Standardisert Elementnavn og Materialliste',

    // History
    'history.title': 'Historie',

    // Download
    'download.title': 'Last ned',
    'download.alert': 'Denne nedlastingen er ikke tilgjengelig enda, vennligst prøv igjen senere.',
    'download.github': 'Utforsk organisasjonen på GitHub',
    'download.item1.title': 'Rapport: Behovsanalyse (PDF)',
    'download.item1.subtitle': 'Del 1: Behovsanalyse',
    'download.item2.title': 'Rapport: Sluttrapport (PDF)',
    'download.item2.subtitle': 'Del 2: Sluttrapport',
    'download.item3.title': 'Rapport: Standardisering av modellbaserte leveranser (BIM)',
    'download.item3.subtitle': 'Del 1: Behovsanalyse',
    'download.item4.title': 'Rapport: Standardisering av modellbaserte leveranser (BIM)',
    'download.item4.subtitle': 'Del 2: Sluttrapport',
    'download.item5.title': 'Excel: SNACKS Egenskapssett Egenskaper, og verdier (XLSX)',
    'download.item5.subtitle': 'Del 3: Egenskapssett',
    'download.item6.title': 'Rapport: Standardiserte Element- og materialnavnlister (PDF)',
    'download.item6.subtitle': 'Del 4: Egenskapsnavn og verdier',
    'download.item7.title': 'Excel: Materialnavn (XLSX)',
    'download.item7.subtitle': 'Tilgjengelig snart',
    'download.item8.title': 'Rapport: XXX (PDF)',
    'download.item8.subtitle': 'Tilgjengelig snart',

    // Glossary
    'glossary.title': 'Begrepsforklaring',
    'glossary.intro': 'Velg et begrep for å lese hele forklaringen.',
    'glossary.seeAlso': 'Se også',
    'glossary.backToList': 'Tilbake til begrepslisten',
    'glossary.notFound': 'Vi fant ikke begrepet du lette etter.',

    // Additional Info
    'additional.title': 'Tilleggsinformasjon',
    'additional.video.title': 'Presentasjon BA-Nettverket',

    // Contact
    'contact.title': 'Kontakt',
    'contact.intro': 'Har du spørsmål eller ønsker å komme i kontakt med noen av oss? Her finner du oversikt over teammedlemmer og deres kontaktinformasjon. Ønsker du å gi tilbakemelding på innholdet i SNACKS, eller har du forslag til forbedringer kan det gjøres direkte i Github, eller ved å kontakte oss direkte.',
    'contact.github': 'Tilbakemelding GitHub',

    // Footer
    'footer.collaboration': 'Et samarbeid mellom:',
  },
  en: {
    // Navbar
    'nav.properties': 'Property Sets',
    'nav.home': 'Home',
    'nav.standardization1': 'Standardization Part 1',
    'nav.standardization2': 'Standardization Part 2',
    'nav.history': 'History',
    'nav.download': 'Download',
    'nav.glossary': 'Glossary',
    'nav.additional': 'Additional Information',
    'nav.contact': 'Contact',
    'nav.approval': 'Approval acc. to N400',

    // Main
    'main.title': 'SNACKS',
    'main.intro': 'SNACKS is a collaboration between four of Norway\'s largest consultant companies (Sweco, Norconsult, Aas-Jakobsen, and Cowi) with the aim of standardizing IFC models of bridges.',
    'main.std1': 'Standardization part 1:',
    'main.std1.subtitle': 'SNACKS Ifc Structure',
    'main.std2': 'Standardization part 2:',
    'main.std2.subtitle1': 'Standardization of element names',
    'main.std2.subtitle2': 'Standardization of material lists',

    // Standardization Part 1
    'std1.title': 'Standardization part 1: SNACKS Property Sets',
    'std1.intro': 'The SNACKS Ifc Structure defines how information in IFC models of bridges should be organized. The most important definitions are:',
    'std1.list1': 'Names of properties and property sets',
    'std1.list2': 'Grouping of properties into property sets',
    'std1.list3': 'Permitted property values where relevant',
    'std1.list4': 'Which level property sets belong to in the IFC Spatial Breakdown System',
    'std1.list5': 'SNACKS can be used for both Ifc2x3 and Ifc4.3',
    'std1.purpose.title': 'Purpose',
    'std1.purpose.text': 'The purpose of the SNACKS Ifc Structure is to streamline model production, reduce uncertainty in verification processes, and simplify the use of Ifc models during construction and operation of bridges. Consistent use of the SNACKS Ifc Structure will also make it easier for the industry to develop and maintain reusable systems and work methods.',
    'std1.spatial.title': 'Ifc Spatial Breakdown System',
    'std1.spatial.text': 'The Ifc Spatial Breakdown System is a functionality in the IFC format that defines multiple levels of information, also referred to as an information hierarchy. Properties placed high in the hierarchy are inherited by elements further down the hierarchy. This allows general information to be stored in one location instead of needing to be assigned to each individual element.',
    'std1.spatial.text1': 'The Ifc Spatial Breakdown System is a functionality in the IFC format that defines multiple levels of information, also referred to as an information hierarchy.',
    'std1.spatial.text2': 'Properties placed high in the hierarchy are inherited by elements further down the hierarchy. This allows properties describing general information to be collected in one place instead of having to be assigned to each individual element.',
    'std1.facility.title': 'Properties on Model Level',
    'std1.facility.subtitle': 'Property Sets on Model Level',
    'std1.facility.modelinfo': 'BIM_Modelinfo *',
    'std1.facility.note': '* Property Set should always be included',
    'std1.facility.text': 'In the SNACKS Ifc Structure, overarching properties are placed at the "facility level" and collected in the property set "BIM_Modelinfo".',
    'std1.facility.example': 'Coordinate System is an example of a property that is assigned to the model at the "facility level".',
    'std1.element.title': 'Properties on Element Level',
    'std1.element.subtitle': 'Property Sets on Element Level',
    'std1.element.text': 'In the SNACKS Ifc Structure, properties associated with property sets on elements are placed at the "element level". In the SNACKS Ifc Structure, it is only possible to assign properties to elements at the "element level".',
    'std1.element.text2': 'It is not possible to assign properties to elements at the "element assembly level".',
    'std1.element.note1': '* Property Set should always be included',
    'std1.element.note2': '** Property Set included for relevant elements',
    'std1.deviations.title': 'Deviations from the Ifc schema',
    'std1.deviations.intro': 'The SNACKS Ifc Structure deviates from the Ifc schema in the following ways:',
    'std1.deviations.naming.title': 'Naming of properties:',
    'std1.deviations.naming.text': 'The names of properties in the SNACKS Ifc Structure differ from the standard naming in the Ifc schema.',
    'std1.deviations.reason1.title': 'Reason 1:',
    'std1.deviations.reason1.text': 'Standard properties in the Ifc schema have English names. To facilitate understanding of what the properties describe, the SNACKS Ifc Structure uses Norwegian property names.',
    'std1.deviations.reason2.title': 'Reason 2:',
    'std1.deviations.reason2.text': 'Standard properties in the Ifc schema have names that often do not provide a good understanding of what information the property provides. To facilitate understanding of what the properties describe, the SNACKS Ifc Structure uses Norwegian property names.',
    'std1.deviations.reason3.title': 'Reason 3:',
    'std1.deviations.reason3.text': 'Standard properties in the Ifc schema have names without prefixes. Property names in the SNACKS Ifc Structure have prefixes that provide information about which property set the property belongs to.',
    'std1.deviations.assembly.title': 'Properties only at element level:',
    'std1.deviations.assembly.text': 'The SNACKS Ifc Structure does not support properties at the "element assembly level" in the Ifc schema.',
    'std1.deviations.assembly.reason1.title': 'Reason 1:',
    'std1.deviations.assembly.reason1.text': 'Properties at the "element assembly level" in the Ifc schema can be difficult to find in many viewing tools.',
    'std1.deviations.assembly.reason2.title': 'Reason 2:',
    'std1.deviations.assembly.reason2.text': 'Conflicting information at the "element level" and "element assembly level" in the Ifc schema creates ambiguity. An example is objects that have one material quality at the "element level" and another material quality at the "element assembly level".',

    // Property Set Names
    'propset.BIM_Beskrivelse': 'BIM_Description',
    'propset.BIM_FDV': 'BIM_O&M',
    'propset.BIM_Tverrfaglig': 'BIM_Multidisciplinary',
    'propset.KON_Felles': 'KON_Common',
    'propset.KON_Armering': 'KON_Reinforcement',
    'propset.KON_Betong': 'KON_Concrete',
    'propset.KON_Festemidler': 'KON_Fasteners',
    'propset.KON_Fuger': 'KON_Joints',
    'propset.KON_Geometri': 'KON_Geometry',
    'propset.KON_Lager': 'KON_Bearings',
    'propset.KON_Løsmasser': 'KON_Aggregates',
    'propset.KON_Peler': 'KON_Piles',
    'propset.KON_Spennarmering': 'KON_Prestressing',
    'propset.KON_Stål': 'KON_Steel',
    'propset.KON_Sveis': 'KON_Welding',
    'propset.KON_Tre': 'KON_Timber',

    // Validation / N400
    'validation.n400.text': 'The SNACKS structure meets requirements for object information in accordance with N400',
    'validation.n400.link': 'Read more here',
    'validation.svv.text': 'The SNACKS Ifc Structure was developed in collaboration with the Norwegian Public Roads Administration',
    'validation.modal.close': 'Close',

    // Standardization Part 2
    'std2.title': 'Standardization part 2: Standardization of element names and material lists',

    // History
    'history.title': 'History',

    // Download
    'download.title': 'Download',
    'download.alert': 'This download is not available yet, please try again later.',
    'download.github': 'Explore the organization on GitHub',
    'download.item1.title': 'Report: Needs Analysis (PDF)',
    'download.item1.subtitle': 'Part 1: Needs Analysis',
    'download.item2.title': 'Report: Final Report (PDF)',
    'download.item2.subtitle': 'Part 2: Final Report',
    'download.item3.title': 'Report: Standardization of model-based deliveries (BIM)',
    'download.item3.subtitle': 'Part 1: Needs Analysis',
    'download.item4.title': 'Report: Standardization of model-based deliveries (BIM)',
    'download.item4.subtitle': 'Part 2: Final Report',
    'download.item5.title': 'Excel: SNACKS Property Sets Properties and values (XLSX)',
    'download.item5.subtitle': 'Part 3: Property Sets',
    'download.item6.title': 'Report: Standardized Element and material name lists (PDF)',
    'download.item6.subtitle': 'Part 4: Property names and values',
    'download.item7.title': 'Excel: Material names (XLSX)',
    'download.item7.subtitle': 'Available soon',
    'download.item8.title': 'Report: XXX (PDF)',
    'download.item8.subtitle': 'Available soon',

    // Glossary
    'glossary.title': 'Glossary',
    'glossary.intro': 'Select a term to read the full explanation.',
    'glossary.seeAlso': 'See also',
    'glossary.backToList': 'Back to glossary list',
    'glossary.notFound': 'We could not find the term you were looking for.',

    // Additional Info
    'additional.title': 'Additional Information',
    'additional.video.title': 'Presentation BA Network',

    // Contact
    'contact.title': 'Contact',
    'contact.intro': 'Do you have questions or wish to get in touch with any of us? Here you will find an overview of team members and their contact information. If you wish to provide feedback on the content of SNACKS, or have suggestions for improvements, this can be done directly in Github, or by contacting us directly.',
    'contact.github': 'Feedback GitHub',

    // Footer
    'footer.collaboration': 'A collaboration between:',
  }
};

export const getTranslation = (language: 'no' | 'en', key: string): string => {
  const langTranslations = translations[language] as Record<string, string>;
  return langTranslations[key] || key;
};
