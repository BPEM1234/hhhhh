import React, { useState, useMemo } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Edit2, 
  Trash2, 
  ArrowUpDown,
  CheckCircle,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import { Language, MedicineItem, MedicineCategory } from '../types/pharmacy';
import { formatBDT, formatBnDigits, computeMedicineStats } from '../utils/pharmacyUtils';

interface MedicineLedgerViewProps {
  lang: Language;
  medicines: MedicineItem[];
  onAddMedicine: () => void;
  onEditMedicine: (med: MedicineItem) => void;
  onDeleteMedicine: (id: string) => void;
  onQuickRestock: (id: string, delta: number) => void;
}

export const MedicineLedgerView: React.FC<MedicineLedgerViewProps> = ({
  lang,
  medicines,
  onAddMedicine,
  onEditMedicine,
  onDeleteMedicine,
  onQuickRestock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'expiring_soon' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'value' | 'expiry'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const stats = useMemo(() => computeMedicineStats(medicines), [medicines]);

  const categories: MedicineCategory[] = [
    'Tablet', 'Capsule', 'Syrup', 'Drop', 'Injection', 'Ointment', 'Saline', 'Inhaler', 'Suppository', 'Powder'
  ];

  // Filter & Sort Logic
  const filteredMedicines = useMemo(() => {
    return medicines
      .filter((m) => {
        const matchesSearch = 
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;

        let matchesStatus = true;
        if (statusFilter === 'low_stock') {
          matchesStatus = m.stockQuantity <= m.minStockThreshold && m.stockQuantity > 0;
        } else if (statusFilter === 'out_of_stock') {
          matchesStatus = m.stockQuantity === 0;
        } else if (statusFilter === 'expiring_soon') {
          const exp = new Date(m.expiryDate);
          const limit = new Date();
          limit.setDate(limit.getDate() + 90);
          matchesStatus = exp <= limit;
        }

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name);
        else if (sortBy === 'stock') comp = a.stockQuantity - b.stockQuantity;
        else if (sortBy === 'value') comp = (a.stockQuantity * a.sellPrice) - (b.stockQuantity * b.sellPrice);
        else if (sortBy === 'expiry') comp = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [medicines, searchTerm, selectedCategory, statusFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-6">
      
      {/* Header & Main Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'ঔষধের মোট হিসাব ও স্টক খতিয়ান' : 'Medicine Inventory & Valuation Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'bn' 
              ? 'মজুদ ঔষধের ক্রয়-বিক্রয় মূল্য, মোট ইনভেন্টরি সম্পদ, মুনাফা হিসাব ও শেল্ফ লোকেশন' 
              : 'Detailed stock accounting, total buying/selling value, batch numbers, and shelf locations.'}
          </p>
        </div>

        <button
          onClick={onAddMedicine}
          className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'bn' ? '+ নতুন ঔষধ যুক্ত করুন' : '+ Add New Medicine'}</span>
        </button>
      </div>

      {/* Financial Accounting Grid (Total Hiseb Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট ঔষধ আইটেম' : 'Total Items'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.totalItemTypes)} টি` : `${stats.totalItemTypes} SKUs`}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {stats.totalStockUnits.toLocaleString()} {lang === 'bn' ? 'ইউনিট মজুদ' : 'total units'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট ক্রয়মূল্য (খরচ)' : 'Total Cost Value'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatBDT(stats.totalPurchaseCost)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'ক্রয়কৃত ইনভেস্টমেন্ট' : 'Total wholesale cost'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট বিক্রয়মূল্য (সম্পদ)' : 'Total Retail Value'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-teal-800 mt-1 tabular-nums">
            {formatBDT(stats.totalRetailValue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'সর্বমোট সম্ভাব্য বিক্রয়' : 'Expected revenue'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'আনুমানিক মুনাফা' : 'Estimated Profit'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {formatBDT(stats.totalPotentialProfit)}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
            {stats.totalPurchaseCost > 0 
              ? `${((stats.totalPotentialProfit / stats.totalPurchaseCost) * 100).toFixed(1)}% মার্জিন`
              : '0%'}
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'স্টক অ্যালার্ট' : 'Stock Alerts'}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 tabular-nums">
            {stats.lowStockCount + stats.expiringSoonCount}
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            {stats.lowStockCount} {lang === 'bn' ? 'ঘাটতি' : 'low'} · {stats.expiringSoonCount} {lang === 'bn' ? 'মেয়াদোত্তীর্ণের পথে' : 'expiring'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'ঔষধের নাম, জেনেরিক বা কোম্পানি দিয়ে খুঁজুন (e.g. Napa, Seclo, Square)...' : 'Search by medicine, generic, brand, or batch...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
            >
              <option value="All">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
            >
              <option value="all">{lang === 'bn' ? 'সকল স্টক অবস্থা' : 'All Stock Status'}</option>
              <option value="low_stock">{lang === 'bn' ? 'কম স্টক (Low Stock)' : 'Low Stock'}</option>
              <option value="expiring_soon">{lang === 'bn' ? 'মেয়াদোত্তীর্ণের পথে (Expiring)' : 'Expiring Soon'}</option>
              <option value="out_of_stock">{lang === 'bn' ? 'স্টক শেষ (Out of Stock)' : 'Out of Stock'}</option>
            </select>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
            >
              <option value="name">{lang === 'bn' ? 'নাম অনুযায়ী' : 'Sort by Name'}</option>
              <option value="stock">{lang === 'bn' ? 'স্টক অনুযায়ী' : 'Sort by Stock'}</option>
              <option value="value">{lang === 'bn' ? 'মোট মূল্য অনুযায়ী' : 'Sort by Value'}</option>
              <option value="expiry">{lang === 'bn' ? 'মেয়াদ অনুযায়ী' : 'Sort by Expiry'}</option>
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
      </div>

      {/* Medicines Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">{lang === 'bn' ? 'ঔষধের নাম ও বিবরণ' : 'Medicine & Generic'}</th>
                <th className="py-3 px-3">{lang === 'bn' ? 'ধরন' : 'Category'}</th>
                <th className="py-3 px-3">{lang === 'bn' ? 'কোম্পানি' : 'Company'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'ক্রয়মূল্য' : 'Cost'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'বিক্রয়মূল্য' : 'MRP'}</th>
                <th className="py-3 px-3 text-center">{lang === 'bn' ? 'মজুদ স্টক' : 'In Stock'}</th>
                <th className="py-3 px-3 text-right">{lang === 'bn' ? 'মোট সম্পদ' : 'Stock Value'}</th>
                <th className="py-3 px-3">{lang === 'bn' ? 'মেয়াদ ও ব্যাচ' : 'Expiry / Batch'}</th>
                <th className="py-3 px-3 text-center">{lang === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Pill className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-700">
                        {lang === 'bn' ? 'কোনো ঔষধ পাওয়া যায়নি' : 'No medicines found'}
                      </div>
                      <p className="text-xs text-slate-500">
                        {lang === 'bn' ? 'সার্চ ফিল্টার রিসেট করুন অথবা নতুন ঔষধ যোগ করুন।' : 'Try modifying your search or add a new medicine item.'}
                      </p>
                      <button
                        onClick={onAddMedicine}
                        className="mt-2 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100"
                      >
                        {lang === 'bn' ? '+ নতুন ঔষধ যোগ করুন' : '+ Add New Medicine'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLow = med.stockQuantity <= med.minStockThreshold && med.stockQuantity > 0;
                  const isOut = med.stockQuantity === 0;
                  const expDate = new Date(med.expiryDate);
                  const isExpiringSoon = expDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                  const totalRowValue = med.stockQuantity * med.sellPrice;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Generic */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{med.name}</span>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {med.dosage}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[220px]">
                          {med.genericName}
                        </div>
                        <div className="text-[11px] text-teal-700 font-mono mt-0.5">
                          {med.shelfLocation || 'Main Shelf'}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-xs text-slate-700 font-medium">
                          {med.category}
                        </span>
                      </td>

                      {/* Company */}
                      <td className="py-3 px-3">
                        <span className="text-xs text-slate-600 truncate max-w-[140px] block" title={med.company}>
                          {med.company.replace('Pharmaceuticals Ltd.', '').replace('Laboratories Ltd.', '').trim()}
                        </span>
                      </td>

                      {/* Purchase Price */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 tabular-nums">
                        {formatBDT(med.purchasePrice)}
                      </td>

                      {/* Sell Price */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatBDT(med.sellPrice)}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 font-mono">
                          <span className={`font-bold tabular-nums text-sm ${
                            isOut ? 'text-rose-700' : isLow ? 'text-amber-700' : 'text-slate-900'
                          }`}>
                            {med.stockQuantity.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {med.unit}
                          </span>
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                            {lang === 'bn' ? 'ঘাটতি সতর্কতা' : 'Low stock'}
                          </div>
                        )}
                        {isOut && (
                          <div className="text-[10px] text-rose-700 font-bold mt-0.5">
                            {lang === 'bn' ? 'স্টক নেই' : 'Out of stock'}
                          </div>
                        )}
                      </td>

                      {/* Total Valuation */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {formatBDT(totalRowValue)}
                      </td>

                      {/* Expiry & Batch */}
                      <td className="py-3 px-3">
                        <div className={`font-mono text-xs ${isExpiringSoon ? 'text-amber-800 font-bold' : 'text-slate-700'}`}>
                          {med.expiryDate}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {med.batchNumber}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onQuickRestock(med.id, 50)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded"
                            title={lang === 'bn' ? 'দ্রুত ৫০ পিস স্টক যোগ করুন' : 'Quick add 50 units'}
                          >
                            <PackagePlus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditMedicine(med)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                            title={lang === 'bn' ? 'এডিট করুন' : 'Edit item'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteMedicine(med.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title={lang === 'bn' ? 'ডিলিট করুন' : 'Delete item'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            {lang === 'bn' ? 'মোট প্রদর্শিত ঔষধ:' : 'Showing medicines:'}{' '}
            <strong className="text-slate-900">{filteredMedicines.length}</strong> {lang === 'bn' ? 'টির মধ্যে' : 'of'}{' '}
            <strong className="text-slate-900">{medicines.length}</strong>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>
              {lang === 'bn' ? 'মোট ইনভেন্টরি স্টক মূল্য:' : 'Inventory Valuation:'}{' '}
              <strong className="text-slate-900 font-bold">{formatBDT(stats.totalRetailValue)}</strong>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
