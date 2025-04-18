import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // SVG icon renderer function
  const renderFeatureIcon = (iconName: string) => {
    const iconColor = '#3b82f6'; // text-blue-500
    
    switch (iconName) {
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" />
            <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z" />
          </svg>
        );
      case 'bell':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z" />
          </svg>
        );
      case 'sync':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M19.91 15.51h-4.53a1 1 0 0 0 0 2h2.4a8 8 0 0 1-15.56-2 1 1 0 1 0-2 .18 10 10 0 0 0 19.6 2.33v1.18a1 1 0 0 0 2 0v-2.68a1 1 0 0 0-1-1z" />
            <path d="M9.61 8.41h4.51a1 1 0 0 0 0-2h-2.4a8 8 0 0 1 15.57 2 1 1 0 0 0 2-.18 10 10 0 0 0-19.6-2.33V4.72a1 1 0 1 0-2 0v2.68a1 1 0 0 0 1 1z" />
          </svg>
        );
      case 'mobile':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M17 2H7c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM7 4h10v16H7V4zm6 14h-2v-2h2v2z" />
          </svg>
        );
      case 'lock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm9 5v8H6v-8h12z" />
          </svg>
        );
      case 'friends':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z" />
            <path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const features = [
    {
      iconName: 'calendar',
      title: "Smart Scheduling",
      description: "Intelligent scheduling suggestions based on your habits and preferences."
    },
    {
      iconName: 'bell',
      title: "Customizable Notifications",
      description: "Stay on top of your schedule with personalized reminders across all devices."
    },
    {
      iconName: 'sync',
      title: "Seamless Sync",
      description: "Your calendar stays updated across all devices in real-time."
    },
    {
      iconName: 'mobile',
      title: "Offline Access",
      description: "Access your schedule anytime, even without an internet connection."
    },
    {
      iconName: 'lock',
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties."
    },
    {
      iconName: 'friends',
      title: "Collaborative Features",
      description: "Share calendars and events with friends, family or colleagues."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500 opacity-5 pattern-dots"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-5xl font-bold text-blue-800 mb-6">
                Celeris <span className="text-blue-500">Calendar</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your life, organized. Manage your schedule seamlessly across all devices with our intuitive calendar application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-center font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    console.log("Register button clicked");
                  }}
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 text-center font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    console.log("Sign In button clicked");
                  }}
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <img 
                  src="/logo_celeris.studio.png"
                  alt="Celeris Calendar Preview" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Celeris Calendar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition duration-300">
                <div className="mb-4">
                  {renderFeatureIcon(feature.iconName)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Celeris has transformed how I manage my time. The interface is intuitive and the sync across devices is flawless.",
                author: "Sarah Johnson",
                title: "Marketing Director"
              },
              {
                quote: "As someone who juggles multiple projects, Celeris Calendar has been a game-changer for my productivity.",
                author: "Michael Chen",
                title: "Software Engineer"
              },
              {
                quote: "The collaborative features make planning events with my team so much easier. Highly recommended!",
                author: "Emma Rodriguez",
                title: "Event Coordinator"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-4 text-blue-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 italic mb-4">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.author}</p>
                  <p className="text-gray-600 text-sm">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Calendar Experience?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of users who have optimized their schedule with Celeris Calendar.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 font-medium">
              Create Free Account
            </Link>
            <Link to="/login" className="px-8 py-3 bg-transparent border border-white text-white rounded-lg hover:bg-blue-500 transition duration-300 font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Celeris</h3>
              <p className="text-gray-400">Your premium calendar solution for personal and professional scheduling.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-300 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Integrations</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-300 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Careers</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-300 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-300 transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Celeris.studio. Student Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
