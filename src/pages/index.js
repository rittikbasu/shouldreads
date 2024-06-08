import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaAmazon } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import { init } from "../../utils/db";

export default function Home({ data }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(data);
  const [aiToggle, setAiToggle] = useState(false);

  const handleSearch = (query) => {
    const filteredResults = data.filter(
      (book) =>
        book.book_title.toLowerCase().includes(query.toLowerCase()) ||
        book.author_name.toLowerCase().includes(query.toLowerCase())
    );

    // Prioritize results by book title
    const prioritizedResults = filteredResults.sort((a, b) => {
      const aTitleMatch = a.book_title
        .toLowerCase()
        .includes(query.toLowerCase());
      const bTitleMatch = b.book_title
        .toLowerCase()
        .includes(query.toLowerCase());
      return bTitleMatch - aTitleMatch;
    });

    setResults(prioritizedResults);
  };

  const handleAISearch = async (query) => {
    console.log(query);
    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching data");
    }
    const responseData = await response.json();

    const responseIds = responseData.map((item) => item.rowid);
    const distanceMap = new Map(
      responseData.map((item) => [item.rowid, item.distance])
    );

    const filteredResults = data
      .filter((item) => responseIds.includes(item.id))
      .sort((a, b) => distanceMap.get(a.id) - distanceMap.get(b.id));

    setResults(filteredResults);
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (!aiToggle) {
      handleSearch(newQuery);
    }
  };

  const formatImpressions = (impressions) => {
    return impressions >= 1000
      ? (impressions / 1000).toFixed(1) + "K"
      : impressions;
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-8 pb-8 pt-4 md:pt-8">
      <Head>
        <meta name="description" content="find must read books" />
        <title>shouldreads</title>
      </Head>
      <h1 className="text-zinc-200 text-3xl md:text-5xl font-medium font-mono">
        shouldreads
      </h1>
      <div className="w-full max-w-3xl my-8 md:mt-16">
        <div className="rounded-t-2xl overflow-hidden border border-b-0 border-zinc-800">
          <Image
            src="/tweet.jpeg"
            alt="Logo"
            width={500}
            height={500}
            className="object-cover pt-1"
          />
        </div>
        <div className="bg-black px-4 pb-2 rounded-b-2xl border border-t-0 border-zinc-800">
          <p className="text-gray-500 text-justify text-sm md:text-base">
            someone posted this on twitter and people gave a lot of good book
            recommendations. But it was hard to keep track of all the books
            mentioned. So I made this website to help you find the books
            mentioned in the thread using some data science + ai magic
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center md:my-8 w-full transition-transform duration-500 ">
        <label className="block text-gray-500 mb-2">
          {aiToggle
            ? "what kind of book are you looking for?"
            : "search for a book or an author"}
        </label>
        <div className="flex flex-col w-full md:w-auto sticky top-0">
          <div className="flex w-full">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              className="pl-4 pr-1 py-2 md:w-72 w-full bg-zinc-900 border-y border-l border-zinc-800 rounded-l-xl outline-none placeholder:text-gray-500"
              placeholder={aiToggle ? "search..." : "search..."}
            />
            <button
              onClick={() =>
                aiToggle ? handleAISearch(query) : handleSearch(query)
              }
              className="px-4 py-2 md:w-24 bg-blue-500 text-zinc-2003 rounded-r-xl hover:bg-blue-600 flex justify-center items-center"
            >
              <span className="hidden md:block">Search</span>
              <IoSearch className="block md:hidden h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center w-full md:w-auto mt-4">
            <span className="text-gray-500 text-sm mr-2">AI Search</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiToggle}
                onChange={() => setAiToggle(!aiToggle)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      {results && (
        <div className="mt-8 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <div
              key={result.id}
              className="relative p-4 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 hover:border-blue-500 transition-colors duration-300 group flex flex-col justify-between"
            >
              <div className="absolute -top-[0.07rem] -right-[0.06rem] bg-zinc-800 border border-zinc-700 text-zinc-200 w-10 rounded-tr-2xl rounded-bl text-sm text-center">
                {index + 1}
              </div>
              <div className="flex flex-col justify-between h-full">
                <div className="">
                  <h3 className="text-lg text-zinc-200 font-medium group-hover:text-blue-300 transition-colors duration-300 capitalize">
                    {result.book_title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 group-hover:line-clamp-none">
                    {result.author_name}
                  </p>
                </div>
                <div className="my-4 flex items-center justify-between">
                  <p className="text-sm hidden md:block text-gray-500">
                    Mentions: {result.mentions}
                  </p>
                  <p className="text-sm md:hidden text-gray-500">
                    Mentioned {result.mentions} times
                  </p>
                  <Link
                    href={`https://www.amazon.com/dp/${result.amazon_id}`}
                    target="_blank"
                    className="bg-blue-950/60 px-2 py-0.5 rounded-md text-gray-500 hover:bg-blue-900 hover:text-gray-300 flex items-center "
                  >
                    <span className="text-sm">
                      <FaAmazon className="inline-block" /> Order
                    </span>
                  </Link>
                </div>
                <div className="flex text-sm text-gray-500 justify-between">
                  <div className="flex items-center">
                    <FaRegComment className="inline-block mr-1" />
                    <span>{result.comments}</span>
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="inline-block mr-1" />
                    <span>{result.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <IoIosStats className="inline-block mr-1" />
                    <span>{formatImpressions(result.impressions)}</span>
                  </div>
                  <div className="flex items-center">
                    <IoMdStar className="inline-block mr-1" />
                    <span>{result.ratings || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const db = init(false);

  const data = db
    .prepare(
      "SELECT id, book_title, author_name, mentions, comments, likes, impressions, amazon_id, olid, ratings, pages FROM aggregated_books"
    )
    .all();

  db.close();

  return {
    props: {
      data,
    },
  };
}
