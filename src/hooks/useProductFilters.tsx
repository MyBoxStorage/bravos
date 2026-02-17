import { useState, useMemo, useCallback } from 'react';
import type { Product, Category, Size, Color, Gender, SortOption } from '@/types';

interface Filters {
  category: Category;
  gender: '' | Gender;
  sizes: Size[];
  colors: Color[];
  priceRange: [number, number] | null;
}

interface UseProductFiltersReturn {
  filters: Filters;
  sortBy: SortOption;
  setCategory: (category: Category) => void;
  setGender: (gender: '' | Gender) => void;
  toggleSize: (size: Size) => void;
  toggleColor: (color: Color) => void;
  setPriceRange: (range: [number, number] | null) => void;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;
  filteredProducts: Product[];
  hasActiveFilters: boolean;
}

const initialFilters: Filters = {
  category: 'all',
  gender: '',
  sizes: [],
  colors: [],
  priceRange: null,
};

export function useProductFilters(products: Product[]): UseProductFiltersReturn {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('bestsellers');

  const setCategory = useCallback((category: Category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setGender = useCallback((gender: '' | Gender) => {
    setFilters((prev) => ({ ...prev, gender }));
  }, []);

  const toggleSize = useCallback((size: Size) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }, []);

  const toggleColor = useCallback((color: Color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  }, []);

  const setPriceRange = useCallback((range: [number, number] | null) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortBy('bestsellers');
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Apply gender filter (unissex appears in all gender filters)
    if (filters.gender) {
      result = result.filter((p) => {
        if (p.gender === 'unissex') return true;
        return p.gender === filters.gender;
      });
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s as Size))
      );
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c as Color))
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'bestsellers':
      default:
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== 'all' ||
      filters.gender !== '' ||
      filters.sizes.length > 0 ||
      filters.colors.length > 0 ||
      filters.priceRange !== null
    );
  }, [filters]);

  return {
    filters,
    sortBy,
    setCategory,
    setGender,
    toggleSize,
    toggleColor,
    setPriceRange,
    setSortBy,
    clearFilters,
    filteredProducts,
    hasActiveFilters,
  };
}
