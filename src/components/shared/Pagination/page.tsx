import React from 'react'
import { ArrowRight, ArrowLeft } from "lucide-react";

interface PaginationProps {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({ page = 1, totalPages = 1, onPageChange }: PaginationProps) => {
  const handlePrev = () => {
    if (page > 1) {
      onPageChange?.(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange?.(page + 1);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        disabled={page <= 1}
        className={page <= 1 ? "p-2 disabled:opacity-50 disabled:cursor-not-allowed" : "p-2 hover:text-gray-600 cursor-pointer"}
        onClick={handlePrev}
      >
        <ArrowLeft />
      </button>

      <span>Page {page} of {totalPages}</span>

      <button
        disabled={page >= totalPages}
        className={page >= totalPages ? "p-2 disabled:opacity-50 disabled:cursor-not-allowed" : "p-2 hover:text-gray-600 cursor-pointer"}
        onClick={handleNext}
      >
        <ArrowRight />
      </button>
    </div>
  );
};
