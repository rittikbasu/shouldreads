import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import path from "path";

import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaAmazon } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

import sqlite3 from "sqlite3";

export default function Home({ data }) {
  // console.log(data);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(data);

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

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const formatImpressions = (impressions) => {
    return impressions >= 1000
      ? (impressions / 1000).toFixed(1) + "K"
      : impressions;
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-8 pb-8 pt-4 md:pt-8">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <h1 className="text-zinc-200 text-3xl md:text-5xl font-bold font-mono">
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
        {/* <label className="block text-gray-500 mb-2 text-center">
          what kind of book are you looking for?
        </label> */}
        <div className="flex w-full md:w-auto">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="px-4 py-2 md:w-72 w-full bg-zinc-900 border-y border-l border-zinc-800 rounded-l-xl outline-none"
            placeholder="search for a book or an author"
          />
          <button
            onClick={() => handleSearch(query)}
            className="px-4 py-2 md:w-24 bg-blue-500 text-white rounded-r-xl hover:bg-blue-600 flex justify-center items-center"
          >
            <span className="hidden md:block">Search</span>
            <IoSearch className="block md:hidden h-5 w-5" />
          </button>
        </div>
      </div>
      {results && (
        <div className="mt-8 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <div
              key={index}
              className="relative p-4 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 hover:border-blue-500 transition-colors duration-300 group flex flex-col justify-between"
            >
              <div className="flex flex-col justify-between h-full">
                <div className="">
                  <h3 className="text-lg text-zinc-200 font-medium group-hover:text-blue-300 transition-colors duration-300 capitalize">
                    {result.book_title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 group-hover:line-clamp-none">
                    {result.author_name}
                  </p>
                </div>
                <div className="my-4">
                  <p className="text-sm text-gray-500">
                    Mentioned {result.mentions} times
                  </p>
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
  async function openDB() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(process.cwd(), "public", "output.db");
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  }

  const db = await openDB();

  const data = await new Promise((resolve, reject) => {
    db.all(
      "SELECT book_title, author_name, mentions, comments, likes, impressions, amazon_id, olid, ratings, pages FROM aggregated_books",
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });

  db.close();

  return {
    props: {
      data,
    },
  };
}
