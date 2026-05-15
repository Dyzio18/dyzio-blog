import projectsData from '@/data/projectsData';
import Card from '@/components/Card';
import { genPageMetadata } from 'app/seo';
import { getDictionary } from '@/lib/i18n/getDictionary';

export const metadata = genPageMetadata({ title: 'Bucket list' });

export default async function Projects() {
  const { dict } = await getDictionary();
  const destinations = [
    'Kathmandu, Nepal [October/November 2022]',
    'Bangkok, Thailand',
    'Goa, India',
    'Mumbai, India',
    'Marrakesh, Maroko',
    'Mexico City, Mexico',
    'Havana, Kuba',
    'Manaus, Brazil',
    'São Paulo, Brazil',
    'Rio de Janeiro, Brazil',
    'Toronto, Canada',
    'New York, US',
    'Paris, France',
    'Santiago de Compostela, Spain',
    'Barcelona, Spain',
    'Syracuse, Italy',
    'Eat orange from tree in Sicily',
    'Madagascar',
    'Baikal lake, Russia',
    'Tokyo, Japan',
    'Hiroshima, Japan',
    'North & South Japan (by train)',
    'Seul, South Korea',
    'Tehran, Iran',
    'Ulaanbaatar, Mongolia',
    'Kyrgyzstan',
    'Tibetan Buddhist temple, Tibet',
    'Wellington, New Zealand',
    'Philippines',
    'Iquitos, Peru',
    'La Paz, Bolivia',
    'Vietnam',
    'San Francisco, US',
    'Miami, US',
    'Texas, US',
    'Hawaii, US',
    'Helsinki, Finland',
    'St. Petersburg, Russia',
    'Greenland',
    'Iceland',
    'Athens, Greece',
    'Sparti, Greece',
    'Kotor, Montenegro',
    'Jerusalem, Israel',
    'Odesa, Ukraine',
    'Lwów, Ukraine',
    'Wilno, Lithuania',
    'Papua, Indonesia',
    'Bali, Indonesia',
    'Alasca, US',
  ];

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {dict.bucketlist.title}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {dict.bucketlist.subtitleLine1} <br />
            {dict.bucketlist.subtitleLine2}
          </p>
        </div>
        <div className="container py-12">
          <ol className="-m-4 list-decimal">
            {destinations.map((destination, index) => (
              <li key={index} className="py-1 block">
                {destination}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
