/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Filter from './Filter';
import useDataContext from '@/app/ContextApi';
import zoomPlugin from 'chartjs-plugin-zoom'; // Correct import
// Correct registration of Chart.js plugins
Chart.register(...registerables, zoomPlugin);

type Dataset = {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
};

const BarLineChart: React.FC = () => {
    const { data, filters } = useDataContext();
    const [filter, setFilter] = useState(false);
    const [chartData, setChartData] = useState<{ labels: string[]; datasets: Dataset[] }>({
        labels: [],
        datasets: []
    });

    const generateShareableUrl = useCallback(() => {
        const params = new URLSearchParams();
        if (filters.dateRange) {
            params.append('startDate', filters.dateRange.startDate.toString());
            params.append('endDate', filters.dateRange.endDate.toString());
        }
        if (filters.ageRange) {
            params.append('age', filters.ageRange.toString());
        }
        if (filters.gender) {
            params.append('gender', filters.gender.toString());
        }

        const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        console.log(shareableUrl, 'shareable url');
        return shareableUrl;
    }, [filters]);

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

        const datasets: Dataset[] = data.map((entry: any) => ({
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

        setChartData({ labels, datasets });
    }, [data, filters.ageRange, filters.dateRange.startDate, filters.dateRange.endDate, filters.gender]);

    return (
        <div>
            <div className='m-4 pt-12 flex justify-between'>
                <span onClick={() => setFilter(!filter)} className='text-md font-semibold border-[1px] border-gray-400 px-4 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 antialiased'>
                    Filter
                </span>
                <span onClick={handleShareClick} className='text-md font-semibold border-[1px] border-gray-400 px-4 rounded-md bg-transparent hover:bg-gray-300 text-gray-700 antialiased'>
                    Share ↗
                </span>
            </div>
            {filter && (
                <div className='translate-x-0 sm:p-7 mt-14 translate-y-[-20%] sm:translate-y-[-25%] max-w-screen sm:w-fit h-full absolute z-40 overflow-hidden'>
                    <Filter setfilter={setFilter} />
                </div>
            )}
            <div className='flex justify-center flex-wrap'>
                <div className='flex flex-wrap'>
                    <Bar
                        data={chartData}
                        options={{
                            maintainAspectRatio: true,
                            indexAxis: 'y',
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
                                    zoom: {
                                        wheel: {
                                            enabled: true,
                                        },
                                        pinch: {
                                            enabled: true
                                        },
                                        mode: 'xy',
                                    }
                                }
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
                                    zoom: {
                                        wheel: {
                                            enabled: true,
                                        },
                                        pinch: {
                                            enabled: true
                                        },
                                        mode: 'xy',
                                    }
                                }
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
