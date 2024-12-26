import React, {useState, MouseEvent, ChangeEvent, useEffect} from 'react';
import ReactSlider from 'react-slider'

const PriceRange = ({priceGap=5, minVal, maxVal, changeMax, changeMin}: {priceGap: number, minVal: number, maxVal: number, changeMin: any, changeMax: any}) => {

    const [priceRange, setPriceRange] = useState([minVal, maxVal]);

    const handleChange = (value) => {
        const [min, max] = value;
        changeMin(min);
        changeMax(max);
        setPriceRange(value);
    };

    return (
        <>
            <p className="font-semibold text-lg mb-2">Price</p>
            <div>
                <div className="flex justify-between items-center">
                <p>{`${minVal}`}</p>
                <p>{`${maxVal}`}</p>
                </div>
                <ReactSlider
                    min={0}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onChange={handleChange}
                    renderTrack={(props, state) => (
                        <div {...props} className="bg-gray-300 h-2 rounded-md" />
                    )}
                    renderThumb={(props, state) => (
                        <div {...props} className="w-6 h-6 bg-blue-600 rounded-full cursor-pointer border-2 border-blue-800" />
                    )}
                    className="slider"
                    ariaLabel={['Lower thumb', 'Upper thumb']}
                    thumbClassName="thumb"
                    trackClassName="track"
                />
            </div>
        </>
    )
}

export default PriceRange