import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, CheckCircle, Clock } from 'lucide-react';
import { API_URL } from '../config';

export default function Quests() {
  const fetchQuests = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/users/me/quests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch quests');
    return res.json();
  };

  const { data: quests = [], isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: fetchQuests
  });

  const getQuestIcon = (type) => {
    switch (type) {
      case 'learn_words': return <Target className="text-blue-500" />;
      case 'perfect_score': return <CheckCircle className="text-green-500" />;
      default: return <Clock className="text-orange-500" />;
    }
  };

  const getQuestTitle = (type, target) => {
    switch (type) {
      case 'learn_words': return `Ôn tập ${target} từ vựng`;
      case 'perfect_score': return `Đạt điểm tuyệt đối ${target} lần`;
      case 'complete_lesson': return `Hoàn thành ${target} bài học`;
      default: return `Nhiệm vụ ${type}`;
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Đang tải nhiệm vụ...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Nhiệm vụ hàng ngày</h1>
        <p className="text-slate-500 dark:text-slate-400">Hoàn thành nhiệm vụ để nhận Xu và đổi quà trong cửa hàng.</p>
      </div>

      <div className="space-y-4">
        {quests.map((quest) => {
          const progress = Math.min((quest.current_progress / quest.target_value) * 100, 100);
          const isCompleted = quest.current_progress >= quest.target_value;

          return (
            <div 
              key={quest.id} 
              className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 transition-all ${isCompleted ? 'border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-100' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  {isCompleted ? <CheckCircle className="text-green-600" /> : getQuestIcon(quest.quest_type)}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    {getQuestTitle(quest.quest_type, quest.target_value)}
                  </h3>
                  <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2 mb-1">
                    <span>Tiến độ: {quest.current_progress} / {quest.target_value}</span>
                    <span className="font-medium text-yellow-500 flex items-center gap-1">
                      +{quest.reward_coins} Xu
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {isCompleted ? (
                    <span className="inline-block px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">
                      Đã xong
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                      Đang làm
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
