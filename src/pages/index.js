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
      <div className="w-full my-8 sm:mt-16">
        <Link
          target="_blank"
          href="https://x.com/amix011/status/1797696341738688557"
        >
          <div className="rounded-xl sm:rounded-3xl overflow-hidden border border-zinc-900 bg-black min-h-28 md:min-h-56 lg:min-h-64">
            <Image
              src="/tweet.jpeg"
              alt="Logo"
              width={500}
              height={500}
              className="object-cover w-full p-2 pb-1.5 sm:p-4 sm:pb-3"
            />
          </div>
        </Link>
      </div>
      <div className="bg-black pb-2">
        <p className="text-gray-400 text-justify text-balance text-base leading-relaxed sm:text-xl">
          I came across this post on twitter with tons of really good book
          recommendations in the comments. It was hard to keep track of all the
          titles, and I wanted to see which books, authors and genres were
          mentioned the most, which ones were top rated, and which ones people
          liked the most. So, I compiled all the book recommendations using some
          data science + AI magic and built this website to share these great
          book finds with everyone. Enjoy!
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
