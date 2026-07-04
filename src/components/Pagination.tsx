type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="
          px-4
          py-2
          rounded-lg
          border
          border-zinc-700
          disabled:opacity-40
        "
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            w-10
            h-10
            rounded-lg
            transition
            ${currentPage === page ? "bg-[#D4B08C] text-black" : "bg-zinc-900 hover:bg-zinc-800"}
          `}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
          px-4
          py-2
          rounded-lg
          border
          border-zinc-700
          disabled:opacity-40
        "
      >
        Next →
      </button>
    </div>
  );
}
