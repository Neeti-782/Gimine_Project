import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CountrySelect from "./CountrySelect";
import { useState } from "react";
import OTPVerification from "./OTPVerification";

const schema = z.object({
  phone: z.string().min(6, "Phone number missing"),
});

type FormValues = z.infer<typeof schema>;

export default function PhoneLogin() {
  const [dialCode, setDialCode] = useState("+1");
  const [otpSent, setOtpSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Sending OTP to:", dialCode + data.phone);
    setTimeout(() => {
      setOtpSent(true);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 to-blue-100 space-y-6 border border-blue-200 animate-fade-in">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">Welcome to Gemini</h2>
        <p className="text-gray-500 text-sm mb-2">Login or Signup with your phone number</p>
      </div>
      {!otpSent ? (
        <>
          <div className="mb-4">
            <CountrySelect onChange={(code) => setDialCode(code)} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 bg-blue-200 text-blue-700 rounded-l font-semibold border border-blue-300">{dialCode}</span>
              <input
                type="text"
                placeholder="Phone Number"
                className="flex-1 p-2 border-t border-b border-r border-blue-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
        </>
      ) : (
        <OTPVerification phone={dialCode} onBack={() => setOtpSent(false)} />
      )}
    </div>
  );
}
