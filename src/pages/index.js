import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { FaArrowRightLong } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto sm:space-y-16">
      <Head>
        <meta name="description" content="find must read books" />
        <title>shouldreads</title>
      </Head>
      <div className="w-full my-8 md:mt-16">
        <div className="rounded-2xl overflow-hidden border border-zinc-900 bg-black">
          <Image
            src="/tweet.jpeg"
            alt="Logo"
            width={500}
            height={500}
            className="object-cover w-full pt-1"
          />
        </div>
      </div>
      <div className="bg-black pb-2">
        <p className="text-gray-400 text-justify text-base leading-relaxed sm:text-xl">
          Someone posted this on Twitter, and there were so many amazing book
          recommendations. It was overwhelming to keep track of all the titles,
          and I really wanted to know which ones were the best. So, I created
          this website to not only help myself but also to share this treasure
          trove of book recommendations with others. Using some data science +
          ai magic I was able to find the most recommended books from the thread
          and put them all in one place. Enjoy!
        </p>
      </div>
      <Link
        href="/books"
        className="mt-4 px-4 py-2 md:px-8 sm:text-2xl mx-auto max-w-44 sm:max-w-[16rem] justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 flex items-center active:scale-95 transition duration-300"
      >
        go to books <FaArrowRightLong className="inline-block ml-2" />
      </Link>
    </div>
  );
}
