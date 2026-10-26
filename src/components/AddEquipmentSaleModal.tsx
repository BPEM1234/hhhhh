import React, { useState, useEffect } from 'react';
import { Stethoscope, X, ShieldCheck, User, Phone } from 'lucide-react';
import { Language, MedicalEquipment, EquipmentSaleRecord, StaffMember } from '../types/pharmacy';
import { formatBDT } from '../utils/pharmacyUtils';

interface AddEquipmentSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentList: MedicalEquipment[];
  staffList: StaffMember[];
  onSaveSale: (sale: EquipmentSaleRecord) => void;
  lang: Language;
  preselectedEquipmentId?: string;
}

export const AddEquipmentSaleModal: React.FC<AddEquipmentSaleModalProps> = ({
  isOpen,
  onClose,
  equipmentList,
  staffList,
  onSaveSale,
  lang,
  preselectedEquipmentId,
}) => {
  const [selectedEqId, setSelectedEqId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash/Nagad' | 'Card'>('Cash');
  const [soldByStaffId, setSoldByStaffId] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Synchronize selected equipment
  useEffect(() => {
    const targetId = preselectedEquipmentId || (equipmentList[0]?.id || '');
    setSelectedEqId(targetId);

    const eq = equipmentList.find((e) => e.id === targetId);
    if (eq) {
      setUnitPrice(eq.sellPrice);
      setWarrantyPeriod(
        eq.warrantyMonths > 0 
          ? `${eq.warrantyMonths} Months Official Warranty` 
          : 'Standard Checking Warranty'
      );
      setSerialNumber(`${eq.serialNumberPrefix || 'EQ-'}${Math.floor(10000 + Math.random() * 90000)}`);
    }

    if (staffList.length > 0) {
      setSoldByStaffId(staffList[0].id);
    }
  }, [preselectedEquipmentId, equipmentList, staffList, isOpen]);

  // When dropdown changes
  const handleEquipmentChange = (id: string) => {
    setSelectedEqId(id);
    const eq = equipmentList.find((e) => e.id === id);
    if (eq) {
      setUnitPrice(eq.sellPrice);
      setWarrantyPeriod(
        eq.warrantyMonths > 0 
          ? `${eq.warrantyMonths} Months Official Warranty` 
          : 'Standard Checking Warranty'
      );
      setSerialNumber(`${eq.serialNumberPrefix || 'EQ-'}${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  if (!isOpen) return null;

  const currentEq = equipmentList.find((e) => e.id === selectedEqId);
  const totalAmount = Math.max(0, (unitPrice * quantity) - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEq || !customerName.trim()) return;

    const staffMember = staffList.find((s) => s.id === soldByStaffId);

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const newSale: EquipmentSaleRecord = {
      id: `eq-sale-${Date.now()}`,
      invoiceNo: `EQ-INV-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      equipmentId: currentEq.id,
      equipmentName: currentEq.name,
      brand: currentEq.brand,
      model: currentEq.model,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      quantity,
      unitPrice,
      discount,
      totalAmount,
      warrantyPeriod: warrantyPeriod || '1 Year Warranty',
      serialNumber: serialNumber.trim() || 'N/A',
      paymentMethod,
      soldByStaffId,
      soldByStaffName: staffMember ? staffMember.name : 'Counter Staff',
      date: dateStr,
      notes: notes.trim(),
    };

    onSaveSale(newSale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 my-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'bn' ? 'মেডিকেল ইকুইপমেন্ট বিক্রয় এন্ট্রি' : 'Record Medical Equipment Sale'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Equipment Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'বিক্রিত ইকুইপমেন্ট নির্বাচন করুন *' : 'Select Equipment Sold *'}
            </label>
            <select
              value={selectedEqId}
              onChange={(e) => handleEquipmentChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.brand} · {eq.model}) - মজুদ: {eq.inStock} টি
                </option>
              ))}
            </select>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ক্রেতা / রোগীর নাম *' : 'Customer / Patient Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Al-Haj Rafiqul Islam"
                  className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ক্রেতার মোবাইল নম্বর *' : 'Customer Phone Number *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Quantity & Pricing */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'পরিমাণ (পিস)' : 'Quantity (Pcs)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={currentEq ? Math.max(1, currentEq.inStock) : 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'একক মূল্য (টাকা)' : 'Unit Price (BDT)'}
                </label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {lang === 'bn' ? 'ছাড় / ডিসকাউন্ট' : 'Discount (BDT)'}
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded"
                />
              </div>
            </div>

            {/* Live Total Display */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {lang === 'bn' ? 'সর্বমোট পরিশোধযোগ্য:' : 'Net Total Amount:'}
              </span>
              <span className="text-base font-bold text-teal-800 font-mono tabular-nums">
                {formatBDT(totalAmount)}
              </span>
            </div>
          </div>

          {/* Warranty & Serial Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ডিভাইস সিরিয়াল নম্বর (S/N)' : 'Device Serial Number (S/N)'}
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. OMR-BP-99214"
                className="w-full px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'ওয়ারেন্টি বিবরণ' : 'Warranty Details'}
              </label>
              <input
                type="text"
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                placeholder="e.g. 3 Years Brand Warranty"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              />
            </div>
          </div>

          {/* Payment & Staff Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              >
                <option value="Cash">Cash (নগদ)</option>
                <option value="bKash/Nagad">bKash / Nagad / MFS</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'বিক্রয়কারী স্টাফ' : 'Sold By Staff'}
              </label>
              <select
                value={soldByStaffId}
                onChange={(e) => setSoldByStaffId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.roleTitleBn.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'বিশেষ নোট / ডেমো সহায়তা' : 'Sale Notes / Demo Provided'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. BP cuff usage demo given, customer battery inserted"
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
              {lang === 'bn' ? 'বিক্রি সম্পন্ন ও স্টক আপডেট' : 'Complete Sale & Update Stock'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
