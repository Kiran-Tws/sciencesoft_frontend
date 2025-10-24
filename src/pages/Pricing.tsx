import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import Navbar from "@/components/Navbar";
import { servicesData } from "@/data/servicesData";

const Pricing = () => {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon || Icons.Code2;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services & Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive range of IT services. Click on any
              service to explore specific solutions and get a customized quote.
            </p>
          </div>

          {/* Services Sections */}
          {servicesData.map((service, serviceIndex) => {
            const ServiceIcon = getIcon(service.icon);
            
            return (
              <div
                key={service.id}
                className="mb-20 animate-fade-in"
                style={{ animationDelay: `${serviceIndex * 150}ms` }}
              >
                {/* Service Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ServiceIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{service.title}</h2>
                  </div>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {service.categories.map((category, categoryIndex) => {
                    const CategoryIcon = getIcon(category.icon);
                    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                    
                    return (
                      <Link
                        key={category.id}
                        to={
                          hasSubcategories
                            ? `/category/${service.id}/${category.id}`
                            : `/inquiry/${service.id}/${category.id}`
                        }
                        className="block animate-scale-in"
                        style={{ animationDelay: `${(serviceIndex * 150) + (categoryIndex * 50)}ms` }}
                      >
                        <Card className="h-full group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-border">
                          <CardHeader>
                            <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                              <CategoryIcon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <CardTitle className="text-lg leading-tight">
                              {category.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                              {hasSubcategories ? "View options" : "Get quote"}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Takkiwebsolution. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
