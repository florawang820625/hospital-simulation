import React, { useState, useMemo } from 'react';

// 模擬 Python Pandas 吐出來的 JSON 資料 (對應急診室情境)
const mockEDLogs = [
  { timestamp: 15.17, event_type: '結束初診', patient: 'P-001', resource: 'Doctor_1', desc: '病患 P-001 結束初診，準備進入檢查' },
  { timestamp: 15.42, event_type: '進入檢查佇列', patient: 'P-001', resource: '-', desc: '病患 P-001 開始等待 CT 檢查' },
  { timestamp: 15.90, event_type: '結束初診', patient: 'P-002', resource: 'Doctor_2', desc: '病患 P-002 (Level IV) 結束初診，可離院' },
  { timestamp: 17.56, event_type: '開始檢查', patient: 'P-001', resource: 'CT_Scanner', desc: '病患 P-001 進入 CT_Scanner 檢查' },
  { timestamp: 19.84, event_type: '病患抵達', patient: 'P-003', resource: '-', desc: '病患 P-003 (Level III) 抵達急診檢傷' },
  { timestamp: 19.84, event_type: '進入初診佇列', patient: 'P-003', resource: '-', desc: '病患 P-003 開始等待醫師初診' },
  { timestamp: 20.10, event_type: '動態插隊', patient: 'P-003', resource: '-', desc: '[SBP 觸發] 病患 P-003 逼近紅線，優先權提升' },
  { timestamp: 21.78, event_type: '開始初診', patient: 'P-003', resource: 'Doctor_2', desc: '病患 P-003 取得醫師資源，開始初診' }
];

// 定義所有可能的事件類型與對應的標籤顏色
const EVENT_TYPES = [
  '病患抵達', '進入初診佇列', '開始初診', '結束初診', 
  '進入檢查佇列', '開始檢查', '結束檢查', 
  '進入複診佇列', '開始複診', '動態插隊', '辦理離院'
];

export default function EDLogTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // 處理標籤點擊 (多選邏輯)
  const toggleFilter = (type) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // 根據搜尋字詞與標籤過濾資料
  const filteredLogs = useMemo(() => {
    return mockEDLogs.filter(log => {
      const matchSearch = Object.values(log).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchFilter = activeFilters.length === 0 || activeFilters.includes(log.event_type);
      return matchSearch && matchFilter;
    });
  }, [searchTerm, activeFilters]);

  // 給予不同事件類型不同的視覺顏色 (類似照片中的彩虹標籤)
  const getBadgeColor = (type) => {
    if (type.includes('抵達') || type.includes('離院')) return 'bg-gray-100 text-gray-700';
    if (type.includes('開始')) return 'bg-green-100 text-green-700';
    if (type.includes('結束')) return 'bg-red-100 text-red-700';
    if (type.includes('佇列')) return 'bg-yellow-100 text-yellow-700';
    if (type.includes('插隊')) return 'bg-purple-100 text-purple-700 font-bold';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans text-gray-800">
      {/* 頂部搜尋列 (模仿照片頂端) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋描述、病歷編號、資源名稱..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 事件過濾標籤列 (模仿照片那排按鈕) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {EVENT_TYPES.map(type => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              activeFilters.includes(type) 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 資料筆數統計 */}
      <div className="text-sm text-gray-500 mb-2 font-medium">
        顯示 {filteredLogs.length} / {mockEDLogs.length} 筆事件
      </div>

      {/* 核心日誌表格 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-orange-50/50 border-b">
              <th className="py-3 px-4 font-semibold text-gray-600 w-24">時間(分)</th>
              <th className="py-3 px-4 font-semibold text-gray-600 w-36">事件類型</th>
              <th className="py-3 px-4 font-semibold text-gray-600 w-24">病患</th>
              <th className="py-3 px-4 font-semibold text-gray-600 w-32">資源</th>
              <th className="py-3 px-4 font-semibold text-gray-600">描述</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-mono text-gray-600">
                  {log.timestamp.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor(log.event_type)}`}>
                    {log.event_type}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">{log.patient}</td>
                <td className="py-3 px-4 text-gray-500 font-mono text-sm">
                  {log.resource}
                </td>
                <td className="py-3 px-4 text-gray-700">
                  {log.desc}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  沒有符合條件的事件紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}