import React from 'react';
import Banner from '../Components/Banner';
import HomeStats from '../Components/HomeStats';
import HowItWorks from '../Components/HowItWorks';
import Features from '../Components/Features';
import Benefits from '../Components/Benefits';
import FAQ from '../Components/FAQ';
import CallToAction from '../Components/CallToAction';

const HomePage = () => {
    return (
        <div className="space-y-0">
            <Banner />
            <HomeStats />
            <HowItWorks />
            <Features />
            <Benefits />
            <FAQ />
            <CallToAction />
        </div>
    );
};

export default HomePage;