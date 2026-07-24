import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 border border-slate-100 flex flex-col h-full overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-slate-200 rounded-xl mb-4"></div>
      <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded-md w-5/6 mb-4"></div>
      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded-md w-20"></div>
        <div className="h-8 bg-blue-100 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-full z-10 animate-pulse">
      <div className="p-4 border-b border-slate-200">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 mx-2 my-2 rounded-xl flex items-start gap-3 bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonVideo() {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8 animate-pulse">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-t-2xl shadow-soft border border-slate-100 border-b-0 mb-0">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
          <div className="flex gap-4">
            <div className="h-6 bg-slate-200 rounded w-24"></div>
            <div className="h-6 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
        <div className="bg-white shadow-soft border border-slate-100 rounded-b-2xl p-6 h-[400px] flex items-center justify-center">
           <div className="w-full h-full bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonExam() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 animate-pulse">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-slate-200 rounded"></div>
            <div className="h-6 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100">
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-16 bg-slate-100 rounded-2xl border-2 border-slate-200"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
