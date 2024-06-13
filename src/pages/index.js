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
        <div className="rounded-xl sm:rounded-3xl overflow-hidden border border-zinc-900 bg-black">
          <Image
            src="/tweet.jpeg"
            alt="Logo"
            width={500}
            height={500}
            className="object-cover w-full p-2 pb-1.5 sm:p-4 sm:pb-3"
          />
        </div>
      </div>
      <div className="bg-black pb-2">
        <p className="text-gray-400 text-justify text-balance text-base leading-relaxed sm:text-xl">
          I came across this post on twitter and under it I found so many
          amazing book recommendations. It was overwhelming to keep track of all
          the titles, and I really wanted to know which books and authors were
          mentioned the most, what were the top rated books, and which books
          were liked the most. So, I created this website using some data
          science + ai magic to not only help myself but also to share this
          treasure trove of book recommendations with others. Enjoy!
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
