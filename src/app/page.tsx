import { Metadata } from 'next';
import { WebSite, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Pedro Martín Valera',
  description:
    'I am a Web developer and educator. I help to build, teach and lead product tech teams.',
};

const jsonLd: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  about: 'Pedro Martín Valera',
  url: 'https://pataruco.dev',
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="content">
        <h1>Web developer and educator</h1>
        <p>I help to build, teach and lead product tech teams.</p>
      </div>
      <div className="content">
        <h2 className="heading">About</h2>
        <p> Born and raised in Caracas, Venezuela.</p>
        <p>
          I started as a Science Teacher and Programme Director in Summer camps,
          then joined a charity to improve social integration in the slums.
        </p>
        <p>
          I arrived in London in 2013 and worked as a rope access technician to
          save money for a Web Development course, which I finished at General
          Assembly in 2015.
        </p>
        <p>They were crazy enough to hire me as a Teacher Assistant.</p>
        <p>
          I am still teaching as Lead Instructor, so the circle is completed.
        </p>
      </div>
      <div className="content">
        <h2 className="heading">Career</h2>
        <ul>
          <li className="strikethrough">
            <s>
              Support Engineer at{' '}
              <a href="https://www.madetech.com/" title="made tech">
                Made Tech
              </a>
            </s>
          </li>
          <li>
            <s>
              Junior Web Developer at{' '}
              <a href="https://www.thirtythr.ee/uk" title="thirtythree">
                33
              </a>
            </s>
          </li>
          <li>
            <s>
              Senior Software Engineer Consultant at{' '}
              <a href="https://red-badger.com/" title="red badger">
                Red Badger
              </a>
            </s>
          </li>
          <li>
            <s>
              Teacher assistant at{' '}
              <a href="https://ga.co" title="general assembly">
                General Assembly
              </a>
            </s>
          </li>
          <li>
            Distinguished Faculty Member (fancy name for a tech teacher) at{' '}
            <a href="https://ga.co" title="general assembly">
              General Assembly
            </a>
          </li>
          <li>
            Tech lead consultant at{' '}
            <a href="https://www.101ways.com/">101 Ways</a>
          </li>
        </ul>
      </div>
    </>
  );
}
