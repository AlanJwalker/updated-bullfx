import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function OnboardingModal() {
  const [ibCode, setIbCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ibCode: ibCode.trim() || null }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to complete onboarding");
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Welcome to Bull Capital FX!", description: "Your account is ready. Start trading now." });
    } catch {
      toast({ title: "Error", description: "Failed to complete setup", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" data-testid="onboarding-modal">
      <div className="bg-card w-full max-w-md rounded-2xl border border-white/10 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">B</div>
          <h2 className="text-2xl font-display font-bold mb-2" data-testid="text-welcome">Welcome to Bull Capital FX</h2>
          <p className="text-muted-foreground text-sm">Your account has been created. You're ready to start trading.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
              Introducing Broker Code (Optional)
            </label>
            <input
              type="text"
              value={ibCode}
              onChange={(e) => setIbCode(e.target.value)}
              placeholder="Enter IB code if you have one"
              className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none border border-white/5"
              data-testid="input-ib-code"
            />
            <p className="text-xs text-muted-foreground mt-1">If you were referred by a broker, enter their code here.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-amber-500 text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          data-testid="button-start-trading"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start Trading <ArrowRight className="w-5 h-5" /></>}
        </button>
      </div>
    </div>
  );
}
