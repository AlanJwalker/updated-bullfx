import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAccount, useProducts, useOrders } from "@/hooks/use-market";
import { useRealtimePrices } from "@/hooks/use-websocket";
import { BottomNav } from "@/components/Navigation";
import { MarketCard } from "@/components/MarketCard";
import { Loader2, TrendingUp, TrendingDown, Plus, Minus, ArrowUpRight, ArrowDownRight, History, User, Bell, Shield, Settings, LogOut, X } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { formatUSD } from "@/lib/currency";

export default function Home() {
  const { user, logout } = useAuth();
  const { data: portfolio, isLoading: loadingAccount } = useAccount();
  const { data: products } = useProducts();
  const { data: allOrders } = useOrders();
  const [, setLocation] = useLocation();
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  useRealtimePrices();

  if (loadingAccount) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
      </div>
    );
  }

  const account = portfolio?.account;
  const isProfit = (portfolio?.totalPnL || 0) >= 0;

  const topMovers = products?.sort((a, b) => 
    Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0)
  ).slice(0, 3) || [];

  const closedTrades = (allOrders || [])
    .filter((o: any) => o.status === "closed" && o.pnl != null)
    .sort((a: any, b: any) => new Date(b.closedAt).getTime() - new Date(a.closedAt).getTime());

  const totalRealizedPnl = closedTrades.reduce((sum: number, o: any) => sum + Number(o.pnl || 0), 0);
  const winCount = closedTrades.filter((o: any) => Number(o.pnl) >= 0).length;
  const loseCount = closedTrades.filter((o: any) => Number(o.pnl) < 0).length;

  const productMap = new Map((products || []).map((p: any) => [p.id, p]));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold font-display" data-testid="text-greeting">{user?.firstName || 'Trader'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-[8px]">B</div>
            <button
              onClick={() => setShowProfilePanel(true)}
              className="w-10 h-10 rounded-full bg-secondary overflow-hidden border border-border hover:border-amber-500/50 transition-colors cursor-pointer"
              data-testid="button-profile-avatar"
            >
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold bg-amber-500/20 text-amber-400">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-card to-card/50 p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden" data-testid="portfolio-card">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4" data-testid="text-total-balance">
            {formatUSD(parseFloat(account?.balance || "0") + (portfolio?.totalPnL || 0))}
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md bg-white/5 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`} data-testid="text-pnl">
              {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{formatUSD(Math.abs(portfolio?.totalPnL || 0))}</span>
            </div>
            <span className="text-xs text-muted-foreground">Today's P&L</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setLocation('/wallet')} className="flex items-center justify-center gap-2 py-3 bg-amber-500 text-black rounded-xl font-bold text-sm hover:bg-amber-400 transition-all" data-testid="button-deposit">
              <Plus className="w-4 h-4" /> Deposit
            </button>
            <button onClick={() => setLocation('/wallet')} className="flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold text-sm hover:bg-secondary/80 transition-all" data-testid="button-withdraw">
              <Minus className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Top Movers</h3>
          <button 
            onClick={() => setLocation('/markets')}
            className="text-amber-400 text-sm font-medium hover:underline"
            data-testid="link-see-all"
          >
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {topMovers.map((product) => (
            <div key={product.id} className="min-w-[160px]">
              <MarketCard 
                product={product} 
                compact 
                onClick={() => setLocation(`/trade/${product.id}`)} 
              />
            </div>
          ))}
          {topMovers.length === 0 && (
            <div className="text-muted-foreground text-sm italic">Loading markets...</div>
          )}
        </div>
      </section>

      <section className="px-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Market Overview</h3>
        <div className="space-y-3">
          {products?.slice(0, 6).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <MarketCard 
                product={product} 
                onClick={() => setLocation(`/trade/${product.id}`)} 
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 mb-8" data-testid="section-pnl-history">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg">Trade History</h3>
          </div>
          {closedTrades.length > 0 && (
            <span className="text-xs text-muted-foreground">{closedTrades.length} trades</span>
          )}
        </div>

        {closedTrades.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-card rounded-xl p-3 border border-border text-center" data-testid="stat-realized-pnl">
              <p className="text-[10px] text-muted-foreground mb-0.5">Realized P&L</p>
              <p className={`text-lg font-bold font-mono ${totalRealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalRealizedPnl >= 0 ? '+' : ''}{formatUSD(totalRealizedPnl)}
              </p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center" data-testid="stat-wins">
              <p className="text-[10px] text-muted-foreground mb-0.5">Wins</p>
              <p className="text-lg font-bold text-emerald-400">{winCount}</p>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border text-center" data-testid="stat-losses">
              <p className="text-[10px] text-muted-foreground mb-0.5">Losses</p>
              <p className="text-lg font-bold text-rose-400">{loseCount}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {closedTrades.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-muted-foreground text-sm">No closed trades yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your trade history will appear here</p>
            </div>
          ) : (
            closedTrades.slice(0, 20).map((order: any) => {
              const pnl = Number(order.pnl || 0);
              const product = productMap.get(order.productId);
              const isBuy = order.type === "buy";
              const isJpy = product?.symbol?.includes('JPY');
              const decimals = isJpy ? 3 : 5;
              return (
                <div key={order.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3" data-testid={`trade-history-${order.id}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isBuy ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {isBuy ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate">{product?.symbol || `#${order.productId}`}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {order.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{Number(order.lotSize).toFixed(2)} lots</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span>Entry: {Number(order.price).toFixed(decimals)}</span>
                      <span className="ml-auto">{order.closedAt ? new Date(order.closedAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                  <div className={`text-right font-mono font-bold text-sm ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} data-testid={`pnl-${order.id}`}>
                    {pnl >= 0 ? '+' : ''}{formatUSD(pnl)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {showProfilePanel && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowProfilePanel(false)}
            data-testid="profile-panel-backdrop"
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200" data-testid="profile-panel">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold font-display text-lg">Profile</h2>
                <button onClick={() => setShowProfilePanel(false)} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors" data-testid="button-close-profile-panel">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary overflow-hidden border border-border shrink-0">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold bg-amber-500/20 text-amber-400">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {[
                { icon: User, label: "My Profile", path: "/profile", testId: "link-profile" },
                { icon: Bell, label: "Notifications", path: "/profile/notifications", testId: "link-notifications" },
                { icon: Shield, label: "Security", path: "/profile/security", testId: "link-security" },
                { icon: Settings, label: "Preferences", path: "/profile/preferences", testId: "link-preferences" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => { setShowProfilePanel(false); setLocation(item.path); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                  data-testid={item.testId}
                >
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-amber-400 transition-colors" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <button
                onClick={() => { setShowProfilePanel(false); logout(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold text-sm transition-colors"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
