import React from 'react';
import Navbar from '../comp/navbar';
import MainHome from '../comp/main_home';
import Main2 from '../comp/main2';
import WhyChoose from '../comp/WhyChoose';

const Home = () => {
    return (
        <div >
            <Navbar/>
            <MainHome/>
            <Main2/>
            <WhyChoose/>
           
        </div>
    );
}

export default Home;
