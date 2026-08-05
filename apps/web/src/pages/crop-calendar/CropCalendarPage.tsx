import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import { LanguageSelector } from "../../components/shared/LanguageSelector.js";
import { Plus, Filter, AlertTriangle } from "lucide-react";

interface FieldTask {
  id: string;
  title: string;
  crop: string;
  plot: string;
  date: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  notes: string;
}

export function CropCalendarPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Season" | "Month" | "Tasks">("Season");
  const [viewMode, setViewMode] = useState<"action" | "dashboard" | "conversational">("action");

  // Real-Time Dynamic Date & Stage Calculations
  const now = new Date();
  const currentMonthName = now.toLocaleDateString("en-US", { month: "long" });
  const currentMonthShort = now.toLocaleDateString("en-US", { month: "short" });
  const currentYear = now.getFullYear();

  const daysInSeasonSoFar = 48;
  const totalSeasonDays = 135;
  const panicleDaysLeft = 12;
  
  const panicleDate = new Date(now.getTime() + panicleDaysLeft * 86400000);
  const panicleDateStr = `${panicleDate.getDate()} ${panicleDate.toLocaleDateString("en-US", { month: "short" })}`;

  const harvestEstDate = new Date(now.getTime() + (totalSeasonDays - daysInSeasonSoFar) * 86400000);
  const harvestEstStr = `~${harvestEstDate.getDate()} ${harvestEstDate.toLocaleDateString("en-US", { month: "short" })}`;

  const rabiSowingDate = new Date(currentYear, 10, 5); // 5 Nov
  const rabiSowingStr = `${rabiSowingDate.getDate()} ${rabiSowingDate.toLocaleDateString("en-US", { month: "short" })}`;

  const initialDynamicTasks: FieldTask[] = [
    {
      id: "task-1",
      title: "Apply 2nd Dose Urea Top-Dress",
      crop: "Paddy",
      plot: "Plot A (2.4 ac)",
      date: panicleDateStr,
      priority: "high",
      completed: false,
      notes: "Critical for panicle initiation stage. Apply 45 kg/acre."
    },
    {
      id: "task-2",
      title: "Drain Field Standing Water",
      crop: "Paddy",
      plot: "Plot A (2.4 ac)",
      date: `${Math.max(1, now.getDate() - 6)} ${currentMonthShort}`,
      priority: "high",
      completed: true,
      notes: "Prevent bacterial leaf blight spread during heavy rain."
    },
    {
      id: "task-3",
      title: "Weed Inspection & Clearing",
      crop: "Cotton",
      plot: "Strip C (0.4 ac)",
      date: `${Math.max(1, now.getDate() - 3)} ${currentMonthShort}`,
      priority: "medium",
      completed: true,
      notes: "Clear manual weeds before foliar nutrition spray."
    },
    {
      id: "task-4",
      title: "Drip Irrigation Cycle Setup",
      crop: "Tomato",
      plot: "Plot B (1.8 ac)",
      date: `${now.getDate()} ${currentMonthShort}`,
      priority: "medium",
      completed: false,
      notes: "Run 45 min drip cycle with soluble NPK 19-19-19."
    },
    {
      id: "task-5",
      title: "Bengal Gram Seed Purchase for Rabi",
      crop: "Bengal Gram",
      plot: "All Plots",
      date: `25 Oct ${currentYear}`,
      priority: "low",
      completed: false,
      notes: `Purchase certified KVK seeds for ${rabiSowingStr} sowing.`
    }
  ];

  // Interactive Task state
  const [tasks, setTasks] = useState<FieldTask[]>(initialDynamicTasks);
  const [taskFilter, setTaskFilter] = useState<"all" | "pending" | "completed" | "critical">("all");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newCrop, setNewCrop] = useState("Paddy");
  const [newPlot, setNewPlot] = useState("Plot A");
  const [newDate, setNewDate] = useState(`${now.getDate() + 2} ${currentMonthShort}`);
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("high");

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: FieldTask = {
      id: "task-" + Date.now(),
      title: newTitle.trim(),
      crop: newCrop,
      plot: newPlot,
      date: newDate,
      priority: newPriority,
      completed: false,
      notes: `Custom field task added for ${newCrop} (${newPlot}).`
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTitle("");
    setShowAddTaskModal(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "pending") return !t.completed;
    if (taskFilter === "completed") return t.completed;
    if (taskFilter === "critical") return t.priority === "high" && !t.completed;
    return true;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden text-left">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Crop Calendar &amp; Operations
          </h1>
          
          {/* Interactive Navigation Tabs: Season | Month | Tasks */}
          <div className="flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {(["Season", "Month", "Tasks"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  activeTab === tab
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block text-[13px] font-semibold text-[#8B978F]">
            {activeTab === "Season" && `Kharif ${currentYear} · Jun - Nov`}
            {activeTab === "Month" && `${currentMonthName} ${currentYear} · Operations Schedule`}
            {activeTab === "Tasks" && `${tasks.filter(t => !t.completed).length} Pending Operations`}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector buttonClassName="bg-[#EBEAE2] border border-[#DCDBD1] text-[#12261D] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#E4E3DA] transition shadow-sm" />
          
          <button 
            onClick={() => {
              if (activeTab === "Tasks") {
                setShowAddTaskModal(true);
              } else {
                navigate("/chat", { state: { initialPrompt: "Help me create a new crop schedule for my Kharif crops." } });
              }
            }}
            className="bg-[#006837] hover:bg-[#1B4332] text-white text-[13px] font-extrabold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <Plus size={15} /> {activeTab === "Tasks" ? "Add New Task" : "Add Crop Schedule"}
          </button>

          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col xl:flex-row gap-6 overflow-y-auto no-scrollbar">
        
        {/* VIEW 1: SEASON TAB */}
        {activeTab === "Season" && (
          <>
            <div className="flex-1 flex flex-col gap-6">
              {/* Season Timeline */}
              <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Crop Stages Timeline
                    </h3>
                    <p className="text-[13px] font-semibold text-[#5C6B62] mt-0.5">
                      Real-time lifecycle tracking across all plots · Today: {now.getDate()} {currentMonthShort}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] font-bold">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#CDE5C8]"/> <span className="text-[#5C6B62]">Vegetative</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1B7A4B]"/> <span className="text-[#5C6B62]">Reproductive</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#E0A838]"/> <span className="text-[#5C6B62]">Harvest</span></div>
                  </div>
                </div>

                {/* Timeline Visual */}
                <div className="flex flex-col gap-6 relative pl-[100px] sm:pl-[120px] pt-6 pb-2 overflow-x-auto no-scrollbar min-w-[600px]">
                  <div className="absolute top-0 left-[120px] right-0 flex text-[11px] font-bold text-[#A2ADA5] uppercase tracking-widest justify-between px-4">
                    <span>Jun</span>
                    <span>Jul</span>
                    <span className="text-[#12261D] font-extrabold underline">{currentMonthShort}</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                  </div>

                  <div className="absolute top-4 bottom-0 left-[45%] w-px bg-[#12261D] z-10">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#12261D] text-[#9BD96B] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                       Today ({now.getDate()} {currentMonthShort})
                     </div>
                  </div>

                  {/* Paddy */}
                  <div className="relative flex items-center h-10">
                    <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                      <div className="text-[14px] font-extrabold text-[#12261D]">Paddy</div>
                      <div className="text-[12px] font-medium text-[#5C6B62]">Plot A · 2.4 ac</div>
                    </div>
                    <div className="relative flex-1 h-3.5 rounded-full bg-[#FAFAF7] border border-[#E4E3DA] mx-4 flex items-center overflow-hidden">
                      <div className="absolute left-[15%] w-[35%] h-full bg-[#CDE5C8]" />
                      <div className="absolute left-[50%] w-[25%] h-full bg-[#1B7A4B]" />
                      <div className="absolute left-[75%] w-[10%] h-full bg-[#E0A838]" />
                    </div>
                  </div>

                  {/* Tomato */}
                  <div className="relative flex items-center h-10">
                    <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                      <div className="text-[14px] font-extrabold text-[#12261D]">Tomato</div>
                      <div className="text-[12px] font-medium text-[#5C6B62]">Plot B · 1.8 ac</div>
                    </div>
                    <div className="relative flex-1 h-3.5 rounded-full bg-[#FAFAF7] border border-[#E4E3DA] mx-4 flex items-center overflow-hidden">
                      <div className="absolute left-[25%] w-[20%] h-full bg-[#CDE5C8]" />
                      <div className="absolute left-[45%] w-[25%] h-full bg-[#1B7A4B]" />
                      <div className="absolute left-[70%] w-[15%] h-full bg-[#E0A838]" />
                    </div>
                  </div>

                  {/* Cotton */}
                  <div className="relative flex items-center h-10">
                    <div className="absolute left-[-120px] w-[100px] flex flex-col justify-center">
                      <div className="text-[14px] font-extrabold text-[#12261D]">Cotton</div>
                      <div className="text-[12px] font-medium text-[#5C6B62]">Strip C · 0.4 ac</div>
                    </div>
                    <div className="relative flex-1 h-3.5 rounded-full bg-[#FAFAF7] border border-[#E4E3DA] mx-4 flex items-center overflow-hidden">
                      <div className="absolute left-[20%] w-[35%] h-full bg-[#CDE5C8]" />
                      <div className="absolute left-[55%] w-[20%] h-full bg-[#1B7A4B]" />
                      <div className="absolute left-[75%] w-[15%] h-full bg-[#E0A838]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Month Grid */}
              <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {currentMonthName} Field Operations
                    </h3>
                    <p className="text-[13px] font-semibold text-[#5C6B62] mt-0.5">
                      Synchronized with live weather forecasts &amp; crop growth stages
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("Month")}
                    className="text-[#1B7A4B] font-bold text-[13px] hover:underline"
                  >
                    View Full Month Calendar ➔
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-3">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-extrabold text-[#A2ADA5] uppercase pb-2">
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: 14 }).map((_, idx) => {
                    const dayNum = idx + 4;
                    const isToday = dayNum === now.getDate();
                    return (
                      <div 
                        key={dayNum} 
                        className={cn(
                          "aspect-square rounded-xl p-2 md:p-3 relative border transition",
                          isToday ? "bg-[#E6F3E4] border-2 border-[#1B7A4B] shadow-sm" : "bg-[#FAFAF7] border-[#E4E3DA]"
                        )}
                      >
                        <span className={cn("text-[12px] font-extrabold", isToday ? "text-[#1B7A4B]" : "text-[#5C6B62]")}>{dayNum}</span>
                        {dayNum === 5 && <div className="mt-2 text-[11px] font-bold text-[#D94F4F]">Drain A</div>}
                        {dayNum === 6 && <div className="mt-2 text-[11px] font-bold text-[#C27D00]">Spray</div>}
                        {dayNum === 8 && <div className="mt-2 text-[11px] font-bold text-[#1B7A4B]">Weed C</div>}
                        {dayNum === 9 && <div className="mt-2 text-[11px] font-bold text-[#3B6FA8]">Mandi</div>}
                        {dayNum === 11 && <div className="mt-2 text-[11px] font-bold text-[#1B7A4B]">Flood A</div>}
                        {dayNum === 14 && <div className="mt-2 text-[11px] font-bold text-[#1B7A4B]">2nd Urea</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Action-First & Rabi Cards with Real-Time Data */}
            <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-6">
              <div className="flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
                {[
                  { id: "action", label: "Action-First" },
                  { id: "dashboard", label: "Dashboard" },
                  { id: "conversational", label: "Agronomist" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id as any)}
                    className={cn(
                      "flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition",
                      viewMode === m.id ? "bg-[#0F2419] text-white shadow-xs" : "text-[#5C6B62] hover:text-[#12261D]"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {viewMode === "action" && (
                <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col shadow-md relative overflow-hidden border border-[#006837]/40">
                  <div className="text-[11px] font-extrabold text-[#9BD96B] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    🚜 Upcoming Field Operations
                  </div>
                  <div className="text-[20px] font-extrabold leading-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Priority Action: Panicle Initiation
                  </div>
                  <div className="flex flex-col gap-2.5 mt-3 text-[13.5px] font-medium text-[#A2B8AA] leading-relaxed">
                    <div className="flex items-center gap-2 text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9BD96B] shrink-0" />
                      <span><strong>When:</strong> Starts in ~{panicleDaysLeft} days (Day {daysInSeasonSoFar} of {totalSeasonDays} · {panicleDateStr})</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F3C969] shrink-0 mt-1" />
                      <span><strong>Critical Task:</strong> Apply <strong>second dose of urea</strong> (45 kg/acre) on {panicleDateStr}. Critical for yield.</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/10 my-4" />
                  <div className="text-[12.5px] font-bold text-[#9BD96B] flex items-center justify-between">
                    <span>Stage: Paddy Tillering</span>
                    <span>Harvest Est: {harvestEstStr}</span>
                  </div>
                </div>
              )}

              {/* Rabi Card with Real-Time Sowing Window */}
              <div className="shrink-0 bg-[#E6F3E4] border border-[#CDE5C8] rounded-[24px] p-6 flex flex-col gap-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-[15px] font-extrabold text-[#12261D]">🌾 Future Planning: Rabi Season</h4>
                  <span className="bg-[#1B7A4B] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">SOWING {rabiSowingStr}</span>
                </div>
                <div className="space-y-2 text-[13px] text-[#1B7A4B]">
                  <div className="font-extrabold text-[#12261D]">Recommendation: Plant Bengal gram after Paddy harvest</div>
                  <ul className="space-y-1 text-xs text-[#5C6B62] font-semibold list-disc list-inside">
                    <li>Fits soil type &amp; historical rainfall patterns</li>
                    <li>Target Sowing Window: Opens <strong>{rabiSowingStr}</strong></li>
                  </ul>
                </div>
                <button 
                  onClick={() => navigate("/chat", { state: { initialPrompt: `Tell me more about planting Bengal gram in Rabi season after Paddy for target sowing on ${rabiSowingStr}.` } })}
                  className="bg-[#12261D] hover:bg-[#1C3D2A] text-white font-extrabold text-[13px] py-3 px-4 rounded-xl mt-1 transition text-center shadow-sm"
                >
                  See Rabi Crop Plan &amp; Guidance
                </button>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: MONTH TAB */}
        {activeTab === "Month" && (
          <div className="flex-1 flex flex-col gap-6">
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {currentMonthName} {currentYear} · Detailed Operational Calendar
                  </h3>
                  <p className="text-[13.5px] font-semibold text-[#5C6B62] mt-0.5">
                    Day-by-day field tasks, irrigation runs, and spraying windows
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setActiveTab("Tasks")} className="bg-[#006837] text-white text-xs font-bold px-4 py-2 rounded-xl">
                    View Tasks Checklist ➔
                  </button>
                </div>
              </div>

              {/* Full Month Grid */}
              <div className="grid grid-cols-7 gap-2 md:gap-3">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                  <div key={d} className="text-center text-[11px] font-extrabold text-[#12261D] uppercase pb-2 border-b border-[#E4E3DA]">
                    {d}
                  </div>
                ))}
                {Array.from({ length: 31 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isToday = dayNum === now.getDate();
                  const isUrgent = dayNum === 5 || dayNum === 14;
                  return (
                    <div 
                      key={dayNum}
                      className={cn(
                        "min-h-[85px] p-2 rounded-xl border flex flex-col justify-between transition hover:border-[#1B7A4B]",
                        isToday ? "bg-[#E6F3E4] border-[#1B7A4B] shadow-sm" : isUrgent ? "bg-[#FFF4E5] border-[#FCD34D]" : "bg-white border-[#E4E3DA]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-extrabold", isToday ? "text-[#1B7A4B]" : "text-[#12261D]")}>
                          {dayNum} {currentMonthShort}
                        </span>
                        {isToday && <span className="bg-[#1B7A4B] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">TODAY</span>}
                      </div>

                      <div className="text-[11px] font-bold mt-1">
                        {dayNum === 5 && <span className="text-[#D94F4F]">Drain Paddy (Plot A)</span>}
                        {dayNum === 6 && <span className="text-[#C27D00]">Foliar Spray</span>}
                        {dayNum === 8 && <span className="text-[#1B7A4B]">Weed Cotton</span>}
                        {dayNum === 9 && <span className="text-[#3B6FA8]">Mandi Selling</span>}
                        {dayNum === 11 && <span className="text-[#1B7A4B]">Flood Paddy</span>}
                        {dayNum === 14 && <span className="text-[#1B7A4B]">2nd Urea Dose ({panicleDateStr})</span>}
                        {dayNum === 22 && <span className="text-[#D94F4F]">PM-KISAN Deadline</span>}
                        {dayNum === 31 && <span className="text-[#1B7A4B]">Crop Insurance Deadline</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TASKS TAB */}
        {activeTab === "Tasks" && (
          <div className="flex-1 flex flex-col gap-6">
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#5C6B62]" />
                <span className="text-xs font-bold text-[#5C6B62]">Filter Tasks:</span>
                {(["all", "pending", "completed", "critical"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-bold capitalize transition",
                      taskFilter === f
                        ? "bg-[#0F2419] text-white shadow-xs"
                        : "bg-[#FAFAF7] text-[#5C6B62] border border-[#E4E3DA] hover:text-[#12261D]"
                    )}
                  >
                    {f} ({
                      f === "all" ? tasks.length :
                      f === "pending" ? tasks.filter(t => !t.completed).length :
                      f === "completed" ? tasks.filter(t => t.completed).length :
                      tasks.filter(t => t.priority === "high" && !t.completed).length
                    })
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-[#006837] hover:bg-[#1B4332] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
              >
                <Plus size={14} /> Add New Field Task
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "bg-white border rounded-[20px] p-5 shadow-xs flex items-start justify-between gap-4 transition duration-150",
                    task.completed ? "opacity-60 border-[#E4E3DA] bg-[#FAFAF7]" : "border-[#E4E3DA] hover:border-[#1B7A4B]"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="w-5 h-5 mt-1 accent-[#006837] cursor-pointer rounded"
                    />

                    <div className="flex flex-col gap-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-[15px] font-extrabold", task.completed ? "line-through text-[#8B978F]" : "text-[#12261D]")}>
                          {task.title}
                        </span>

                        <span className="bg-[#E6F3E4] text-[#1B7A4B] text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                          {task.crop} · {task.plot}
                        </span>

                        {task.priority === "high" && (
                          <span className="bg-[#FCECEA] text-[#D94F4F] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                            <AlertTriangle size={10} /> Critical
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] font-medium text-[#5C6B62] leading-relaxed">
                        {task.notes}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-[#12261D] bg-[#FAFAF7] px-2.5 py-1 rounded-lg border border-[#E4E3DA]">
                      📅 {task.date}
                    </span>
                    <button
                      onClick={() => navigate("/chat", { state: { initialPrompt: `Give me detailed agronomist instructions for performing: "${task.title}" on ${task.crop} (${task.plot}).` } })}
                      className="text-[11.5px] font-bold text-[#1B7A4B] hover:underline"
                    >
                      Ask AI Helper ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Task Interactive Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddTask} className="bg-white rounded-[24px] border border-[#E4E3DA] p-6 max-w-md w-full flex flex-col gap-4 text-left shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#12261D]">Add New Field Task</h3>
              <button type="button" onClick={() => setShowAddTaskModal(false)} className="text-sm font-bold text-[#8B978F]">✕</button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#5C6B62]">Task Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Apply NPK 19-19-19 spray"
                className="border border-[#DCDBD1] rounded-xl p-2.5 text-sm font-semibold outline-none focus:border-[#006837]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#5C6B62]">Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="border border-[#DCDBD1] rounded-xl p-2.5 text-sm font-semibold outline-none"
                >
                  <option value="Paddy">Paddy</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Bengal Gram">Bengal Gram</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#5C6B62]">Plot</label>
                <input
                  type="text"
                  value={newPlot}
                  onChange={(e) => setNewPlot(e.target.value)}
                  placeholder="Plot A"
                  className="border border-[#DCDBD1] rounded-xl p-2.5 text-sm font-semibold outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#5C6B62]">Scheduled Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  placeholder={`${now.getDate() + 2} ${currentMonthShort}`}
                  className="border border-[#DCDBD1] rounded-xl p-2.5 text-sm font-semibold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#5C6B62]">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="border border-[#DCDBD1] rounded-xl p-2.5 text-sm font-semibold outline-none"
                >
                  <option value="high">High (Critical)</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-[#5C6B62]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#006837] hover:bg-[#1B4332] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition"
              >
                Save Field Task
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
