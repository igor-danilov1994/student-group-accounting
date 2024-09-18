import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

interface UrlState {
  searchTerm?: string;
  minDate?: string;
  maxDate?: string;
  orderBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export const useUrlState = (initialState?: UrlState) => {
  const searchParams = useSearchParams();
  const [urlState, setUrlState] = useState<UrlState | undefined>(initialState);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (!isInitialRender.current) return;

    const query = Object.fromEntries(searchParams.entries());

    const newState: UrlState = {
      searchTerm: query.searchTerm || '',
      minDate: query.minDate || undefined,
      maxDate: query.maxDate || undefined,
      orderBy: query.orderBy || initialState?.orderBy,
      order: (query.order as 'asc' | 'desc') || initialState?.order,
      page: query.page
        ? parseInt(query.page as string, 10)
        : initialState?.page,
      rowsPerPage: query.rowsPerPage
        ? parseInt(query.rowsPerPage as string, 10)
        : initialState?.rowsPerPage,
    };

    setUrlState(newState);

    isInitialRender.current = false;
  }, [searchParams, initialState]);

  const updateUrlState = useCallback(
    (newState: Partial<UrlState>) => {
      const updatedState = { ...urlState, ...newState };

      const formattedState = {
        ...updatedState,
        minDate: updatedState.minDate
          ? dayjs(updatedState.minDate).format('YYYY-MM-DD')
          : undefined,
        maxDate: updatedState.maxDate
          ? dayjs(updatedState.maxDate).format('YYYY-MM-DD')
          : undefined,
      };

      if (JSON.stringify(urlState) !== JSON.stringify(formattedState)) {
        setUrlState(formattedState);

        const searchParams = new URLSearchParams();
        Object.entries(formattedState).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, value.toString());
          }
        });

        const newUrl = `?${searchParams.toString()}`;
        if (window.location.search !== newUrl) {
          window.history.replaceState(null, '', newUrl);
        }
      }
    },
    [urlState]
  );

  return { urlState: urlState || initialState, updateUrlState };
};
