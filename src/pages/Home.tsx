import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/navbar/PublicNavbar";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useUser();


    useEffect(() => {
        console.log("User:", user); 
        // Ne pas rediriger automatiquement
    }, []);



    return (
        <div className="app-root">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}

export default Home;