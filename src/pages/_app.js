import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Work_Sans } from "next/font/google";
import clsx from "clsx";
import "@/styles/globals.css";

import { FaArrowLeftLong } from "react-icons/fa6";

import { GradientIcon } from "@/components/GradientIcon";

const work_sans = Work_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <div
      className={clsx(
        work_sans.className,
        "flex flex-col min-h-screen relative max-w-3xl mx-auto"
      )}
    >
      <Head>
        <meta
          name="description"
          content="find the most important books from a twitter thread"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>shouldreads</title>
      </Head>
      <header className="flex justify-center items-center w-full max-w-3xl mx-auto py-4 sm:py-8 relative">
        {router.pathname !== "/" && (
          <Link
            href="/"
            className="absolute left-8 sm:left-0 top-[63%] transform -translate-y-1/2"
          >
            <GradientIcon
              IconComponent={FaArrowLeftLong}
              svgClassName="w-10 h-10 sm:h-16 sm:w-16"
              viewBox={"0 0 30 30"}
            />
          </Link>
        )}
        <h1 className="text-3xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 via-zinc-100 to-zinc-500 font-mono font-medium">
          shouldreads
        </h1>
        <div className="flex place-items-center absolute -top-[12rem] left-1/2 transform -translate-x-1/2 -z-10 before:h-[300px] before:w-[300px] before:translate-x-0 before:rounded-full before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[240px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700/10 after:from-sky-900 after:via-[#0141ff]/40 before:lg:h-[360px]"></div>
      </header>
      <main className="flex-grow flex flex-col items-center px-8 pb-8 pt-4 sm:pt-8">
        <Component {...pageProps} />
      </main>
      <footer className="my-4 text-center text-sm sm:text-base text-zinc-500 font-mono">
        <Link
          target="_blank"
          href="https://twitter.com/_rittik"
          className="group"
        >
          <span>
            by <span className="group-hover:text-blue-300">@_rittik</span>
          </span>
        </Link>
      </footer>
    </div>
  );
}
