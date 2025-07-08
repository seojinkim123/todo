import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [reminderTime, setReminderTime] = useState('09:00');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="p-4 pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">설정</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">알림 시간</label>
          <input
            type="time"
            value={reminderTime}
            onChange={e => setReminderTime(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">저장</button>
        {saved && <div className="text-green-600 text-center mt-2">저장되었습니다!</div>}
      </form>
      <div className="mt-8 space-y-4">
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-1">계정 관리</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          <button className="mt-2 text-red-500 text-xs border px-2 py-1 rounded" onClick={signOut}>로그아웃</button>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-1">앱 정보</div>
          <div className="text-sm text-gray-500">FocusFlow v1.0<br/>© 2024</div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 