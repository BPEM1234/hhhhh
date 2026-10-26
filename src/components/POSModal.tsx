import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Printer, 
  Pill, 
  Stethoscope, 
  CheckCircle,
  Receipt
} from 'lucide-react';
import { 
  Language, 
  MedicineItem, 
  MedicalEquipment, 
  CartItem, 
  POSSaleRecord, 
  StaffMember,
  PharmacySettings
} from '../types/pharmacy';
import { formatBDT } from '../utils/pharmacyUtils';

interface POSModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: MedicineItem[];
  equipment: MedicalEquipment[];
  staffList: StaffMember[];
  settings: PharmacySettings;
  lang: Language;
  onCompleteSale: (saleRecord: POSSaleRecord) => void;
}

export const POSModal: React.FC<POSModalProps> = ({
  isOpen,
  onClose,
  medicines,
  equipment,
  staffList,
  settings,
  lang,
  onCompleteSale,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'bKash/Nagad' | 'Card'>('Cash');
  const [servedByStaff, setServedByStaff] = useState<string>(staffList[0]?.name || 'Counter Pharmacist');
  const [lastCompletedSale, setLastCompletedSale] = useState<POSSaleRecord | null>(null);

  if (!isOpen) return null;

  // Search items across medicines and equipment
  const searchResults = () => {
    if (!searchTerm.trim()) return [];

    const lower = searchTerm.toLowerCase();

    const matchingMeds = medicines
      .filter((m) => m.name.toLowerCase().includes(lower) || m.genericName.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((m): CartItem => ({
        id: m.id,
        type: 'medicine',
        name: m.name,
        brandOrGeneric: `${m.dosage} · ${m.genericName}`,
        unitPrice: m.sellPrice,
        quantity: 1,
        maxStock: m.stockQuantity,
        unit: m.unit,
      }));

    const matchingEq = equipment
      .filter((e) => e.name.toLowerCase().includes(lower) || e.brand.toLowerCase().includes(lower))
      .slice(0, 5)
      .map((e): CartItem => ({
        id: e.id,
        type: 'equipment',
        name: e.name,
        brandOrGeneric: `${e.brand} · ${e.model}`,
        unitPrice: e.sellPrice,
        quantity: 1,
        maxStock: e.inStock,
        warranty: `${e.warrantyMonths}m warranty`,
      }));

    return [...matchingMeds, ...matchingEq];
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        if (existing.quantity >= existing.maxStock) return prev;
        return prev.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x);
      }
      return [...prev, item];
    });
    setSearchTerm('');
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((x) => {
          if (x.id === id) {
            const newQty = x.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > x.maxStock) return x;
            return { ...x, quantity: newQty };
          }
          return x;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const saleRecord: POSSaleRecord = {
      id: `pos-${Date.now()}`,
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      customerName: customerName.trim() || 'General Customer',
      customerPhone: customerPhone.trim() || 'N/A',
      items: cart,
      subtotal,
      discount,
      grandTotal,
      paymentMethod,
      servedByStaffName: servedByStaff,
    };

    onCompleteSale(saleRecord);
    setLastCompletedSale(saleRecord);
    setCart([]);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-5 sm:p-6 my-4 shadow-2xl">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'bn' ? 'ফার্মেসি বিক্রয় কাউন্টার (POS Counter)' : 'Pharmacy POS & Billing Counter'}
            </h3>
          </div>
          <button 
            onClick={() => {
              setLastCompletedSale(null);
              onClose();
            }} 
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Successful Receipt View */}
        {lastCompletedSale ? (
          <div className="py-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                {lang === 'bn' ? 'বিক্রয় সফলভাবে সম্পন্ন হয়েছে!' : 'Sale Completed Successfully!'}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'স্টক স্বয়ংক্রিয়ভাবে আপডেট করা হয়েছে।' : 'Inventory stock has been automatically updated.'}
              </p>
            </div>

            {/* Printable Receipt Box */}
            <div id="print-receipt" className="max-w-md mx-auto p-4 border border-slate-300 rounded-lg bg-slate-50 font-mono text-xs space-y-3">
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="font-bold text-sm text-slate-900">{settings.storeNameBn}</div>
                <div className="text-[11px] text-slate-600">{settings.addressBn}</div>
                <div className="text-[10px] text-slate-500">{settings.phone} · {settings.regNumber}</div>
              </div>

              <div className="flex justify-between text-[11px] border-b border-slate-200 pb-1 text-slate-600">
                <span>Inv: {lastCompletedSale.invoiceNo}</span>
                <span>{lastCompletedSale.date}</span>
              </div>

              <div className="text-[11px]">
                <div>ক্রেতা: {lastCompletedSale.customerName} ({lastCompletedSale.customerPhone})</div>
                <div>ক্যাশিয়ার: {lastCompletedSale.servedByStaffName}</div>
              </div>

              <table className="w-full text-left text-[11px] border-t border-b border-slate-200 py-1">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-1">আইটেম</th>
                    <th className="py-1 text-center">পরিমাণ</th>
                    <th className="py-1 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lastCompletedSale.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-sans">{it.name}</td>
                      <td className="py-1 text-center">{it.quantity}</td>
                      <td className="py-1 text-right">{formatBDT(it.unitPrice * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-0.5 text-right text-[11px]">
                <div>সাবটোটাল: {formatBDT(lastCompletedSale.subtotal)}</div>
                {lastCompletedSale.discount > 0 && <div>ডিসকাউন্ট: -{formatBDT(lastCompletedSale.discount)}</div>}
                <div className="font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  সর্বমোট: {formatBDT(lastCompletedSale.grandTotal)}
                </div>
                <div className="text-[10px] text-slate-500">পেমেন্ট: {lastCompletedSale.paymentMethod}</div>
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                সুস্থ থাকুন, আমাদের সেবার সাথে থাকার জন্য ধন্যবাদ!
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'bn' ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}</span>
              </button>
              <button
                onClick={() => setLastCompletedSale(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
              >
                {lang === 'bn' ? '+ পরবর্তী বিক্রয় শুরু করুন' : '+ Next Sale'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Search & Quick Add */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'bn' ? 'ঔষধ বা মেডিকেল ইকুইপমেন্ট খুঁজুন:' : 'Search Medicine or Medical Device:'}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'নাম লিখুন (e.g. Napa, Seclo, Omron, Beurer, Accu-Chek)...' : 'Type name to search stock...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Search Suggestions */}
              {searchTerm.trim().length > 0 && (
                <div className="border border-slate-200 rounded-lg bg-white divide-y divide-slate-100 max-h-60 overflow-y-auto shadow-sm">
                  {searchResults().length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 text-center">
                      {lang === 'bn' ? 'কোনো আইটেম পাওয়া যায়নি' : 'No matching items'}
                    </div>
                  ) : (
                    searchResults().map((item) => (
                      <div
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          {item.type === 'medicine' ? (
                            <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                          ) : (
                            <Stethoscope className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                          <div>
                            <div className="text-xs font-bold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-500">{item.brandOrGeneric}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-slate-900">
                            {formatBDT(item.unitPrice)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            মজুদ: {item.maxStock} {item.unit || 'টি'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Quick Picks for Fast Counter Dispensing */}
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  {lang === 'bn' ? 'বহুল বিক্রিত ঔষধ ও ইকুইপমেন্ট (Quick Counter Tap):' : 'Frequently Dispensed OTC & Devices:'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {medicines.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addToCart({
                        id: m.id,
                        type: 'medicine',
                        name: m.name,
                        brandOrGeneric: m.dosage,
                        unitPrice: m.sellPrice,
                        quantity: 1,
                        maxStock: m.stockQuantity,
                        unit: m.unit,
                      })}
                      className="p-2 border border-slate-200 rounded-lg text-left hover:border-teal-500 hover:bg-teal-50/50 transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.dosage} · {formatBDT(m.sellPrice)}</div>
                    </button>
                  ))}
                  {equipment.slice(0, 2).map((eq) => (
                    <button
                      key={eq.id}
                      onClick={() => addToCart({
                        id: eq.id,
                        type: 'equipment',
                        name: eq.name,
                        brandOrGeneric: eq.brand,
                        unitPrice: eq.sellPrice,
                        quantity: 1,
                        maxStock: eq.inStock,
                        warranty: `${eq.warrantyMonths}m warranty`,
                      })}
                      className="p-2 border border-slate-200 rounded-lg text-left hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">{eq.name}</div>
                      <div className="text-[10px] text-slate-500">{eq.brand} · {formatBDT(eq.sellPrice)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700">
                  {lang === 'bn' ? 'ক্রেতার তথ্য (ঐচ্ছিক):' : 'Customer Information:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'ক্রেতার নাম...' : 'Customer Name...'}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder={lang === 'bn' ? 'মোবাইল নম্বর...' : 'Phone number...'}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Active Billing Cart */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900">
                    {lang === 'bn' ? 'বিলিং কার্ট (Cart)' : 'Billing Items'} ({cart.length})
                  </span>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      {lang === 'bn' ? 'সব মুছুন' : 'Clear All'}
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      {lang === 'bn' ? 'কার্ট খালি। বাম পাশ থেকে ঔষধ বা ইকুইপমেন্ট যোগ করুন।' : 'Cart is empty. Select items from the left.'}
                    </div>
                  ) : (
                    cart.map((it) => (
                      <div key={it.id} className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 truncate">{it.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {formatBDT(it.unitPrice)} × {it.quantity}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateCartQty(it.id, -1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono w-5 text-center">{it.quantity}</span>
                          <button
                            onClick={() => updateCartQty(it.id, 1)}
                            className="w-5 h-5 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-slate-900 ml-1.5 w-14 text-right tabular-nums">
                            {formatBDT(it.unitPrice * it.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Checkout Calculation */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{lang === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                  <span className="font-mono tabular-nums">{formatBDT(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{lang === 'bn' ? 'ছাড় / ডিসকাউন্ট (টাকা):' : 'Discount (BDT):'}</span>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-0.5 text-right font-mono bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{lang === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="px-2 py-0.5 text-xs bg-white border border-slate-300 rounded"
                  >
                    <option value="Cash">Cash (নগদ)</option>
                    <option value="bKash/Nagad">bKash/Nagad</option>
                    <option value="Card">Card</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{lang === 'bn' ? 'ক্যাশিয়ার:' : 'Cashier:'}</span>
                  <select
                    value={servedByStaff}
                    onChange={(e) => setServedByStaff(e.target.value)}
                    className="px-2 py-0.5 text-xs bg-white border border-slate-300 rounded max-w-[150px] truncate"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">{lang === 'bn' ? 'সর্বমোট পরিশোধ:' : 'Grand Total:'}</span>
                  <span className="text-lg font-bold text-teal-800 font-mono tabular-nums">
                    {formatBDT(grandTotal)}
                  </span>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                  className="w-full py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 rounded-lg shadow-sm transition-colors mt-2"
                >
                  {lang === 'bn' ? 'বিল সম্পূর্ণ করুন ও মেমো প্রিন্ট' : 'Checkout & Print Memo'}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
