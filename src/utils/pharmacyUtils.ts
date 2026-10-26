import { DaySchedule, MedicineItem, MedicalEquipment, EquipmentSaleRecord, StaffMember } from '../types/pharmacy';

export function formatBDT(amount: number): string {
  return '৳' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatBnDigits(num: number | string): string {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
}

export function checkPharmacyOpenStatus(schedules: DaySchedule[]): {
  isOpenNow: boolean;
  currentDaySchedule: DaySchedule | undefined;
  statusTextBn: string;
  statusTextEn: string;
  nextScheduleInfoBn: string;
  nextScheduleInfoEn: string;
} {
  const now = new Date();
  const dayIndex = now.getDay(); // 0 is Sunday, 6 is Saturday
  const dayIdMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDayId = dayIdMap[dayIndex];

  const currentSchedule = schedules.find((s) => s.dayId === currentDayId);

  if (!currentSchedule || !currentSchedule.isOpen) {
    return {
      isOpenNow: false,
      currentDaySchedule: currentSchedule,
      statusTextBn: 'আজ বন্ধ (Closed Today)',
      statusTextEn: 'Closed Today',
      nextScheduleInfoBn: 'জরুরি প্রেসক্রিপশনের জন্য অন-কল নম্বরে ফোন করুন',
      nextScheduleInfoEn: 'For emergencies please call on-call hotline',
    };
  }

  // Parse open & close time
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeVal = currentHours * 60 + currentMinutes;

  const [openH, openM] = currentSchedule.openTime.split(':').map(Number);
  const openTimeVal = openH * 60 + (openM || 0);

  let closeH = 24;
  let closeM = 0;
  if (currentSchedule.closeTime) {
    const parts = currentSchedule.closeTime.split(':').map(Number);
    closeH = parts[0];
    closeM = parts[1] || 0;
  }
  const closeTimeVal = closeH * 60 + closeM;

  const isOpen = currentTimeVal >= openTimeVal && currentTimeVal < closeTimeVal;

  return {
    isOpenNow: isOpen,
    currentDaySchedule: currentSchedule,
    statusTextBn: isOpen ? 'ফার্মেসি এখন খোলা (Open Now)' : 'ফার্মেসি এখন বন্ধ (Closed Now)',
    statusTextEn: isOpen ? 'Pharmacy is Open Now' : 'Pharmacy is Currently Closed',
    nextScheduleInfoBn: isOpen 
      ? `আজ রাত ${currentSchedule.closeTime === '24:00' ? '১২:০০' : currentSchedule.closeTime} পর্যন্ত খোলা থাকবে`
      : `পরবর্তী খোলা হবে সকাল ${currentSchedule.openTime}-এ`,
    nextScheduleInfoEn: isOpen
      ? `Open until ${currentSchedule.closeTime}`
      : `Reopens at ${currentSchedule.openTime}`,
  };
}

export function computeMedicineStats(medicines: MedicineItem[]) {
  const totalItemTypes = medicines.length;
  const totalStockUnits = medicines.reduce((sum, m) => sum + (m.stockQuantity || 0), 0);
  const totalPurchaseCost = medicines.reduce((sum, m) => sum + (m.stockQuantity * m.purchasePrice), 0);
  const totalRetailValue = medicines.reduce((sum, m) => sum + (m.stockQuantity * m.sellPrice), 0);
  const totalPotentialProfit = totalRetailValue - totalPurchaseCost;
  
  const lowStockItems = medicines.filter((m) => m.stockQuantity <= m.minStockThreshold);

  const today = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(today.getDate() + 90);

  const expiringSoonItems = medicines.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate);
    return exp <= ninetyDaysFromNow;
  });

  return {
    totalItemTypes,
    totalStockUnits,
    totalPurchaseCost,
    totalRetailValue,
    totalPotentialProfit,
    lowStockCount: lowStockItems.length,
    lowStockItems,
    expiringSoonCount: expiringSoonItems.length,
    expiringSoonItems,
  };
}

export function computeEquipmentStats(
  equipmentList: MedicalEquipment[], 
  salesList: EquipmentSaleRecord[]
) {
  const totalModels = equipmentList.length;
  const totalUnitsInStock = equipmentList.reduce((sum, eq) => sum + (eq.inStock || 0), 0);
  const totalStockValuation = equipmentList.reduce((sum, eq) => sum + (eq.inStock * eq.sellPrice), 0);

  const totalSalesCount = salesList.length;
  const totalUnitsSold = salesList.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalSalesRevenue = salesList.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return {
    totalModels,
    totalUnitsInStock,
    totalStockValuation,
    totalSalesCount,
    totalUnitsSold,
    totalSalesRevenue,
  };
}

export function computeStaffStats(staffList: StaffMember[]) {
  const totalStaff = staffList.length;
  const onDutyCount = staffList.filter((s) => s.dutyStatus === 'on_duty').length;
  const offDutyCount = staffList.filter((s) => s.dutyStatus === 'off_duty').length;
  const onLeaveCount = staffList.filter((s) => s.dutyStatus === 'on_leave').length;

  const morningShift = staffList.filter((s) => s.shift === 'morning').length;
  const eveningShift = staffList.filter((s) => s.shift === 'evening').length;
  const nightShift = staffList.filter((s) => s.shift === 'night').length;

  return {
    totalStaff,
    onDutyCount,
    offDutyCount,
    onLeaveCount,
    morningShift,
    eveningShift,
    nightShift,
  };
}
