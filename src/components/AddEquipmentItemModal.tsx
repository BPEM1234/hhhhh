import React, { useState } from 'react';
import { Stethoscope, X } from 'lucide-react';
import { Language, MedicalEquipment } from '../types/pharmacy';

interface AddEquipmentItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eq: MedicalEquipment) => void;
  lang: Language;
}

export const AddEquipmentItemModal: React.FC<AddEquipmentItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<MedicalEquipment['category']>('Diagnostic');
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);
  const [sellPrice, setSellPrice] = useState<number>(1500);
  const [inStock, setInStock] = useState<number>(10);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(12);
  const [serialPrefix, setSerialPrefix] = useState('EQ-');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEquipment: MedicalEquipment = {
      id: `eq-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'General Medical',
      model: model.trim() || 'Standard Model',
      category,
      purchasePrice: Number(purchasePrice) || 0,
      sellPrice: Number(sellPrice) || 0,
      inStock: Number(inStock) || 0,
      warrantyMonths: Number(warrantyMonths) || 0,
      serialNumberPrefix: serialPrefix.trim() || 'EQ-',
      description: description.trim() || 'Medical equipment device for healthcare.',
      featured: false,
    };

    onSave(newEquipment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 my-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'bn' ? 'নতুন মেডিকেল ইকুইপমেন্ট যুক্ত করুন' : 'Add Medical Equipment to Catalog'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'ইকুইপমেন্টের নাম *' : 'Equipment Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Omron BP Machine, Accu-Chek Meter"
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ব্র্যান্ড' : 'Brand'}
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Omron, Beurer, Roche"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'মডেল নম্বর' : 'Model'}
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. HEM-7120, Instant"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              >
                <option value="Diagnostic">Diagnostic</option>
                <option value="Respiratory">Respiratory</option>
                <option value="Mobility">Mobility</option>
                <option value="Surgical & Wound">Surgical & Wound</option>
                <option value="Home Care">Home Care</option>
                <option value="Therapeutic">Therapeutic</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ওয়ারেন্টি (মাস)' : 'Warranty (Months)'}
              </label>
              <input
                type="number"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(parseInt(e.target.value) || 0)}
                placeholder="e.g. 12, 24, 36"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'ক্রয়মূল্য (টাকা)' : 'Buy Price'}
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'বিক্রয়মূল্য (টাকা)' : 'Sell Price'}
              </label>
              <input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-teal-800 bg-white border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'মজুদ পরিমাণ' : 'In Stock Qty'}
              </label>
              <input
                type="number"
                value={inStock}
                onChange={(e) => setInStock(parseInt(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'বিবরণ ও ব্যবহার' : 'Description & Specification'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Accurate blood pressure monitor with cuff size M-L..."
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
              {lang === 'bn' ? 'ইকুইপমেন্ট যোগ করুন' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
