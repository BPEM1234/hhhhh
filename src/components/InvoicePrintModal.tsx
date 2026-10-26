import React from 'react';
import { Printer, X, ShieldCheck } from 'lucide-react';
import { EquipmentSaleRecord, PharmacySettings, Language } from '../types/pharmacy';
import { formatBDT } from '../utils/pharmacyUtils';

interface InvoicePrintModalProps {
  sale: EquipmentSaleRecord | null;
  settings: PharmacySettings;
  lang: Language;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  sale,
  settings,
  lang,
  onClose,
}) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 my-6 shadow-2xl space-y-4">
        
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 no-print">
          <div className="text-sm font-bold text-slate-800">
            {lang === 'bn' ? 'অফিসিয়াল ক্যাশ মেমো ও ওয়ারেন্টি কার্ড' : 'Official Cash Memo & Warranty Card'}
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

        {/* The Printable Invoice Card */}
        <div className="p-6 border border-slate-300 rounded-lg bg-white font-mono text-xs space-y-4 shadow-xs">
          
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              {settings.storeNameBn}
            </h2>
            <div className="text-[11px] text-slate-600">{settings.addressBn}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              ফোন: {settings.phone} · জরুরি: {settings.emergencyPhone}
            </div>
            <div className="text-[10px] text-teal-800 font-semibold mt-0.5">
              {settings.regNumber}
            </div>
          </div>

          {/* Invoice & Customer Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-200 pb-2">
            <div>
              <span className="text-slate-500">ভাউচার নম্বর:</span>{' '}
              <strong className="text-slate-900">{sale.invoiceNo}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">তারিখ:</span>{' '}
              <span>{sale.date}</span>
            </div>
            <div>
              <span className="text-slate-500">ক্রেতার নাম:</span>{' '}
              <strong className="text-slate-900 font-sans">{sale.customerName}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">মোবাইল:</span>{' '}
              <span>{sale.customerPhone}</span>
            </div>
          </div>

          {/* Item Table */}
          <table className="w-full text-left text-[11px] border-b border-slate-200">
            <thead>
              <tr className="border-b border-slate-300 font-bold">
                <th className="py-1">বিবরণ / আইটেম</th>
                <th className="py-1 text-center">পরিমাণ</th>
                <th className="py-1 text-right">দর</th>
                <th className="py-1 text-right">মোট (টাকা)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 font-sans">
                  <div className="font-bold text-slate-900">{sale.equipmentName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {sale.brand} · {sale.model}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    S/N: {sale.serialNumber}
                  </div>
                </td>
                <td className="py-2 text-center align-top font-bold">{sale.quantity}</td>
                <td className="py-2 text-right align-top">{formatBDT(sale.unitPrice)}</td>
                <td className="py-2 text-right align-top font-bold">{formatBDT(sale.quantity * sale.unitPrice)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="space-y-1 text-right text-[11px]">
            <div>উপমোট (Subtotal): {formatBDT(sale.quantity * sale.unitPrice)}</div>
            {sale.discount > 0 && <div>ছাড় (Discount): -{formatBDT(sale.discount)}</div>}
            <div className="text-sm font-bold text-slate-900 pt-1 border-t border-slate-300">
              পরিশোধিত মোট: {formatBDT(sale.totalAmount)}
            </div>
            <div className="text-[10px] text-slate-500">পেমেন্ট মাধ্যম: {sale.paymentMethod}</div>
          </div>

          {/* Warranty Box */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] space-y-1">
            <div className="font-bold text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি সার্টিফিকেট:</span>
            </div>
            <div className="text-slate-700">{sale.warrantyPeriod}</div>
            <div className="text-[10px] text-slate-500">
              * ওয়ারেন্টি দাবির জন্য এই রসিদ ও আসল বক্স সংরক্ষণ করুন।
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-[10px] text-slate-600 border-t border-slate-200">
            <div className="text-center">
              <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
              <span>ক্রেতার স্বাক্ষর</span>
            </div>
            <div className="text-center">
              <div className="w-24 border-t border-slate-400 mx-auto mb-1"></div>
              <span>বিক্রেতা / ফার্মাসিস্ট: {sale.soldByStaffName}</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            {settings.storeNameBn} থেকে সেবা গ্রহণের জন্য ধন্যবাদ!
          </div>

        </div>

      </div>
    </div>
  );
};
