import { useState } from "react";
import { contactAPI } from "@/api";
import { toast } from "react-hot-toast";

const ContactForm = ({color}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await contactAPI.sendContactMessage(formData);
      toast.success("Your message has been sent successfully! We'll get back to you soon.");
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.response?.data?.message || "Failed to send message. Please try again later.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className={`text-3xl font-bold text-${color} mb-6 text-center`}>
          Contact Us
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none   text-gray-900 border-${color}`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={isSubmitting}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none   text-gray-900 border-${color}`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none   text-gray-900 border-${color}`}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-${color} text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
