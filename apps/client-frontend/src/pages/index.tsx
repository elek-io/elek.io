import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Button, Page } from 'ui';

const Home: NextPage = () => {
  const getCount = async () => {
    const count = await window.ipc.core.projects.count();
    console.log('Next.js count from core', count);
  };

  return <Page title="My first page">Page Test</Page>;
};

export default Home;
