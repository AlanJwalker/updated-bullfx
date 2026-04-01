import { ArrowRight, Shield, Zap, Globe, TrendingUp, BarChart3, DollarSign, LineChart } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm" data-testid="logo-icon">B</div>
            <span className="font-display font-bold text-xl" data-testid="brand-name">Bull Capital FX</span>
          </div>
          <a href="/login" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-full text-sm font-bold transition-all" data-testid="login-button">
            Log In
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wider mb-6 border border-amber-500/20" data-testid="badge-tagline">
                TRUSTED CFD BROKER
              </span>
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6" data-testid="hero-heading">
                Trade Global CFDs <br />
                <span className="text-gradient">With Confidence</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
                Access 25+ instruments across Forex, Indices, Commodities & Stocks. 
                Tight spreads, fast execution, and powerful tools — all from one platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/signup" className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2" data-testid="cta-start-trading">
                  Start Trading Now <ArrowRight className="w-5 h-5" />
                </a>
                <a href="#instruments" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all border border-white/5" data-testid="cta-explore">
                  Explore Markets
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 mb-20">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "25", label: "Instruments" },
              { value: "0.0", label: "Pip Spreads" },
              { value: "<10ms", label: "Execution" },
              { value: "1:100", label: "Leverage" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/60 backdrop-blur-sm p-6 rounded-2xl border border-white/5 text-center"
                data-testid={`stat-card-${i}`}
              >
                <p className="text-3xl font-display font-bold text-amber-400">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="instruments" className="py-20 px-4 bg-secondary/20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-4" data-testid="instruments-heading">Trade What Moves You</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">Diversify your portfolio across multiple asset classes with competitive conditions.</p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: DollarSign, title: "Forex", desc: "Major, minor & exotic pairs", count: "15" },
                { icon: BarChart3, title: "Indices", desc: "Global stock indices", count: "3" },
                { icon: TrendingUp, title: "Minor Pairs", desc: "Cross currency pairs", count: "5" },
                { icon: LineChart, title: "Stocks", desc: "Top global equities", count: "3" },
                { icon: Globe, title: "Commodities", desc: "Gold, oil & metals", count: "5" },
              ].map((item, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group text-center" data-testid={`instrument-card-${i}`}>
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                  <p className="text-amber-400 font-bold text-sm">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-center mb-16" data-testid="features-heading">Why Choose Bull Capital FX?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Ultra-Fast Execution", desc: "Sub-10ms order execution with 99.9% uptime. No requotes, no slippage." },
                { icon: Shield, title: "Secure & Reliable", desc: "Bank-grade encryption protects your funds. Segregated client accounts for your safety." },
                { icon: Globe, title: "Global Market Access", desc: "Trade Forex, Indices, Crypto, Stocks & Commodities — all from a single account." }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors group" data-testid={`feature-card-${i}`}>
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border-y border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4" data-testid="cta-heading">Ready to Start Trading?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of traders who trust Bull Capital FX for their CFD trading needs.</p>
            <a href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black rounded-xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/25" data-testid="cta-bottom-signup">
              Open Live Account <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-xs">B</div>
              <span className="font-display font-bold text-sm">Bull Capital FX</span>
            </div>
            <p className="text-muted-foreground text-xs text-center" data-testid="footer-disclaimer">
              Risk Warning: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.
            </p>
            <p className="text-muted-foreground text-xs" data-testid="footer-copyright">© 2026 Bull Capital FX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
