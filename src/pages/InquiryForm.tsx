import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { servicesData, getFormQuestions } from "@/data/servicesData";
import { toast } from "sonner";
import { z } from "zod";

// Contact form validation schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid phone number" })
    .max(20, { message: "Phone number is too long" }),
  company: z.string().trim().max(100).optional(),
  additional: z.string().trim().max(1000).optional(),
});

const InquiryForm = () => {
  const { serviceId, categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const service = servicesData.find((s) => s.id === serviceId);
  const category = service?.categories.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories?.find((sc) => sc.id === subcategoryId);

  const questions = getFormQuestions(
    serviceId || "",
    categoryId || "",
    subcategoryId
  );

  const totalSteps = questions.length + 1; // +1 for contact info
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (!service || !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button onClick={() => navigate("/pricing")}>Back to Services</Button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    if (currentStep < questions.length) {
      if (currentQuestion?.required && !formData[currentQuestion.id]) {
        toast.error("Please answer this question before proceeding");
        return;
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate contact info using zod schema
    try {
      contactSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        additional: formData.additional,
      });

      // Here you would typically send the data to your backend
      // Note: Never log sensitive user data in production
      setSubmitted(true);
      toast.success("Your inquiry has been submitted successfully!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-3">
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={
                    Array.isArray(formData[question.id]) &&
                    formData[question.id].includes(option)
                  }
                  onCheckedChange={(checked) => {
                    const current = formData[question.id] || [];
                    if (checked) {
                      handleAnswerChange(question.id, [...current, option]);
                    } else {
                      handleAnswerChange(
                        question.id,
                        current.filter((o: string) => o !== option)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={formData[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={formData[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "text":
        return (
          <Textarea
            value={formData[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="text-center animate-scale-in shadow-elegant">
              <CardContent className="p-12">
                <div className="mb-6 flex justify-center animate-fade-in">
                  <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                    <CheckCircle2 className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
                  Thank You for Your Inquiry!
                </h1>
                <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
                  We've received your request and will get back to you within 24
                  hours with a detailed quote and proposal.
                </p>
                <div className="space-y-3 text-left bg-muted/50 p-6 rounded-lg mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <p className="font-semibold">Summary of your request:</p>
                  <p className="text-sm">
                    <span className="font-medium">Service:</span> {service.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Category:</span> {category.name}
                  </p>
                  {subcategory && (
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {subcategory.name}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant animate-fade-in"
                  size="lg"
                  style={{ animationDelay: "400ms" }}
                >
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm text-primary font-semibold">
                {Math.round(progress)}% Complete
              </span>
            </div>
            {/* <Progress value={progress} className="h-2.5 transition-all duration-500" /> */}
          </div>

          {/* Form Card */}
          <Card className="animate-scale-in shadow-elegant hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2 animate-fade-in">
                {service.title} → {category.name}
                {subcategory && ` → ${subcategory.name}`}
              </div>
              <CardTitle className="text-2xl animate-fade-in" style={{ animationDelay: "100ms" }}>
                {currentStep < questions.length
                  ? `Question ${currentStep + 1}`
                  : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep < questions.length ? (
                  // Question Step
                  <div className="space-y-6 animate-fade-in" key={currentStep}>
                    <div>
                      <Label className="text-lg font-medium mb-4 block">
                        {questions[currentStep].question}
                        {questions[currentStep].required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {renderQuestion(questions[currentStep])}
                    </div>
                  </div>
                ) : (
                  // Contact Info Step
                  <div className="space-y-4 animate-fade-in" key="contact">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) => {
                          handleAnswerChange("name", e.target.value);
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        placeholder="John Doe"
                        className={errors.name ? "border-destructive" : ""}
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => {
                          handleAnswerChange("email", e.target.value);
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        placeholder="john@example.com"
                        className={errors.email ? "border-destructive" : ""}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={(e) => {
                          handleAnswerChange("phone", e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                        placeholder="+1 (555) 000-0000"
                        className={errors.phone ? "border-destructive" : ""}
                        required
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive animate-fade-in">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={formData.company || ""}
                        onChange={(e) => handleAnswerChange("company", e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additional">Additional Details</Label>
                      <Textarea
                        id="additional"
                        value={formData.additional || ""}
                        onChange={(e) =>
                          handleAnswerChange("additional", e.target.value)
                        }
                        placeholder="Any additional information you'd like to share..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t animate-fade-in">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="transition-all hover:scale-105"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {currentStep < totalSteps - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant"
                    >
                      Submit Inquiry
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
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

export default InquiryForm;
