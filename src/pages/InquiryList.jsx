import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

export default function InquiryList() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/inquiries/all`)
      .then(res => {
        setInquiries(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch inquiries");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold">Inquiry Records</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquiries
          .filter(
            ({ user_details }) =>
              user_details && Object.keys(user_details).length > 0
          )
          .map(({ sessionId, user_details, service, category, subcategory }) => (
            <Link
              to={`/admin/inquiries/${sessionId}`}
              key={sessionId}
              className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              style={{
                animation: `fadeInUp 0.3s ease forwards`,
                animationDelay: `${Math.random() * 0.4}s`,
              }}
            >
              <h2 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                {user_details.name || "Anonymous User"}
              </h2>
              <p className="text-primary-foreground mb-2 font-semibold">{service.name}</p>
              <p className="text-muted-foreground text-sm">
                Category: {category.name} | Subcategory: {subcategory.name}
              </p>
            </Link>
          ))}

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

