export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
}

export interface FormQuestion {
  id: string;
  question: string;
  type: "mcq" | "select" | "radio" | "text";
  options?: string[];
  required: boolean;
}

export const servicesData: Service[] = [
  {
    id: "development",
    title: "Software Development Cost Calculators",
    icon: "Code2",
    description: "Click on the card to reach the cost calculator for your required solution type",
    categories: [
      {
        id: "by-type",
        name: "By type: web, mobile, website, DWH, API",
        icon: "Monitor",
        subcategories: [
          { id: "web-app", name: "Web app", icon: "Globe" },
          { id: "web-portal", name: "Web portal", icon: "Layout" },
          { id: "website", name: "Website", icon: "FileCode" },
          { id: "mobile-app", name: "Mobile app", icon: "Smartphone" },
          { id: "intranet", name: "Intranet", icon: "Network" },
          { id: "data-warehouse", name: "Data warehouse", icon: "Database" },
          { id: "api", name: "API", icon: "Boxes" },
          { id: "other-software", name: "Other software type", icon: "Code" },
        ],
      },
      {
        id: "by-function",
        name: "By function: ERP, CRM, SCM, accounting, etc.",
        icon: "Settings",
        subcategories: [
          { id: "erp", name: "ERP software", icon: "Zap" },
          { id: "crm", name: "CRM software", icon: "Users" },
          { id: "supply-chain", name: "Supply chain software", icon: "Truck" },
          { id: "procurement", name: "Procurement software", icon: "ShoppingCart" },
          { id: "srm", name: "Supplier relationship management (SRM) software", icon: "Link" },
          { id: "inventory", name: "Inventory management software", icon: "Package" },
          { id: "warehouse", name: "Warehouse management software", icon: "Warehouse" },
          { id: "asset", name: "Asset management software", icon: "Shield" },
          { id: "fleet", name: "Fleet management software", icon: "Car" },
          { id: "order", name: "Order management software", icon: "ClipboardList" },
          { id: "finance", name: "Corporate finance software", icon: "DollarSign" },
          { id: "accounting", name: "Accounting software", icon: "Calculator" },
        ],
      },
      {
        id: "by-industry",
        name: "By industry: healthcare, BFSI, and other",
        icon: "Building2",
        subcategories: [
          { id: "healthcare", name: "Healthcare software", icon: "Heart" },
          { id: "banking", name: "Banking software", icon: "Landmark" },
          { id: "insurance", name: "Insurance software", icon: "Shield" },
          { id: "retail", name: "Retail software", icon: "Store" },
          { id: "manufacturing", name: "Manufacturing software", icon: "Factory" },
          { id: "education", name: "Education software", icon: "GraduationCap" },
        ],
      },
      {
        id: "by-technology",
        name: "By technology: AI/ML, AR, blockchain, big data, and more",
        icon: "Cpu",
        subcategories: [
          { id: "ai-ml", name: "AI/ML solutions", icon: "Brain" },
          { id: "ar-vr", name: "AR/VR solutions", icon: "Glasses" },
          { id: "blockchain", name: "Blockchain solutions", icon: "Lock" },
          { id: "iot", name: "IoT solutions", icon: "Wifi" },
          { id: "cloud", name: "Cloud solutions", icon: "Cloud" },
          { id: "bigdata", name: "Big data solutions", icon: "BarChart" },
        ],
      },
      {
        id: "by-language",
        name: "By programming language: .NET, PHP, Java, and other",
        icon: "Code2",
        subcategories: [
          { id: "dotnet", name: ".NET development", icon: "FileCode" },
          { id: "php", name: "PHP development", icon: "FileCode" },
          { id: "java", name: "Java development", icon: "Coffee" },
          { id: "python", name: "Python development", icon: "FileCode" },
          { id: "javascript", name: "JavaScript development", icon: "FileCode" },
          { id: "react", name: "React development", icon: "Atom" },
        ],
      },
    ],
  },
  {
    id: "platform",
    title: "Platform-Based Solutions",
    icon: "Layers",
    description: "Comprehensive platform solutions for enterprise needs",
    categories: [
      {
        id: "microsoft-365",
        name: "Microsoft 365 software",
        icon: "Microsoft",
      },
      {
        id: "dynamics-365",
        name: "Dynamics 365 software",
        icon: "Workflow",
      },
      {
        id: "sharepoint",
        name: "SharePoint software",
        icon: "Share2",
      },
      {
        id: "servicenow",
        name: "ServiceNow software",
        icon: "Server",
      },
    ],
  },
  {
    id: "managed-it",
    title: "Managed IT Service Cost Calculators",
    icon: "Wrench",
    description: "A trusted partner to monitor, troubleshoot, and evolve any components of your IT infrastructure",
    categories: [
      {
        id: "maintenance",
        name: "Software maintenance",
        icon: "Tool",
      },
      {
        id: "infrastructure",
        name: "IT infrastructure management",
        icon: "Server",
      },
      {
        id: "helpdesk",
        name: "Help desk services",
        icon: "Headphones",
      },
      {
        id: "migration",
        name: "Cloud migration",
        icon: "CloudUpload",
      },
    ],
  },
];

export const getFormQuestions = (
  serviceId: string,
  categoryId: string,
  subcategoryId?: string
): FormQuestion[] => {
  // Dynamic questions based on service/category/subcategory
  const baseQuestions: FormQuestion[] = [
    {
      id: "q1",
      question: "What is the primary goal of your project?",
      type: "mcq",
      options: [
        "Improve operational efficiency",
        "Increase revenue",
        "Enhance customer experience",
        "Reduce costs",
        "Digital transformation",
      ],
      required: true,
    },
    {
      id: "q2",
      question: "What is your estimated project timeline?",
      type: "radio",
      options: [
        "Less than 3 months",
        "3-6 months",
        "6-12 months",
        "More than 12 months",
        "Flexible/Not sure",
      ],
      required: true,
    },
    {
      id: "q3",
      question: "How many users will use this solution?",
      type: "select",
      options: [
        "1-10 users",
        "11-50 users",
        "51-100 users",
        "101-500 users",
        "500+ users",
      ],
      required: true,
    },
    {
      id: "q4",
      question: "Do you need integration with existing systems?",
      type: "radio",
      options: [
        "Yes, multiple integrations",
        "Yes, one or two integrations",
        "No integrations needed",
        "Not sure",
      ],
      required: true,
    },
    {
      id: "q5",
      question: "What is your budget range?",
      type: "select",
      options: [
        "Under $10,000",
        "$10,000 - $50,000",
        "$50,000 - $100,000",
        "$100,000 - $250,000",
        "$250,000+",
        "To be determined",
      ],
      required: true,
    },
    {
      id: "q6",
      question: "Any specific requirements or additional details?",
      type: "text",
      required: false,
    },
  ];

  return baseQuestions;
};
