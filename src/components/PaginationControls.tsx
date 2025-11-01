import type { Pagination } from '../pages/Cart/Checkout';

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number | null) => void;
}

const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  const { current_page, total_pages, next_page, previous_page } = pagination;

  // Don't render if there's only one page or no pages
  if (!total_pages || total_pages <= 1) {
    return null;
  }

  const handlePageChange = (page: number | null) => {
    onPageChange(page);
    // Scroll to top of the page when pagination changes
    window.scrollTo({ top: 950, behavior: 'smooth' });
  };

  return (
    <div className="join mt-6 flex justify-center">
      <input
        className="join-item btn btn-square border-black shadow-none" 
        type="radio" 
        name="options" 
        onClick={() => handlePageChange(previous_page)}
        disabled={!previous_page}
        aria-label="❮" 
      />
      {[...Array(total_pages).keys()].map((_, i) => {
        const pageNum = i + 1;
        return (
          <input 
            key={i} 
            className="join-item btn btn-square border-black shadow-none" 
            type="radio" 
            name="options" 
            checked={current_page === pageNum}
            onClick={() => handlePageChange(pageNum)}
            aria-label={`${pageNum}`} 
            readOnly
          />
        );
      })}
      <input
        className="join-item btn btn-square border-black shadow-none" 
        type="radio" 
        name="options" 
        onClick={() => handlePageChange(next_page)}
        disabled={!next_page}
        aria-label="❯" 
      />
    </div>
  );
};

export default PaginationControls;
