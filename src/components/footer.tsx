import Link from 'next/link';
import BrandLogo from './logo';

const createTimeStamp = () => {
  if (!process.env.NEXT_PUBLIC_TIMESTAMP) {
    return null;
  }

  const now = new Date(Number(process.env.NEXT_PUBLIC_TIMESTAMP) * 1000);
  const locale = 'en-GB';
  const printTimeStampOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'long',
    second: 'numeric',
    timeZone: 'Europe/London',
    timeZoneName: 'short',
    year: 'numeric',
    hour12: true,
  };

  const printTimestamp = new Intl.DateTimeFormat(
    locale,
    printTimeStampOptions,
  ).format(now);

  const dateTimestamp = now.toISOString();

  return {
    printTimestamp,
    dateTimestamp,
  };
};

export const TimeStamp: React.FC = () => {
  const timestamps = createTimeStamp();
  if (timestamps) {
    const { printTimestamp, dateTimestamp } = timestamps;
    return (
      <p>
        Updated at: <time dateTime={dateTimestamp}>{printTimestamp}</time>
      </p>
    );
  }
  return null;
};

const Footer = () => (
  <footer className="footer">
    <Link href="/" title="Pedro Martin Valera" className="branding">
      <BrandLogo />
    </Link>
    <div className="footer-sections | mask-links">
      <div>
        <h3 className="size-md font-bold">Follow me</h3>
        <p>
          <a href="https://www.linkedin.com/in/pataruco/">LinkedIn</a> <br />
          <a href="https://github.com/pataruco">GitHub</a>
        </p>
      </div>
    </div>
    <div className="footer-email">
      <a href="mailto:pedro@martin-blanco.com">pedro@martin-blanco.com</a>
    </div>
    <div>
      <TimeStamp />
    </div>
  </footer>
);

export default Footer;
