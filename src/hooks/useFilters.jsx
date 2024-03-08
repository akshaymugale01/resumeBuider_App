import { useQuery } from "react-query";

const useFilters = () => {
    const { data, isLoading, isError, refetch } = useQuery(
        "globalFilter",
        () => ({ searchTerm: "" }), // Set a default initial value
        { refetchOnWindowFocus: false }
    );

    return { data, isLoading, isError, refetch };
};

export default useFilters;