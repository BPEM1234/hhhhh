import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  Phone, 
  Mail, 
  Plus, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  Edit2, 
  Trash2, 
  Sparkles,
  Award
} from 'lucide-react';
import { Language, StaffMember, StaffDutyStatus } from '../types/pharmacy';
import { formatBDT, formatBnDigits, computeStaffStats } from '../utils/pharmacyUtils';

interface StaffManagementViewProps {
  lang: Language;
  staff: StaffMember[];
  onAddStaff: () => void;
  onEditStaff: (member: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onUpdateDutyStatus: (id: string, status: StaffDutyStatus) => void;
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({
  lang,
  staff,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  onUpdateDutyStatus,
}) => {
  const [filterShift, setFilterShift] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const stats = useMemo(() => computeStaffStats(staff), [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchShift = filterShift === 'all' || s.shift === filterShift;
      const matchStatus = filterStatus === 'all' || s.dutyStatus === filterStatus;
      return matchShift && matchStatus;
    });
  }, [staff, filterShift, filterStatus]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'স্টাফ তালিকা, উপস্থিতি ও দায়িত্ব বন্টন' : 'Staff Directory & Duty Roster'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'bn' 
              ? 'ফার্মেসিতে মোট কতজন কর্মী আছেন, তাদের পদবি, মোবাইল নম্বর, বর্তমান শিফট ও ডিউটি স্ট্যাটাস' 
              : 'Complete personnel directory, shift timings, real-time duty status, and contact roster.'}
          </p>
        </div>

        <button
          onClick={onAddStaff}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? '+ নতুন কর্মী যুক্ত করুন' : '+ Add New Staff'}</span>
        </button>
      </div>

      {/* Staff Count KPI Overview (Direct answer to "kotiojon staf ase") */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Staff */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'সর্বমোট স্টাফ সংখ্যা' : 'Total Staff Strength'}</span>
            <div className="p-1.5 bg-teal-50 text-teal-700 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.totalStaff)} জন` : `${stats.totalStaff} Members`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'bn' ? 'ফার্মাসিস্ট, বিক্রয় ও সহকারী টিম' : 'Full pharmacy team'}
          </div>
        </div>

        {/* On Duty */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'বর্তমানে কর্মরত (On Duty)' : 'Currently On Duty'}</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-2 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.onDutyCount)} জন` : `${stats.onDutyCount} Active`}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            {lang === 'bn' ? 'কাউন্টারে ও ডিসপেনসারিতে উপস্থিত' : 'Serving customers right now'}
          </div>
        </div>

        {/* Off Duty */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'অফ-ডিউটি (শিফট শেষ)' : 'Off Duty'}</span>
            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-700 mt-2 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.offDutyCount)} জন` : `${stats.offDutyCount} Staff`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'bn' ? 'পরবর্তী শিফটের জন্য প্রস্তুত' : 'Scheduled for upcoming shift'}
          </div>
        </div>

        {/* On Leave */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'ছুটিতে আছেন (On Leave)' : 'On Leave'}</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 mt-2 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.onLeaveCount)} জন` : `${stats.onLeaveCount} Staff`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'bn' ? 'অনুমোদিত সাপ্তাহিক/অসুস্থতা ছুটি' : 'Approved weekly/sick leave'}
          </div>
        </div>

      </div>

      {/* Filter and Shift Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            {lang === 'bn' ? 'শিফট ফিল্টার:' : 'Filter Shift:'}
          </span>
          <select
            value={filterShift}
            onChange={(e) => setFilterShift(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-600"
          >
            <option value="all">{lang === 'bn' ? 'সকল শিফট' : 'All Shifts'}</option>
            <option value="morning">{lang === 'bn' ? 'সকাল (Morning 8AM-4PM)' : 'Morning'}</option>
            <option value="evening">{lang === 'bn' ? 'সন্ধ্যা (Evening 4PM-12AM)' : 'Evening'}</option>
            <option value="night">{lang === 'bn' ? 'রাত (Night 12AM-8AM)' : 'Night'}</option>
            <option value="full_day">{lang === 'bn' ? 'ফুল-ডে (Full Day)' : 'Full Day'}</option>
            <option value="flexible">{lang === 'bn' ? 'ফ্লেক্সিবল অন-কল' : 'Flexible'}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-teal-600 ml-2"
          >
            <option value="all">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
            <option value="on_duty">{lang === 'bn' ? 'অন-ডিউটি' : 'On Duty'}</option>
            <option value="off_duty">{lang === 'bn' ? 'অফ-ডিউটি' : 'Off Duty'}</option>
            <option value="on_leave">{lang === 'bn' ? 'ছুটি' : 'On Leave'}</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          {lang === 'bn' ? 'স্ট্যাটাস বদলাতে যে কোনো কর্মীর কার্ডে ক্লিক করুন' : 'Click buttons below to toggle staff status directly'}
        </div>
      </div>

      {/* Staff Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStaff.map((member) => (
          <div 
            key={member.id} 
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
          >
            <div>
              {/* Top Row: Avatar, Name & Role */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-teal-800 font-bold text-base flex items-center justify-center shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {member.name}
                    </h3>
                    <div className="text-xs font-medium text-teal-800 mt-0.5">
                      {lang === 'bn' ? member.roleTitleBn : member.roleTitleEn}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditStaff(member)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title={lang === 'bn' ? 'এডিট করুন' : 'Edit'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteStaff(member.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Shift & Duty Timing */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-medium font-mono">{member.shiftTiming}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>{lang === 'bn' ? 'যোগদান:' : 'Joined:'} {member.joinDate}</span>
                  {member.bloodGroup && (
                    <span className="font-mono text-slate-700">রক্ত: {member.bloodGroup}</span>
                  )}
                </div>
              </div>

              {/* Notes / Special Responsibility */}
              {member.notes && (
                <div className="mt-2.5 text-xs text-slate-600 italic">
                  "{member.notes}"
                </div>
              )}

              {/* Phone & Contact */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <a 
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1.5 font-mono text-teal-700 hover:text-teal-800 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </a>
                <span className="font-mono text-slate-600">
                  {lang === 'bn' ? 'বেতন: ' : 'Salary: '}{formatBDT(member.salary)}
                </span>
              </div>
            </div>

            {/* Bottom Row: 1-Click Duty Status Switcher */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 mb-1.5">
                {lang === 'bn' ? 'বর্তমান উপস্থিতি স্ট্যাটাস:' : 'Duty Attendance Status:'}
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => onUpdateDutyStatus(member.id, 'on_duty')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors ${
                    member.dutyStatus === 'on_duty'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'অন-ডিউটি' : 'On Duty'}
                </button>
                <button
                  onClick={() => onUpdateDutyStatus(member.id, 'off_duty')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors ${
                    member.dutyStatus === 'off_duty'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'অফ-ডিউটি' : 'Off Duty'}
                </button>
                <button
                  onClick={() => onUpdateDutyStatus(member.id, 'on_leave')}
                  className={`py-1.5 px-2 text-xs font-semibold rounded transition-colors ${
                    member.dutyStatus === 'on_leave'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'bn' ? 'ছুটি' : 'Leave'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
