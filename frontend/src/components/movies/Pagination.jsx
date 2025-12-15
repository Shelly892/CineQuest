import { motion } from "framer-motion";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers array (show current page ± 2)
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Maximum pages to display

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Adjust range to always show 5 pages when possible
    if (endPage - startPage < showPages - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + showPages - 1);
      } else {
        startPage = Math.max(1, endPage - showPages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 bg-[#211b27] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#302839] transition-colors flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </motion.button>

      {/* First Page */}
      {pages[0] > 1 && (
        <>
          <PageButton
            page={1}
            currentPage={currentPage}
            onClick={() => handlePageChange(1)}
          />
          {pages[0] > 2 && <span className="text-[#ab9cba] px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <PageButton
          key={page}
          page={page}
          currentPage={currentPage}
          onClick={() => handlePageChange(page)}
        />
      ))}

      {/* Last Page */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-[#ab9cba] px-2">...</span>
          )}
          <PageButton
            page={totalPages}
            currentPage={currentPage}
            onClick={() => handlePageChange(totalPages)}
          />
        </>
      )}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 bg-[#211b27] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#302839] transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </motion.button>
    </div>
  );
}

// Page Button Component
function PageButton({ page, currentPage, onClick }) {
  const isActive = page === currentPage;

  return (
    <motion.button
      whileHover={{ scale: isActive ? 1 : 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors min-w-[40px]
        ${
          isActive
            ? "bg-[#8d25f4] text-white"
            : "bg-[#211b27] text-[#ab9cba] hover:bg-[#302839] hover:text-white"
        }
      `}
    >
      {page}
    </motion.button>
  );
}
