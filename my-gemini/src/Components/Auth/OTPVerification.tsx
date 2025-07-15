import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  otp: z.string().length(4, "Enter a 4-digit OTP"),
});

type FormValues = z.infer<typeof schema>;

interface OTPVerificationProps {
  phone: string;
  onBack: () => void;
}

export default function OTPVerification({ phone, onBack }: OTPVerificationProps) {
  const [verified, setVerified] = useState(false);
  const setPhone = useAuthStore((s) => s.setPhone);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Verifying OTP:", data.otp);
    setTimeout(() => {
      setVerified(true);
      setPhone(phone);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!verified ? (
        <>
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="text-blue-600 text-lg font-semibold">Enter OTP sent to <span className="font-mono">{phone}****</span></span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center tracking-widest text-lg font-mono"
              maxLength={4}
              {...register("otp")}
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              className="w-full text-blue-500 text-xs mt-2 underline hover:text-blue-700"
              onClick={onBack}
            >
              Edit Phone Number
            </button>
          </form>
        </>
      ) : (
        <div className="text-green-600 font-bold text-center text-lg animate-pulse">✅ Verified Successfully!</div>
      )}
    </div>
  );
}
