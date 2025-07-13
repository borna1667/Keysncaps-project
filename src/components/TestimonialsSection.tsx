import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// 3D Floating Review Stars
function FloatingStars({ count = 5 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }, (_, i) => (
        <Float
          key={i}
          speed={1 + Math.random()}
          rotationIntensity={0.3}
          floatIntensity={0.5}
        >
          <mesh position={[(i - 2) * 1.5, Math.sin(i) * 0.5, Math.random() * 2]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// 3D Quote Symbol
function Quote3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#BFF205"
          emissive="#BFF205"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  featured?: boolean;
}

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Pro Gamer",
      company: "Team Velocity",
      content: "The responsiveness is incredible. Every keystroke feels precise and tactile. It's given me a competitive edge I never knew I was missing.",
      rating: 5,
      avatar: "🎮",
      featured: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Software Engineer",
      company: "TechCorp",
      content: "As someone who codes 12+ hours a day, this keyboard has been a game-changer. The comfort and customization options are unmatched.",
      rating: 5,
      avatar: "💻"
    },
    {
      id: 3,
      name: "Marcus Rivera",
      role: "Content Creator",
      company: "Digital Studios",
      content: "The RGB lighting isn't just beautiful—it's functional. I can customize different zones for different workflows. Absolutely love it!",
      rating: 5,
      avatar: "🎨"
    },
    {
      id: 4,
      name: "Emily Zhang",
      role: "UI/UX Designer",
      company: "Design Co",
      content: "Perfect blend of form and function. The aesthetic is sleek and modern, and the typing experience is pure joy. Highly recommended!",
      rating: 5,
      avatar: "✨"
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
      style={{ 
        opacity,
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)"
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        {/* Floating geometric shapes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 border border-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              What Our
            </span>
            <br />
            <span className="text-white">Customers Say</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who've elevated their typing experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D Scene */}
          <motion.div
            className="relative h-96 lg:h-[500px]"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#BFF205" />
              <pointLight position={[-10, -10, -10]} intensity={0.8} color="#D7F205" />
              
              <FloatingStars count={5} />
              <Quote3D />
            </Canvas>
          </motion.div>

          {/* Right: Testimonial Carousel */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: testimonials[activeTestimonial].rating }, (_, i) => (
                    <motion.div
                      key={i}
                      className="text-yellow-400 text-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl text-gray-200 leading-relaxed mb-8 relative">
                  <span className="text-4xl text-primary absolute -top-2 -left-2">"</span>
                  <span className="relative z-10 pl-6">{testimonials[activeTestimonial].content}</span>
                  <span className="text-4xl text-primary absolute -bottom-6 right-0">"</span>
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-gray-400">
                      {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                    </div>
                  </div>
                </div>

                {/* Featured Badge */}
                {testimonials[activeTestimonial].featured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-black px-3 py-1 rounded-full text-sm font-bold">
                    Featured
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                ←
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeTestimonial
                        ? 'bg-primary scale-125'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                →
              </button>
            </div>
          </motion.div>
        </div>

        {/* Customer Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { number: "10K+", label: "Happy Customers" },
            { number: "4.9", label: "Average Rating" },
            { number: "99%", label: "Satisfaction Rate" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
