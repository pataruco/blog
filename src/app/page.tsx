export default function Home() {
  return (
    <>
      <div className="content">
        <h1>Pedro Martín Valera</h1>
        <p>Web developer and educator</p>
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
