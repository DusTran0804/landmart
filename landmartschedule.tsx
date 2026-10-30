import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Calendar as CalendarIcon, Edit3, AlertCircle } from 'lucide-react';

// Fixed Vietnamese Solar Holidays (dd/mm format)
const HOLIDAYS = ['01/01', '30/04', '01/05', '02/09'];

const DEFAULT_TASKS_TEXT = {
  1: "8h30 - 9h00 Đổ rác nhà vệ sinh Tầng G - Tầng 6\n08:30 - 09:00 Thu gom rác WC tầng G–6\n09:00 - 10:30 Vệ sinh toàn bộ 11 WC\n10:30 - 10:45 Dọn phòng G2\n10:50 - 11:05 Dọn phòng G3\n11:05 - 11:30 Dự phòng phát sinh / dọn bù",
  3: "8h30 - 9h00 Đổ rác nhà vệ sinh Tầng G - Tầng 6\n08:30 - 09:00 Thu gom rác WC tầng G–6\n09:00 - 09:35 Lau kính tầng 1 và 2\n09:35 - 10:05 Lau kính tầng 3\n10:05 - 10:25 Quét/lau hành lang, ban công theo khu vực\n10:25 - 10:40 Dọn phòng G5\n10:40 - 11:30 Dự phòng phát sinh / dọn bù",
  5: "8h30 - 9h00 Đổ rác nhà vệ sinh Tầng G - Tầng 6\n08:30 - 09:00 Thu gom rác WC tầng G–6\n09:00 - 10:30 Vệ sinh toàn bộ 11 WC\n10:30 - 10:45 Dọn phòng G9\n10:50 - 11:05 Dọn phòng G15\n11:05 - 11:30 Dự phòng phát sinh / dọn bù"
};

export default function App() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(11);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [tasksText, setTasksText] = useState(DEFAULT_TASKS_TEXT);
  const [parsedTasks, setParsedTasks] = useState({ 1: [], 3: [], 5: [] });

  // Parse raw text into structured tasks whenever text changes
  useEffect(() => {
    const parseText = (text) => {
      if (!text) return [];
      return text.split('\n').filter(line => line.trim() !== '').map(line => {
        // Regex to extract time pattern like "08:30 - 09:00" or "8h30-9h00" at the start
        const timeRegex = /^([0-9]{1,2}[:h][0-9]{2}\s*[-–]\s*[0-9]{1,2}[:h][0-9]{2})[\s:-]*(.*)$/;
        const match = line.trim().match(timeRegex);
        if (match) {
          return { time: match[1].trim(), name: match[2].trim() };
        }
        return { time: '', name: line.trim() }; // Fallback if no time found
      });
    };

    setParsedTasks({
      1: parseText(tasksText[1]),
      3: parseText(tasksText[3]),
      5: parseText(tasksText[5]),
    });
  }, [tasksText]);

  // Calculate weeks containing Mon, Wed, Fri for the selected month/year
  const weeks = useMemo(() => {
    const w = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    let currentWeek = null;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed...

      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        // Start a new week array if it's Monday or if we haven't started one yet
        if (dayOfWeek === 1 || !currentWeek) {
          if (currentWeek) w.push(currentWeek);
          currentWeek = { 1: null, 3: null, 5: null };
        }
        currentWeek[dayOfWeek] = date;
      }
    }
    if (currentWeek && (currentWeek[1] || currentWeek[3] || currentWeek[5])) {
      w.push(currentWeek);
    }
    
    // Reset selected week if month changes and current index is out of bounds
    if (selectedWeekIndex >= w.length) {
      setSelectedWeekIndex(0);
    }
    
    return w;
  }, [year, month]);

  const currentWeekDates = weeks[selectedWeekIndex] || { 1: null, 3: null, 5: null };

  // Helpers
  const formatDate = (date) => {
    if (!date) return '';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const isHoliday = (date) => {
    if (!date) return false;
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    return HOLIDAYS.includes(`${d}/${m}`);
  };

  const handleTextChange = (day, value) => {
    setTasksText(prev => ({ ...prev, [day]: value }));
  };

  // Determine max rows needed for the table based on tasks
  const maxTasks = Math.max(parsedTasks[1].length, parsedTasks[3].length, parsedTasks[5].length, 1);
  const rows = Array.from({ length: maxTasks });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-[#cc0000] text-white shadow-md border-b-4 border-[#ffea00]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h1 className="text-4xl font-black tracking-widest text-[#ffea00] uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
              LANDMART
            </h1>
            <span className="text-xs tracking-[0.2em] font-bold text-white/90">EST 2016</span>
          </div>
          <h2 className="text-xl font-bold uppercase text-center flex items-center gap-2">
            <CalendarIcon size={24} className="text-[#ffea00]" />
            Hệ thống xếp lịch dọn vệ sinh
          </h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
        {/* Controls Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Năm</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Tháng</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Tuần làm việc</label>
              <select
                value={selectedWeekIndex}
                onChange={(e) => setSelectedWeekIndex(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
              >
                {weeks.map((_, index) => (
                  <option key={index} value={index}>Tuần {index + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors font-medium border border-gray-300"
          >
            <Settings size={18} />
            {showConfig ? 'Đóng cấu hình' : 'Cấu hình công việc'}
          </button>
        </div>

        {/* Configuration Section (Collapsible) */}
        {showConfig && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-2 mb-4 text-[#cc0000]">
              <Edit3 size={20} />
              <h3 className="font-bold text-lg">Dán nội dung công việc (Tự động tách giờ & nội dung)</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Copy và dán danh sách công việc vào các ô bên dưới. Định dạng khuyên dùng: <code className="bg-gray-100 px-1 rounded text-[#cc0000]">08:30 - 09:00 Tên công việc</code>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { day: 1, label: 'Thứ 2' },
                { day: 3, label: 'Thứ 4' },
                { day: 5, label: 'Thứ 6' }
              ].map(({ day, label }) => (
                <div key={day} className="flex flex-col">
                  <label className="font-semibold text-gray-700 mb-2">{label}</label>
                  <textarea
                    value={tasksText[day]}
                    onChange={(e) => handleTextChange(day, e.target.value)}
                    className="w-full h-64 border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
                    placeholder="Dán nội dung vào đây..."
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* The Schedule Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              {/* Table Header */}
              <thead>
                <tr>
                  <th colSpan={9} className="bg-[#cc0000] text-white py-4 text-center border-b-4 border-[#ffea00]">
                    <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                      LỊCH DỌN VỆ SINH THÁNG {month}/{year} - TUẦN {selectedWeekIndex + 1}
                    </h2>
                  </th>
                </tr>
                <tr className="bg-[#ffea00] text-gray-900 border-b-2 border-gray-400">
                  <th className="border border-gray-400 py-3 px-2 w-16 text-center font-bold">STT</th>
                  
                  {/* Monday Header */}
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold w-[30%]">
                    Thứ 2 ({formatDate(currentWeekDates[1]) || 'N/A'})
                  </th>
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold whitespace-nowrap w-24">Time</th>
                  
                  <th className="w-2 border-y border-gray-400 bg-white"></th> {/* Spacer */}
                  
                  {/* Wednesday Header */}
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold w-[30%]">
                    Thứ 4 ({formatDate(currentWeekDates[3]) || 'N/A'})
                  </th>
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold whitespace-nowrap w-24">Time</th>
                  
                  <th className="w-2 border-y border-gray-400 bg-white"></th> {/* Spacer */}

                  {/* Friday Header */}
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold w-[30%]">
                    Thứ 6 ({formatDate(currentWeekDates[5]) || 'N/A'})
                  </th>
                  <th className="border border-gray-400 py-3 px-4 text-center font-bold whitespace-nowrap w-24">Time</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white">
                {rows.map((_, rowIndex) => {
                  const isMonHoliday = isHoliday(currentWeekDates[1]);
                  const isWedHoliday = isHoliday(currentWeekDates[3]);
                  const isFriHoliday = isHoliday(currentWeekDates[5]);

                  // Function to render cells for a specific day to avoid repetition
                  const renderDayCells = (dayIndex: number, isHolidayForDay?: boolean) => {
                    const task = parsedTasks[dayIndex][rowIndex];
                    
                    // If it's a holiday, we only render the cell on the FIRST row and span it downwards
                    if (isHolidayForDay) {
                      if (rowIndex === 0) {
                        return (
                          <td 
                            colSpan={2} 
                            rowSpan={maxTasks} 
                            className="border border-gray-400 text-center align-middle bg-red-50 text-[#cc0000]"
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <AlertCircle size={32} />
                              <span className="font-bold text-xl uppercase tracking-widest">Nghỉ lễ</span>
                            </div>
                          </td>
                        );
                      }
                      return null; // Don't render cells for subsequent rows if spanned
                    }

                    // Normal rendering if not a holiday
                    const isFirstRow = rowIndex === 0;
                    const bgClass = isFirstRow ? 'bg-[#cce3d1]' : (rowIndex % 2 === 1 ? 'bg-[#fff5e6]' : ''); // Alternating/Header colors resembling the excel

                    return (
                      <React.Fragment key={`day-${dayIndex}-${rowIndex}`}>
                        <td className={`border border-gray-400 py-2 px-3 text-sm ${bgClass}`}>
                          {task?.name || ''}
                        </td>
                        <td className={`border border-gray-400 py-2 px-3 text-sm text-center whitespace-nowrap ${bgClass}`}>
                          {task?.time || ''}
                        </td>
                      </React.Fragment>
                    );
                  };

                  return (
                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                      {/* STT Column */}
                      <td className="border border-gray-400 py-2 px-2 text-center text-sm">
                        {rowIndex + 1}
                      </td>

                      {/* Monday */}
                      {renderDayCells(1, isMonHoliday)}
                      
                      {/* Spacer */}
                      <td className="border-y border-gray-400 bg-white"></td>

                      {/* Wednesday */}
                      {renderDayCells(3, isWedHoliday)}
                      
                      {/* Spacer */}
                      <td className="border-y border-gray-400 bg-white"></td>

                      {/* Friday */}
                      {renderDayCells(5, isFriHoliday)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-gray-400 text-xs mt-8">
          Hệ thống tự động bỏ qua các ngày nghỉ lễ Cố định (01/01, 30/04, 01/05, 02/09).
        </div>
      </main>
    </div>
  );
}