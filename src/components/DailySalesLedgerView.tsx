import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Smartphone, 
  Receipt, 
  Printer, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  FileSpreadsheet, 
  Search, 
  ArrowUpDown,
  Coffee,
  Coins
} from 'lucide-react';
import { Language, DailySalesEntry, StaffMember, PharmacySettings } from '../types/pharmacy';
import { formatBDT, formatBnDigits } from '../utils/pharmacyUtils';

interface DailySalesLedgerViewProps {
  lang: Language;
  dailyLedger: DailySalesEntry[];
  staffList: StaffMember[];
  settings: PharmacySettings;
  onOpenAddEntry: (existing?: DailySalesEntry) => void;
  onDeleteEntry: (id: string) => void;
  onPrintDaySheet: (entry: DailySalesEntry) => void;
}

export const DailySalesLedgerView: React.FC<DailySalesLedgerViewProps> = ({
  lang,
  dailyLedger,
  staffList,
  settings,
  onOpenAddEntry,
  onDeleteEntry,
  onPrintDaySheet,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7days' | 'month'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'net'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Today's entry
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = dailyLedger.find((e) => e.date === todayStr) || dailyLedger[0];

  // Aggregated calculations
  const totalSalesAll = useMemo(() => {
    return dailyLedger.reduce((sum, item) => sum + item.totalSales, 0);
  }, [dailyLedger]);

  const totalExpenseAll = useMemo(() => {
    return dailyLedger.reduce((sum, item) => sum + item.dailyExpense, 0);
  }, [dailyLedger]);

  const totalNetCashAll = useMemo(() => {
    return dailyLedger.reduce((sum, item) => sum + item.netCashInHand, 0);
  }, [dailyLedger]);

  const averageDailySales = useMemo(() => {
    return dailyLedger.length > 0 ? totalSalesAll / dailyLedger.length : 0;
  }, [dailyLedger, totalSalesAll]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return dailyLedger
      .filter((entry) => {
        const matchesSearch = 
          entry.date.includes(searchTerm) ||
          entry.dayLabelBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.recordedByStaff.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.notes && entry.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        if (filterPeriod === '7days') {
          const entryTime = new Date(entry.date).getTime();
          const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          return entryTime >= sevenDaysAgo;
        }

        return true;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'date') comp = new Date(a.date).getTime() - new Date(b.date).getTime();
        else if (sortBy === 'total') comp = a.totalSales - b.totalSales;
        else if (sortBy === 'net') comp = a.netCashInHand - b.netCashInHand;
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [dailyLedger, searchTerm, filterPeriod, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-800 text-xs font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'bn' ? 'দোকানের ক্যাশ খাতা ও দিনপত্রী' : 'Daily Cash Register & Day-Book'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'প্রতিদিনের বিক্রয় ও জমার খাতা (Daily Sales Khata)' : 'Daily Sales Ledger & Cash Book'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'bn' 
              ? 'প্রতিদিন কত টাকার ঔষধ ও ইকুইপমেন্ট বিক্রি হলো, কত টাকা ক্যাশ ও বিকাশে জমা হলো এবং কত টাকা দোকান খরচ হলো তার দৈনিক খতিয়ান।' 
              : 'Record, track, and balance daily sales revenue, cash in hand, digital collections, and petty expenses.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onOpenAddEntry()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? '+ আজকের খাতা এন্ট্রি করুন' : '+ New Daily Entry'}</span>
          </button>
        </div>
      </div>

      {/* Today's Closing Box / ক্যাশবাক্স কার্ড */}
      {todayEntry && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white rounded-xl p-5 sm:p-6 shadow-md border border-teal-800/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: Day & Total Sales Callout */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-teal-300">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-semibold">{todayEntry.dayLabelBn} · {todayEntry.date}</span>
                <span>·</span>
                <span>এন্ট্রি করেছেন: {todayEntry.recordedByStaff}</span>
              </div>

              <div className="text-xs text-teal-100 uppercase tracking-wider font-semibold">
                {lang === 'bn' ? 'আজকের মোট বিক্রি (Today’s Total Sales)' : 'Today’s Gross Sales'}
              </div>

              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white tabular-nums">
                {formatBDT(todayEntry.totalSales)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span>ঔষধ বিক্রি: <strong className="text-white font-mono">{formatBDT(todayEntry.medicineSales)}</strong></span>
                <span>·</span>
                <span>ইকুইপমেন্ট বিক্রি: <strong className="text-white font-mono">{formatBDT(todayEntry.equipmentSales)}</strong></span>
                <span>·</span>
                <span>মোট মেমো: <strong className="text-white font-mono">{todayEntry.totalInvoices} টি</strong></span>
              </div>
            </div>

            {/* Right: Cash Drawer & Net in Hand Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 text-xs">
              
              {/* Cash in Hand */}
              <div className="space-y-1">
                <span className="text-teal-200 block text-[11px] flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>নগদ ক্যাশ আদায়</span>
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-white tabular-nums block">
                  {formatBDT(todayEntry.cashAmount)}
                </span>
                <span className="text-[10px] text-slate-300">ক্যাশ কাউন্টার ড্রয়ারে</span>
              </div>

              {/* Digital (bKash/Nagad) */}
              <div className="space-y-1">
                <span className="text-teal-200 block text-[11px] flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>বিকাশ / নগদ / কার্ড</span>
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-teal-300 tabular-nums block">
                  {formatBDT(todayEntry.digitalAmount)}
                </span>
                <span className="text-[10px] text-slate-300">ডিজিটাল অ্যাকাউন্টে</span>
              </div>

              {/* Daily Expense & Net */}
              <div className="col-span-2 sm:col-span-1 space-y-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <span className="text-amber-200 block text-[11px] flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>দৈনিক দোকান খরচ</span>
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-amber-300 tabular-nums block">
                  {formatBDT(todayEntry.dailyExpense)}
                </span>
                <span className="text-[10px] text-slate-300">চা-নাস্তা, পলিথিন ইত্যাদি</span>
              </div>

              {/* Net Cash in Box */}
              <div className="col-span-2 sm:col-span-3 pt-3 border-t border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    {lang === 'bn' ? 'ক্যাশবাক্সে দিনের শেষে নিট জমা (Net In Hand):' : 'Net Cash Closing Balance:'}
                  </span>
                  <span className="text-xs text-emerald-300 font-mono font-bold">
                    = মোট বিক্রি - দোকান খরচ ({formatBDT(todayEntry.totalSales)} - {formatBDT(todayEntry.dailyExpense)})
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {formatBDT(todayEntry.netCashInHand)}
                </div>
              </div>

            </div>

          </div>

          {/* Action Row */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-300 italic max-w-xl">
              {todayEntry.notes ? `মন্তব্য: "${todayEntry.notes}"` : 'কোনো বিশেষ নোট নেই।'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAddEntry(todayEntry)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'আজকের খাতা এডিট করুন' : 'Edit Today’s Entry'}</span>
              </button>
              <button
                onClick={() => onPrintDaySheet(todayEntry)}
                className="px-3 py-1.5 text-xs font-semibold text-teal-200 bg-teal-800/80 hover:bg-teal-700 rounded-md transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'দিনপত্রী প্রিন্ট' : 'Print Day Sheet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aggregate KPI Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'খাতায় মোট নথিভুক্ত বিক্রি' : 'Total Logged Sales'}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums font-mono">
            {formatBDT(totalSalesAll)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {dailyLedger.length} {lang === 'bn' ? 'দিনের হিসাব লিপিবদ্ধ' : 'days recorded'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'দৈনিক গড় বিক্রি (Average)' : 'Daily Average Sales'}
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1 tabular-nums font-mono">
            {formatBDT(averageDailySales)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'প্রতিদিনের নিয়মিত গড় আয়' : 'Daily run-rate'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট দোকান খরচ (Petty Expenses)' : 'Total Petty Expenses'}
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums font-mono">
            {formatBDT(totalExpenseAll)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'চা-নাস্তা, কারেন্ট বিল ও বিবিধ' : 'Refreshments & utility'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'নিট সংগৃহীত ক্যাশ টাকা' : 'Net Cash Collected'}
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums font-mono">
            {formatBDT(totalNetCashAll)}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
            {lang === 'bn' ? 'খরচ বাদ দিয়ে মোট সঞ্চিত' : 'Net cash closing'}
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'তারিখ, বার বা স্টাফের নাম দিয়ে খুঁজুন...' : 'Search by date, day, or staff...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as any)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
          >
            <option value="all">{lang === 'bn' ? 'সকল দিনের খাতা' : 'All Days Ledger'}</option>
            <option value="7days">{lang === 'bn' ? 'গত ৭ দিনের খাতা' : 'Last 7 Days'}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
          >
            <option value="date">{lang === 'bn' ? 'তারিখ অনুযায়ী' : 'Sort by Date'}</option>
            <option value="total">{lang === 'bn' ? 'মোট বিক্রি অনুযায়ী' : 'Sort by Gross Sales'}</option>
            <option value="net">{lang === 'bn' ? 'নিট জমা অনুযায়ী' : 'Sort by Net In Hand'}</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            title="Toggle Sort Order"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* The Daily Khata Register Table (Traditional Bengali Style) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">{lang === 'bn' ? 'তারিখ ও দিন' : 'Date & Day'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'সর্বমোট বিক্রি (৳)' : 'Gross Sales (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'ঔষধ বিক্রি (৳)' : 'Medicine (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'ইকুইপমেন্ট (৳)' : 'Equipment (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'নগদ ক্যাশ (৳)' : 'Cash (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'ডিজিটাল (৳)' : 'Digital (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'দোকান খরচ (৳)' : 'Expense (৳)'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'নিট জমা (৳)' : 'Net In Hand (৳)'}</th>
                <th className="py-3 px-3 text-center">{lang === 'bn' ? 'মেমো' : 'Invoices'}</th>
                <th className="py-3 px-3">{lang === 'bn' ? 'খাতা পরিচালক' : 'Cashier'}</th>
                <th className="py-3 px-3 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Date & Day */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 font-mono">{entry.date}</div>
                    <div className="text-xs text-slate-500 font-sans">{entry.dayLabelBn}</div>
                    {entry.notes && (
                      <div className="text-[11px] text-teal-700 italic truncate max-w-[170px]" title={entry.notes}>
                        {entry.notes}
                      </div>
                    )}
                  </td>

                  {/* Gross Total */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatBDT(entry.totalSales)}
                  </td>

                  {/* Medicine Sales */}
                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {formatBDT(entry.medicineSales)}
                  </td>

                  {/* Equipment Sales */}
                  <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {formatBDT(entry.equipmentSales)}
                  </td>

                  {/* Cash Amount */}
                  <td className="py-3 px-3 text-right font-mono text-slate-800 tabular-nums">
                    {formatBDT(entry.cashAmount)}
                  </td>

                  {/* Digital Amount */}
                  <td className="py-3 px-3 text-right font-mono text-teal-700 tabular-nums">
                    {formatBDT(entry.digitalAmount)}
                  </td>

                  {/* Daily Expense */}
                  <td className="py-3 px-3 text-right font-mono text-amber-700 tabular-nums">
                    {formatBDT(entry.dailyExpense)}
                  </td>

                  {/* Net Cash in Hand */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {formatBDT(entry.netCashInHand)}
                  </td>

                  {/* Total Invoices */}
                  <td className="py-3 px-3 text-center font-mono text-slate-700 font-medium">
                    {entry.totalInvoices}
                  </td>

                  {/* Recorded Staff */}
                  <td className="py-3 px-3 text-xs text-slate-700">
                    {entry.recordedByStaff.split('(')[0].trim()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onPrintDaySheet(entry)}
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded"
                        title={lang === 'bn' ? 'দিনপত্রী প্রিন্ট করুন' : 'Print Day Statement'}
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenAddEntry(entry)}
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title={lang === 'bn' ? 'এডিট করুন' : 'Edit entry'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title={lang === 'bn' ? 'মুছে ফেলুন' : 'Delete entry'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            {lang === 'bn' ? 'মোট নথিভুক্ত দিন:' : 'Total Recorded Days:'}{' '}
            <strong className="text-slate-900">{filteredEntries.length}</strong> {lang === 'bn' ? 'দিন' : 'days'}
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span>
              মোট বিক্রি: <strong className="text-slate-900 font-bold">{formatBDT(filteredEntries.reduce((s, x) => s + x.totalSales, 0))}</strong>
            </span>
            <span>·</span>
            <span>
              মোট খরচ: <strong className="text-amber-700 font-bold">{formatBDT(filteredEntries.reduce((s, x) => s + x.dailyExpense, 0))}</strong>
            </span>
            <span>·</span>
            <span>
              নিট ক্যাশ: <strong className="text-emerald-700 font-bold">{formatBDT(filteredEntries.reduce((s, x) => s + x.netCashInHand, 0))}</strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
