'use client';

import '@/styles/hightlight-atom-one-light.css';

import Head from 'next/head';
import Content from './post.mdx';

export default function Page() {
  return (
    <>
      <Head>
        <title>Installfest</title>
        <meta
          name="description"
          content='"Installfest" is my personal setup to install applications that I
          consider essential for software development'
          key="description"
        />
      </Head>
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
