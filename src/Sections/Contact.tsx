import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiMapPin, FiSend, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import ShinyText from "../Components/gradient";
import FadeContent from "../Components/FadeContent";

// Reusable FormField component
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  as?: "input" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  as = "input",
  value,
  onChange,
  required = false,
}) => {
  const commonProps = {
    id,
    name: id,
    placeholder,
    required,
    value,
    onChange,
    className:
      "w-full p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all duration-300 placeholder-gray-400",
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea {...commonProps} rows={5}></textarea>
      ) : (
        <input type={type} {...commonProps} />
      )}
    </div>
  );
};

// Toast Notification component
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";
  const Icon = isSuccess ? FiCheckCircle : FiAlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-5 right-5 flex items-center gap-3 p-4 rounded-lg shadow-lg text-white ${
        isSuccess ? "bg-green-500/80" : "bg-red-500/80"
      } backdrop-blur-sm border ${isSuccess ? "border-green-400" : "border-red-400"}`}
    >
      <Icon className="text-2xl" />
      <span>{message}</span>
    </motion.div>
  );
};

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const sendEmail = () => {
    if (!form.current) return;

    // Get these from your EmailJS account
    const serviceID = "YOUR_SERVICE_ID";
    const templateID = "YOUR_TEMPLATE_ID";
    const publicKey = "YOUR_PUBLIC_KEY";

    return emailjs.sendForm(serviceID, templateID, form.current, publicKey);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    try {
      await sendEmail();
      setToast({ message: "Message sent successfully!", type: "success" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("FAILED...", error);
      setToast({ message: "Failed to send message. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeToast = () => setToast(null);

  return (
    <section id="contact" className="text-center py-16 md:py-24">
      <FadeContent>
        <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk mb-2">
          <ShinyText>Let's talk</ShinyText>
        </h2>
        <p className="text-lg md:text-xl font-medium mb-6">
          <ShinyText>Contact</ShinyText>
        </p>
        <p className="max-w-xl mx-auto text-gray-300 mb-10">
          Have a question or a project in mind? Feel free to reach out. I'm
          always open to discussing new ideas.
        </p>
      </FadeContent>

      {/* Contact Form */}
      <FadeContent delay={200}>
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto text-left flex flex-col gap-5"
        >
          <FormField id="name" name="user_name" label="Your Name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <FormField id="email" name="user_email" label="Your Email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <FormField id="message" name="message" label="Your Message" as="textarea" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="group flex items-center justify-center gap-3 w-full md:w-auto md:self-end px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <>
                <span>Sending...</span>
                <FiLoader className="animate-spin" />
              </>
            ) : (
              <>
                <span>Send Message</span>
                <motion.div whileHover={{ x: 4, rotate: -5 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <FiSend />
                </motion.div>
              </>
            )}
          </motion.button>
        </form>
      </FadeContent>

      {/* Location */}
      <FadeContent delay={400}>
        <div className="flex items-center justify-center gap-2 text-gray-400 mt-16">
          <FiMapPin />
          <span>Chennai, India</span>
        </div>
      </FadeContent>

      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </section>
  );
};

export default Contact;