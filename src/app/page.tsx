import { BASE_URL, author } from '@/utils/metadata';
import { Metadata } from 'next';
import { ProfilePage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Pedro Martín Valera',
  description:
    'I am a Web developer and educator. I help to build, teach and lead product tech teams.',
  manifest: `${BASE_URL}/manifest.json`,
};

export default function Home() {
  const jsonLd: WithContext<ProfilePage> = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    about: 'Pedro Martín Valera',
    description: 'I help to build, teach and lead product tech teams.',
    url: BASE_URL,
    author,
  };
  return (
    <>
      <script
        type='application/ld+json'
        // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className='content'>
        <h1>I am Pedro Martin Valera</h1>
        <p>
          Web developer and educator based in London. I help to build, teach and
          lead product tech teams.
        </p>
      </div>
      <div className='content'>
        <h2 className='heading'>About</h2>
        <p>I was born and raised in Caracas, Venezuela.</p>

        <p>
          I began my career as a Science Teacher and Program Director at Summer
          Camps for children and young adults. I founded Paz con Todo, a charity
          that aimed to reduce violence in Caracas by improving social
          integration in Caracas.
        </p>

        <p>
          In 2013 I arrived in London, where I worked as a{' '}
          <a
            href='https://www.theguardian.com/artanddesign/2015/jul/20/hanging-by-thread-rats-keep-skyscrapers-standing'
            target='_blank'
            rel='noreferrer'
          >
            rope access technician{' '}
          </a>{' '}
          as I put myself through General Assembly's Web Development course,
          which I completed in 2015.
        </p>

        <p>
          Upon graduation, they were crazy enough to invite me to join the{' '}
          <a href='https://generalassemb.ly/instructors/pedro-martin/7012'>
            faculty
          </a>
          . I began as a teaching assistant and am now a lead tutor on the
          Front-end, JavaScript and Immersive courses.
        </p>
      </div>
      <div className='content'>
        <h2 className='heading'>Career</h2>
        <ul>
          <li className='strikethrough'>
            <s>
              Support Engineer at{' '}
              <a href='https://www.madetech.com/' title='made tech'>
                Made Tech
              </a>
            </s>
          </li>
          <li>
            <s>
              Junior Web Developer at{' '}
              <a href='https://www.thirtythr.ee/uk' title='thirtythree'>
                33
              </a>
            </s>
          </li>
          <li>
            <s>
              Senior Software Engineer Consultant at{' '}
              <a href='https://red-badger.com/' title='red badger'>
                Red Badger
              </a>
            </s>
          </li>
          <li>
            <s>
              Teacher assistant at{' '}
              <a href='https://ga.co' title='general assembly'>
                General Assembly
              </a>
            </s>
          </li>
          <li>
            Distinguished Faculty Member (fancy name for a tech teacher) at{' '}
            <a href='https://ga.co' title='general assembly'>
              General Assembly
            </a>
          </li>
          <li>
            Tech lead consultant at{' '}
            <a href='https://www.101ways.com/'>101 Ways</a>
          </li>
        </ul>
      </div>
    </>
  );
}
