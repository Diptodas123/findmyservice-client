import Banner from '../../components/Banner/Banner';
import './HomePage.css';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import Testimonials from '../../components/Testimonials/Testimonials';
import RecommendedServices from '../../components/RecommendedServices/RecommendedServices';
import PopularServiceProviders from '../../components/PopularServiceProviders/PopularServiceProviders';
import NewsLetter from '../../components/Newsletter/NewsLetter';

const HomePage = () => {

    return (
        <>
            <Banner />
            <div className='container'>
                <RecommendedServices />
                <hr />
                <HowItWorks />
                <hr />
                <PopularServiceProviders />
                <hr />
                <Testimonials />
                <hr />
                <NewsLetter />
            </div>
        </>
    );
}

export default HomePage;