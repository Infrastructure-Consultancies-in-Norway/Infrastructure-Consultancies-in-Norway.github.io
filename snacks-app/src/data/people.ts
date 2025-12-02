export interface Person {
  name: string;
  title: string;
  email: string;
  imageSrc: string;
}

export const people: Person[] = [
  {
    name: 'Christoffer Nergaard Mikalsen',
    title: 'Sivilingeniør OsloMet 2024',
    email: 'christoffer.mikalsen@sweco.no',
    imageSrc: '/Images/christoffer.jpg',
  },
  {
    name: 'Øystein Ulvestad',
    title: 'Sivilingeniør NTNU 2000',
    email: 'oystein.ulvestad@sweco.no',
    imageSrc: '/Images/oystein.jpg',
  },
  {
    name: 'Andreas Bratlie',
    title: 'Sivilingeniør NTNU 2012',
    email: 'andreas.bratlie@norconsult.com',
    imageSrc: '/Images/andreas.jpg',
  },
  {
    name: 'Thomas Østgulen',
    title: 'Sivilingeniør NTNU 2010',
    email: 'thomas.ostgulen@norconsult.com',
    imageSrc: '/Images/thomas.jpg',
  },
  {
    name: 'Terje Fjellby',
    title: 'Jernbinder 2005',
    email: 'terje.fjellby@norconsult.com',
    imageSrc: '/Images/terje.jpg',
  },
  {
    name: 'Simon Sòlbjørg',
    title: 'Ingeniør HiO 2010',
    email: 'sso@aaj.no',
    imageSrc: '/Images/simon.jpg',
  },
  {
    name: 'Olav Fiksdal Haukvik',
    title: 'Sivilingeniør NTNU 2011',
    email: 'oha@aaj.no',
    imageSrc: '/Images/olav.jpg',
  },
  {
    name: 'Petter Kay Steinbo',
    title: 'Sivilingeniør NTNU 2020',
    email: 'pest@cowi.com',
    imageSrc: '/Images/petter.jpg',
  },
  {
    name: 'Fredrik Sommer-Jacobsen',
    title: 'MSc UiO 2012',
    email: 'fkjn@cowi.com',
    imageSrc: '/Images/fredrik.png',
  },
];
