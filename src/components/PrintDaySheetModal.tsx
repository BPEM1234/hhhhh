import React from 'react';
import { Printer, X, BookOpen, Calendar, Wallet, Smartphone, Coffee } from 'lucide-react';
import { DailySalesEntry, PharmacySettings, Language } from '../types/pharmacy';
import { formatBDT } from '../utils/pharmacyUtils';

interface PrintDaySheetModalProps {
  entry: DailySalesEntry | null;
  settings: PharmacySettings;
  lang: Language;
  onClose: () => void;
}

export const PrintDaySheetModal: React.FC<PrintDaySheetModalProps> = ({
  entry,
  settings,
  lang,
  onClose,
}) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 my-6 shadow-2xl space-y-4">
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <div className="text-sm font-bold text-slate-800">
            {lang === 'bn' ? 'দৈনিক বিক্রয় খাতা বিবরণী (দিনপত্রী)' : 'Daily Sales Sheet Statement'}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Daily Statement */}
        <div className="p-6 border border-slate-300 rounded-lg bg-white font-mono text-xs space-y-4 shadow-xs">
          
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              {settings.storeNameBn}
            </h2>
            <div className="text-[11px] text-slate-600 font-sans">{settings.addressBn}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              ফোন: {settings.phone} · {settings.regNumber}
            </div>
            <div className="text-xs font-bold text-teal-800 font-sans mt-2 uppercase tracking-wide border-t border-b border-dashed border-slate-300 py-1">
              দৈনিক বিক্রয় ও ক্যাশ খাতা দিনপত্রী
            </div>
          </div>

          {/* Date & Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2">
            <div>
              <span className="text-slate-500">তারিখ:</span>{' '}
              <strong className="text-slate-900">{entry.date}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">দিন / বার:</span>{' '}
              <strong className="text-slate-900 font-sans">{entry.dayLabelBn}</strong>
            </div>
            <div>
              <span className="text-slate-500">মোট মেমো সংখ্যা:</span>{' '}
              <strong className="text-slate-900">{entry.totalInvoices} টি</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">খাতা এন্ট্রি করেছেন:</span>{' '}
              <span className="font-sans text-slate-800">{entry.recordedByStaff}</span>
            </div>
          </div>

          {/* Sales Breakdown Table */}
          <div className="space-y-1.5 border-b border-slate-200 pb-3">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              ১. বিক্রয় হিসাব (Sales Ledger):
            </div>
            <div className="flex justify-between text-xs py-0.5">
              <span>ঔষধ বিক্রয় (Medicine Sales):</span>
              <span className="font-bold">{formatBDT(entry.medicineSales)}</span>
            </div>
            <div className="flex justify-between text-xs py-0.5">
              <span>মেডিকেল ইকুইপমেন্ট বিক্রয়:</span>
              <span className="font-bold">{formatBDT(entry.equipmentSales)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>সর্বমোট বিক্রয় (Gross Sales):</span>
              <span className="text-teal-900">{formatBDT(entry.totalSales)}</span>
            </div>
          </div>

          {/* Collection Breakdown Table */}
          <div className="space-y-1.5 border-b border-slate-200 pb-3">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              ২. টাকা আদায় ও জমা (Payment Collection):
            </div>
            <div className="flex justify-between text-xs py-0.5">
              <span>নগদ ক্যাশ আদায় (Cash in Box):</span>
              <span className="font-bold">{formatBDT(entry.cashAmount)}</span>
            </div>
            <div className="flex justify-between text-xs py-0.5">
              <span>ডিজিটাল / বিকাশ / কার্ড আদায়:</span>
              <span className="font-bold text-teal-700">{formatBDT(entry.digitalAmount)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-800 pt-1 border-t border-slate-200">
              <span>মোট সংগৃহীত অর্থ:</span>
              <span>{formatBDT(entry.cashAmount + entry.digitalAmount)}</span>
            </div>
          </div>

          {/* Expenses & Net Cash Balance */}
          <div className="space-y-1.5 border-b border-slate-300 pb-3">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
              ৩. দোকান খরচ ও ক্যাশ ব্যালেন্স:
            </div>
            <div className="flex justify-between text-xs py-0.5 text-amber-900">
              <span>দৈনিক দোকান খরচ (Petty Expenses):</span>
              <span>-{formatBDT(entry.dailyExpense)}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-300 rounded flex justify-between items-center text-sm font-bold text-slate-900">
              <span className="font-sans">ক্যাশবাক্সে নিট ক্যাশ জমা (Net In Hand):</span>
              <span className="text-emerald-800 font-mono text-base">{formatBDT(entry.netCashInHand)}</span>
            </div>
          </div>

          {/* Remarks */}
          {entry.notes && (
            <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200">
              মন্তব্য: "{entry.notes}"
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-[10px] text-slate-600 border-t border-slate-200">
            <div className="text-center">
              <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
              <span>ক্যাশিয়ার / হিসাবরক্ষক</span>
            </div>
            <div className="text-center">
              <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
              <span>স্বত্বাধিকারী / ফার্মাসিস্ট</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
