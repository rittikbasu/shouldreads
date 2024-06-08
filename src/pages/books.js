import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaAmazon } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";

import { init } from "../../utils/db";

export default function Home({ data }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(data);
  const [aiToggle, setAiToggle] = useState(false);
  const [filter, setFilter] = useState("");

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (aiToggle) {
        handleAISearch(query);
      } else {
        handleSearch(query);
      }
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    const sortedResults = [...results].sort((a, b) => {
      switch (selectedFilter) {
        case "mentions":
          return b.mentions - a.mentions;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "impressions":
          return b.impressions - a.impressions;
        default:
          return 0;
      }
    });

    setResults(sortedResults);
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
      <div className="relative w-full flex justify-center items-center max-w-3xl">
        <Link
          href="/"
          className="absolute left-0 top-1/2 transform -translate-y-1/2"
        >
          <FaArrowLeftLong className="text-blue-400 h-6 w-6 md:h-10 md:w-10" />
        </Link>
        <h1 className="text-zinc-200 text-3xl md:text-5xl font-medium font-mono">
          shouldreads
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center mt-8 md:mt-16 md:mb-8 w-full transition-transform duration-500 ">
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
              onKeyDown={handleKeyDown}
              className="pl-4 pr-1 py-2 md:w-72 w-full bg-zinc-900 border-y border-l border-zinc-800 rounded-l-xl outline-none placeholder:text-gray-500"
              placeholder={aiToggle ? "ai search..." : "search..."}
            />
            <button
              onClick={() =>
                aiToggle ? handleAISearch(query) : handleSearch(query)
              }
              className="px-4 py-2 md:w-24 bg-blue-500 text-zinc-2003 rounded-r-xl hover:bg-blue-600 flex justify-center items-center group"
            >
              <span className="hidden md:block">Search</span>
              <IoSearch className="block md:hidden h-5 w-5 group-active:scale-75 transition duration-300" />
            </button>
          </div>
          <div className="flex justify-between items-center w-full md:w-auto mt-4">
            <div className="relative min-w-32 md:w-auto">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-gray-500 outline-none appearance-none w-full"
              >
                <option value="">filters</option>
                <option value="mentions">top mentions</option>
                <option value="likes">top likes</option>
                <option value="comments">top comments</option>
                <option value="impressions">top impressions</option>
                <option value="ratings">top ratings</option>
              </select>
              <FaChevronDown className="absolute right-1 h-2.5 w-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {aiToggle && (
              <div className="relative min-w-32 md:w-auto">
                <select className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-gray-500 outline-none appearance-none w-full">
                  <option value="">results</option>
                  <option value="mentions">10</option>
                  <option value="likes">20</option>
                  <option value="comments">50</option>
                </select>
                <FaChevronDown className="absolute right-1 h-2.5 w-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            )}
            <div className="flex items-center">
              <span
                className={clsx(
                  "text-gray-500 text-sm mr-2 transition-opacity duration-1000",
                  aiToggle ? "hidden" : "block"
                )}
              >
                AI Search
              </span>
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
