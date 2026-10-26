import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Language, PharmacySettings, DaySchedule } from '../types/pharmacy';
import { checkPharmacyOpenStatus } from '../utils/pharmacyUtils';

interface ScheduleTimingViewProps {
  lang: Language;
  settings: PharmacySettings;
  onUpdateSettings: (newSettings: PharmacySettings) => void;
}

export const ScheduleTimingView: React.FC<ScheduleTimingViewProps> = ({
  lang,
  settings,
  onUpdateSettings,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formSchedules, setFormSchedules] = useState<DaySchedule[]>(settings.schedules);
  const [formEmergencyPhone, setFormEmergencyPhone] = useState(settings.emergencyPhone);
  const [formPharmacist, setFormPharmacist] = useState(settings.emergencyPharmacistName);
  const [formIs24Hours, setFormIs24Hours] = useState(settings.is24HoursEmergency);

  const openStatus = checkPharmacyOpenStatus(settings.schedules);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      schedules: formSchedules,
      emergencyPhone: formEmergencyPhone,
      emergencyPharmacistName: formPharmacist,
      is24HoursEmergency: formIs24Hours,
    });
    setIsEditing(false);
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime' | 'breakInfoBn', value: string) => {
    const updated = [...formSchedules];
    updated[index] = { ...updated[index], [field]: value };
    setFormSchedules(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'ফার্মেসি খোলার সময়সূচী ও জরুরি সেবা' : 'Pharmacy Operating Hours & Emergency Schedule'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'bn' 
              ? 'কখন থেকে কখন দোকান খোলা থাকে, প্রতিদিনের সময়সূচী, জুমার নামাজের বিরতি ও রাতের জরুরি সেবা' 
              : 'Detailed daily opening and closing hours, prayer breaks, and 24/7 on-call emergency pharmacist.'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormSchedules(settings.schedules);
            setFormEmergencyPhone(settings.emergencyPhone);
            setFormPharmacist(settings.emergencyPharmacistName);
            setFormIs24Hours(settings.is24HoursEmergency);
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-slate-600" />
          <span>{lang === 'bn' ? 'সময়সূচী পরিবর্তন করুন' : 'Edit Operating Hours'}</span>
        </button>
      </div>

      {/* Real-Time Live Status Card */}
      <div className={`p-6 rounded-xl border ${
        openStatus.isOpenNow 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50/90 border-amber-200 text-amber-950'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${openStatus.isOpenNow ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/70">
                  {lang === 'bn' ? 'লাইভ ফার্মেসি স্ট্যাটাস' : 'Live Status'}
                </span>
                <span className="text-xs font-mono font-medium">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                {lang === 'bn' ? openStatus.statusTextBn : openStatus.statusTextEn}
              </h3>
              <p className="text-xs sm:text-sm mt-1 text-slate-700">
                {lang === 'bn' ? openStatus.nextScheduleInfoBn : openStatus.nextScheduleInfoEn}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white/80 p-3 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 block">{lang === 'bn' ? 'জরুরি অন-কল সেবা:' : '24/7 Hotline:'}</span>
              <a href={`tel:${settings.emergencyPhone}`} className="font-bold text-teal-800 font-mono text-sm hover:underline">
                {settings.emergencyPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Weekly Hours Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'bn' ? 'সাপ্তাহিক নিয়মিত সময়সূচী (Saturday to Friday)' : 'Weekly Standard Operating Schedule'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'bn' ? 'দোকানের প্রধান ফটক ও কাউন্টার খোলার সময়' : 'Main shutter and counter opening times'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
            {lang === 'bn' ? 'দৈনিক ১৬ ঘণ্টা খোলা' : '16 Hours Daily'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">{lang === 'bn' ? 'বার / দিন' : 'Day'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'খোলার সময় (Open)' : 'Opening Time'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'বন্ধের সময় (Close)' : 'Closing Time'}</th>
                <th className="py-3 px-4">{lang === 'bn' ? 'বিরতি / বিশেষ নোট' : 'Breaks & Notes'}</th>
                <th className="py-3 px-4 text-center">{lang === 'bn' ? 'অবস্থা' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settings.schedules.map((item) => (
                <tr key={item.dayId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {lang === 'bn' ? item.dayBn : item.dayEn}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {item.openTime} AM (সকাল ৮টা)
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {item.closeTime === '24:00' ? '12:00 AM (রাত ১২টা / মধ্যরাত)' : `${item.closeTime} PM`}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {lang === 'bn' ? (item.breakInfoBn || 'সারাদিন বিরতিহীন খোলা') : (item.breakInfoEn || 'Open continuously')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {lang === 'bn' ? 'নিয়মিত খোলা' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Pharmacy Information & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: 24/7 Emergency Medicine Window */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-800">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {lang === 'bn' ? '২৪ ঘণ্টা জরুরি প্রেসক্রিপশন উইন্ডো' : '24/7 Emergency Prescription Window'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'রাত ১২টার পর জরুরি ইনজেকশন, স্যালাইন ও লাইফ-সেভিং ঔষধ' : 'Urgent medication and injections after regular shutter closure'}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'bn' 
              ? 'দোকান বন্ধ থাকার সময়েও জরুরি প্রেসক্রিপশনের ঔষধ পাওয়ার জন্য আমাদের সাইড উইন্ডো বা নাইট বেলের ব্যবস্থা রয়েছে। তাৎক্ষণিক ডেলিভারি বা ঔষধ পেতে নিম্নের অন-কল ফার্মাসিস্টের নম্বরে ডায়াল করুন।'
              : 'Our night emergency dispensing window is equipped for life-saving medicines and hospital prescriptions.'}
          </p>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="text-xs text-slate-500">
              {lang === 'bn' ? 'দায়িত্বপ্রাপ্ত অন-কল ফার্মাসিস্ট:' : 'On-Duty Night Pharmacist:'}
            </div>
            <div className="text-sm font-bold text-slate-900">
              {settings.emergencyPharmacistName}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <PhoneCall className="w-4 h-4 text-teal-700" />
              <a href={`tel:${settings.emergencyPhone}`} className="text-base font-bold font-mono text-teal-800 hover:underline">
                {settings.emergencyPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Card 2: Location & Contact Directory */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-800">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {lang === 'bn' ? 'ফার্মেসির ঠিকানা ও যোগাযোগ' : 'Store Location & Helpline'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'সহজেই ফার্মেসি খুঁজে পেতে লোকেশন' : 'Pharmacy location and contact channels'}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div>
              <span className="font-semibold text-slate-900 block mb-0.5">{lang === 'bn' ? 'ঠিকানা:' : 'Address:'}</span>
              <span>{settings.addressBn}</span>
            </div>

            <div>
              <span className="font-semibold text-slate-900 block mb-0.5">{lang === 'bn' ? 'ল্যান্ডমার্ক:' : 'Landmark:'}</span>
              <span>{lang === 'bn' ? 'উত্তরা আধুনিক মেডিকেল কলেজ ও ফ্রেন্ডশিপ ব্রিজের নিকটবর্তী' : 'Near Uttara Adhunik Medical College Hospital'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{lang === 'bn' ? 'দোকানের ল্যান্ডলাইন' : 'Landline'}</span>
                <span className="font-mono font-bold text-slate-900">{settings.phone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">{lang === 'bn' ? 'লাইসেন্স নম্বর' : 'License'}</span>
                <span className="font-mono font-bold text-slate-900">{settings.regNumber.split('/')[0]}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Schedule Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? 'ফার্মেসি সময়সূচী পরিবর্তন করুন' : 'Edit Operating Schedule'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700">
                  {lang === 'bn' ? 'প্রতিদিনের খোলার ও বন্ধের সময়:' : 'Daily Open / Close Hours:'}
                </div>
                
                {formSchedules.map((sch, idx) => (
                  <div key={sch.dayId} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs p-2 rounded bg-slate-50 border border-slate-200">
                    <div className="sm:col-span-3 font-semibold text-slate-800">
                      {sch.dayBn.split('(')[0]}
                    </div>
                    <div className="sm:col-span-3 flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">খোলা:</span>
                      <input
                        type="text"
                        value={sch.openTime}
                        onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        placeholder="08:00"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center gap-1">
                      <span className="text-[11px] text-slate-500">বন্ধ:</span>
                      <input
                        type="text"
                        value={sch.closeTime}
                        onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono"
                        placeholder="24:00"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={sch.breakInfoBn || ''}
                        onChange={(e) => handleTimeChange(idx, 'breakInfoBn', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-[11px]"
                        placeholder="বিরতির তথ্য..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'জরুরি অন-কল ফোন নম্বর' : 'Emergency Hotline Phone'}
                  </label>
                  <input
                    type="text"
                    value={formEmergencyPhone}
                    onChange={(e) => setFormEmergencyPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'bn' ? 'জরুরি ফার্মাসিস্টের নাম' : 'Emergency Pharmacist Name'}
                  </label>
                  <input
                    type="text"
                    value={formPharmacist}
                    onChange={(e) => setFormPharmacist(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
