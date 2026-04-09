import React from 'react';
import './MediPlay.css';
import DarkVeil from "../Components/Backgrounds/DarkVeil";
import Header from "../Components/FixedComponents/Header";
import Footer from "../Components/FixedComponents/Footer";

export default function MediPlay() {
    return (
        <div className="reminder-container page">
            <DarkVeil
                hueShift={0}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={1}
                scanlineFrequency={0}
                warpAmount={0}
            />
            <Header />
            <div className='content'>
                <h1>MediPlay</h1>
            </div>
            <Footer />
        </div>
    );
}
