import Image from './Image';
import Link from './Link';

const Card = ({ title, description, imgSrc, href }) => (
  <div className="max-w-[544px] p-4 md:w-1/2">
    <div className="group block h-full rounded-2xl border border-gray-200 bg-white/60 p-1 transition hover:border-primary-500 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/40">
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <div className="overflow-hidden rounded-xl">
              <Image
                alt={title}
                src={imgSrc}
                className="object-cover object-center"
                width={544}
                height={380}
              />
            </div>
          </Link>
        ) : (
          <div className="overflow-hidden rounded-xl">
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </div>
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight transition group-hover:text-primary-600 dark:group-hover:text-primary-300">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
            aria-label={`Link to ${title}`}
          >
            more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default Card;
