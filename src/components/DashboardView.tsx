import React from 'react';
import { 
  Pill, 
  Stethoscope, 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { 
  Language, 
  MedicineItem, 
  MedicalEquipment, 
  EquipmentSaleRecord, 
  StaffMember, 
  PharmacySettings,
  DailySalesEntry
} from '../types/pharmacy';
import { 
  formatBDT, 
  formatBnDigits, 
  computeMedicineStats, 
  computeEquipmentStats, 
  computeStaffStats, 
  checkPharmacyOpenStatus 
} from '../utils/pharmacyUtils';
import { BookOpen, Wallet, Smartphone, Coffee } from 'lucide-react';

interface DashboardViewProps {
  lang: Language;
  medicines: MedicineItem[];
  equipment: MedicalEquipment[];
  equipmentSales: EquipmentSaleRecord[];
  staff: StaffMember[];
  dailyLedger: DailySalesEntry[];
  settings: PharmacySettings;
  setActiveTab: (tab: 'dashboard' | 'medicines' | 'equipment' | 'daily_ledger' | 'staff' | 'schedule') => void;
  onOpenPOS: () => void;
  onOpenAddMedicine: () => void;
  onOpenAddEquipmentSale: () => void;
  onOpenAddDailyEntry: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  medicines,
  equipment,
  equipmentSales,
  staff,
  dailyLedger,
  settings,
  setActiveTab,
  onOpenPOS,
  onOpenAddMedicine,
  onOpenAddEquipmentSale,
  onOpenAddDailyEntry,
}) => {
  const medStats = computeMedicineStats(medicines);
  const eqStats = computeEquipmentStats(equipment, equipmentSales);
  const staffStats = computeStaffStats(staff);
  const openStatus = checkPharmacyOpenStatus(settings.schedules);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = dailyLedger.find((e) => e.date === todayStr) || dailyLedger[0];

  return (
    <div className="space-y-6">
      {/* Pharmacy Status & Announcement Banner */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Store Details & Current Status */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-teal-700 tracking-wide">
                  {settings.regNumber}
                </span>
                <span aria-hidden="true">·</span>
                <span>{settings.addressBn}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {lang === 'bn' ? settings.storeNameBn : settings.storeNameEn}
              </h1>

              <p className="text-sm text-slate-600 max-w-xl">
                {lang === 'bn' 
                  ? 'ঔষধের সম্পূর্ণ স্টক হিসাব, আধুনিক মেডিকেল ইকুইপমেন্ট বিক্রির নির্ভুল খতিয়ান, দায়িত্বপ্রাপ্ত মোট স্টাফ এবং ফার্মেসির দৈনিক সময়সূচীর ডিজিটাল ব্যবস্থাপনা।' 
                  : 'Complete ledger for medicine stock, medical equipment sales directory, active staff rosters, and operating hours.'}
              </p>
            </div>

            {/* Live Operational Status Box */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${openStatus.isOpenNow ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {lang === 'bn' ? openStatus.statusTextBn : openStatus.statusTextEn}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      (সকাল ০৮:০০ - রাত ১২:০০)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'bn' ? openStatus.nextScheduleInfoBn : openStatus.nextScheduleInfoEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
                >
                  {lang === 'bn' ? 'সময়সূচী দেখুন' : 'View Timetable'}
                </button>
                <button
                  onClick={onOpenPOS}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors whitespace-nowrap"
                >
                  {lang === 'bn' ? 'বিক্রয় কাউন্টার' : 'Open POS'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Storefront Photography */}
          <div className="lg:col-span-5 relative min-h-[220px] bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200">
            <img
              src="/src/assets/images/pharmacy_storefront_1792987616097.jpg"
              alt="Medisys Pharmacy Storefront & Dispensary Counter"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex items-center justify-between pointer-events-none">
              <span className="font-medium drop-shadow-sm">
                {lang === 'bn' ? '২৪/৭ জরুরি প্রেসক্রিপশন উইন্ডো' : '24/7 Emergency Medicine Window'}
              </span>
              <span className="font-mono text-white/90 drop-shadow-sm">
                {settings.emergencyPhone.split(' ')[0]}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Primary Operational Metric Cards (Aligned with User's 4 Questions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Medicine Total Hiseb */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'ঔষধের মোট স্টক হিসাব' : 'Medicine Inventory'}</span>
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatBDT(medStats.totalRetailValue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700 tabular-nums">
                {lang === 'bn' ? formatBnDigits(medStats.totalItemTypes) : medStats.totalItemTypes} {lang === 'bn' ? 'ধরনের ঔষধ' : 'items'}
              </span>
              <span>·</span>
              <span className="tabular-nums">
                {lang === 'bn' ? formatBnDigits(medStats.totalStockUnits) : medStats.totalStockUnits} {lang === 'bn' ? 'পিস স্টক' : 'units'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {lang === 'bn' ? 'ক্রয়মূল্য:' : 'Cost:'} <strong className="text-slate-700 tabular-nums">{formatBDT(medStats.totalPurchaseCost)}</strong>
            </span>
            <button 
              onClick={() => setActiveTab('medicines')}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-0.5"
            >
              <span>{lang === 'bn' ? 'বিস্তারিত' : 'View'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Equipment Sels Hiseb */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'ইকুইপমেন্ট বিক্রির খতিয়ান' : 'Equipment Sold List'}</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatBDT(eqStats.totalSalesRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="font-medium text-emerald-700 tabular-nums font-semibold">
                {lang === 'bn' ? formatBnDigits(eqStats.totalUnitsSold) : eqStats.totalUnitsSold} {lang === 'bn' ? 'টি ইকুইপমেন্ট বিক্রি' : 'units sold'}
              </span>
              <span>·</span>
              <span className="tabular-nums">
                {lang === 'bn' ? formatBnDigits(eqStats.totalSalesCount) : eqStats.totalSalesCount} {lang === 'bn' ? 'টি ভাউচার' : 'sales'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {lang === 'bn' ? 'বর্তমান স্টক:' : 'In Stock:'} <strong className="text-slate-700 tabular-nums">{eqStats.totalUnitsInStock} {lang === 'bn' ? 'টি' : 'pcs'}</strong>
            </span>
            <button 
              onClick={() => setActiveTab('equipment')}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-0.5"
            >
              <span>{lang === 'bn' ? 'বিক্রির তালিকা' : 'Sales List'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Kotjon Staf Ase */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'মোট স্টাফ সংখ্যা' : 'Total Staff Count'}</span>
            <div className="p-1.5 bg-purple-50 text-purple-700 rounded-md">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums flex items-baseline gap-2">
              <span>{lang === 'bn' ? `${formatBnDigits(staffStats.totalStaff)} জন` : `${staffStats.totalStaff} Members`}</span>
              <span className="text-xs font-normal text-emerald-700 font-medium">
                ({staffStats.onDutyCount} {lang === 'bn' ? 'অন-ডিউটি' : 'active'})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span>{lang === 'bn' ? 'মর্নিং শিফট:' : 'Morning:'} {staffStats.morningShift}</span>
              <span>·</span>
              <span>{lang === 'bn' ? 'ইভিনিং:' : 'Evening:'} {staffStats.eveningShift}</span>
              <span>·</span>
              <span>{lang === 'bn' ? 'ছুটি:' : 'Leave:'} {staffStats.onLeaveCount}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {lang === 'bn' ? 'হেড ফার্মাসিস্ট অন-ডিউটি' : 'Chief Pharmacist Active'}
            </span>
            <button 
              onClick={() => setActiveTab('staff')}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-0.5"
            >
              <span>{lang === 'bn' ? 'স্টাফ বিবরণ' : 'Roster'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Kokhon theke Kokhon Open Thake */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{lang === 'bn' ? 'ফার্মেসি সময়সূচী' : 'Pharmacy Hours'}</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-slate-900 tracking-tight">
              08:00 AM - 12:00 AM
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-medium">
                {lang === 'bn' ? 'প্রতিদিন ১৬ ঘণ্টা নিয়মিত' : '16 hrs daily service'}
              </span>
              <span>·</span>
              <span className="text-slate-600 font-medium">
                {lang === 'bn' ? 'জরুরি ২৪/৭' : '24/7 on call'}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 truncate max-w-[140px]">
              {lang === 'bn' ? 'শুক্রবার জুমার বিরতি' : 'Fri Jummah Break'}
            </span>
            <button 
              onClick={() => setActiveTab('schedule')}
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-0.5"
            >
              <span>{lang === 'bn' ? 'রুটিন দেখুন' : 'Full Hours'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Today's Daily Sales Khata Strip (Direct answer to "potidin a je takar sels hoi seta khatai entry") */}
      {todayEntry && (
        <div className="bg-white border border-teal-200/80 rounded-xl p-5 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-teal-50 text-teal-700">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  {lang === 'bn' ? 'আজকের বিক্রয় খাতা (Today’s Sales Ledger)' : 'Today’s Cash Register'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  · {todayEntry.dayLabelBn} ({todayEntry.date})
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
                  {formatBDT(todayEntry.totalSales)}
                </span>
                <span className="text-xs text-slate-500">
                  {lang === 'bn' ? 'আজকের মোট বিক্রি' : 'Gross Sales Today'}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-600 font-mono">
                  {todayEntry.totalInvoices} {lang === 'bn' ? 'টি মেমো' : 'invoices'}
                </span>
              </div>
            </div>

            {/* Middle: Cash vs Digital vs Net in Hand */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 min-w-[120px]">
                <span className="text-slate-500 block text-[11px]">{lang === 'bn' ? 'নগদ ক্যাশ' : 'Cash in Hand'}</span>
                <span className="text-sm font-bold font-mono text-slate-800 tabular-nums">{formatBDT(todayEntry.cashAmount)}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200 min-w-[120px]">
                <span className="text-teal-700 block text-[11px]">{lang === 'bn' ? 'বিকাশ / ডিজিটাল' : 'Digital MFS'}</span>
                <span className="text-sm font-bold font-mono text-teal-800 tabular-nums">{formatBDT(todayEntry.digitalAmount)}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200 min-w-[120px]">
                <span className="text-amber-700 block text-[11px]">{lang === 'bn' ? 'দোকান খরচ' : 'Daily Expense'}</span>
                <span className="text-sm font-bold font-mono text-amber-800 tabular-nums">-{formatBDT(todayEntry.dailyExpense)}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 min-w-[130px]">
                <span className="text-emerald-700 block text-[11px] font-semibold">{lang === 'bn' ? 'ক্যাশবাক্সে নিট জমা' : 'Net Closing Cash'}</span>
                <span className="text-base font-bold font-mono text-emerald-800 tabular-nums">{formatBDT(todayEntry.netCashInHand)}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenAddDailyEntry}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors whitespace-nowrap"
              >
                {lang === 'bn' ? '+ খাতা এন্ট্রি' : '+ Entry'}
              </button>
              <button
                onClick={() => setActiveTab('daily_ledger')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <span>{lang === 'bn' ? 'সম্পূর্ণ খাতা দেখুন' : 'Full Khata'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Two Column Section: Equipment Sales Snapshot & Staff On Duty Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Medical Equipment Sales & Showcase */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'bn' ? 'মেডিকেল ইকুইপমেন্ট বিক্রির সাম্প্রতিক তালিকা' : 'Recent Medical Equipment Sales'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'bn' ? 'প্রেসার মেশিন, গ্লুকোমিটার, নেবুলাইজার, অক্সিজেন অক্সিমিটার ও হুইলচেয়ার বিক্রির রেকর্ড' : 'Track sales of diagnostic and respiratory equipment with warranties'}
              </p>
            </div>
            <button
              onClick={onOpenAddEquipmentSale}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors"
            >
              {lang === 'bn' ? '+ ইকুইপমেন্ট বিক্রি' : '+ Sell Equipment'}
            </button>
          </div>

          {/* Quick Equipment Visual Card */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <img 
              src="/src/assets/images/medical_equipment_collection_1792987615345.jpg"
              alt="Medical Equipment Display"
              referrerPolicy="no-referrer"
              className="w-20 h-16 object-cover rounded-md shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {lang === 'bn' ? 'রেজিস্টার্ড মেডিকেল ইকুইপমেন্ট তালিকা' : 'Certified Medical Device Collection'}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {lang === 'bn' ? 'Omron BP, Accu-Chek ডায়াবেটিস কিট, Beurer নেবুলাইজার, হুইলচেয়ার ও পালস অক্সিমিটার' : 'Omron BP, Accu-Chek, Beurer Nebulizer, Oximeters with Official Warranty'}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 font-mono">
                <span>{lang === 'bn' ? 'মোট বিক্রয়:' : 'Total Sold:'} <strong>{eqStats.totalUnitsSold} টি</strong></span>
                <span>·</span>
                <span>{lang === 'bn' ? 'মোট আয়:' : 'Revenue:'} <strong className="text-emerald-700">{formatBDT(eqStats.totalSalesRevenue)}</strong></span>
              </div>
            </div>
          </div>

          {/* Sales Table Snippet */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-y border-slate-200 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">{lang === 'bn' ? 'ভাউচার / তারিখ' : 'Invoice / Date'}</th>
                  <th className="py-2.5 px-3">{lang === 'bn' ? 'ইকুইপমেন্টের নাম' : 'Equipment Name'}</th>
                  <th className="py-2.5 px-3">{lang === 'bn' ? 'ক্রেতা' : 'Customer'}</th>
                  <th className="py-2.5 px-3 text-right">{lang === 'bn' ? 'মূল্য (টাকা)' : 'Price (BDT)'}</th>
                  <th className="py-2.5 px-3 text-center">{lang === 'bn' ? 'ওয়ারেন্টি' : 'Warranty'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipmentSales.slice(0, 4).map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono">
                      <div className="font-semibold text-slate-900">{sale.invoiceNo}</div>
                      <div className="text-[11px] text-slate-500">{sale.date}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900 truncate max-w-[180px]">{sale.equipmentName}</div>
                      <div className="text-[11px] text-slate-500">{sale.brand} · {sale.model}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-800">{sale.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{sale.customerPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatBDT(sale.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[11px] text-emerald-800 font-medium">
                        {sale.warrantyPeriod.split('(')[0].trim()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right">
            <button
              onClick={() => setActiveTab('equipment')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              <span>{lang === 'bn' ? 'সকল ইকুইপমেন্ট বিক্রির তালিকা দেখুন' : 'View All Equipment Sales Records'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Active Staff & Operating Timings Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Staff List Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'bn' ? 'বর্তমান কর্মরত স্টাফ তালিকা' : 'Staff On-Duty Today'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'bn' ? `মোট ${staffStats.totalStaff} জনের মধ্যে ${staffStats.onDutyCount} জন বর্তমানে ডিউটিতে আছেন` : `${staffStats.onDutyCount} of ${staffStats.totalStaff} staff members currently on duty`}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('staff')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                {lang === 'bn' ? 'সকল স্টাফ' : 'View All'}
              </button>
            </div>

            <div className="space-y-3">
              {staff.slice(0, 4).map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lang === 'bn' ? member.roleTitleBn : member.roleTitleEn}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                      member.dutyStatus === 'on_duty' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : member.dutyStatus === 'off_duty' 
                          ? 'bg-slate-200 text-slate-700' 
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {member.dutyStatus === 'on_duty' 
                        ? (lang === 'bn' ? 'অন-ডিউটি' : 'On Duty') 
                        : member.dutyStatus === 'off_duty' 
                          ? (lang === 'bn' ? 'অফ-ডিউটি' : 'Off Duty') 
                          : (lang === 'bn' ? 'ছুটি' : 'On Leave')}
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {member.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Schedule Callout Card */}
          <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                {lang === 'bn' ? 'জরুরি সেবা ও সময়সূচী' : 'Emergency & Hours'}
              </span>
              <span className="text-xs bg-teal-700/60 px-2 py-0.5 rounded text-teal-200">
                {settings.is24HoursEmergency ? '24/7 Available' : 'Daily 8AM-12AM'}
              </span>
            </div>

            <div className="text-sm font-semibold">
              {lang === 'bn' 
                ? 'রাত ১২টার পরেও জরুরি ঔষধের জন্য সরাসরি কল করুন:' 
                : 'For urgent medicine after midnight, call directly:'}
            </div>

            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-teal-200">{settings.emergencyPharmacistName}</div>
                <div className="text-base font-bold font-mono text-white">{settings.emergencyPhone}</div>
              </div>
              <a
                href={`tel:${settings.emergencyPhone}`}
                className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors"
                title="Call Emergency Hotline"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Stock Alerts Notice (Low Stock & Expiring Medicines) */}
      {(medStats.lowStockCount > 0 || medStats.expiringSoonCount > 0) && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">
                {lang === 'bn' ? 'স্টক সতর্কবার্তা:' : 'Stock Warnings:'}
              </span>{' '}
              {medStats.lowStockCount > 0 && (
                <span>
                  {medStats.lowStockCount} {lang === 'bn' ? 'টি ঔষধের স্টক শেষ হওয়ার পথে (Low Stock)' : 'medicines running low'}
                </span>
              )}
              {medStats.lowStockCount > 0 && medStats.expiringSoonCount > 0 && ' · '}
              {medStats.expiringSoonCount > 0 && (
                <span>
                  {medStats.expiringSoonCount} {lang === 'bn' ? 'টি ঔষধের মেয়াদ শীঘ্রই শেষ হবে (Near Expiry)' : 'medicines expiring within 90 days'}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('medicines')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            {lang === 'bn' ? 'স্টক চেক করুন' : 'Inspect Stock'}
          </button>
        </div>
      )}

    </div>
  );
};
