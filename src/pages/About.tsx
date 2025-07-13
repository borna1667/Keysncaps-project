import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Music, Award, Users, Star, Globe, Heart, Keyboard, Truck, BookOpen, MessageCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="relative pt-32 pb-24 bg-gradient-to-br from-background via-kloud-dark to-light min-h-screen overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
      <div className="container-custom relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20 animate-fade-in">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary drop-shadow-lg">About <span className="text-dark">Keys 'n' Caps</span></h1>
            <p className="text-lg md:text-xl text-dark mb-8 max-w-2xl mx-auto md:mx-0">
              At Keys 'n' Caps, we’re more than just a store—we’re your European home for everything keyboards. Our story began in January 2025, when our founder hunted for parts to build a custom board and discovered a surprising gap: Europe’s selection was limited, prices were high, and shipping fees piled on. Meanwhile, U.S. and Asian sites offered endless options at lower cost—so we decided to bring that variety, value, and service straight to your doorstep.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://www.instagram.com/keys_n_caps/" target="_blank" rel="noopener noreferrer" className="bg-primary bg-opacity-10 p-3 rounded-full hover:bg-opacity-20 transition-colors"><Instagram className="text-primary" size={28} /></a>
              <a href="https://www.tiktok.com/@keys_n_caps" target="_blank" rel="noopener noreferrer" className="bg-primary bg-opacity-10 p-3 rounded-full hover:bg-opacity-20 transition-colors"><Music className="text-primary" size={28} /></a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/Keys'n'Caps_logo_03.png" alt="Keys 'n' Caps Logo" className="w-64 h-64 object-contain rounded-2xl shadow-2xl border-4 border-primary bg-white animate-slide-up" />
          </div>
        </div>

        {/* Story Section */}
        <div className="relative bg-light bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-10 text-primary">Our Story</h2>
          <div className="max-w-3xl mx-auto text-dark text-lg md:text-xl leading-relaxed space-y-6">
            <p>In just six months, we’ve managed to partner directly with already familiar to you manufacturers to source switches, keycaps, PCBs, cases and accessories—everything from classic "thocky" sets to cutting-edge ergonomic designs. By handling import and logistics ourselves, we keep prices competitive and delivery fast, without surprise fees.</p>
            <p>But Keys 'n' Caps isn’t only about parts. We’re building a community: watch our build guides and tutorials, dive into expert articles on switch feel and typing ergonomics, or share your own creations in our blog comments. Whether you’re assembling your first board or chasing that limited-edition artisan keycap, you’ll find passion, support, and inspiration here.</p>
            <p>This is just the beginning. As we grow, our catalog will expand, our prices will stay sharp, and our service will become even more personal. Welcome to Keys 'n' Caps—where Europe’s keyboard enthusiasts connect, create, and type together.</p>
          </div>
        </div>

        {/* Timeline / Journey Section */}
        <div className="relative bg-light bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-10 text-primary">Our Journey</h2>
          <ol className="relative border-l-4 border-primary pl-8 space-y-12 max-w-3xl mx-auto">
            <li>
              <div className="flex items-center mb-2">
                <Award className="text-primary mr-3" size={28} />
                <span className="font-semibold text-lg">January 2025: The Idea Rises</span>
              </div>
              <p className="text-dark/70 ml-11">The spark for Keys 'n' Caps is ignited after realizing the lack of affordable, high-quality keyboard parts in Europe.</p>
            </li>
            <li>
              <div className="flex items-center mb-2">
                <BookOpen className="text-primary mr-3" size={28} />
                <span className="font-semibold text-lg">February 2025: Building the Website</span>
              </div>
              <p className="text-dark/70 ml-11">Development of the Keys 'n' Caps website begins, focusing on user experience and a beautiful, modern design.</p>
            </li>
            <li>
              <div className="flex items-center mb-2">
                <Keyboard className="text-primary mr-3" size={28} />
                <span className="font-semibold text-lg">April 2025: Website Complete</span>
              </div>
              <p className="text-dark/70 ml-11">After two months of hard work, the website is finished and ready to welcome keyboard enthusiasts from all over Europe.</p>
            </li>
            <li>
              <div className="flex items-center mb-2">
                <Heart className="text-primary mr-3" size={28} />
                <span className="font-semibold text-lg">May 2025: Launch & Community</span>
              </div>
              <p className="text-dark/70 ml-11">Keys 'n' Caps goes live! The site is running, and customers are joining the community, sharing their passion for keyboards.</p>
            </li>
          </ol>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-12 text-primary">Why Choose Keys 'n' Caps?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-light bg-opacity-80 rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <Award className="text-primary mb-4" size={36} />
              <h3 className="font-semibold text-lg mb-2 text-dark">Premium Quality</h3>
              <p className="text-dark/70">Every product is handpicked and tested for durability, feel, and aesthetics. Only the best for our customers.</p>
            </div>
       
            <div className="bg-light bg-opacity-80 rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <Globe className="text-primary mb-4" size={36} />
              <h3 className="font-semibold text-lg mb-2 text-dark">European Focus</h3>
              <p className="text-dark/70">Fast shipping, local layouts, and support in multiple languages. We are truly European.</p>
            </div>
            <div className="bg-light bg-opacity-80 rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
              <Star className="text-primary mb-4" size={36} />
              <h3 className="font-semibold text-lg mb-2 text-dark">Expert Advice</h3>
              <p className="text-dark/70">Our team lives and breathes keyboards. Get personalized recommendations and support anytime.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-primary">Ready to Elevate Your Typing?</h2>
          <p className="text-lg text-dark mb-8">Explore our curated collection or reach out for expert advice. Join the Keys 'n' Caps family today!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary text-lg px-8 py-4">Shop Keyboards</Link>
            <Link to="/contact" className="btn-secondary text-lg px-8 py-4">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;