import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Receipt, 
  ShieldCheck, 
  Phone, 
  User, 
  Calendar, 
  CheckCircle2, 
  Printer, 
  TrendingUp, 
  Package, 
  DollarSign, 
  FileText,
  BadgeAlert
} from 'lucide-react';
import { 
  Language, 
  MedicalEquipment, 
  EquipmentSaleRecord 
} from '../types/pharmacy';
import { 
  formatBDT, 
  formatBnDigits, 
  computeEquipmentStats 
} from '../utils/pharmacyUtils';

interface EquipmentSalesViewProps {
  lang: Language;
  equipment: MedicalEquipment[];
  equipmentSales: EquipmentSaleRecord[];
  onOpenAddEquipmentSale: (preselectedEquipmentId?: string) => void;
  onOpenAddEquipmentItem: () => void;
  onPrintEquipmentReceipt: (sale: EquipmentSaleRecord) => void;
}

export const EquipmentSalesView: React.FC<EquipmentSalesViewProps> = ({
  lang,
  equipment,
  equipmentSales,
  onOpenAddEquipmentSale,
  onOpenAddEquipmentItem,
  onPrintEquipmentReceipt,
}) => {
  const [subTab, setSubTab] = useState<'sales_list' | 'catalog'>('sales_list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const stats = useMemo(() => computeEquipmentStats(equipment, equipmentSales), [equipment, equipmentSales]);

  // Unique brands
  const brands = useMemo(() => {
    const set = new Set(equipment.map((e) => e.brand));
    return Array.from(set);
  }, [equipment]);

  // Filtered Sales List
  const filteredSales = useMemo(() => {
    return equipmentSales.filter((sale) => {
      const matchSearch = 
        sale.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customerPhone.includes(searchTerm) ||
        sale.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchBrand = selectedBrand === 'All' || sale.brand === selectedBrand;
      return matchSearch && matchBrand;
    });
  }, [equipmentSales, searchTerm, selectedBrand]);

  // Filtered Equipment Catalog
  const filteredCatalog = useMemo(() => {
    return equipment.filter((eq) => {
      const matchSearch = 
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || eq.category === selectedCategory;
      const matchBrand = selectedBrand === 'All' || eq.brand === selectedBrand;
      return matchSearch && matchCategory && matchBrand;
    });
  }, [equipment, searchTerm, selectedCategory, selectedBrand]);

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'মেডিকেল ইকুইপমেন্ট ও বিক্রির সম্পূর্ণ তালিকা' : 'Medical Equipment & Sales Ledger'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {lang === 'bn' 
              ? 'প্রেসার মেশিন, ডায়াবেটিস গ্লুকোমিটার, নেবুলাইজার, অক্সিজেন অক্সিমিটার ও হুইলচেয়ার বিক্রির বিস্তারিত হিসাব' 
              : 'Complete registry of all diagnostic, respiratory, and surgical equipment sold with customer and warranty details.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onOpenAddEquipmentItem}
            className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            {lang === 'bn' ? '+ নতুন ইকুইপমেন্ট যুক্ত করুন' : '+ Add Equipment Item'}
          </button>

          <button
            onClick={() => onOpenAddEquipmentSale()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'bn' ? '+ ইকুইপমেন্ট বিক্রি এন্ট্রি' : '+ Record Equipment Sale'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট ইকুইপমেন্ট বিক্রি হয়েছে' : 'Total Equipment Sold'}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.totalUnitsSold)} টি` : `${stats.totalUnitsSold} Units`}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {stats.totalSalesCount} {lang === 'bn' ? 'টি সফল বিক্রয় রসিদ' : 'customer sales receipts'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মোট বিক্রয় রাজস্ব (Revenue)' : 'Total Sales Revenue'}
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {formatBDT(stats.totalSalesRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'ক্যাশ ও ডিজিটাল পেমেন্ট' : 'Cash & digital collection'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'দোকানে বর্তমান মজুদ ইকুইপমেন্ট' : 'Equipment In Stock'}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {lang === 'bn' ? `${formatBnDigits(stats.totalUnitsInStock)} টি` : `${stats.totalUnitsInStock} Units`}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {stats.totalModels} {lang === 'bn' ? 'ধরনের মডেল বিদ্যমান' : 'available models'}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">
            {lang === 'bn' ? 'মজুদ ইকুইপমেন্টের মূল্য' : 'Stock Valuation'}
          </div>
          <div className="text-2xl font-bold text-teal-800 mt-1 tabular-nums">
            {formatBDT(stats.totalStockValuation)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'bn' ? 'বর্তমান বিক্রয়মূল্য ভিত্তিতে' : 'At retail market price'}
          </div>
        </div>

      </div>

      {/* Segmented Sub-Tab Switcher (Sales History vs Inventory Catalog) */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg w-fit">
        <button
          onClick={() => setSubTab('sales_list')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            subTab === 'sales_list'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'bn' ? 'বিক্রির তালিকা (Sales Records)' : 'Equipment Sales Ledger'}</span>
          <span className="text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 tabular-nums">
            {equipmentSales.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('catalog')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
            subTab === 'catalog'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{lang === 'bn' ? 'ইকুইপমেন্ট ক্যাটালগ ও স্টক' : 'Equipment Catalog & Stock'}</span>
          <span className="text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 tabular-nums">
            {equipment.length}
          </span>
        </button>
      </div>

      {/* Sub-Tab 1: Equipment Sales History List (Crucial prompt requirement) */}
      {subTab === 'sales_list' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'ইকুইপমেন্টের নাম, ভাউচার নম্বর, ক্রেতার নাম বা মোবাইল দিয়ে খুঁজুন...' : 'Search by equipment, invoice, buyer name or phone...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
              >
                <option value="All">{lang === 'bn' ? 'সকল ব্র্যান্ড' : 'All Brands'}</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Sold Equipment */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ভাউচার / তারিখ' : 'Invoice & Date'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'বিক্রিত ইকুইপমেন্টের নাম' : 'Equipment Name & Model'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ক্রেতা ও ফোন নম্বর' : 'Customer & Contact'}</th>
                    <th className="py-3 px-3 text-center">{lang === 'bn' ? 'পরিমাণ' : 'Qty'}</th>
                    <th className="py-3 px-3 text-right">{lang === 'bn' ? 'মোট বিক্রয়মূল্য' : 'Total Amount'}</th>
                    <th className="py-3 px-4">{lang === 'bn' ? 'ওয়ারেন্টি ও সিরিয়াল' : 'Warranty / S/N'}</th>
                    <th className="py-3 px-3">{lang === 'bn' ? 'বিক্রেতা কর্মী' : 'Sold By'}</th>
                    <th className="py-3 px-3 text-center">{lang === 'bn' ? 'রসিদ' : 'Receipt'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto space-y-2">
                          <Stethoscope className="w-8 h-8 text-slate-300 mx-auto" />
                          <div className="font-semibold text-slate-700">
                            {lang === 'bn' ? 'কোনো বিক্রির রেকর্ড পাওয়া যায়নি' : 'No sales records found'}
                          </div>
                          <p className="text-xs text-slate-500">
                            {lang === 'bn' ? 'নতুন ইকুইপমেন্ট বিক্রি এন্ট্রি করতে উপরের বাটনে চাপুন।' : 'Record a new equipment sale using the button above.'}
                          </p>
                          <button
                            onClick={() => onOpenAddEquipmentSale()}
                            className="mt-2 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100"
                          >
                            {lang === 'bn' ? '+ ইকুইপমেন্ট বিক্রি এন্ট্রি' : '+ Record Equipment Sale'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Invoice & Date */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-slate-900">{sale.invoiceNo}</div>
                          <div className="text-xs text-slate-500">{sale.date}</div>
                        </td>

                        {/* Equipment Name */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{sale.equipmentName}</div>
                          <div className="text-xs text-slate-500">
                            {sale.brand} · {sale.model}
                          </div>
                          {sale.notes && (
                            <div className="text-[11px] text-teal-700 mt-0.5 italic">
                              "{sale.notes}"
                            </div>
                          )}
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{sale.customerName}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{sale.customerPhone}</span>
                          </div>
                        </td>

                        {/* Qty */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {sale.quantity}
                        </td>

                        {/* Total Amount */}
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          <div className="font-bold text-slate-900 text-sm">
                            {formatBDT(sale.totalAmount)}
                          </div>
                          {sale.discount > 0 && (
                            <div className="text-[11px] text-slate-500">
                              (ডিসকাউন্ট: {formatBDT(sale.discount)})
                            </div>
                          )}
                          <div className="text-[10px] text-slate-500 font-sans">
                            {sale.paymentMethod}
                          </div>
                        </td>

                        {/* Warranty & Serial */}
                        <td className="py-3 px-4">
                          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{sale.warrantyPeriod}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            S/N: {sale.serialNumber || 'N/A'}
                          </div>
                        </td>

                        {/* Sold By Staff */}
                        <td className="py-3 px-3">
                          <div className="text-xs text-slate-700 font-medium">
                            {sale.soldByStaffName}
                          </div>
                        </td>

                        {/* Receipt Button */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => onPrintEquipmentReceipt(sale)}
                            className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded"
                            title={lang === 'bn' ? 'ওয়ারেন্টি রসিদ দেখুন / প্রিন্ট' : 'View / Print receipt'}
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                {lang === 'bn' ? 'মোট বিক্রির হিসাব:' : 'Total Sold Entries:'}{' '}
                <strong className="text-slate-900">{filteredSales.length}</strong> {lang === 'bn' ? 'টি ভাউচার' : 'receipts'}
              </div>
              <div className="font-mono text-slate-900 font-bold">
                {lang === 'bn' ? 'মোট অর্জিত বিক্রয়:' : 'Total Volume:'} {formatBDT(filteredSales.reduce((s, x) => s + x.totalAmount, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Equipment Inventory & Catalog */}
      {subTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Category & Search Filter */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'মডেল, ব্র্যান্ড বা ইকুইপমেন্টের ধরন দিয়ে খুঁজুন...' : 'Search by model, brand, or equipment category...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 text-slate-700"
              >
                <option value="All">{lang === 'bn' ? 'সকল মেডিকেল ক্যাটাগরি' : 'All Categories'}</option>
                <option value="Diagnostic">Diagnostic (BP, Sugar, Thermo)</option>
                <option value="Respiratory">Respiratory (Nebulizer, Suction)</option>
                <option value="Mobility">Mobility (Wheelchair, Cane)</option>
                <option value="Surgical & Wound">Surgical & Wound Care</option>
                <option value="Home Care">Home Care & Ortho</option>
              </select>
            </div>
          </div>

          {/* Grid of Medical Equipments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.inStock} {lang === 'bn' ? 'টি মজুদ' : 'in stock'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    {item.name}
                  </h3>

                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    {item.brand} · {item.model}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        {item.warrantyMonths > 0 
                          ? `${item.warrantyMonths} ${lang === 'bn' ? 'মাসের ওয়ারেন্টি' : 'months warranty'}` 
                          : (lang === 'bn' ? 'ওয়ারেন্টি নেই' : 'No warranty')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">{lang === 'bn' ? 'বিক্রয়মূল্য' : 'Retail Price'}</span>
                      <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                        {formatBDT(item.sellPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500">
                    {lang === 'bn' ? 'ক্রয়:' : 'Cost:'} <span className="font-mono">{formatBDT(item.purchasePrice)}</span>
                  </div>
                  <button
                    onClick={() => onOpenAddEquipmentSale(item.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors"
                  >
                    {lang === 'bn' ? 'বিক্রি করুন' : 'Sell This Item'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
