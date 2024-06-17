import { FaHeart, FaRegComment, FaAmazon } from "react-icons/fa";
import { IoIosStats, IoMdStar } from "react-icons/io";

export const CardSkeleton = () => {
  return (
    <div className="relative h-[182px] sm:h-[214px] p-4 bg-zinc-900/50 rounded-2xl shadow-md border border-zinc-900 hover:border-blue-500 group flex flex-col justify-between md:hover:scale-110 transition duration-500">
      <div className="absolute z-0 blur-3xl h-16 w-16 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500"></div>
      <div className="flex flex-col justify-between h-full animate-pulse">
        <div>
          <div className="sm:h-4 h-5 bg-zinc-700 rounded-lg sm:rounded w-full"></div>
          <div className="h-4 hidden sm:block mt-1 bg-zinc-700 rounded w-5/6"></div>
          <div className="h-4 sm:h-3 mt-2 bg-zinc-700 rounded-lg sm:rounded w-3/5"></div>
        </div>
        <div className="h-4 sm:h-3 bg-zinc-700 rounded-lg sm:rounded w-1/2"></div>
        <div className="h-4 sm:h-3 bg-zinc-700 rounded-lg sm:rounded w-3/4"></div>
        <div className="flex text-sm text-zinc-700 justify-between">
          <div className="flex items-center">
            <FaRegComment className="inline-block mr-1" />
          </div>
          <div className="flex items-center">
            <FaHeart className="inline-block mr-1" />
          </div>
          <div className="flex items-center">
            <IoIosStats className="inline-block mr-1" />
          </div>
          <div className="flex items-center">
            <IoMdStar className="inline-block mr-1" />
          </div>
          <div className="flex sm:hidden items-center">
            <FaAmazon className="inline-block mr-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
