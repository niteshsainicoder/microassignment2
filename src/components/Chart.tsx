// components/BarLineChart.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Filter from './Filter'; // Assuming you have a filter component
import useDataContext from '@/app/ContextApi';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { _DeepPartialObject } from 'chartjs-plugin-zoom/types/options';

Chart.register(...registerables, zoomPlugin);

interface DataEntry {
    _id: {
        Gender: string;
        Age: string;
    };
    averageA: number;
    averageB: number;
    averageC: number;
    averageD: number;
    averageE: number;
    averageF: number;
}

type Dataset = {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
};

const BarLineChart: React.FC = () => {
    const { data, filters } = useDataContext();
    const [filterVisible, setFilterVisible] = useState(false);
    const [chartData, setChartData] = useState<{ labels: string[], datasets: Dataset[] }>({
        labels: [],
        datasets: []
    });

    // Generate shareable URL with the current filters
    const generateShareableUrl = useCallback(() => {
        const params = new URLSearchParams();
        params.append('startDate', filters.dateRange.startDate.toString());
        params.append('endDate', filters.dateRange.endDate.toString());
        params.append('age', filters.ageRange.toString());
        params.append('gender', filters.gender.toString());

        const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        console.log(shareableUrl, 'shareable url');
        return shareableUrl;
    }, [filters]);

    // Copy the generated URL to clipboard
    const handleShareClick = () => {
        const shareableUrl = generateShareableUrl();
        if (navigator.share) {
            navigator.share({
                title: 'Chart with Filters',
                url: shareableUrl,
            }).catch((error) => console.error('Error sharing', error));
        } else {
            navigator.clipboard.writeText(shareableUrl)
                .then(() => alert('URL copied to clipboard!'))
                .catch((err) => console.error('Error copying text: ', err));
        }
    };

    useEffect(() => {
        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

        const datasets = data.map((entry: DataEntry) => ({
            label: `${entry._id.Gender} (Age ${entry._id.Age})`,
            data: [
                entry.averageA, entry.averageB, entry.averageC,
                entry.averageD, entry.averageE, entry.averageF
            ],
            borderColor: entry._id.Gender === 'Male' ? '#007bff' : '#ff6384',
            backgroundColor: entry._id.Gender === 'Male' 
                ? (entry._id.Age === '>25' ? '#cce7ff' : '#b3d9ff') 
                : (entry._id.Age === '>25' ? '#ffccf2' : '#ffc1e3'),
            borderWidth: 1,
        }));

        setChartData({
            labels,
            datasets: datasets as Dataset[]
        });

        // Call to generate shareable URL when data updates
        generateShareableUrl();
    }, [data, generateShareableUrl]);

    return (
        <div>
            <div className='m-4 pt-12 flex justify-between'>
                <span 
                    onClick={() => setFilterVisible(!filterVisible)} 
                    className='text-md font-semibold border-[1px] border-gray-400 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 antialiased'
                >
                    Filter
                </span>
                <span 
                    onClick={handleShareClick} 
                    className='text-md font-semibold border-[1px] border-gray-400 px-4 rounded-md bg-transparent hover:bg-gray-300 text-gray-700 antialiased'
                >
                    Share ↗
                </span>
            </div>
            {filterVisible && (
                <div className='transalate-x-[0] sm:p-7 mt-14 translate-y-[-20%] sm:translate-y-[-25%] max-w-screen sm:w-fit h-full absolute z-40 overflow-hidden'>
                    <Filter setfilter={setFilterVisible} />
                </div>
            )}
            <div className='flex justify-center flex-wrap'>
                <div className='flex flex-wrap'>
                    <Bar
                        data={chartData}
                        options={{
                            maintainAspectRatio: true,
                            indexAxis: 'y' as const,
                            elements: {
                                bar: {
                                    borderWidth: 1,
                                },
                            },
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Bar Chart',
                                },
                                zoom: {
                                    pan: {
                                        enabled: true,
                                        mode: 'x' as string,
                                    },
                                    zoom: {
                                        enabled: true,
                                        mode: 'x' as string,
                                    }
                                } as _DeepPartialObject<ZoomPluginOptions>
                            },
                        }}
                        height={400}
                    />
                </div>
                <div className='flex flex-wrap'>
                    <Line 
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: 'Line Chart',
                                },
                                zoom: {
                                    pan: {
                                        enabled: true,
                                        mode: 'x' as string,
                                    },
                                    zoom: {
                                        enabled: true,
                                        mode: 'x' as string,
                                    }
                                } as _DeepPartialObject<ZoomPluginOptions>
                            },
                        }} 
                        height={400}
                    />
                </div>
            </div>
        </div>
    );
};

export default BarLineChart;
