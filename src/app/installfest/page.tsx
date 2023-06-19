'use client';

import '@/styles/hightlight-atom-one-light.css';

import Content from './post.mdx';

export default function Page() {
  return (
    <>
      <div className="content">
        <h1>Installfest</h1>
        <p>
          "Installfest" is my personal setup to install applications that I
          consider essential for software development.
        </p>
      </div>
      <Content />
    </>
  );
}
