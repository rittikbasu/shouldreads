import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosArrowRoundBack } from "react-icons/io";

const Modal = ({ book, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (book) {
      setIsVisible(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";

      // Fetch book description
      fetch(`/api/getDescription?bookId=${book.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.description) {
            setDescription(data.description);
          }
        })
        .catch((error) => {
          console.error("Error fetching book description:", error);
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
      className={`fixed inset-0 bg-black webkit-backdrop-blur bg-opacity-50 z-50 flex justify-center pt-8 sm:items-center transition-opacity duration-300 ${
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
      <div className="bg-zinc-800/50 sm:rounded-3xl rounded-t-3xl max-w-4xl sm:h-5/6 w-full overflow-hidden relative">
        <div
          className="sm:hidden flex items-center cursor-pointer sm:px-8 px-4 my-4 text-blue-500 hover:text-blue-300"
          onClick={handleClose}
        >
          <IoIosArrowRoundBack className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="ml-2 sm:text-lg">back</span>
        </div>
        <div
          className="hidden sm:flex top-3.5 left-0 items-center cursor-pointer sm:px-8 px-4 my-4 text-blue-500 hover:text-blue-300"
          onClick={handleClose}
        >
          <IoIosArrowRoundBack className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="ml-2 sm:text-xl">back</span>
        </div>
        <div className="h-full overflow-scroll px-4 sm:px-12 pb-20 sm:pb-32">
          <h2 className="text-2xl sm:text-3xl text-center text-zinc-200 pl-2 pb-8">
            {book.title}
          </h2>
          <div className="flex flex-row space-x-4 sm:space-x-8">
            <div className="py-3">
              <Image
                src={`http://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
                alt={`${book.title} cover`}
                width={100}
                height={150}
                className="border border-zinc-700 rounded-lg min-h-40 min-w-28 max-h-40 max-w-28"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="p-2 rounded-lg">
                <h4 className="sm:text-xl text-zinc-500">Author</h4>
                <p className="text-xl sm:text-3xl">{book.author}</p>
              </div>
              {book.categories && (
                <div className="p-2 rounded-lg">
                  <h4 className="sm:text-xl text-zinc-500">Genre</h4>
                  <p className="text-xl sm:text-3xl">{book.categories}</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-2 rounded-lg mt-4 sm:space-y-4">
            <h4 className="sm:text-2xl text-zinc-500">Description</h4>
            <p className="text-lg sm:text-xl font-light text-zinc-300 tracking-widest">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
