import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

export default function InquiryDetail() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/inquiries/session/${sessionId}`)
      .then((res) => {
        setInquiry(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load inquiry details");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <p className="text-center py-10">Loading details...</p>;
  if (error) return <p className="text-red-600 text-center py-10">{error}</p>;
  if (!inquiry) return <p className="text-center py-10">No data found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline transition"
      >
        &larr; Back to Inquiries
      </button>

      <h1 className="text-3xl font-extrabold mb-8 border-b pb-4">Inquiry Details</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-1">User Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
          <div><dt className="font-medium">Name:</dt><dd>{inquiry.user_details.name || "N/A"}</dd></div>
          <div><dt className="font-medium">Company:</dt><dd>{inquiry.user_details.company_name || "N/A"}</dd></div>
          <div><dt className="font-medium">Email:</dt><dd>{inquiry.user_details.work_email || "N/A"}</dd></div>
          <div><dt className="font-medium">Phone:</dt><dd>{inquiry.user_details.phone_number || "N/A"}</dd></div>
          <div><dt className="font-medium">Preferred Communication:</dt><dd>{inquiry.user_details.preferred_communication || "None"}</dd></div>
        </dl>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 border-b pb-1">Service & Category</h2>
        <p><strong>Service:</strong> {inquiry.service.name}</p>
        <p><strong>Category:</strong> {inquiry.category.name}</p>
        <p><strong>Subcategory:</strong> {inquiry.subcategory.name}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-1">Questions & Answers</h2>
        <ol className="list-decimal list-inside space-y-4">
          {inquiry.questions.map((q) => (
            <li key={q.id} className="text-gray-900">
              <p className="font-medium">{q.question}</p>
              <p className="text-gray-700">Answer: {q.answer}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

