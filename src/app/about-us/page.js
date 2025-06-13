'use client';
import { Globe, ShieldCheck, Package, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';



const SectionWrapper = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function AboutPage() {
  
  
  useEffect(() => {
    document.title = 'ZOOZ - About Us'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content','Discover the history, mission, and values behind ZOOZ, a modern e-commerce platform. Learn more about our team, our services, and how we inspire our customers.')
    }
  }, [])
  
  return (
    <div className="min-h-screen  overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-base-100 flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-accent/10">
        <div className="absolute inset-0 bg-noise opacity-10" />
        <div className="text-center max-w-4xl px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Redefining E-Commerce Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="py-6 text-xl md:text-2xl font-light text-gray-300"
          >
            Where Innovation Meets Customer Satisfaction
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <SectionWrapper>
        <div className="container mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="text-primary text-sm font-semibold tracking-wide">
                  OUR MISSION
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-base-100">
                Building the Future of Digital Commerce
              </h2>
              <p className="text-lg text-neutral/80 leading-relaxed">
                At ZOOZ, we're pioneering a new era of online shopping experiences. With
                cutting-edge AI integration and blockchain-powered security, we've redefined
                what it means to shop online. Our global network of 300+ professionals
                continuously innovates to deliver unparalleled service across 15 countries.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-base-200 rounded-xl border border-base-300/50">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <div className="text-3xl font-bold">1.5M+</div>
                  <div className="text-gray-500">Active Users</div>
                </div>
                <div className="p-6 bg-base-200 rounded-xl border border-base-300/50">
                  <Globe className="w-12 h-12 text-secondary mb-4" />
                  <div className="text-3xl font-bold">15</div>
                  <div className="text-gray-500">Countries Served</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative overflow-hidden rounded-3xl border border-base-300/50 transform hover:scale-[1.01] transition-all">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
                  alt="Team"
                  className="w-full h-[600px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Timeline Section */}
      <SectionWrapper delay={0.2}>
        <div className="bg-base-200 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Our Evolution
            </h2>
            <div className="relative pl-8 md:pl-0">
              <div className="absolute left-0 md:left-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent" />
              {[
                { year: '2023', title: 'Founding Vision', content: 'Launched in Benha with revolutionary marketplace concept' },
                { year: '2024', title: 'Regional Dominance', content: 'Expanded across Middle East with localized hubs' },
                { year: '2025', title: 'AI Integration', content: 'Implemented machine learning-powered personalization' },
                { year: '2026', title: 'Global Network', content: 'Established 3 continental headquarters' },
              ].map((item, index) => (
                <div key={index} className="relative mb-16 md:w-1/2 md:ml-auto md:odd:ml-0 md:odd:mr-auto md:even:translate-y-32">
                  <div className="absolute left-0 md:left-[-28px] w-8 h-8 bg-primary rounded-full border-4 border-base-100" />
                  <div className="ml-12 md:ml-0 p-8 bg-base-100 rounded-2xl shadow-xl border border-base-300/50">
                    <div className="text-sm text-primary font-semibold mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Team Section */}
      <SectionWrapper delay={0.3}>
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Visionary Leadership
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative bg-base-200 rounded-2xl p-8 transition-all hover:bg-base-300/20">
                <div className="absolute inset-0 border border-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 mb-6">
                    <img
                      src={`https://i.pravatar.cc/300?img=${item + 10}`}
                      className="w-full h-full rounded-full object-cover border-4 border-base-100"
                      alt="Team member"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mohamed Ali</h3>
                  <p className="text-primary mb-4">CEO & Founder</p>
                  <p className="text-center text-gray-400">
                    15+ years shaping digital commerce landscapes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Values Section */}
      <SectionWrapper delay={0.4}>
        <div className="bg-base-200 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Our Pillars of Excellence
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-base-100 rounded-2xl border border-base-300/50 hover:border-primary/20 transition-all">
                <ShieldCheck className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">Uncompromising Security</h3>
                <p className="text-gray-400">
                  Military-grade encryption and blockchain verification for every transaction
                </p>
              </div>

              <div className="p-8 bg-base-100 rounded-2xl border border-base-300/50 hover:border-secondary/20 transition-all">
                <Package className="w-16 h-16 text-secondary mb-6" />
                <h3 className="text-2xl font-bold mb-4">Smart Logistics</h3>
                <p className="text-gray-400">
                  AI-optimized global delivery network with real-time tracking
                </p>
              </div>

              <div className="p-8 bg-base-100 rounded-2xl border border-base-300/50 hover:border-accent/20 transition-all">
                <Clock className="w-16 h-16 text-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">Instant Fulfillment</h3>
                <p className="text-gray-400">
                  30-minute delivery promise in major metropolitan areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper delay={0.5}>
        <div className="container mx-auto px-4  py-24 text-center">
          <div className="max-w-3xl mx-auto bg-base-100 bg-gradient-to-br from-primary/10 to-accent/10 p-16 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Join the Commerce Revolution
            </h2>
            <p className="text-xl text-neutral/80 mb-12">
              Experience the future of online shopping today
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/product"
                className="btn btn-primary btn-lg px-8 rounded-full transform hover:-translate-y-1 transition-all"
              >
                Explore Collection
              </Link>
              <Link
                href="/contact"
                className="btn btn-outline btn-lg px-8 rounded-full border-2 hover:border-primary hover:bg-primary/10 transition-all"
              >
                Contact Team
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}