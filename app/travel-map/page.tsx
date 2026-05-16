import Link from 'next/link';
import SectionContainer from '@/components/SectionContainer';
import PageTitle from '@/components/PageTitle';
import TravelMapClient from '@/components/TravelMapClient';
import { genPageMetadata } from 'app/seo';
import { getDictionary } from '@/lib/i18n/getDictionary';

export const metadata = genPageMetadata({
  title: 'Travel Map',
  description: 'World map showing all travel destinations with links to blog posts',
});

const allDestinations = [
  // Nepal 2022
  { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.324, post: '/blog/nepal-2022', trip: 'Nepal 2022' },
  { name: 'Besisahar, Nepal', lat: 28.6333, lng: 84.3833, post: '/blog/nepal-2022', trip: 'Nepal 2022' },
  { name: 'Manang, Nepal', lat: 28.6667, lng: 84.0167, post: '/blog/nepal-2022', trip: 'Nepal 2022' },
  // Maroko 2023/24
  { name: 'Agadir, Maroko', lat: 30.4278, lng: -9.5981, post: '/blog/maroko-2023-24', trip: 'Maroko 2023/24' },
  // Azja 2024/25
  { name: 'Seul, Korea Południowa', lat: 37.5665, lng: 126.978, post: '/blog/azja-2024-25', trip: 'Azja 2024/25' },
  { name: 'Bali, Indonezja', lat: -8.3405, lng: 115.092, post: '/blog/azja-2024-25', trip: 'Azja 2024/25' },
  { name: 'Bangkok, Tajlandia', lat: 13.7563, lng: 100.5018, post: '/blog/azja-2024-25', trip: 'Azja 2024/25' },
  { name: 'Chiang Mai, Tajlandia', lat: 18.7883, lng: 98.9853, post: '/blog/azja-2024-25', trip: 'Azja 2024/25' },
  { name: 'Pai, Tajlandia', lat: 19.3617, lng: 98.4397, post: '/blog/azja-2024-25', trip: 'Azja 2024/25' },
  // Amazonia 2025
  { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
  { name: 'Iquitos, Peru', lat: -3.7437, lng: -73.2516, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
  { name: 'Bogota, Kolumbia', lat: 4.711, lng: -74.0721, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
  { name: 'Puerto Narino, Kolumbia', lat: -3.7667, lng: -70.3667, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
  { name: 'Leticia, Kolumbia', lat: -4.2053, lng: -69.9401, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
  { name: 'Tabatinga, Brazylia', lat: -4.2496, lng: -69.9386, post: '/blog/amazonia-2025', trip: 'Amazonia 2025' },
];

const trips = [
  {
    name: 'Nepal 2022',
    date: 'Październik 2022',
    post: '/blog/nepal-2022',
    description: 'Trekking wokół Annapurny, Kathmandu, Manang',
    destinations: ['Kathmandu', 'Besisahar', 'Manang'],
  },
  {
    name: 'Maroko 2023/24',
    date: 'Grudzień 2023 - Styczeń 2024',
    post: '/blog/maroko-2023-24',
    description: 'Agadir i okolice',
    destinations: ['Agadir'],
  },
  {
    name: 'Azja 2024/25',
    date: 'Grudzień 2024 - Styczeń 2025',
    post: '/blog/azja-2024-25',
    description: 'Korea, Indonezja, Tajlandia (2 miesiące)',
    destinations: ['Seul', 'Bali', 'Bangkok', 'Chiang Mai', 'Pai'],
  },
  {
    name: 'Amazonia 2025',
    date: 'Październik - Listopad 2025',
    post: '/blog/amazonia-2025',
    description: 'Peru, Kolumbia, Brazylia - trójstyki granic',
    destinations: ['Lima', 'Iquitos', 'Bogota', 'Puerto Narino', 'Leticia', 'Tabatinga'],
  },
];

export default async function TravelMap() {
  const { dict } = await getDictionary();

  const mapLocations = allDestinations.map((d) => ({
    name: d.name,
    lat: d.lat,
    lng: d.lng,
    post: d.post,
    trip: d.trip,
  }));

  const uniqueTrips = Array.from(new Set(allDestinations.map((d) => d.trip))).map((tripName) => {
    const trip = trips.find((t) => t.name === tripName);
    return {
      ...trip!,
      destinations: allDestinations.filter((d) => d.trip === tripName),
    };
  });

  const cityCount = allDestinations.length;
  const countryCount = new Set(
    allDestinations.map((d) => d.name.split(',').pop()?.trim()).filter(Boolean)
  ).size;
  const reportageCount = uniqueTrips.length;

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700" data-mode="travel">
        <div className="space-y-2 pb-8 pt-6">
          <PageTitle>{dict.travelMap.title}</PageTitle>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {dict.travelMap.subtitle}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 py-6 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <strong className="text-gray-900 dark:text-gray-100">{countryCount}</strong>{' '}
              {dict.travelMap.statCountries}
            </span>
            <span>
              <strong className="text-gray-900 dark:text-gray-100">{cityCount}</strong>{' '}
              {dict.travelMap.statCities}
            </span>
            <span>
              <strong className="text-gray-900 dark:text-gray-100">{reportageCount}</strong>{' '}
              {dict.travelMap.statReportages}
            </span>
          </div>
        </div>

        <div className="py-8">
          <TravelMapClient locations={mapLocations} />
        </div>

        <div className="py-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {dict.travelMap.trips}
          </h2>
          <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory">
            {uniqueTrips.map((trip) => (
              <li
                key={trip.name}
                className="snap-start shrink-0 w-72 sm:w-80 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {trip.date}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {trip.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {trip.description}
                </p>
                <Link
                  href={trip.post}
                  className="mt-3 inline-block text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  {dict.travelMap.readMore} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
