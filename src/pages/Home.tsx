import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { TestimonialsColumn } from '../components/ui/testimonials-columns-1';
import univ1Image from '../images/univ1.jpg';
import univ2Image from '../images/univ2.jpg';
import heroImage from '../images/hero.png';
import logo1 from '../logos/logo1.png';
import logo2 from '../logos/logo2.png';
import logo3 from '../logos/logo3.png';
import logo4 from '../logos/logo4.png';
import logo5 from '../logos/logo5.png';
import logo6 from '../logos/logo6.jpg';
import logo7 from '../logos/logo7.png';
import { 
  MapPin, 
  CheckCircle, 
  ArrowRight, 
  Award,
  Filter,
  Zap,
  Menu,
  X
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);

  const loadingMessages = [
    "Connexion aux serveurs...",
    "Chargement des établissements...",
    "Préparation de l'intelligence artificielle...",
    "Configuration de la carte interactive...",
    "Finalisation...",
  ];

  const features = [
    {
      icon: MapPin,
      title: "Géolocalisation Précise",
      description: "Trouvez les écoles par ville, région ou proximité géographique avec notre carte interactive avancée."
    },
    {
      icon: Filter,
      title: "Filtres Intelligents",
      description: "Filtrez par filière, seuil d'entrée, ville et bien plus pour trouver l'école qui correspond à votre niveau."
    },
    {
      icon: Award,
      title: "Informations Complètes",
      description: "Accédez aux programmes, critères d'admission, contacts et infrastructures de chaque établissement."
    },
    {
      icon: Zap,
      title: "Recherche Instantanée",
      description: "Résultats en temps réel avec notre moteur de recherche optimisé et interface fluide."
    }
  ];

  const testimonials = [
    {
      text: "Grâce à Afaqi, j'ai trouvé l'université parfaite qui correspondait à mon profil et mes ambitions. La plateforme m'a fait gagner un temps précieux.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      name: "Fatima Zahra",
      role: "Étudiante en Médecine",
    },
    {
      text: "Une plateforme indispensable pour aider nos enfants à choisir leur orientation avec toutes les informations nécessaires.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      name: "Ahmed Benali",
      role: "Parent d'élève",
    },
    {
      text: "L'outil de référence que j'utilise quotidiennement pour guider mes étudiants vers les meilleures formations au Maroc.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      name: "Youssef El Idrissi",
      role: "Conseiller d'orientation",
    },
    {
      text: "Les filtres intelligents m'ont permis de trouver exactement l'école qui correspondait à mon seuil et ma ville. Je recommande vivement !",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      name: "Salma Ouahbi",
      role: "Étudiante en Commerce",
    },
    {
      text: "En tant que directeur d'école, Afaqi nous donne une visibilité incroyable auprès des étudiants. Un vrai partenaire.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      name: "Karim Tazi",
      role: "Directeur d'établissement",
    },
    {
      text: "La carte interactive est fantastique. J'ai pu visualiser toutes les écoles de Casablanca en un clin d'œil.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
      name: "Nadia Chraibi",
      role: "Étudiante en Ingénierie",
    },
    {
      text: "Afaqi a simplifié le processus d'orientation pour toute notre famille. Les informations sont claires et complètes.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
      name: "Mohamed Alami",
      role: "Parent d'élève",
    },
    {
      text: "Le chatbot IA m'a donné des recommandations personnalisées qui m'ont vraiment aidé dans mon choix. Impressionnant !",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
      name: "Hajar Benjelloun",
      role: "Bachelière Sciences Math",
    },
    {
      text: "Une plateforme moderne et bien pensée. Elle répond parfaitement aux besoins des étudiants marocains d'aujourd'hui.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
      name: "Omar Fassi",
      role: "Professeur universitaire",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  // Check for loading parameter after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showLoading') === 'true' && user) {
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Start loading screen
      startLoading();
    }
  }, [user]);

  const startLoading = () => {
    // Check if user is authenticated first
    if (!user) {
      // If not authenticated, go to login page first
      navigate('/login');
      return;
    }
    
    // If authenticated, show loading screen then navigate to platform
    const firstPercent = Math.floor(Math.random() * 15) + 10;
    setLoadingPercent(firstPercent);
    setLoadingStep(0);
    setIsLoading(true);
    let percent = firstPercent;
    let step = 0;
    const interval = setInterval(() => {
      percent += Math.floor(Math.random() * 15) + 10;
      step = Math.min(Math.floor(percent / 25), 4);
      setLoadingStep(step);
      if (percent >= 100) {
        percent = 100;
        setLoadingPercent(percent);
        setLoadingStep(4);
        clearInterval(interval);
        setTimeout(() => {
          navigate('/platform');
          setIsLoading(false);
        }, 500);
      } else {
        setLoadingPercent(percent);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex flex-col items-start">
                <span className="text-2xl font-bold text-[#004235]">
                  Afaqi
                </span>
                <span className="mt-1 text-xs italic text-gray-500">powered by Tawjeeh</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  Fonctionnalités
                </a>
                <a href="#about" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  À Propos
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors">
                  Témoignages
                </a>
                
                {user ? (
                  // Authenticated user navigation
                  <button 
                    onClick={startLoading}
                    className="bg-[#004235] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#cda86b] hover:text-white"
                  >
                    Plateforme
                  </button>
                ) : (
                  // Non-authenticated user navigation
                  <>
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-gray-700 hover:text-[#004235] px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Se connecter
                    </button>
                    <button 
                      onClick={startLoading}
                      className="bg-[#004235] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#cda86b] hover:text-white"
                    >
                      Commencer
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#004235] p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                Fonctionnalités
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                À Propos
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-[#004235] font-medium">
                Témoignages
              </a>
              
              {user ? (
                // Authenticated user mobile navigation
                <button 
                  onClick={startLoading}
                  className="block w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-[#004235] text-white hover:bg-[#cda86b] hover:text-white"
                >
                  Plateforme
                </button>
              ) : (
                // Non-authenticated user mobile navigation
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#004235] font-medium"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={startLoading}
                    className="block w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-[#004235] text-white hover:bg-[#cda86b] hover:text-white"
                  >
                    Commencer
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-8 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004235]/5 via-white to-[#cda86b]/5"></div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#004235]/10 to-[#cda86b]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-[#cda86b]/10 to-[#004235]/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="text-gray-900">
                      Nous guidons chaque étudiant 
                    </span>
                    <br />
                    <span className="text-gray-900">
                      vers son avenir
                    </span>
                    <br />
                    <span className="text-[#004235]">
                      au Maroc
                    </span>
                  </h1>
                  <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                    Découvrez et comparez plus de 90 établissements d'enseignement supérieur avec notre plateforme interactive et intelligente.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={startLoading}
                    className="group bg-[#004235] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#cda86b] transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                  >
                    <span>Explorer la carte</span>
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right column - Hero Image */}
              <div className="hidden lg:flex items-center justify-center relative">
                {/* Hero Image */}
                <img 
                  src={heroImage} 
                  alt="Afaqi Educational Platform" 
                  className="w-auto h-auto max-w-[200px] object-contain relative z-10"
                />
                
                {/* Logo Carousel Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="logo-carousel-container">
                    <div className="logo-carousel-track">
                      {/* First set of logos */}
                      <div className="logo-carousel-item">
                        <img src={logo1} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo2} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo3} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo4} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo5} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo6} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo7} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      
                      {/* Duplicate set for seamless loop */}
                      <div className="logo-carousel-item">
                        <img src={logo1} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo2} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo3} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo4} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo5} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo6} alt="University Logo" className="logo-carousel-img" />
                      </div>
                      <div className="logo-carousel-item">
                        <img src={logo7} alt="University Logo" className="logo-carousel-img" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Établissements" },
              { number: "12k+", label: "Étudiants" },
              { number: "12", label: "Villes" },
              { number: "98%", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-4xl font-bold text-[#004235]">{stat.number}</div>
                <div className="text-base text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir <span className="text-[#004235]">Afaqi</span> ?
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Une plateforme complète qui révolutionne la recherche d'établissements d'enseignement au Maroc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-[#004235] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                L'avenir de l'orientation étudiante au <span className="text-[#004235]">Maroc</span>
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Afaqi est né de la volonté de démocratiser l'accès à l'information sur l'enseignement supérieur marocain. Notre plateforme centralise toutes les données essentielles pour aider les étudiants et leurs familles à prendre des décisions éclairées.
              </p>
              
              <div className="space-y-4">
                {[
                  "Base de données exhaustive mise à jour en temps réel",
                  "Interface intuitive adaptée à tous les profils",
                  "Algorithmes de recommandation personnalisés"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-[#004235] mr-3 flex-shrink-0" />
                    <span className="text-gray-500">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={startLoading}
                className="bg-[#004235] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#cda86b] transition-all duration-300"
              >
                En savoir plus
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <img
                  src={univ1Image}
                  alt="Université"
                  className="rounded-2xl shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300 w-full h-[300px] object-cover"
                />
                <img
                  src={univ2Image}
                  alt="Étudiants"
                  className="rounded-2xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8 w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Accédez à l'expérience <span className="text-[#004235]">complète</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour trouver votre formation idéale, à un prix accessible
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#004235] to-[#cda86b]"></div>

              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  {/* Left column — features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Tout est inclus
                    </h3>
                    <ul className="space-y-4 mb-8 md:mb-0">
                      {[
                        "Recommandations IA illimitées et personnalisées",
                        "Filtres avancés (notes, coût, satisfaction)",
                        "Chatbot intelligent personnalisé",
                        "Gestion de listes de favoris multiples",
                        "Rappels SMS et email des échéances",
                        "Alertes bourses et places en temps réel",
                        "Accès prioritaire aux nouvelles fonctionnalités",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[#004235] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right column — price + CTA */}
                  <div className="flex flex-col items-center text-center md:border-l md:border-gray-100 md:pl-10">
                    <div className="mb-2">
                      <span className="text-8xl font-bold text-[#004235]">49</span>
                    </div>
                    <div className="text-xl text-gray-500 font-medium mb-1">MAD / an</div>
                    <p className="text-sm text-gray-400 mb-8">
                      Soit moins de 5 MAD par mois
                    </p>

                    <button
                      onClick={startLoading}
                      className="w-full bg-[#004235] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#cda86b] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                    >
                      Commencer maintenant
                    </button>

                    <p className="text-sm text-gray-400 mt-4">
                      Annulation possible à tout moment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 text-center">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-center mt-4 text-lg text-gray-500">
              Découvrez les témoignages de ceux qui ont trouvé leur voie grâce à Afaqi
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={19}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={17}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prêt à découvrir votre future école ?
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Rejoignez des milliers d'étudiants qui ont déjà trouvé leur voie avec Afaqi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={startLoading}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-[#004235] text-white hover:bg-[#cda86b]"
            >
              Commencer maintenant
            </button>
            <button className="bg-white text-[#004235] px-8 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-[#004235] hover:text-white transition-all duration-300">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004235]">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white/80 text-sm">
            © 2026 Afaqi — A product of Tawjeeh Consulting. Tous droits réservés.
          </p>
        </div>
      </footer>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white"
        >
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004235]/5 via-white to-[#cda86b]/5"></div>

          <div className="relative flex flex-col items-center">
            {/* Animated logo ring */}
            <div className="relative mb-10">
              <div className="w-24 h-24 rounded-full border-[3px] border-gray-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#004235]">A</span>
              </div>
              {/* Spinning arc */}
              <svg className="absolute inset-0 w-24 h-24 animate-spin" style={{ animationDuration: '1.5s' }} viewBox="0 0 96 96">
                <circle
                  cx="48" cy="48" r="46"
                  fill="none"
                  stroke="url(#loading-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="72 216"
                />
                <defs>
                  <linearGradient id="loading-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#004235" />
                    <stop offset="100%" stopColor="#cda86b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Percentage */}
            <motion.div
              key={loadingPercent}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-[#004235] tabular-nums mb-2"
            >
              {loadingPercent}%
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#004235] to-[#cda86b]"
                initial={{ width: 0 }}
                animate={{ width: `${loadingPercent}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Loading message */}
            <motion.p
              key={loadingStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-400"
            >
              {loadingMessages[loadingStep]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;