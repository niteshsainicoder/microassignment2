// components/BarLineChart.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Filter from './Filter'; // Assuming you have a filter component
import useDataContext from '@/app/ContextApi';

Chart.register(...registerables);

type Dataset = {
    label: string;
    data: any[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
};


const BarLineChart: React.FC = () => {
    const { data, filters } = useDataContext();

    const [filter, setfilter] = useState(false);
    const [chartData, setChartData] = useState<{ labels: String[], datasets: Dataset[]}>({
        labels: [],
        datasets: []
    });

    // Fetch the data from the server (pre-filtered by backend pipeline)



    const generateShareableUrl = () => {
        const params = new URLSearchParams();
        params.append('startDate', filters.dateRange.startDate.toString());
        params.append('endDate', filters.dateRange.endDate.toString());
        params.append('age', filters.ageRange.toString());
        params.append('gender', filters.gender.toString());

        const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        console.log(shareableUrl, 'shareable url');
        return shareableUrl;
    };

    // Copy the generated URL to clipboard
    const handleShareClick = () => {
        const shareableUrl = generateShareableUrl();
        if (navigator.share) {
            // Use the Web Share API for mobile devices
            navigator.share({
                title: 'Chart with Filters',
                url: shareableUrl,
            }).catch((error) => console.error('Error sharing', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareableUrl)
                .then(() => alert('URL copied to clipboard!'))
                .catch((err) => console.error('Error copying text: ', err));
        }
    };


    useEffect(() => {
        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];

        const datasets = data.map((entry: any) => ({
            label: `${entry._id.Gender} (Age ${entry._id.Age})`,
            data: [
                entry.averageA, entry.averageB, entry.averageC,
                entry.averageD, entry.averageE, entry.averageF
            ],

            borderColor: entry._id.Gender === 'Male' ? '#007bff' : '#ff6384', // Color based on gender
            backgroundColor: entry._id.Gender === 'Male' ? (entry._id.Age == '>25' ? '#cce7ff' : '#b3d9ff') : (entry._id.Age == '>25' ? '#ffccf2' : '#ffc1e3'), // Color based on gender
            borderWidth: 1,

        }));

     
        // ...

        setChartData({
            labels,
            datasets: datasets as Dataset[]
        });
        generateShareableUrl();

       


    }, [data]); // Only runs once on component mount

    return (
        <div>
            <div className='m-4 pt-12 flex justify-between'>
                <span onClick={() => setfilter(!filter)} className='text-md font-semibold border-[1px] border-gray-400 px-4   rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 antialiased'>Filter</span>
                <span onClick={() => handleShareClick()} className='text-md font-semibold border-[1px] border-gray-400 px-4   rounded-md bg-trasparent hover:bg-gray-300 text-gray-700 antialiased'>share ↗</span>
            </div>
            {filter && <div className='transalate-x-[0]  sm:p-7 mt-14 translate-y-[-20%] sm:translate-y-[-25%]  max-w-screen  sm:w-fit h-full absolute z-40 overflow-hidden '>
                <Filter setfilter={setfilter} />
            </div>}
            <div className='flex justify-center flex-wrap  '>
                <div className=' flex flex-wrap'>
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
                                    text: ' Bar Chart',
                                },
                            },
                        }} height={400} />
                </div>
                <div className='flex flex-wrap'>
                    <Line data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: true,
                                    text: ' Line Chart',
                                },
                            },
                        }} height={400}
                    />
                </div>
            </div>
        </div>
    );
};

export default BarLineChart;
