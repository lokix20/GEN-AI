import { useNavigate } from "react-router-dom";
import { Sun, Leaf, Droplets, TrendingUp, Camera, MessageCircle, Calendar, Cloud, Shield } from "lucide-react";
import { useAuthStore } from "../../store/auth.store.js";
import { MandiPriceWidget } from "../../features/mandi/MandiPriceWidget.js";

const sora = { fontFamily: "'Sora', sans-serif" };

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Ramesh";

  return (
    <div className="flex flex-col gap-5">
      {/* Header Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ ...sora, fontSize: 28, fontWeight: 700, color: '#12261D', letterSpacing: '-0.02em' }}>Good afternoon, {firstName}</h1>
          <p style={{ fontSize: 13, color: '#5C6B62', marginTop: 3 }}>Tuesday, 5 August · 2 things need you today</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={() => navigate('/disease-detection')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:9, background:'#12261D', color:'#F4F3EC', fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            <Camera size={14}/> Scan a crop
          </button>
          <button style={{ padding:'9px 16px', borderRadius:9, background:'white', color:'#2B3A32', fontSize:13, fontWeight:600, border:'1px solid #DCDBD1', cursor:'pointer' }}>Log activity</button>
        </div>
      </div>

      {/* Priority Alert Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
        {/* Card 1 - DO FIRST (dark) - takes more visual weight */}
        <div style={{ gridColumn:'1', background:'#0F2419', borderRadius:16, padding:'22px 24px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ background:'#C0442F', color:'white', fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:12, letterSpacing:'0.06em' }}>DO FIRST</span>
            <span style={{ color:'#7F9A88', fontSize:12 }}>Plot A · paddy · 2.4 ac</span>
          </div>
          <div style={{ ...sora, fontSize:20, fontWeight:700, color:'#F4F3EC', lineHeight:1.3 }}>Drain Plot A today — blight risk before Wednesday's rain</div>
          <p style={{ fontSize:13, color:'#8CA396', lineHeight:1.55 }}>Leaf blight was detected on 15% of the plot. Standing water plus 42 mm of rain would spread it across the field within a week.</p>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button style={{ padding:'9px 16px', borderRadius:8, background:'#9BD96B', color:'#0F2419', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>Mark as done</button>
            <button style={{ padding:'9px 16px', borderRadius:8, background:'transparent', color:'#D7F0C2', fontSize:13, fontWeight:600, border:'1px solid #34523F', cursor:'pointer' }}>See treatment plan</button>
          </div>
        </div>

        {/* Card 2 - TODAY */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px', display:'flex', flexDirection:'column', gap:10 }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#C27D00', letterSpacing:'0.1em', background:'#FBF1DC', padding:'3px 8px', borderRadius:10, alignSelf:'flex-start' }}>TODAY</span>
          <div style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>Irrigate Plot B before 6 PM</div>
          <p style={{ fontSize:13, color:'#5C6B62', lineHeight:1.5 }}>Tomato soil at 31% — below the fruiting band.</p>
          <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10 }}>
            <span style={{ fontSize:12, color:'#8B978F' }}>~55 min of drip</span>
            <button onClick={() => navigate('/coming-soon/irrigation')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>Schedule →</button>
          </div>
        </div>

        {/* Card 3 - THIS WEEK */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px', display:'flex', flexDirection:'column', gap:10 }}>
          <span style={{ fontSize:10, fontWeight:800, color:'#3B6FA8', letterSpacing:'0.1em', background:'#E4EEF6', padding:'3px 8px', borderRadius:10, alignSelf:'flex-start' }}>THIS WEEK</span>
          <div style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>Claim PM-KISAN ₹2,000</div>
          <p style={{ fontSize:13, color:'#5C6B62', lineHeight:1.5 }}>Eligible · 4 of 5 documents already on file.</p>
          <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10 }}>
            <span style={{ fontSize:12, color:'#8B978F' }}>Closes 22 Aug</span>
            <button onClick={() => navigate('/coming-soon/schemes')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>Apply →</button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {/* Weather */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Sun size={14} color='#C27D00'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>Weather today</span>
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
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>Crop health</span>
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
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>Soil moisture</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ ...sora, fontSize:36, fontWeight:700, color:'#12261D' }}>45%</span>
            <span style={{ fontSize:11, fontWeight:700, color:'#1B7A4B', background:'#E6F3E4', padding:'2px 8px', borderRadius:10 }}>Optimal</span>
          </div>
          <div style={{ height:5, borderRadius:3, background:'#EDECE3', position:'relative' }}>
            <div style={{ position:'absolute', left:'40%', right:'45%', top:0, bottom:0, background:'#C4E0B2', borderRadius:3 }}/>
            <div style={{ position:'absolute', left:'45%', width:2, top:-2, bottom:-2, background:'#12261D', borderRadius:2 }}/>
          </div>
        </div>

        {/* Paddy Price */}
        <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <TrendingUp size={14} color='#1B7A4B'/>
            <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>Paddy · Kadapa mandi</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ ...sora, fontSize:30, fontWeight:700, color:'#12261D' }}>₹2,183</span>
            <span style={{ fontSize:12, fontWeight:700, color:'#1B7A4B' }}>▲2.4%</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:22 }}>
            {[35,50,42,65,80,100].map((h,i) => (
              <div key={i} style={{ flex:1, height:`${h}%`, background: i < 3 ? '#C4E0B2' : i < 5 ? '#9BD96B' : '#12261D', borderRadius:'3px 3px 0 0' }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}>
        {/* Left Column */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Interactive Mandi Price Intelligence Widget */}
          <MandiPriceWidget />

          {/* My Plots */}
          <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyItems:'space-between', justifyContent:'space-between', marginBottom:4 }}>
              <div>
                <span style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>My plots</span>
                <div style={{ fontSize:12, color:'#8B978F', marginTop:2 }}>4.2 acres · Kharif 2026</div>
              </div>
              <button onClick={() => navigate('/coming-soon/farm-diary')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>View all</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 80px', gap:10, marginTop:16 }}>
              {/* Paddy Plot */}
              <div style={{ border:'1px solid #E4E3DA', borderRadius:12, padding:'14px 12px' }}>
                <div style={{ height:60, background:'#F4F3EC', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                  <div style={{ fontSize:11, color:'#8B978F', textAlign:'center' }}>🌾<br/><span style={{fontSize:10}}>or browse files</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#C0442F', display:'inline-block', flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#12261D' }}>Paddy</div>
                    <div style={{ fontSize:11, color:'#8B978F' }}>Plot A · tillering</div>
                  </div>
                </div>
                <div style={{ height:3, borderRadius:2, background:'#E6F3E4', marginTop:8 }}><div style={{ width:'40%', height:'100%', background:'#1B7A4B', borderRadius:2 }}/></div>
              </div>
              {/* Tomato Plot */}
              <div style={{ border:'1px solid #E4E3DA', borderRadius:12, padding:'14px 12px' }}>
                <div style={{ height:60, background:'#F4F3EC', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                  <div style={{ fontSize:11, color:'#8B978F', textAlign:'center' }}>🍅<br/><span style={{fontSize:10}}>or browse files</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#E8A33D', display:'inline-block', flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#12261D' }}>Tomato</div>
                    <div style={{ fontSize:11, color:'#8B978F' }}>Plot B · fruiting</div>
                  </div>
                </div>
                <div style={{ height:3, borderRadius:2, background:'#FBF1DC', marginTop:8 }}><div style={{ width:'60%', height:'100%', background:'#E8A33D', borderRadius:2 }}/></div>
              </div>
              {/* Cotton Plot */}
              <div style={{ border:'1px solid #E4E3DA', borderRadius:12, padding:'14px 12px' }}>
                <div style={{ height:60, background:'#F4F3EC', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                  <div style={{ fontSize:11, color:'#8B978F', textAlign:'center' }}>🌿<br/><span style={{fontSize:10}}>or browse files</span></div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#1B7A4B', display:'inline-block', flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#12261D' }}>Cotton</div>
                    <div style={{ fontSize:11, color:'#8B978F' }}>Strip C · boll</div>
                  </div>
                </div>
                <div style={{ height:3, borderRadius:2, background:'#E6F3E4', marginTop:8 }}><div style={{ width:'75%', height:'100%', background:'#1B7A4B', borderRadius:2 }}/></div>
              </div>
              {/* Add Plot */}
              <div style={{ border:'1px dashed #C7CDC0', borderRadius:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, cursor:'pointer', minHeight:120 }}>
                <span style={{ fontSize:20, color:'#7A877F' }}>+</span>
                <span style={{ fontSize:11, fontWeight:600, color:'#7A877F' }}>Add a plot</span>
              </div>
            </div>
          </div>

          {/* This Week's Plan */}
          <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <span style={{ ...sora, fontSize:16, fontWeight:700, color:'#12261D' }}>This week's plan</span>
                <div style={{ fontSize:12, color:'#8B978F', marginTop:2 }}>Generated from weather, crop stage and your diary</div>
              </div>
              <button onClick={() => navigate('/coming-soon/crop-calendar')} style={{ fontSize:13, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>Open calendar</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 }}>
              {[
                { day:'TUE 5', tasks:[{label:'Drain Plot A', color:'#C0442F', bg:'#FCECEA'}] },
                { day:'WED 6', tasks:[{label:'Spray 6 AM', color:'#1B7A4B', bg:'#E6F3E4'},{label:'Rain 42 mm', color:'#5C6B62', bg:'transparent', plain:true}] },
                { day:'THU 7', tasks:[{label:'Nothing due', color:'#8B978F', bg:'transparent', plain:true}] },
                { day:'FRI 8', tasks:[{label:'Weed cotton', color:'#1B7A4B', bg:'#E6F3E4'}] },
                { day:'SAT 9', tasks:[{label:'Mandi visit', color:'#3B6FA8', bg:'#E4EEF6'}] },
              ].map(col => (
                <div key={col.day} style={{ borderRadius:10, border:'1px solid #EDECE3', padding:'12px 10px', background:'#FAFAF7' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#8B978F', marginBottom:8, letterSpacing:'0.05em' }}>{col.day}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {col.tasks.map((t,i) => (
                      <span key={i} style={{ fontSize:11, fontWeight: t.plain ? 400 : 600, color:t.color, background:t.bg, padding: t.plain ? '0' : '4px 8px', borderRadius: t.plain ? 0 : 8 }}>{t.label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Notifications */}
          <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <span style={{ ...sora, fontSize:15, fontWeight:700, color:'#12261D' }}>Notifications</span>
              <button style={{ fontSize:12, fontWeight:600, color:'#1B7A4B', background:'none', border:'none', cursor:'pointer' }}>View all</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { color:'#C0D8F0', title:'Rain alert', desc:'42 mm expected Wednesday noon.', time:'2h' },
                { color:'#C4E0B2', title:'Irrigation reminder', desc:'Tomato needs water in 2 days.', time:'5h' },
                { color:'#F5DFA8', title:'Scheme update', desc:'PM-KISAN instalment released.', time:'1d' },
              ].map(n => (
                <div key={n.title} style={{ display:'flex', gap:10 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:n.color, flexShrink:0, marginTop:5 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'#12261D' }}>{n.title}</span>
                      <span style={{ fontSize:11, color:'#A9B3AC' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#5C6B62', marginTop:2 }}>{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background:'white', border:'1px solid #E4E3DA', borderRadius:16, padding:'18px 20px' }}>
            <span style={{ ...sora, fontSize:15, fontWeight:700, color:'#12261D', display:'block', marginBottom:14 }}>Quick actions</span>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { icon: <Camera size={18}/>, label:'Scan', path:'/disease-detection', bg:'#E6F3E4', color:'#1B7A4B' },
                { icon: <MessageCircle size={18}/>, label:'Ask AI', path:'/chat', bg:'#E4EEF6', color:'#3B6FA8' },
                { icon: <Calendar size={18}/>, label:'Calendar', path:'/coming-soon/crop-calendar', bg:'#FBF1DC', color:'#C27D00' },
                { icon: <TrendingUp size={18}/>, label:'Prices', path:'/coming-soon/market', bg:'#EFE9F7', color:'#7B5EA7' },
                { icon: <Cloud size={18}/>, label:'Weather', path:'/coming-soon/weather', bg:'#E4EEF6', color:'#3B6FA8' },
                { icon: <Shield size={18}/>, label:'Schemes', path:'/coming-soon/schemes', bg:'#E6F3E4', color:'#1B7A4B' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)} style={{ border:'1px solid #E4E3DA', borderRadius:12, padding:'12px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', background:'white' }}>
                  <span style={{ color:a.color, background:a.bg, padding:6, borderRadius:8, display:'flex' }}>{a.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:'#2B3A32' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Expert Consultation */}
          <div style={{ background:'#12261D', borderRadius:16, padding:'18px 20px', display:'flex', flexDirection:'column', gap:10 }}>
            <span style={{ ...sora, fontSize:15, fontWeight:700, color:'#F4F3EC' }}>Need an expert?</span>
            <p style={{ fontSize:13, color:'#9DB3A6', lineHeight:1.5 }}>Free 15-minute call with an agronomist, 9 AM – 7 PM.</p>
            <div style={{ display:'flex', alignItems:'center', gap:8, paddingTop:2 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#9BD96B', display:'inline-block' }}/>
              <span style={{ fontSize:12, color:'#8CA396' }}>4 advisors online now</span>
            </div>
            <button onClick={() => navigate('/coming-soon/expert-consultation')} style={{ width:'100%', padding:'11px 0', borderRadius:9, background:'#9BD96B', color:'#0F2419', fontSize:13, fontWeight:700, border:'none', cursor:'pointer', marginTop:4 }}>Book consultation</button>
          </div>
        </div>
      </div>
    </div>
  );
}
