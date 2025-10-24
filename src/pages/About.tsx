import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Learn more about Takkiwebsolution and our mission to deliver
            innovative IT solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
