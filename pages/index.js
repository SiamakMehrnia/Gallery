import WelcomeSection from "@/components/home/WelcomeSection";
import FeaturedArtist from "@/components/home/FeaturedArtist";
import AboutUs from "@/components/home/AboutUs";
import ContactUs from "@/components/home/ContactUs";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br  text-white space-y-12 font-sans mt-16">
      <WelcomeSection />
      <FeaturedArtist />
      <AboutUs />
      <ContactUs />
    </div>
  );
}
