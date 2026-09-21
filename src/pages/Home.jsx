import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarqueeStrip from '../components/MarqueeStrip';
import CategoryCards from '../components/CategoryCards';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import CTABanner from '../components/CTABanner';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const Home = () => {
  return (
    <>
      <CartDrawer />
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <CategoryCards />
        <FeaturedProducts />
        <WhyChooseUs />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
};

export default Home;
