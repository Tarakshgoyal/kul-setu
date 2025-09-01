import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, Users, Heart, Star, TreePine } from 'lucide-react';
// import heroImage from '@/assets/hero-spiritual.jpg';
import heroimage from '@/assets/tree.jpg'

const Home = () => {
  const features = [
    {
      icon: UserPlus,
      title: 'Register Family',
      description: 'Add your family members with detailed spiritual and personal attributes',
      gradient: 'gradient-spiritual'
    },
    {
      icon: Search,
      title: 'Search Connections',
      description: 'Find family connections through traits, nature, and shared characteristics',
      gradient: 'gradient-sacred'
    },
    {
      icon: Users,
      title: 'Family Profiles',
      description: 'Beautiful detailed profiles with photos, videos, and spiritual insights',
      gradient: 'gradient-divine'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Kul Setu
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Connect with your spiritual family heritage. Discover the sacred bonds that unite your lineage through generations of wisdom, traits, and divine connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-sacred text-sacred-foreground hover:bg-sacred/90 shadow-sacred">
                  <Link to="/register">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register Family
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/search">
                    <Search className="w-5 h-5 mr-2" />
                    Search Family
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative animate-float">
              <img 
                src={heroimage} 
                alt="Spiritual Family Tree"
                className="w-[450px] h-auto ml-20 rounded-2xl shadow-divine"
              />
              <div className="absolute -top-4 -right-4 bg-spiritual/20 rounded-full p-4 animate-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Discover Your Sacred <span className="bg-gradient-spiritual bg-clip-text text-transparent">Family Tree</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Preserve and explore the spiritual essence of your family lineage with beautiful, meaningful connections
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-spiritual transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${feature.gradient} flex items-center justify-center group-hover:animate-float`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spiritual Quote Section */}
      <section className="py-16 bg-gradient-divine relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Star className="w-12 h-12 text-white/80 mx-auto mb-6 animate-glow" />
          <blockquote className="text-2xl lg:text-3xl font-medium text-white mb-6 italic max-w-4xl mx-auto leading-relaxed">
            "Family is not just about blood relations, but about the spiritual bonds that connect souls across generations."
          </blockquote>
          <div className="flex items-center justify-center space-x-2 text-white/80">
            <TreePine className="w-5 h-5" />
            <span className="text-lg">Ancient Wisdom</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;