import React, { useState, useEffect } from 'react';
import { BookOpen, X, Calculator, Wallet, Smartphone, Coffee } from 'lucide-react';
import { Language, DailySalesEntry, StaffMember } from '../types/pharmacy';
import { formatBDT } from '../utils/pharmacyUtils';

interface AddDailyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: DailySalesEntry) => void;
  lang: Language;
  staffList: StaffMember[];
  editEntry?: DailySalesEntry | null;
}

export const AddDailyEntryModal: React.FC<AddDailyEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
  staffList,
  editEntry,
}) => {
  const [date, setDate] = useState('');
  const [dayLabelBn, setDayLabelBn] = useState('');
  const [totalSales, setTotalSales] = useState<number>(0);
  const [medicineSales, setMedicineSales] = useState<number>(0);
  const [equipmentSales, setEquipmentSales] = useState<number>(0);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [digitalAmount, setDigitalAmount] = useState<number>(0);
  const [dailyExpense, setDailyExpense] = useState<number>(0);
  const [totalInvoices, setTotalInvoices] = useState<number>(1);
  const [recordedByStaff, setRecordedByStaff] = useState('');
  const [notes, setNotes] = useState('');

  const getDayNameBn = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      return days[d.getDay()] || 'দিন';
    } catch (e) {
      return 'দিন';
    }
  };

  useEffect(() => {
    if (editEntry) {
      setDate(editEntry.date);
      setDayLabelBn(editEntry.dayLabelBn);
      setTotalSales(editEntry.totalSales);
      setMedicineSales(editEntry.medicineSales);
      setEquipmentSales(editEntry.equipmentSales);
      setCashAmount(editEntry.cashAmount);
      setDigitalAmount(editEntry.digitalAmount);
      setDailyExpense(editEntry.dailyExpense);
      setTotalInvoices(editEntry.totalInvoices);
      setRecordedByStaff(editEntry.recordedByStaff);
      setNotes(editEntry.notes || '');
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setDayLabelBn(getDayNameBn(today));
      setTotalSales(15000);
      setMedicineSales(12000);
      setEquipmentSales(3000);
      setCashAmount(11500);
      setDigitalAmount(3500);
      setDailyExpense(350);
      setTotalInvoices(30);
      setRecordedByStaff(staffList[0]?.name || 'Counter Cashier');
      setNotes('দোকানের দৈনিক স্বাভাবিক বিক্রয় সম্পন্ন।');
    }
  }, [editEntry, isOpen, staffList]);

  if (!isOpen) return null;

  // Auto calculate net cash
  const netCashInHand = Math.max(0, totalSales - dailyExpense);

  const handleDateChange = (val: string) => {
    setDate(val);
    setDayLabelBn(getDayNameBn(val));
  };

  const handleSubSalesChange = (med: number, eq: number) => {
    setMedicineSales(med);
    setEquipmentSales(eq);
    const sum = med + eq;
    setTotalSales(sum);
    // Proportion cash & digital
    const cashRatio = totalSales > 0 ? cashAmount / totalSales : 0.8;
    setCashAmount(Math.round(sum * cashRatio));
    setDigitalAmount(Math.round(sum * (1 - cashRatio)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const entryData: DailySalesEntry = {
      id: editEntry ? editEntry.id : `ledger-${date}-${Date.now()}`,
      date,
      dayLabelBn: dayLabelBn || getDayNameBn(date),
      totalSales: Number(totalSales) || 0,
      medicineSales: Number(medicineSales) || 0,
      equipmentSales: Number(equipmentSales) || 0,
      cashAmount: Number(cashAmount) || 0,
      digitalAmount: Number(digitalAmount) || 0,
      dailyExpense: Number(dailyExpense) || 0,
      netCashInHand,
      totalInvoices: Number(totalInvoices) || 1,
      recordedByStaff: recordedByStaff || 'Counter Cashier',
      notes: notes.trim(),
    };

    onSave(entryData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 my-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editEntry 
                ? (lang === 'bn' ? 'দৈনিক বিক্রয় খাতা এডিট করুন' : 'Edit Daily Sales Entry') 
                : (lang === 'bn' ? 'খাতায় নতুন দিনের বিক্রয় এন্ট্রি' : 'Add Daily Sales to Ledger')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Date & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'তারিখ নির্বাচন করুন *' : 'Entry Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'বার / দিনের নাম' : 'Day of Week'}
              </label>
              <input
                type="text"
                value={dayLabelBn}
                onChange={(e) => setDayLabelBn(e.target.value)}
                placeholder="e.g. রবিবার"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>

          {/* Sales Breakdown */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? 'দৈনিক মোট বিক্রি ও খাত অনুযায়ী হিসাব:' : 'Gross Sales & Category Breakdown:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'ঔষধ বিক্রি (টাকা)' : 'Medicine Sales'}
                </label>
                <input
                  type="number"
                  value={medicineSales}
                  onChange={(e) => handleSubSalesChange(parseFloat(e.target.value) || 0, equipmentSales)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'ইকুইপমেন্ট বিক্রি (টাকা)' : 'Equipment Sales'}
                </label>
                <input
                  type="number"
                  value={equipmentSales}
                  onChange={(e) => handleSubSalesChange(medicineSales, parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'সর্বমোট বিক্রি (৳) *' : 'Total Gross Sales *'}
                </label>
                <input
                  type="number"
                  required
                  value={totalSales}
                  onChange={(e) => setTotalSales(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-teal-800 bg-teal-50/50 border border-teal-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Cash & Digital Collection */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'bn' ? 'নগদ ক্যাশ (টাকা)' : 'Cash in Hand'}</span>
              </label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'bn' ? 'বিকাশ / নগদ / কার্ড' : 'Digital MFS'}</span>
              </label>
              <input
                type="number"
                value={digitalAmount}
                onChange={(e) => setDigitalAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-700 block mb-1 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'bn' ? 'দোকান খরচ (টাকা)' : 'Daily Expenses'}</span>
              </label>
              <input
                type="number"
                value={dailyExpense}
                onChange={(e) => setDailyExpense(parseFloat(e.target.value) || 0)}
                placeholder="চা, পলিথিন, কারেন্ট..."
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-amber-50/50 border border-amber-300 text-amber-900 rounded"
              />
            </div>
          </div>

          {/* Closing Net Balance Callout */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-emerald-900 block">
                {lang === 'bn' ? 'ক্যাশবাক্সে নিট জমা টাকা (Net Cash Balance):' : 'Net Cash Closing Balance:'}
              </span>
              <span className="text-[11px] text-emerald-700">
                (মোট বিক্রি - দোকান খরচ)
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-800 tabular-nums">
              {formatBDT(netCashInHand)}
            </div>
          </div>

          {/* Invoices count & Cashier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'মোট মেমো বা কাস্টমার সংখ্যা' : 'Total Invoices Count'}
              </label>
              <input
                type="number"
                min="1"
                value={totalInvoices}
                onChange={(e) => setTotalInvoices(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'খাতা পরিচালনাকারী কর্মী / ক্যাশিয়ার' : 'Recorded By Staff'}
              </label>
              <select
                value={recordedByStaff}
                onChange={(e) => setRecordedByStaff(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.roleTitleBn.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'দৈনিক মন্তব্য / বিশেষ বিবরণ' : 'Daily Remarks / Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. সন্ধ্যায় প্রেসার মেশিন বিক্রি বেশি হয়েছে। চা-নাস্তা খরচ ৳৩৫০।"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
            >
              {lang === 'bn' ? 'খাতায় সেভ করুন' : 'Save to Ledger'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
