export type Language = 'bn' | 'en';

export type MedicineCategory = 
  | 'Tablet' 
  | 'Capsule' 
  | 'Syrup' 
  | 'Drop' 
  | 'Injection' 
  | 'Ointment' 
  | 'Saline' 
  | 'Inhaler' 
  | 'Suppository' 
  | 'Powder';

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  company: string;
  category: MedicineCategory;
  dosage: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number; // buy price per unit (BDT)
  sellPrice: number; // sell price per unit (BDT)
  stockQuantity: number;
  unit: string; // Pcs, Strip, Box, Bottle
  minStockThreshold: number;
  shelfLocation: string; // e.g. Shelf A-3
  lastUpdated: string;
}

export interface MedicalEquipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'Diagnostic' | 'Respiratory' | 'Mobility' | 'Surgical & Wound' | 'Home Care' | 'Therapeutic';
  purchasePrice: number;
  sellPrice: number;
  inStock: number;
  warrantyMonths: number;
  serialNumberPrefix?: string;
  description: string;
  featured?: boolean;
}

export interface EquipmentSaleRecord {
  id: string;
  invoiceNo: string;
  equipmentId: string;
  equipmentName: string;
  brand: string;
  model: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalAmount: number;
  warrantyPeriod: string;
  serialNumber: string;
  paymentMethod: 'Cash' | 'bKash/Nagad' | 'Card';
  soldByStaffId: string;
  soldByStaffName: string;
  date: string; // YYYY-MM-DD HH:mm
  notes?: string;
}

export type StaffRole = 
  | 'registered_pharmacist' 
  | 'sales_assistant' 
  | 'inventory_manager' 
  | 'support_delivery';

export type StaffShift = 'morning' | 'evening' | 'night' | 'full_day' | 'flexible';
export type StaffDutyStatus = 'on_duty' | 'off_duty' | 'on_leave';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  roleTitleBn: string;
  roleTitleEn: string;
  phone: string;
  email?: string;
  shift: StaffShift;
  shiftTiming: string; // e.g. "08:00 AM - 04:00 PM"
  dutyStatus: StaffDutyStatus;
  salary: number;
  joinDate: string;
  bloodGroup?: string;
  photoUrl?: string;
  notes?: string;
}

export interface DaySchedule {
  dayId: string;
  dayBn: string;
  dayEn: string;
  isOpen: boolean;
  openTime: string; // "08:00"
  closeTime: string; // "24:00" or "23:30"
  breakInfoBn?: string;
  breakInfoEn?: string;
}

export interface PharmacySettings {
  storeNameBn: string;
  storeNameEn: string;
  taglineBn: string;
  taglineEn: string;
  regNumber: string;
  addressBn: string;
  addressEn: string;
  phone: string;
  emergencyPhone: string;
  is24HoursEmergency: boolean;
  emergencyPharmacistName: string;
  schedules: DaySchedule[];
}

export interface CartItem {
  id: string;
  type: 'medicine' | 'equipment';
  name: string;
  brandOrGeneric: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  unit?: string;
  warranty?: string;
}

export interface POSSaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  grandTotal: number;
  paymentMethod: 'Cash' | 'bKash/Nagad' | 'Card';
  servedByStaffName: string;
}

export interface DailySalesEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabelBn: string; // e.g. রবিবার
  totalSales: number; // সর্বমোট বিক্রি
  medicineSales: number; // ঔষধ বিক্রি
  equipmentSales: number; // মেডিকেল ইকুইপমেন্ট বিক্রি
  cashAmount: number; // নগদ ক্যাশ আদায়
  digitalAmount: number; // বিকাশ / নগদ / কার্ড আদায়
  totalInvoices: number; // মেমো সংখ্যা
  dailyExpense: number; // দোকানের খরচ (চা, বিদ্যুৎ, প্যাকেজিং ইত্যাদি)
  netCashInHand: number; // দিনের শেষে ক্যাশবাক্সে নিট জমা
  recordedByStaff: string; // খাতা পরিচালনাকারী কর্মী
  notes?: string;
}

