import React from 'react';
import { BookOpen, Target, Coins, Trophy, Flame, ShieldAlert, Sparkles, Map } from 'lucide-react';

export default function Guide() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 pb-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Hướng Dẫn Sử Dụng EnglishMaster</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Khám phá cách tận dụng tối đa nền tảng để chinh phục tiếng Anh dễ dàng và thú vị nhất!
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Map size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">1. Lộ trình Học Cá Nhân Hóa (AI Roadmap)</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Khi mới tham gia, hãy làm <strong>Bài kiểm tra đầu vào (Placement Test)</strong> để hệ thống AI đánh giá trình độ của bạn.
                Sau đó, chuyển sang phần <strong>Lộ trình AI</strong> để nhận một lịch học chi tiết cho 7 ngày tiếp theo, được thiết kế riêng cho bạn.
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
                <li>Truy cập mục "Lộ trình AI" trên thanh bên trái.</li>
                <li>Theo sát các bài học được AI gợi ý mỗi ngày.</li>
                <li>Làm bài tập để mở khóa ngày học tiếp theo.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">2. Duy trì Chuỗi Ngày Học (Streak)</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Học tiếng Anh cần sự kiên trì. Tính năng <strong>Streak</strong> (Ngọn lửa) sẽ theo dõi số ngày bạn học liên tiếp.
              </p>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                <p className="text-orange-800 dark:text-orange-300 text-sm">
                  💡 <strong>Mẹo:</strong> Nếu bạn bận một ngày, hãy sử dụng <strong>Streak Shield (Khiên Bảo Vệ)</strong> mua trong Cửa hàng để không bị mất chuỗi nhé!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 flex items-center justify-center">
              <Coins size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">3. Kiếm Xu (Coins) và Cửa Hàng</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Bạn có thể kiếm Xu bằng cách:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                <li>Hoàn thành các <strong>Nhiệm vụ hàng ngày (Quests)</strong>.</li>
                <li>Đạt điểm cao trong các bài kiểm tra.</li>
                <li>Hoàn thành bài học lần đầu tiên.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Xu được dùng trong <strong>Cửa hàng</strong> để mua Giao diện (Themes) mới, mua Streak Shield, hoặc bạn cũng có thể <strong>Nạp Xu</strong> bằng ví điện tử nếu cần gấp!
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">4. Các Trợ Thủ AI</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                EnglishMaster tích hợp nhiều công cụ AI mạnh mẽ:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <Target size={18} className="text-indigo-500" /> AI Roleplay
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Nhắn tin trực tiếp với chatbot AI đóng vai người bản xứ (trong Góc học tập).</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <BookOpen size={18} className="text-emerald-500" /> AI Dictionary
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Click vào bất kỳ từ nào khó hiểu trên màn hình (đặc biệt trong video) để tra cứu tự động.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-6">Bạn đã sẵn sàng chinh phục tiếng Anh?</p>
        <a href="/roadmap" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all hover:-translate-y-1">
          Bắt đầu học ngay! <Map size={20} />
        </a>
      </div>
    </div>
  );
}
