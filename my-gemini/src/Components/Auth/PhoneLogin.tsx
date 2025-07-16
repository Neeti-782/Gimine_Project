
// Form and validation
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// React
import { useState, useEffect } from "react";

// Components
import OTPVerification from "./OTPVerification";


// Validation schema
const schema = z.object({
  phone: z.string().min(6, "Phone number missing"),
});

type FormValues = z.infer<typeof schema>;


export default function PhoneLogin() {
  // State for dial code, OTP sent, and country codes
  const [dialCode, setDialCode] = useState("+1");
  const [otpSent, setOtpSent] = useState(false);
  const [countryCodes, setCountryCodes] = useState<{ name: string; code: string }[]>([]);

  // Fetch country codes on mount
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=idd,name")
      .then(res => res.json())
      .then(data => {
        const codes = data
          .filter((c: any) => c.idd && c.idd.root)
          .map((c: any) => {
            const suffix = c.idd.suffixes?.[0] || "";
            return {
              name: c.name.common,
              code: c.idd.root + suffix,
            };
          })
          .filter((c: any) => c.code && c.code.length > 1)
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      });
  }, []);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // Handle form submit
  const onSubmit = (data: FormValues) => {
    // console.log("Sending OTP to:", dialCode + data.phone);
    setTimeout(() => setOtpSent(true), 1000);
  };

  // Render country code select options
  const renderCountryOptions = () => {
    if (countryCodes.length === 0) return <option>Loading...</option>;
    return countryCodes.map(c => (
      <option
        key={c.code + c.name}
        value={c.code}
        title={`${c.code} (${c.name})`}
        className="truncate overflow-hidden whitespace-nowrap"
      >
        {`${c.code} (${c.name.length > 10 ? c.name.slice(0, 15) + '…' : c.name})`}
      </option>
    ));
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 space-y-6 border border-blue-200 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">Welcome to Gemini</h2>
        <p className="text-gray-500 text-sm mb-2">Login or Signup with your phone number</p>
      </div>

      {/* Main content: form or OTP verification */}
      {!otpSent ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-0">
            <select
              value={dialCode}
              onChange={e => setDialCode(e.target.value)}
              className="w-[5rem] h-12 text-blue-700 font-semibold border border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-blue-100 truncate overflow-hidden whitespace-nowrap"
            >
              {renderCountryOptions()}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              className="flex-1 h-12 p-4 border-t border-b border-r border-blue-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700 bg-white"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <OTPVerification phone={dialCode} onBack={() => setOtpSent(false)} />
      )}
    </div>
  );
}
