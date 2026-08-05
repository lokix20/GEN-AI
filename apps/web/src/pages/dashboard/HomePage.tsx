import { useNavigate } from "react-router-dom";
import { Sun, Leaf, Droplets, TrendingUp, Camera, Calendar, Cloud, Shield } from "lucide-react";
import { useAuthStore } from "../../store/auth.store.js";
import { useCurrentLanguage } from "../../hooks/useCurrentLanguage.js";

const sora = { fontFamily: "'Outfit', sans-serif" };

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { t } = useCurrentLanguage();
  const firstName = user?.name?.split(" ")[0] ?? "Ramesh";

  return (
    <div className="flex flex-col gap-5 text-left">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 style={{ ...sora, fontSize: 28, fontWeight: 700, color: '#12261D', letterSpacing: '-0.02em' }}>
            {t.greeting ? t.greeting.replace("{{name}}", firstName) : `Good afternoon, ${firstName}`}
          </h1>
          <p style={{ fontSize: 13, color: '#5C6B62', marginTop: 3 }}>
            {t.subtitle || "Tuesday, 5 August · 2 things need you today"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={() => navigate('/disease-detection')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:9, background:'#12261D', color:'#F4F3EC', fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            <Camera size={14}/> {t.scanCropBtn || "📷 Scan a crop"}
          </button>
          <button style={{ padding:'9px 16px', borderRadius:9, background:'white', color:'#2B3A32', fontSize:13, fontWeight:600, border:'1px solid #DCDBD1', cursor:'pointer' }}>
            {t.logActivityBtn || "Log activity"}
          </button>
        </div>
      </div>

      {/* Priority Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Card 1 - DO FIRST */}
        <div style={{ background:'#0F2419', borderRadius:16, padding:'22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ background:'#C0442F', color:'white', fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:12, letterSpacing:'0.06em' }}>
              {t.doFirstBadge || "DO FIRST"}
            </span>
            <span style={{ color:'#7F9A88', fontSize:12 }}>Plot A · paddy · 2.4 ac</span>
          </div>
          <div style={{ ...sora, fontSize:20, fontWeight:700, color:'#F4F3EC', lineHeight:1.3 }}>
            {t.doFirstTitle || "Drain Plot A today — blight risk before Wednesday's rain"}
          </div>
          <p style={{ fontSize:13, color:'#8CA396', lineHeight:1.55 }}>
            {t.doFirstDesc || "Leaf blight was detected on 15% of the plot. Standing water plus 42 mm of rain would spread it across the field within a week."}
          </p>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button style={{ padding:'9px 16px', borderRadius:8, background:'#9BD96B', color:'#0F2419', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>
              {t.markDoneBtn || "Mark as done"}
            </button>
            <button style={{ padding:'9px 16px', borderRadius:8, background:'transparent', color:'#D7F0C2', fontSize:13, fontWeight:600, border:'1px solid #34523F', cursor:'pointer' }}>
              {t.seeTreatmentBtn || "See treatment plan"}
            </button>
          </div>
        </div>

        {/* Card 2 - TODAY */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px', display:'flex', flexDirection:'column', gap:10 }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#C27D00', letterSpacing:'0.1em', background:'#FBF1DC', padding:'3px 8px', borderRadius:10, alignSelf:'flex-start' }}>
            {t.todayBadge || "TODAY"}
          </span>
          <div style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>
            {t.irrigateTitle || "Irrigate Plot B before 6 PM"}
          </div>
          <p style={{ fontSize:13, color:'#5C6B62', lineHeight:1.5 }}>
            {t.irrigateDesc || "Tomato soil at 31% — below the fruiting band."}
          </p>
          <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10 }}>
            <span style={{ fontSize:12, color:'#8B978F' }}>~55 min of drip</span>
            <button onClick={() => navigate('/irrigation')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>
              {t.scheduleBtn || "Schedule →"}
            </button>
          </div>
        </div>

        {/* Card 3 - THIS WEEK */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px', display:'flex', flexDirection:'column', gap:10 }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#3B6FA8', letterSpacing:'0.1em', background:'#E4EEF6', padding:'3px 8px', borderRadius:10, alignSelf:'flex-start' }}>
            {t.thisWeekBadge || "THIS WEEK"}
          </span>
          <div style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>
            {t.claimTitle || "Claim PM-KISAN ₹2,000"}
          </div>
          <p style={{ fontSize:13, color:'#5C6B62', lineHeight:1.5 }}>
            {t.claimDesc || "Eligible · 4 of 5 documents already on file."}
          </p>
          <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10 }}>
            <span style={{ fontSize:12, color:'#8B978F' }}>Closes 22 Aug</span>
            <button onClick={() => navigate('/schemes')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>
              {t.applyBtn || "Apply →"}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Weather */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Sun size={14} color='#C27D00'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>{t.weatherTitle || "Weather today"}</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ ...sora, fontSize:36, fontWeight:700, color:'#12261D' }}>28°</span>
            <span style={{ fontSize:14, color:'#5C6B62', fontWeight:500 }}>Sunny</span>
          </div>
          <div style={{ fontSize:12, color:'#8B978F' }}>Humidity 65% · rain 10% · wind 12 km/h</div>
        </div>

        {/* Crop Health */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Leaf size={14} color='#1B7A4B'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>{t.cropHealthTitle || "Crop health"}</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ ...sora, fontSize:36, fontWeight:700, color:'#12261D' }}>82</span>
            <span style={{ fontSize:14, color:'#8B978F' }}>/100</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:'#EDECE3', overflow:'hidden' }}>
            <div style={{ width:'82%', height:'100%', background:'#1B7A4B' }}/>
          </div>
        </div>

        {/* Soil Moisture */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Droplets size={14} color='#3B6FA8'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>{t.soilMoistureTitle || "Soil moisture"}</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ ...sora, fontSize:36, fontWeight:700, color:'#12261D' }}>31%</span>
            <span style={{ fontSize:13, color:'#C27D00', fontWeight:600 }}>Low</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:'#EDECE3', overflow:'hidden' }}>
            <div style={{ width:'31%', height:'100%', background:'#C27D00' }}/>
          </div>
        </div>

        {/* Mandi Rate */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <TrendingUp size={14} color='#1B7A4B'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>{t.mandiTitle || "Paddy · Kadapa mandi"}</span>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ ...sora, fontSize:36, fontWeight:700, color:'#12261D' }}>₹2,183</span>
            <span style={{ fontSize:13, color:'#1B7A4B', fontWeight:600 }}>▲2.4%</span>
          </div>
          <div style={{ fontSize:12, color:'#8B978F' }}>MSP ₹2,300 · hold advisory active</div>
        </div>
      </div>

      {/* Main Grid: Mandi chart + Activity timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left 2 cols: Mandi Rate Intelligence */}
        <div className="lg:col-span-2" style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ ...sora, fontSize:17, fontWeight:700, color:'#12261D' }}>
                {t.mandiRateIntelligence || "Mandi Rate Intelligence & AI Forecast"}
              </div>
              <p style={{ fontSize:12, color:'#7A877F', marginTop:2 }}>Real-time prices from 4 nearest AP mandis for Paddy (BPT 5204)</p>
            </div>
            <button onClick={() => navigate('/market')} style={{ fontSize:12, fontWeight:700, color:'#1B7A4B', background:'#E6F3E4', border:'1px solid #CDE5C8', borderRadius:8, padding:'6px 12px', cursor:'pointer' }}>
              {t.viewAll || "View all"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { market: "Proddatur Mandi", price: "₹2,240", change: "+₹57 net", dist: "31 km", best: true },
              { market: "Kadapa Main Mandi", price: "₹2,183", change: "Base rate", dist: "12 km", best: false },
              { market: "Rayachoti Mandi", price: "₹2,205", change: "+₹22 gross", dist: "58 km", best: false },
            ].map((m, i) => (
              <div key={i} style={{ background: m.best ? '#E6F3E4' : '#FAFAF7', border: m.best ? '1.5px solid #1B7A4B' : '1px solid #E4E3DA', borderRadius:12, padding:'14px 16px', display:'flex', flexDirection:'column', gap:4 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#12261D' }}>{m.market}</span>
                  {m.best && <span style={{ fontSize:9, fontWeight:800, background:'#1B7A4B', color:'white', padding:'2px 6px', borderRadius:8 }}>BEST NET</span>}
                </div>
                <span style={{ ...sora, fontSize:22, fontWeight:700, color:'#12261D' }}>{m.price}</span>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color: m.best ? '#1B7A4B' : '#7A877F', fontWeight:600 }}>
                  <span>{m.change}</span>
                  <span>{m.dist}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'#0F2419', borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', color:'white' }}>
            <div>
              <span style={{ fontSize:11, fontWeight:800, color:'#9BD96B', letterSpacing:'0.06em' }}>AI RECOMMENDATION</span>
              <p style={{ fontSize:13, color:'#F4F3EC', fontWeight:600, marginTop:2 }}>Hold paddy for 14 days — projected rise of ₹120-₹180/qtl after local harvest rush.</p>
            </div>
            <button onClick={() => navigate('/market')} style={{ padding:'8px 14px', borderRadius:8, background:'#9BD96B', color:'#0F2419', fontSize:12, fontWeight:800, border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>
              Set Price Alert
            </button>
          </div>
        </div>

        {/* Right 1 col: Quick Navigation Cards */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ ...sora, fontSize:17, fontWeight:700, color:'#12261D' }}>
            {t.quickActions || "Quick Actions"}
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { title: t.sidebarCropDiagnosis || "Crop Diagnosis", desc: "Instant AI leaf disease test", icon: Camera, path: "/disease-detection", color: "#C0442F", bg: "#FCECEA" },
              { title: t.sidebarWeather || "Weather Telemetry", desc: "Live satellite rain alerts", icon: Cloud, path: "/weather", color: "#C27D00", bg: "#FFF4E5" },
              { title: t.sidebarSchemes || "Government Schemes", desc: "PM-KISAN, PMFBY eligibility", icon: Shield, path: "/schemes", color: "#1B7A4B", bg: "#E6F3E4" },
              { title: t.sidebarCropCalendar || "Crop Calendar", desc: "Operations & fertilizer timeline", icon: Calendar, path: "/crop-calendar", color: "#3B6FA8", bg: "#E4EEF6" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E4E3DA] hover:border-[#1B7A4B] cursor-pointer transition bg-[#FAFAF7] hover:bg-white"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.bg, color: item.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-extrabold text-[#12261D]">{item.title}</span>
                    <span className="text-[12px] font-semibold text-[#5C6B62]">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
