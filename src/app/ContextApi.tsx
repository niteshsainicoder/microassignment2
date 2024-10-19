'use client';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define types for data, filters, and context value
interface Filter {
    ageRange: string;
    gender: string;
    dateRange: { startDate: number; endDate: number };
}

interface DataContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]; // Adjust the type based on your actual data structure
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    logedin: boolean;
    setlogedin: React.Dispatch<React.SetStateAction<boolean>>
}

// Create context with the correct types
export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any[]>([]); // Adjust the type based on your data
    const [filters, setFilters] = useState<Filter>({
        ageRange: '',
        gender: '',
        dateRange: { startDate: 44838, endDate: 44864 },
    });
    const [logedin, setlogedin] = useState<boolean>(false)

    // Function to fetch aggregated data from your server-side pipeline
    const fetchAggregatedData = async () => {
        try {


            await fetch(`http://localhost:3000/api/data?age=${filters.ageRange}&gender=${filters.gender}&startDate=${filters.dateRange.startDate}&endDate=${filters.dateRange.endDate}`, {
                method: 'GET',
            }).then((res) => res.json()).then((res) => setData(res)).catch((err) => console.log(err));
        } catch (error) {
            console.error('Error fetching aggregated data:', error);
        }
    };

    // Fetch data when filters change
    useEffect(() => {
        fetchAggregatedData();
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        console.log(data, "fetched data")
    }, [data])
    useEffect(() => {
        if (localStorage.getItem('filters') && filters.ageRange === '' && filters.gender === '' && filters.dateRange.startDate === 44838 && filters.dateRange.endDate === 44864) {
            setFilters(JSON.parse(localStorage.getItem('filters') || '{}'))

        }
    }, [])
    return (
        <DataContext.Provider value={{ data, filters, setFilters, logedin, setlogedin }}>
            {children}
        </DataContext.Provider>
    );
};

export default function useDataContext() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
}