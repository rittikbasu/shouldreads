import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosArrowRoundBack } from "react-icons/io";

const Modal = ({ book, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (book) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";

      fetch(`/api/getDescription?gbooks_id=${book.gbooks_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.description) {
            setDescription(data.description);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching book description:", error);
          setLoading(false);
        });
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 500);
    }
  }, [book]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      document.body.style.overflow = "unset";
    }, 500);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!book) return null;

  return (
    <div
      className={`fixed inset-0 bg-black webkit-backdrop-blur bg-opacity-50 z-50 flex justify-center pt-8 sm:pt-0 sm:items-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        transition: "transform 500ms ease-in-out",
        transform: isVisible
          ? isClosing
            ? "translateY(100%)"
            : "translateY(0)"
          : "translateY(100%)",
      }}
      onClick={handleBackdropClick}
    >
      <div className="bg-zinc-800/50 sm:rounded-3xl rounded-t-3xl max-w-2xl sm:h-4/6 w-full overflow-hidden relative sm:pb-[6.4rem] sm:mx-8">
        <div
          className="flex items-center cursor-pointer px-4 sm:pl-8 my-4 text-blue-500 sm:hover:text-blue-600"
          onClick={handleClose}
        >
          <IoIosArrowRoundBack className="h-8 w-8" />
          <span className="ml-2 text-lg">back</span>
        </div>
        <div className="h-full overflow-scroll px-8 sm:px-10 pb-20 sm:pb-32">
          <h2 className="text-2xl sm:text-3xl text-zinc-200 pb-4 capitalize">
            {book.title}
          </h2>
          {book.subtitle && (
            <h4 className="sm:text-2xl text-zinc-300 pb-4 sm:pb-8 capitalize">
              {book.subtitle}
            </h4>
          )}
          <div className="flex flex-row space-x-4 sm:space-x-8">
            <div className="py-3">
              {imageLoading && (
                <div className="w-28 h-40 bg-zinc-700 rounded-lg animate-pulse"></div>
              )}
              <Image
                src={`https://books.google.com/books/content?id=${book.gbooks_id}&printsec=frontcover&img=1&zoom=1&edge=none&source=gbs_api`}
                alt={`${book.title} cover`}
                width={100}
                height={150}
                className={`border border-zinc-700 rounded-lg min-h-40 min-w-28 max-h-40 max-w-28 ${
                  imageLoading ? "hidden" : "block"
                }`}
                onLoad={() => setImageLoading(false)}
                priority
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="p-2 rounded-lg">
                <h4 className="sm:text-xl text-zinc-500">Author</h4>
                <p className="text-xl sm:text-3xl">{book.author || "N/A"}</p>
              </div>
              {book.categories && (
                <div className="p-2 rounded-lg">
                  <p className="sm:text-xl text-zinc-500">Genre</p>
                  <p className="text-xl sm:text-3xl">{book.categories}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex py-6 sm:text-lg rounded-xl justify-between max-w-sm">
            <div className="text-gray-400">Mentioned: {book.mentions}</div>
            {book.ratings && (
              <p className="text-gray-400">Rating: {book.ratings}</p>
            )}
            <div className="text-gray-400">Pages: {book.pages || "N/A"}</div>
          </div>
          <div className="sm:space-y-4">
            <h4 className="sm:text-2xl text-xl text-zinc-500 mb-2">
              Description
            </h4>
            {loading ? (
              <div className="space-y-4 mt-2">
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-5/6"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-5/6"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-full"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-3/5"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-5/6"></div>
                <div className="h-4 animate-pulse bg-zinc-700 rounded w-full"></div>
              </div>
            ) : (
              <p
                className="text-base sm:text-xl font-light text-zinc-300 tracking-wide"
                style={{ wordSpacing: "0.4em" }}
              >
                {description || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
