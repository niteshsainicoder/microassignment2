import React from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import useDataContext from '@/app/ContextApi';

function Filter({ setfilter }: { setfilter: (arg: boolean) => void }) {
  const { setFilters, filters } = useDataContext();
  const [filter, setFilter] = React.useState({
    ageRange: '',
    gender: '',
    dateRange: { startDate: 44838, endDate: 44862 },
  });
  const [date, setDate] = React.useState(['4/10/2022', '28/10/2022']);
  const selectionRange = {
    startDate: new Date(2022, 9, 4),
    endDate: new Date(2022, 9, 28),
    key: 'selection',
  };

  function dateToExcelSerial(date: Date) {
    const excelEpoch = new Date(1899, 11, 30);
    const msPerDay = 24 * 60 * 60 * 1000;

    const serialDate = (date - excelEpoch) / msPerDay;

    return Math.floor(serialDate);
  }

  const handleSelect = (ranges: any) => {
    setFilter({ ...filter, dateRange: { startDate: dateToExcelSerial(ranges.selection.startDate), endDate: dateToExcelSerial(ranges.selection.endDate) } });
    console.log(dateToExcelSerial(ranges.selection.startDate), dateToExcelSerial(ranges.selection.endDate), 'ranges.selection');
    setDate([ranges.selection.startDate, ranges.selection.endDate]);
  };
  const handleGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, gender: e.target.value });
    console.log(e.target.value, 'val from gender');
  };
  const handleAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, ageRange: e.target.value });
    console.log(e.target.value, 'val from age');
  };

  const apply = () => {
   
    setFilters({
      ageRange: filter.ageRange,
      gender: filter.gender,
      dateRange: { startDate: filter.dateRange.startDate, endDate: filter.dateRange.endDate },
    })
    setTimeout(() => {
      setfilter(false)
    }, 600);
  }
  return (
    <div className="flex flex-col  bg-gray-100 rounded-lg shadow-md w-full max-w-screen p-2 border-[1px] border-gray-200   mt-14 sm:max-w-md mx-auto">
      <DateRange
        className="text-black w-screen bg-gray-100 max-w-screen sm:w-full sm:max-w-full"
        editableDateInputs={true}
        ranges={[selectionRange]}
        onChange={handleSelect}
        minDate={new Date(2022, 9, 4)} // Minimum date: 4th October 2022
        maxDate={new Date(2022, 9, 28)}

      />
      <div className="mt-4 flex ">
        <p className="font-semibold text-wrap">Selected Range :</p>
        {filter.dateRange.startDate && filter.dateRange.endDate && (
          <p className='text-wrap'>
            From: {date[0].toLocaleString().slice(0, 10)} To: {date[1].toLocaleString().slice(0, 10)}           </p>
        )}
      </div>
      <div className='flex gap-1 justify-around items-center pb-2 flex-wrap'>
        <div className="mt-4 flex m-1 gap-1">
          <label htmlFor="gender" className="block ">Gender :</label>
          <select title='gender' name="gender" id="0" onChange={(e) => handleGender(e)} className="border rounded bg-transparent  px-2 m- w-fit outline-none">
            <option defaultChecked value=""> select </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="mt-4 flex m-1 gap-1">
          <label htmlFor="gender" className="block ">Age  :</label>
          <select title='gender' name="gender" id="1" onChange={(e) => handleAge(e)} className="border rounded bg-transparent text-center px-2  w-fit outline-none">

            <option defaultChecked value=""> select </option>

            <option value="15-25">15-25</option>
            <option value=">25">{`>25`}</option>
          </select>
        </div>


        <div className="mt-4 flex m-1 gap-1">
          <button type='button' className='bg-[#6b8095] shadow-lg hover:bg-[#5e7285]  text-white px-4  p-1  rounded-lg ' onClick={apply}>Apply</button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
