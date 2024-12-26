import React, { useCallback, useEffect, useRef, useState } from 'react';
import {addDays} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import './AreaTop.scss';
import { Link } from 'react-router-dom';

const AreaTop = () => {

    const [state, setState] = useState([{
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
        key: "selection"
    }]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const dateRangeRef = useRef<HTMLDivElement | null >(null);

    const handleInputClick = () => {
        setShowDatePicker(true);
    }

    const handleDateChange = (item: any) => {
        const newSelection = {
          startDate: item.selection.startDate || new Date(),
          endDate: item.selection.endDate || new Date(),
          key: item.selection.key
        };
        setState([newSelection]);
      };

    const handleClickOutside = useCallback((event: any) => {
        if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)){
            setShowDatePicker(false);
        }
    },[]);

    useEffect(()=>{
        document.addEventListener("mousedown", handleClickOutside);
        console.log(1234);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[handleClickOutside]);




    return (
        <section className={'content-area-top'}>
            <div className="area-top-l">
                <div className='flex gap-8 items-center'>
                    <h2 className="area-top-title">Hello, <span className='area-top-title_name'>Zhibek</span></h2>
                    <div className='flex gap-4'>
                        <div className=''>
                            <Link to="/dashboard"><p className='text-blue-800'>My Dashboard</p></Link>
                        </div>
                        <div className='text-blue-800'>
                            <Link to="/orders"><p>My Orders</p></Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="area-top-r">
                <div
                    ref={dateRangeRef}
                    className={`date-range-wrapper ${
                        !showDatePicker ? "hide-date-range" : ""
                    }`}
                    onClick={handleInputClick}
                >
                    <DateRange
                        editableDateInputs={true}
                        onChange={handleDateChange}
                        moveRangeOnFirstSelection={false}
                        ranges={state}
                        showMonthAndYearPickers={false}
                    />
                </div>
            </div>
        </section>
    )
}

export default AreaTop