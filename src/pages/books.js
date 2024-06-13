import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

import { FaHeart, FaRegComment, FaAmazon, FaChevronDown } from "react-icons/fa";
import { IoIosStats, IoMdStar } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { CiDesktopMouse2 } from "react-icons/ci";

import { turso } from "@/utils/db";
import { Searchbar } from "@/components/Searchbar";
import Modal from "@/components/Modal";

export default function Home({ data }) {
  // console.log(data);
  const [results, setResults] = useState(data);
  const [aiToggle, setAiToggle] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);
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
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );

    // Prioritize results by book title
    const prioritizedResults = filteredResults.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      <button
        onClick={scrollToTop}
        className={clsx(
          "fixed bottom-4 sm:bottom-8 right-4 md:left-[90%] lg:left-[80%] h-12 w-12 flex items-center justify-center bg-blue-500/30 webkit-backdrop-blur text-white p-2 rounded-full shadow-lg sm:hover:bg-blue-600/50 transition duration-500 z-20 outline-none",
          showTopButton ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <CiDesktopMouse2 className="h-8 w-8 text-zinc-300" />
      </button>
      <div className="flex justify-between items-center mt-4 w-full max-w-md transition-transform duration-500 sm:px-1">
        <div className="flex items-center min-w-44 pl-3 pr-1 py-1 bg-zinc-700/50 text-sm text-gray-400 border rounded-lg border-zinc-700/40">
          <div className="relative w-full">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="outline-none appearance-none w-full bg-transparent"
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
        </div>
        <button
          onClick={clearFilter}
          className="text-blue-500/80 text-sm rounded-lg flex items-center ml-auto"
        >
          <MdClear className="mr-1" /> clear filters
        </button>
      </div>

      {results && (
        <div className="mt-10 sm:mt-12 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((book, index) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="relative p-4 bg-zinc-900/50 rounded-2xl shadow-md border border-zinc-900 hover:border-blue-500 group flex flex-col justify-between md:hover:scale-110 transition duration-500"
            >
              <div className="absolute z-0 blur-3xl h-16 w-16 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500"></div>
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
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1 group-hover:line-clamp-none">
                    {book.author}
                  </p>
                  <p className="text-sm text-blue-200 mt-2 line-clamp-1 group-hover:line-clamp-none group-hover:text-zinc-200 transition-colors duration-500">
                    {book.categories}
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
                    href={`https://www.amazon.com/s?k=${encodeURIComponent(
                      book.title
                    )}`}
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
          {selectedBook && (
            <Modal
              book={selectedBook}
              onClose={() => setSelectedBook(null)} // Close the modal
            />
          )}
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const result = await turso.execute(
    `SELECT id, title, subtitle, author, categories, mentions, comments, likes, impressions, ratings, pages,
      (SELECT COUNT(*) FROM aggregated_books AS ab WHERE ab.author = aggregated_books.author) AS author_books,
      (SELECT SUM(mentions) FROM aggregated_books AS ab WHERE ab.author = aggregated_books.author) AS author_mentions
      FROM aggregated_books`
  );

  const data = result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    author: row.author,
    categories: row.categories,
    mentions: row.mentions,
    comments: row.comments,
    likes: row.likes,
    impressions: row.impressions,
    ratings: row.ratings,
    pages: row.pages,
    author_books: row.author_books,
    author_mentions: row.author_mentions,
  }));

  return {
    props: {
      data,
    },
  };
}
