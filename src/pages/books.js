import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import Minisearch from "minisearch";

import { FaHeart, FaRegComment, FaAmazon, FaChevronDown } from "react-icons/fa";
import { IoIosStats, IoMdStar } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { CiDesktopMouse2 } from "react-icons/ci";

import { turso } from "@/utils/db";
import { sortResultsByFilter } from "@/utils/sortResultsByFilter";
import { Searchbar } from "@/components/Searchbar";
import Modal from "@/components/Modal";
import { CardSkeleton } from "@/components/CardSkeleton";

export default function Home({ data }) {
  const [results, setResults] = useState(data);
  const [aiToggle, setAiToggle] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [amazonTLD, setAmazonTLD] = useState("com");
  const [loading, setLoading] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const searchPlaceholders = [
    "The Beginning of Infinity",
    "Philosophy",
    "Fyodor Dostoevsky",
    "Fahrenheit 451",
  ];
  const aiPlaceholders = [
    "Books like 1984",
    "Dystopian novels",
    "Books about philosophy",
    "Classic literature",
  ];

  const miniSearch = new Minisearch({
    fields: ["title", "author", "categories"],
    storeFields: ["id"],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
    },
  });

  miniSearch.addAll(data);

  const handleSearch = (query) => {
    if (!query) {
      setResults(data);
      return;
    }

    const searchResults = miniSearch.search(query);
    const resultIds = searchResults.map((result) => result.id);
    let filteredResults = resultIds.map((id) =>
      data.find((book) => book.id === id)
    );

    if (filter) {
      filteredResults = sortResultsByFilter(filteredResults, filter);
    }

    setResults(filteredResults);
  };

  const handleAISearch = async (query) => {
    if (query === lastSearchTerm || query.length < 5) return;

    setFilter("");
    setLoading(true);
    const response = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching data");
      return;
    }

    const responseData = await response.json();
    const responseIds = responseData.map((item) => item.id);

    let filteredResults = responseIds
      .map((id) => data.find((item) => item.id === id))
      .filter((item) => item !== undefined);

    setLoading(false);
    setResults(filteredResults);
    setLastSearchTerm(query);
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

    let sortedResults = [...results];
    if (selectedFilter) {
      sortedResults = sortResultsByFilter(sortedResults, selectedFilter);
    }

    setResults(sortedResults);
  };

  const clearFilter = () => {
    setFilter("");
    const sortedResults = [...results].sort((a, b) => a.id - b.id);
    setResults(sortedResults);
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

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/getAmazonTLD`);
        const data = await response.json();
        setAmazonTLD(data.tld);
      } catch (error) {
        console.error("Error fetching Amazon domain:", error);
      }
    })();
  }, []);

  return (
    <>
      <div className="sticky top-0 w-full max-w-md z-20 mt-8 md:mt-16">
        <label className="block text-center text-gray-500 mb-2">
          {aiToggle
            ? "what kind of book are you looking for?"
            : "search for a book, author or a genre"}
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
          "fixed bottom-4 sm:bottom-8 right-4 md:left-[90%] lg:left-[80%] h-12 w-12 flex items-center justify-center bg-zinc-500/30 webkit-backdrop-blur p-2 rounded-full transition-opacity duration-500 z-20 outline-none group",
          showTopButton ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <CiDesktopMouse2 className="h-8 w-8 text-blue-400 group-hover:text-blue-500" />
      </button>
      <div className="flex justify-between items-center mt-4 w-full max-w-md transition-transform duration-500 sm:px-1">
        <div className="flex items-center min-w-44 pl-3 pr-1 py-1 bg-zinc-700/50 text-sm text-gray-400 border rounded-lg border-zinc-700/40">
          <div className="relative w-full">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="outline-none appearance-none w-full bg-transparent"
            >
              <option value="" disabled>
                filters
              </option>
              <option value="topAuthors">top authors</option>
              <option value="ratings">top rated</option>
              <option value="mentions">most mentioned</option>
              <option value="likes">most liked</option>
              <option value="comments">most commented</option>
              <option value="impressions">most seen</option>
            </select>
            <FaChevronDown className="absolute right-2 h-2.5 w-2.5 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={() => filter && clearFilter()}
          className="text-blue-500/80 text-sm rounded-lg flex items-center ml-auto"
        >
          <MdClear className="mr-1" /> clear filters
        </button>
      </div>

      {results.length > 0 ? (
        <div className="mt-10 sm:mt-12 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : results.map((book, index) => (
                <div
                  key={book.id}
                  onClick={() => book.gbooks_id && setSelectedBook(book)}
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
                      <p className="text-sm text-gray-500 line-clamp-1 sm:group-hover:line-clamp-none">
                        {book.author}
                      </p>
                      <p className="text-sm text-blue-200 mt-2 line-clamp-1 group-hover:line-clamp-none group-hover:text-zinc-200 transition-colors duration-500">
                        {book.categories}
                      </p>
                      {!book.gbooks_id && (
                        <p className="text-sm text-red-500 mt-2">
                          Data unavailable
                        </p>
                      )}
                    </div>
                    <div className="my-4 flex items-center justify-between">
                      <p className="text-sm hidden md:block text-gray-500">
                        Mentions: {book.mentions}
                      </p>
                      <p className="text-sm md:hidden text-gray-500">
                        Mentioned {book.mentions} times
                      </p>
                      <Link
                        href={`https://www.amazon.${amazonTLD}/s?k=${encodeURIComponent(
                          book.title
                        )}`}
                        target="_blank"
                        className="bg-gray-600/50 px-2 py-0.5 rounded-md text-gray-400 hover:bg-blue-700 hover:text-gray-300 hidden sm:flex items-center"
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
                      <Link
                        href={`https://www.amazon.${amazonTLD}/s?k=${encodeURIComponent(
                          book.title
                        )}`}
                        target="_blank"
                        className="flex sm:hidden items-center"
                      >
                        <FaAmazon className="inline-block mr-1" />
                        <span>Buy</span>
                      </Link>
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
      ) : (
        <div className="text-blue-400 mt-8 sm:text-lg sm:tracking-wide">
          there are no results for this query but here are some insights from
          all this data:
          <ul
            className="list-decimal mt-4 ml-4 text-gray-400 space-y-2"
            style={{ wordSpacing: "0.2em" }}
          >
            <li>
              people seem to love books that offer timeless wisdom, practical
              advice, and captivating stories.
            </li>
            <li>
              classics like{" "}
              <span className="underline underline-offset-2">Meditations</span>{" "}
              and{" "}
              <span className="underline underline-offset-2">
                The 48 Laws of Power
              </span>{" "}
              are hits because they provide guidance that&apos;s still relevant
              today.
            </li>
            <li>
              science and history books like{" "}
              <span className="underline underline-offset-2">Sapiens</span> and{" "}
              <span className="underline underline-offset-2">
                A Short History of Nearly Everything
              </span>{" "}
              show that there&apos;s a big interest in understanding the world
              and our place in it.
            </li>
            <li>
              interestingly,{" "}
              <span className="underline underline-offset-2">
                philosophical
              </span>{" "}
              books appear a lot, suggesting that people are searching for
              deeper meaning and ways to navigate life&apos;s big questions.
            </li>
            <li>
              there&apos;s also a noticeable interest in specialized knowledge,
              like tech and business skills.
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const result = await turso.execute(
    `SELECT id, gbooks_id, title, subtitle, author, categories, mentions, comments, likes, impressions, ratings, pages,
      (SELECT COUNT(*) FROM aggregated_books AS ab WHERE ab.author = aggregated_books.author) AS author_books,
      (SELECT SUM(mentions) FROM aggregated_books AS ab WHERE ab.author = aggregated_books.author) AS author_mentions
      FROM aggregated_books`
  );

  const data = result.rows.map((row) => ({
    id: row.id,
    gbooks_id: row.gbooks_id,
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
