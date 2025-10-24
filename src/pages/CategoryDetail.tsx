import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import Navbar from "@/components/Navbar";
import { servicesData } from "@/data/servicesData";

const CategoryDetail = () => {
  const { serviceId, categoryId } = useParams();
  const navigate = useNavigate();

  const service = servicesData.find((s) => s.id === serviceId);
  const category = service?.categories.find((c) => c.id === categoryId);

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon || Icons.Code2;
  };

  if (!service || !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button onClick={() => navigate("/pricing")}>Back to Services</Button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getIcon(category.icon);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="mb-8 animate-fade-in"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          {/* Header */}
          <div className="mb-12 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-hero rounded-xl">
                <CategoryIcon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  {category.name}
                </h1>
                <p className="text-muted-foreground mt-2">{service.title}</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mt-4">
              Select the specific type of solution you're interested in to get a
              customized quote.
            </p>
          </div>

          {/* Subcategories Grid */}
          {category.subcategories && category.subcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.subcategories.map((subcategory, index) => {
                const SubIcon = getIcon(subcategory.icon);
                
                return (
                  <Link
                    key={subcategory.id}
                    to={`/inquiry/${serviceId}/${categoryId}/${subcategory.id}`}
                    className="block animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Card className="h-full group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-border">
                      <CardHeader>
                        <div className="p-3 bg-gradient-hero rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform">
                          <SubIcon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                          Get quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No subcategories available for this service.
                </p>
                <Link to={`/inquiry/${serviceId}/${categoryId}`}>
                  <Button className="bg-gradient-hero">
                    Proceed to Get Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
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

export default CategoryDetail;
