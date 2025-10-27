import { useState, useEffect } from "react";
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
import StepIndicator from "@/components/StepIndicator";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { z } from "zod";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  work_email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone_number: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid phone number" })
    .max(20, { message: "Phone number is too long" }),
  company_name: z.string().trim().max(100).optional(),
  preferred_communication: z.string().optional(),
});

const InquiryForm = () => {
  const { subcategoryId } = useParams();
  const navigate = useNavigate();

  const [formSteps, setFormSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("formSessionId") || null
  );

  // Contact form data state separate from steps formData
  const [contactData, setContactData] = useState({
    name: "",
    company_name: "",
    work_email: "",
    phone_number: "",
    preferred_communication: "",
  });

  const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

  const [phoneError, setPhoneError] = useState("");
  const [commError, setCommError] = useState("");

  const handlePhoneChange = (value) => {
    // Allow empty string or only digits
    if (value === "" || /^\d+$/.test(value)) {
      handleContactChange("phone_number", value);
      setPhoneError("");
    } else {
      setPhoneError("Please enter only numbers");
    }
  };

  console.log("subcategoryId->>", subcategoryId);
  useEffect(() => {
    const fetchFormSteps = async () => {
      if (!subcategoryId) return;
      console.log("subcategoryId->>", subcategoryId);

      try {
        setLoading(true);
        const response2 = await axios.get(
          `${apiUrl}/api/fetch_formsData/${subcategoryId}`
        );

        setFormSteps(response2.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch form steps", error);
        setError("Failed to load form data.");
        setLoading(false);
      }
    };
    fetchFormSteps();
  }, [subcategoryId]);

  const totalSteps = formSteps.length + 1; // +1 for contact form
  const currentStep =
    currentStepIndex < formSteps.length ? formSteps[currentStepIndex] : null;
  const isContactStep = currentStepIndex === formSteps.length;

  // Handle answer changes for questions
  const handleAnswerChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handle contact form field changes
  const handleContactChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate required questions for current step
  const validateStep = () => {
    if (!currentStep || !currentStep.questions) return true;
    for (const q of currentStep.questions) {
      if (
        q.is_required &&
        (formData[q.id] === undefined || formData[q.id] === "")
      ) {
        toast.error(
          `Please answer the required question: "${q.question_text}"`
        );
        return false;
      }
    }
    return true;
  };

  const submitCurrentStep = async () => {
    if (!validateStep()) return;

    try {
      const stepId = currentStep.id;
      const stepOrder = currentStep.step_order;

      // Build payload in expected format for API
      const payload = Object.entries(formData)
        .map(([question_id, answer]) => {
          if (Array.isArray(answer)) {
            // Multiple choice answers, send individual responses
            return answer.map((ans) => ({
              question_id,
              selected_option_id: ans, // Assumes answer is option id
              response_value: null,
            }));
          }
          // Single answer
          return {
            question_id,
            selected_option_id: answer, // or set null if text input? Adjust as needed
            response_value: typeof answer === "string" ? answer : null,
          };
        })
        .flat();

      const headers = sessionId ? { "x-session-id": sessionId } : {};

      const response = await axios.post(
        `${apiUrl}/api/user_responses/${stepId}`,
        payload,
        { headers }
      );

      if (stepOrder === 1 && response.data.sessionId) {
        localStorage.setItem("formSessionId", response.data.sessionId);
        setSessionId(response.data.sessionId);
      }

      setFormData({});
      setCurrentStepIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting form step:", error);
      toast.error("Failed to submit step, please try again.");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      contactSchema.parse(contactData);
      if (!contactData.preferred_communication) {
        setCommError("Preferred communication method is required.");
        return;
      } else {
        setCommError(""); // clear error if valid
      }

      const contactDataResponse = await axios.post(
        `${apiUrl}/api/final-contacts/${sessionId}`,
        contactData
      );

      if (contactDataResponse.status === 201) {
        localStorage.removeItem("formSessionId");
        setSubmitted(true);
      } else {
        // If backend responds with other than 201, show message if any
        const msg =
          contactDataResponse.data?.message ||
          "Unexpected response from server. Please try again.";
        toast.error(msg);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else if (axios.isAxiosError(error)) {
        // Axios error - try to extract backend error message
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit contact info, please try again.";
        toast.error(backendMessage);
      } else {
        console.error("Error submitting contact info:", error);
        toast.error("Failed to submit contact info, please try again.");
      }
    }
  };

  if (loading) return <p>Loading form...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (submitted)
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
                <h1
                  className="text-3xl font-bold mb-4 animate-fade-in"
                  style={{ animationDelay: "100ms" }}
                >
                  Thank You for Your Inquiry!
                </h1>
                <p
                  className="text-lg text-muted-foreground mb-8 animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  We've received your request and will get back to you within 24
                  hours with a detailed quote and proposal.
                </p>
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

  const renderQuestion = (question) => {
    switch (question.input_type) {
      case "checkbox":
        return question.options.map((opt) => (
          <div key={opt.id} className="flex items-center space-x-3">
            <input
              id={opt.id}
              type="checkbox"
              checked={
                Array.isArray(formData[question.id]) &&
                formData[question.id].includes(opt.id)
              }
              onChange={(e) => {
                const checked = e.target.checked;
                const current = formData[question.id] || [];
                if (checked) {
                  handleAnswerChange(question.id, [...current, opt.id]);
                } else {
                  handleAnswerChange(
                    question.id,
                    current.filter((o) => o !== opt.id)
                  );
                }
              }}
              className="h-5 w-5 border-2 border-primary  accent-primary focus:ring-2 focus:ring-primary transition-all cursor-pointer"
            />
            <Label htmlFor={opt.id} className="cursor-pointer ">
              {opt.option_label}
            </Label>
          </div>
        ));

      case "radio":
        return (
          <RadioGroup
            value={formData[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options.map((opt) => (
              <div key={opt.id} className="flex items-center space-x-3">
                <RadioGroupItem value={opt.id} id={opt.id} />
                <Label htmlFor={opt.id} className="cursor-pointer">
                  {opt.option_label}
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
              {question.options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.option_label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "text":
      default:
        return (
          <Textarea
            value={formData[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in">
            <StepIndicator
              totalSteps={totalSteps}
              currentStep={currentStepIndex}
            />
          </div>

          <Card className="animate-scale-in shadow-elegant hover:shadow-hover transition-all duration-300">
            <CardHeader>
              <CardTitle
                className="text-2xl animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                {currentStep
                  ? `Step ${currentStepIndex + 1}`
                  : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isContactStep ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await submitCurrentStep();
                  }}
                  className="space-y-6"
                >
                  {currentStep.questions.length === 0 && (
                    <p className="text-muted-foreground">
                      No questions in this step.
                    </p>
                  )}
                  {currentStep.questions.map((question) => (
                    <div className="space-y-6" key={question.id}>
                      <Label className="text-lg font-medium mb-4 block">
                        {question.question_text}
                        {question.is_required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>
                      {renderQuestion(question)}
                    </div>
                  ))}

                  <div className="flex justify-between pt-6 border-t animate-fade-in">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentStepIndex === 0}
                      className="transition-all hover:scale-105"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="submit"
                      className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={contactData.name}
                      onChange={(e) =>
                        handleContactChange("name", e.target.value)
                      }
                      placeholder="John Doe"
                      required
                      className={error ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="work_email"
                      type="email"
                      value={contactData.work_email}
                      onChange={(e) =>
                        handleContactChange("work_email", e.target.value)
                      }
                      placeholder="john@example.com"
                      required
                      className={error ? "border-destructive" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={contactData.phone_number}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="1234567890"
                      required
                      className={phoneError ? "border-destructive" : ""}
                    />
                    {phoneError && (
                      <p className="text-sm text-destructive">{phoneError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={contactData.company_name}
                      onChange={(e) =>
                        handleContactChange("company_name", e.target.value)
                      }
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_communication">
                      Preferred Communication{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={contactData.preferred_communication}
                      onValueChange={(val) => {
                        handleContactChange("preferred_communication", val);
                        if (val) setCommError(""); // clear error on valid selection
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select communication method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    {commError && (
                      <div className="text-destructive text-sm mt-1">
                        {commError}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t animate-fade-in">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="transition-all hover:scale-105"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="submit"
                      className="bg-gradient-hero hover:opacity-90 transition-all hover:scale-105 shadow-elegant"
                    >
                      Submit Inquiry
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Takkiwebsolution. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default InquiryForm;
