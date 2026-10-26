import React, { useState, useEffect } from 'react';
import { Pill, X } from 'lucide-react';
import { Language, MedicineItem, MedicineCategory } from '../types/pharmacy';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: MedicineItem) => void;
  lang: Language;
  editItem?: MedicineItem | null;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
  editItem,
}) => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<MedicineCategory>('Tablet');
  const [dosage, setDosage] = useState('500mg');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(100);
  const [unit, setUnit] = useState('Pcs');
  const [minStockThreshold, setMinStockThreshold] = useState<number>(20);
  const [shelfLocation, setShelfLocation] = useState('Rack A-1');

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setGenericName(editItem.genericName);
      setCompany(editItem.company);
      setCategory(editItem.category);
      setDosage(editItem.dosage);
      setBatchNumber(editItem.batchNumber);
      setExpiryDate(editItem.expiryDate);
      setPurchasePrice(editItem.purchasePrice);
      setSellPrice(editItem.sellPrice);
      setStockQuantity(editItem.stockQuantity);
      setUnit(editItem.unit);
      setMinStockThreshold(editItem.minStockThreshold);
      setShelfLocation(editItem.shelfLocation);
    } else {
      setName('');
      setGenericName('');
      setCompany('Square Pharmaceuticals Ltd.');
      setCategory('Tablet');
      setDosage('500mg');
      setBatchNumber(`BX-${Math.floor(1000 + Math.random() * 9000)}`);
      setExpiryDate('2028-06-30');
      setPurchasePrice(2.50);
      setSellPrice(3.50);
      setStockQuantity(200);
      setUnit('Tablet');
      setMinStockThreshold(30);
      setShelfLocation('Rack A-1');
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const medData: MedicineItem = {
      id: editItem ? editItem.id : `med-${Date.now()}`,
      name: name.trim(),
      genericName: genericName.trim() || name.trim(),
      company: company.trim() || 'General Pharma',
      category,
      dosage,
      batchNumber: batchNumber.trim() || 'GEN-BATCH',
      expiryDate: expiryDate || '2028-12-31',
      purchasePrice: Number(purchasePrice) || 0,
      sellPrice: Number(sellPrice) || 0,
      stockQuantity: Number(stockQuantity) || 0,
      unit,
      minStockThreshold: Number(minStockThreshold) || 10,
      shelfLocation: shelfLocation.trim() || 'Rack A-1',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onSave(medData);
    onClose();
  };

  const categories: MedicineCategory[] = [
    'Tablet', 'Capsule', 'Syrup', 'Drop', 'Injection', 'Ointment', 'Saline', 'Inhaler', 'Suppository', 'Powder'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 my-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editItem 
                ? (lang === 'bn' ? 'ঔষধ ও স্টক আপডেট করুন' : 'Edit Medicine & Stock')
                : (lang === 'bn' ? 'নতুন ঔষধ ইনভেন্টরিতে যুক্ত করুন' : 'Add New Medicine to Stock')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ঔষধের ব্র‍্যান্ড নাম *' : 'Brand Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Napa Extra, Seclo, Maxpro"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-teal-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'জেনেরিক নাম ( Generic Formula )' : 'Generic Formula'}
              </label>
              <input
                type="text"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                placeholder="e.g. Paracetamol + Caffeine"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ধরন (Category)' : 'Dosage Form'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MedicineCategory)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ডোজ / শক্তি' : 'Dosage Strength'}
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500mg, 20mg, 100ml"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'কোম্পানি' : 'Pharmaceutical Co.'}
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Square, Beximco, Incepta"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>

          {/* Pricing & Stock Accounting */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">
              {lang === 'bn' ? 'মূল্য ও স্টক পরিমাণ হিসাব:' : 'Pricing & Stock Quantities:'}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'ক্রয়মূল্য (টাকা) *' : 'Buy Price (BDT) *'}
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'বিক্রয়মূল্য (টাকা) *' : 'Sell Price (MRP) *'}
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={sellPrice}
                  onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'বর্তমান স্টক সংখ্যা' : 'Stock Quantity'}
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'ঘাটতি সতর্কতা লেভেল' : 'Min Alert Qty'}
                </label>
                <input
                  type="number"
                  value={minStockThreshold}
                  onChange={(e) => setMinStockThreshold(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'মেয়াদোত্তীর্ণ তারিখ' : 'Expiry Date'}
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ব্যাচ নম্বর' : 'Batch Number'}
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BX-2024-99"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'র‍্যাক / শেল্ফ লোকেশন' : 'Shelf / Rack'}
              </label>
              <input
                type="text"
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="e.g. Rack A-2, Liquid 1"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              />
            </div>
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
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Medicine'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
