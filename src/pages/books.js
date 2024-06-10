import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

import { FaHeart, FaRegComment, FaAmazon, FaChevronDown } from "react-icons/fa";
import { IoIosStats, IoMdStar } from "react-icons/io";
import { MdClear } from "react-icons/md";

import { init } from "@/utils/db";
import { Searchbar } from "@/components/Searchbar";

export default function Home({ data }) {
  const [results, setResults] = useState(data);
  const [aiToggle, setAiToggle] = useState(false);
  const [filter, setFilter] = useState("");
  const searchPlaceholders = [
    "The Beginning of Infinity",
    "George Orwell",
    "Fyodor Dostoevsky",
    "Fahrenheit 451",
  ];
  const aiPlaceholders = [
    "Books like 1984",
    "Dystopian novels",
    "Books about philosophy",
    "Classic literature",
  ];

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
    if (!aiToggle) {
      handleSearch(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (aiToggle) {
        handleAISearch(e.target.value);
      } else {
        handleSearch(e.target.value);
      }
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    const sortedResults = [...data].sort((a, b) => {
      switch (selectedFilter) {
        case "mentions":
          return b.mentions - a.mentions;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        case "impressions":
          return b.impressions - a.impressions;
        case "ratings":
          return Number(b.ratings) - Number(a.ratings);
        case "topAuthors":
          // Sort by mentions first, then by the number of books
          return (
            b.author_mentions - a.author_mentions ||
            b.author_books - a.author_books
          );
        default:
          return 0;
      }
    });

    setResults(sortedResults);
  };

  const clearFilter = () => {
    setFilter("");
    setResults(data);
  };

  const formatImpressions = (impressions) => {
    return impressions >= 1000
      ? (impressions / 1000).toFixed(1) + "K"
      : impressions;
  };

  return (
    <>
      <div className="sticky top-0 w-full max-w-md z-20 mt-8 md:mt-16">
        <label className="block text-center text-gray-500 mb-2">
          {aiToggle
            ? "what kind of book are you looking for?"
            : "search for a book or an author"}
        </label>
        <Searchbar
          placeholders={aiToggle ? aiPlaceholders : searchPlaceholders}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSubmit={aiToggle ? handleAISearch : handleSearch}
          aiToggle={aiToggle}
          setAiToggle={setAiToggle}
        />
      </div>
      <div className="flex justify-between items-center mt-4 w-full max-w-md transition-transform duration-500">
        <div
          className={clsx(
            "flex items-center sm:min-w-64 px-1.5 py-1 bg-zinc-600/50 text-sm text-gray-400 border rounded-lg border-zinc-700",
            aiToggle && "min-w-[13rem]"
          )}
        >
          <div className="relative flex-1">
            <select
              value={filter}
              onChange={handleFilterChange}
              className={clsx(
                " outline-none appearance-none w-full bg-transparent border-zinc-600",
                aiToggle ? "border-r " : "rounded-lg sm:border-r"
              )}
            >
              <option value="">filters</option>
              <option value="topAuthors">top authors</option>
              <option value="ratings">top ratings</option>
              <option value="mentions">top mentions</option>
              <option value="likes">top likes</option>
              <option value="comments">top comments</option>
              <option value="impressions">top impressions</option>
            </select>
            <FaChevronDown className="absolute right-2 h-2.5 w-2.5 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none" />
          </div>
          <div
            className={clsx(
              "relative",
              aiToggle ? "flex-1" : "hidden sm:block sm:flex-1"
            )}
          >
            <select className="bg-transparent outline-none appearance-none w-full ml-1">
              <option value="">results</option>
              <option value="mentions">10</option>
              <option value="likes">20</option>
              <option value="comments">50</option>
            </select>
            <FaChevronDown className="absolute right-0.5 h-2.5 w-2.5 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={clearFilter}
          className="text-blue-500/80 text-sm rounded-lg flex items-center ml-auto"
        >
          <MdClear className="mr-1" /> clear filters
        </button>
      </div>

      {results && (
        <div className="mt-8 sm:mt-12 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((book, index) => (
            <div
              key={book.id}
              className="relative p-4 bg-zinc-900 rounded-2xl shadow-md border border-zinc-800 hover:border-blue-500 group flex flex-col justify-between md:hover:scale-110 transition duration-500"
            >
              <div
                className="absolute -top-4 -right-4 text-transparent text-4xl font-bold z-10 group-hover:opacity-0 opacity-100 transition-opacity duration-300"
                style={{
                  WebkitTextStroke: "1px #71717a",
                }}
              >
                {(index + 1).toString().padStart(2, "0")}
              </div>
              <div className="flex flex-col justify-between h-full">
                <div className="">
                  <h3 className="text-lg text-zinc-200 font-medium group-hover:text-blue-300 transition-colors duration-500 capitalize">
                    {book.book_title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 group-hover:line-clamp-none">
                    {book.author_name}
                  </p>
                </div>
                <div className="my-4 flex items-center justify-between">
                  <p className="text-sm hidden md:block text-gray-500">
                    Mentions: {book.mentions}
                  </p>
                  <p className="text-sm md:hidden text-gray-500">
                    Mentioned {book.mentions} times
                  </p>
                  <Link
                    href={
                      book.amazon_id
                        ? `https://www.amazon.com/dp/${book.amazon_id}`
                        : `https://www.amazon.com/s?k=${encodeURIComponent(
                            book.book_title
                          )}`
                    }
                    target="_blank"
                    className="bg-gray-600/50 px-2 py-0.5 rounded-md text-gray-400 hover:bg-blue-700 hover:text-gray-300 flex items-center "
                  >
                    <span className="text-sm">
                      <FaAmazon className="inline-block" /> Order
                    </span>
                  </Link>
                </div>
                <div className="flex text-sm text-gray-500 justify-between">
                  <div className="flex items-center">
                    <FaRegComment className="inline-block mr-1" />
                    <span>{book.comments}</span>
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="inline-block mr-1" />
                    <span>{book.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <IoIosStats className="inline-block mr-1" />
                    <span>{formatImpressions(book.impressions)}</span>
                  </div>
                  <div className="flex items-center">
                    <IoMdStar className="inline-block mr-1" />
                    <span>{book.ratings || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const db = init(false);

  const data = db
    .prepare(
      `SELECT id, book_title, author_name, mentions, comments, likes, impressions, amazon_id, olid, ratings, pages,
      (SELECT COUNT(*) FROM aggregated_books AS ab WHERE ab.author_name = aggregated_books.author_name) AS author_books,
      (SELECT SUM(mentions) FROM aggregated_books AS ab WHERE ab.author_name = aggregated_books.author_name) AS author_mentions
      FROM aggregated_books`
    )
    .all();

  db.close();

  return {
    props: {
      data,
    },
  };
}
