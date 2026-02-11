import React from 'react';
import Banner from '../Components/Banner';
import HomeStats from '../Components/HomeStats';

const HomePage = () => {
    return (
        <div className="space-y-10 md:space-y-14">
            <Banner />
            <HomeStats />
        </div>
    );
};

export default HomePage;