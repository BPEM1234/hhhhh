/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Language, 
  MedicineItem, 
  MedicalEquipment, 
  EquipmentSaleRecord, 
  StaffMember, 
  PharmacySettings,
  StaffDutyStatus,
  POSSaleRecord,
  DailySalesEntry
} from './types/pharmacy';
import { 
  INITIAL_MEDICINES, 
  INITIAL_EQUIPMENT, 
  INITIAL_EQUIPMENT_SALES, 
  INITIAL_STAFF, 
  INITIAL_SETTINGS,
  INITIAL_DAILY_LEDGER
} from './data/initialData';

// Component Imports
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MedicineLedgerView } from './components/MedicineLedgerView';
import { EquipmentSalesView } from './components/EquipmentSalesView';
import { DailySalesLedgerView } from './components/DailySalesLedgerView';
import { StaffManagementView } from './components/StaffManagementView';
import { ScheduleTimingView } from './components/ScheduleTimingView';
import { AddMedicineModal } from './components/AddMedicineModal';
import { AddEquipmentSaleModal } from './components/AddEquipmentSaleModal';
import { AddEquipmentItemModal } from './components/AddEquipmentItemModal';
import { AddDailyEntryModal } from './components/AddDailyEntryModal';
import { AddStaffModal } from './components/AddStaffModal';
import { POSModal } from './components/POSModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { PrintDaySheetModal } from './components/PrintDaySheetModal';

export default function App() {
  // App Language: Default to Bengali ('bn') with toggle
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('medisys_lang') as Language) || 'bn';
  });

  // Current Navigation View (Includes daily_ledger for everyday sales ledger)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'medicines' | 'equipment' | 'daily_ledger' | 'staff' | 'schedule'>('dashboard');

  // 1. Medicines State (Medicine Total Hiseb)
  const [medicines, setMedicines] = useState<MedicineItem[]>(() => {
    const saved = localStorage.getItem('medisys_medicines');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MEDICINES;
  });

  // 2. Equipment State & Equipment Sales List (Total ki ki equipment sels kore)
  const [equipment, setEquipment] = useState<MedicalEquipment[]>(() => {
    const saved = localStorage.getItem('medisys_equipment');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EQUIPMENT;
  });

  const [equipmentSales, setEquipmentSales] = useState<EquipmentSaleRecord[]>(() => {
    const saved = localStorage.getItem('medisys_equipment_sales');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EQUIPMENT_SALES;
  });

  // 3. Daily Sales Khata / Ledger State (প্রতিদিনের বিক্রয় ও জমার খাতা)
  const [dailyLedger, setDailyLedger] = useState<DailySalesEntry[]>(() => {
    const saved = localStorage.getItem('medisys_daily_ledger');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DAILY_LEDGER;
  });

  // 4. Staff State (Kotjon staff ase & duty)
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('medisys_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_STAFF;
  });

  // 5. Pharmacy Operating Schedule & Settings (Kokhon theke kokhon open thake)
  const [settings, setSettings] = useState<PharmacySettings>(() => {
    const saved = localStorage.getItem('medisys_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          storeNameBn: 'মোঃ জুয়েল রানা ফার্মেসি',
          storeNameEn: 'Md. Jewel Rana Pharmacy',
        };
      } catch (e) { /* ignore */ }
    }
    return INITIAL_SETTINGS;
  });

  // Modals visibility
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineItem | null>(null);

  const [isAddEquipmentSaleOpen, setIsAddEquipmentSaleOpen] = useState(false);
  const [preselectedEquipmentId, setPreselectedEquipmentId] = useState<string | undefined>();

  const [isAddEquipmentItemOpen, setIsAddEquipmentItemOpen] = useState(false);

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  const [isAddDailyEntryOpen, setIsAddDailyEntryOpen] = useState(false);
  const [editingDailyEntry, setEditingDailyEntry] = useState<DailySalesEntry | null>(null);
  const [printedDaySheet, setPrintedDaySheet] = useState<DailySalesEntry | null>(null);

  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [printedSale, setPrintedSale] = useState<EquipmentSaleRecord | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('medisys_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('medisys_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('medisys_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('medisys_equipment_sales', JSON.stringify(equipmentSales));
  }, [equipmentSales]);

  useEffect(() => {
    localStorage.setItem('medisys_daily_ledger', JSON.stringify(dailyLedger));
  }, [dailyLedger]);

  useEffect(() => {
    localStorage.setItem('medisys_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('medisys_settings', JSON.stringify(settings));
  }, [settings]);

  // --- Handlers: Medicines ---
  const handleSaveMedicine = (med: MedicineItem) => {
    setMedicines((prev) => {
      const exists = prev.some((m) => m.id === med.id);
      if (exists) {
        return prev.map((m) => m.id === med.id ? med : m);
      }
      return [med, ...prev];
    });
    setEditingMedicine(null);
  };

  const handleDeleteMedicine = (id: string) => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত এই ঔষধটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this medicine?')) {
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleQuickRestock = (id: string, delta: number) => {
    setMedicines((prev) =>
      prev.map((m) => m.id === id ? { ...m, stockQuantity: Math.max(0, m.stockQuantity + delta) } : m)
    );
  };

  // --- Handlers: Equipment & Equipment Sales ---
  const handleSaveEquipmentSale = (sale: EquipmentSaleRecord) => {
    // 1. Add to sales history
    setEquipmentSales((prev) => [sale, ...prev]);

    // 2. Decrement equipment inventory stock
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id === sale.equipmentId) {
          return {
            ...eq,
            inStock: Math.max(0, eq.inStock - sale.quantity),
          };
        }
        return eq;
      })
    );

    // 3. Auto-update Today's Daily Sales Khata!
    const today = new Date().toISOString().split('T')[0];
    const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const dayNameBn = daysBn[new Date().getDay()] || 'দিন';
    const isCash = sale.paymentMethod === 'Cash';

    setDailyLedger((prev) => {
      const existingIdx = prev.findIndex((e) => e.date === today);
      if (existingIdx >= 0) {
        const current = prev[existingIdx];
        const updatedTotal = current.totalSales + sale.totalAmount;
        const updatedCash = current.cashAmount + (isCash ? sale.totalAmount : 0);
        const updatedDigital = current.digitalAmount + (!isCash ? sale.totalAmount : 0);
        const updated: DailySalesEntry = {
          ...current,
          totalSales: updatedTotal,
          equipmentSales: current.equipmentSales + sale.totalAmount,
          cashAmount: updatedCash,
          digitalAmount: updatedDigital,
          totalInvoices: current.totalInvoices + 1,
          netCashInHand: Math.max(0, updatedTotal - current.dailyExpense),
        };
        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      } else {
        const newEntry: DailySalesEntry = {
          id: `ledger-${today}`,
          date: today,
          dayLabelBn: dayNameBn,
          totalSales: sale.totalAmount,
          medicineSales: 0,
          equipmentSales: sale.totalAmount,
          cashAmount: isCash ? sale.totalAmount : 0,
          digitalAmount: !isCash ? sale.totalAmount : 0,
          totalInvoices: 1,
          dailyExpense: 0,
          netCashInHand: sale.totalAmount,
          recordedByStaff: sale.soldByStaffName,
          notes: 'ইকুইপমেন্ট বিক্রয় থেকে স্বয়ংক্রিয় এন্ট্রি।',
        };
        return [newEntry, ...prev];
      }
    });
  };

  const handleSaveEquipmentItem = (eq: MedicalEquipment) => {
    setEquipment((prev) => [eq, ...prev]);
  };

  // --- Handlers: Daily Sales Khata ---
  const handleSaveDailyEntry = (entry: DailySalesEntry) => {
    setDailyLedger((prev) => {
      const idx = prev.findIndex((e) => e.id === entry.id || e.date === entry.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
    setEditingDailyEntry(null);
  };

  const handleDeleteDailyEntry = (id: string) => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি নিশ্চিত এই দিনের খাতা মুছে ফেলতে চান?' : 'Are you sure you want to delete this daily ledger record?')) {
      setDailyLedger((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // --- Handlers: Staff ---
  const handleSaveStaff = (member: StaffMember) => {
    setStaff((prev) => {
      const exists = prev.some((s) => s.id === member.id);
      if (exists) {
        return prev.map((s) => s.id === member.id ? member : s);
      }
      return [...prev, member];
    });
    setEditingStaff(null);
  };

  const handleDeleteStaff = (id: string) => {
    if (window.confirm(lang === 'bn' ? 'আপনি কি এই স্টাফ সদস্যকে মুছে ফেলতে চান?' : 'Are you sure you want to remove this staff member?')) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdateDutyStatus = (id: string, status: StaffDutyStatus) => {
    setStaff((prev) =>
      prev.map((s) => s.id === id ? { ...s, dutyStatus: status } : s)
    );
  };

  // --- Handlers: POS Sale Complete ---
  const handleCompletePOSSale = (saleRecord: POSSaleRecord) => {
    // 1. Deduct stock for each sold cart item
    saleRecord.items.forEach((item) => {
      if (item.type === 'medicine') {
        setMedicines((prev) =>
          prev.map((m) => m.id === item.id ? { ...m, stockQuantity: Math.max(0, m.stockQuantity - item.quantity) } : m)
        );
      } else if (item.type === 'equipment') {
        setEquipment((prev) =>
          prev.map((eq) => eq.id === item.id ? { ...eq, inStock: Math.max(0, eq.inStock - item.quantity) } : eq)
        );

        // Also add an equipment sale record if equipment was sold in POS
        const targetEq = equipment.find((e) => e.id === item.id);
        if (targetEq) {
          const eqRecord: EquipmentSaleRecord = {
            id: `eq-sale-${Date.now()}-${item.id}`,
            invoiceNo: saleRecord.invoiceNo,
            equipmentId: targetEq.id,
            equipmentName: targetEq.name,
            brand: targetEq.brand,
            model: targetEq.model,
            customerName: saleRecord.customerName,
            customerPhone: saleRecord.customerPhone,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: 0,
            totalAmount: item.unitPrice * item.quantity,
            warrantyPeriod: `${targetEq.warrantyMonths} Months Warranty`,
            serialNumber: `${targetEq.serialNumberPrefix || 'EQ-'}${Math.floor(10000 + Math.random() * 90000)}`,
            paymentMethod: saleRecord.paymentMethod,
            soldByStaffId: 'pos-counter',
            soldByStaffName: saleRecord.servedByStaffName,
            date: saleRecord.date,
          };
          setEquipmentSales((prev) => [eqRecord, ...prev]);
        }
      }
    });

    // 2. Auto-aggregate into Today's Daily Sales Khata
    const today = new Date().toISOString().split('T')[0];
    const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const dayNameBn = daysBn[new Date().getDay()] || 'দিন';

    const medAmount = saleRecord.items
      .filter((i) => i.type === 'medicine')
      .reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    const eqAmount = saleRecord.items
      .filter((i) => i.type === 'equipment')
      .reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);

    const isCash = saleRecord.paymentMethod === 'Cash';

    setDailyLedger((prev) => {
      const existingIdx = prev.findIndex((e) => e.date === today);
      if (existingIdx >= 0) {
        const current = prev[existingIdx];
        const updatedTotal = current.totalSales + saleRecord.grandTotal;
        const updatedCash = current.cashAmount + (isCash ? saleRecord.grandTotal : 0);
        const updatedDigital = current.digitalAmount + (!isCash ? saleRecord.grandTotal : 0);
        const updated: DailySalesEntry = {
          ...current,
          totalSales: updatedTotal,
          medicineSales: current.medicineSales + medAmount,
          equipmentSales: current.equipmentSales + eqAmount,
          cashAmount: updatedCash,
          digitalAmount: updatedDigital,
          totalInvoices: current.totalInvoices + 1,
          netCashInHand: Math.max(0, updatedTotal - current.dailyExpense),
        };
        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      } else {
        const newEntry: DailySalesEntry = {
          id: `ledger-${today}`,
          date: today,
          dayLabelBn: dayNameBn,
          totalSales: saleRecord.grandTotal,
          medicineSales: medAmount,
          equipmentSales: eqAmount,
          cashAmount: isCash ? saleRecord.grandTotal : 0,
          digitalAmount: !isCash ? saleRecord.grandTotal : 0,
          totalInvoices: 1,
          dailyExpense: 0,
          netCashInHand: saleRecord.grandTotal,
          recordedByStaff: saleRecord.servedByStaffName,
          notes: 'কাউন্টার বিক্রয় থেকে স্বয়ংক্রিয় এন্ট্রি।',
        };
        return [newEntry, ...prev];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        settings={settings}
        onOpenPOS={() => setIsPOSOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            lang={lang}
            medicines={medicines}
            equipment={equipment}
            equipmentSales={equipmentSales}
            staff={staff}
            dailyLedger={dailyLedger}
            settings={settings}
            setActiveTab={setActiveTab}
            onOpenPOS={() => setIsPOSOpen(true)}
            onOpenAddMedicine={() => {
              setEditingMedicine(null);
              setIsAddMedicineOpen(true);
            }}
            onOpenAddEquipmentSale={() => {
              setPreselectedEquipmentId(undefined);
              setIsAddEquipmentSaleOpen(true);
            }}
            onOpenAddDailyEntry={() => {
              setEditingDailyEntry(null);
              setIsAddDailyEntryOpen(true);
            }}
          />
        )}

        {activeTab === 'medicines' && (
          <MedicineLedgerView
            lang={lang}
            medicines={medicines}
            onAddMedicine={() => {
              setEditingMedicine(null);
              setIsAddMedicineOpen(true);
            }}
            onEditMedicine={(med) => {
              setEditingMedicine(med);
              setIsAddMedicineOpen(true);
            }}
            onDeleteMedicine={handleDeleteMedicine}
            onQuickRestock={handleQuickRestock}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentSalesView
            lang={lang}
            equipment={equipment}
            equipmentSales={equipmentSales}
            onOpenAddEquipmentSale={(preId) => {
              setPreselectedEquipmentId(preId);
              setIsAddEquipmentSaleOpen(true);
            }}
            onOpenAddEquipmentItem={() => setIsAddEquipmentItemOpen(true)}
            onPrintEquipmentReceipt={(sale) => setPrintedSale(sale)}
          />
        )}

        {activeTab === 'daily_ledger' && (
          <DailySalesLedgerView
            lang={lang}
            dailyLedger={dailyLedger}
            staffList={staff}
            settings={settings}
            onOpenAddEntry={(existing) => {
              setEditingDailyEntry(existing || null);
              setIsAddDailyEntryOpen(true);
            }}
            onDeleteEntry={handleDeleteDailyEntry}
            onPrintDaySheet={(entry) => setPrintedDaySheet(entry)}
          />
        )}

        {activeTab === 'staff' && (
          <StaffManagementView
            lang={lang}
            staff={staff}
            onAddStaff={() => {
              setEditingStaff(null);
              setIsAddStaffOpen(true);
            }}
            onEditStaff={(member) => {
              setEditingStaff(member);
              setIsAddStaffOpen(true);
            }}
            onDeleteStaff={handleDeleteStaff}
            onUpdateDutyStatus={handleUpdateDutyStatus}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTimingView
            lang={lang}
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings(newSettings)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-slate-800">
              {lang === 'bn' ? settings.storeNameBn : settings.storeNameEn}
            </div>
            <div>
              {settings.addressBn} · লাইসেন্স: {settings.regNumber}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>জরুরি হেল্পলাইন: <strong>{settings.emergencyPhone}</strong></span>
            <span>·</span>
            <span>নিয়মিত সময়: <strong>08:00 AM - 12:00 AM</strong></span>
          </div>
        </div>
      </footer>

      {/* --- Modals --- */}
      {/* Add / Edit Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => {
          setIsAddMedicineOpen(false);
          setEditingMedicine(null);
        }}
        onSave={handleSaveMedicine}
        lang={lang}
        editItem={editingMedicine}
      />

      {/* Record Equipment Sale Modal */}
      <AddEquipmentSaleModal
        isOpen={isAddEquipmentSaleOpen}
        onClose={() => {
          setIsAddEquipmentSaleOpen(false);
          setPreselectedEquipmentId(undefined);
        }}
        equipmentList={equipment}
        staffList={staff}
        onSaveSale={handleSaveEquipmentSale}
        lang={lang}
        preselectedEquipmentId={preselectedEquipmentId}
      />

      {/* Add Equipment Item to Catalog Modal */}
      <AddEquipmentItemModal
        isOpen={isAddEquipmentItemOpen}
        onClose={() => setIsAddEquipmentItemOpen(false)}
        onSave={handleSaveEquipmentItem}
        lang={lang}
      />

      {/* Add / Edit Daily Sales Ledger Entry Modal */}
      <AddDailyEntryModal
        isOpen={isAddDailyEntryOpen}
        onClose={() => {
          setIsAddDailyEntryOpen(false);
          setEditingDailyEntry(null);
        }}
        onSave={handleSaveDailyEntry}
        lang={lang}
        staffList={staff}
        editEntry={editingDailyEntry}
      />

      {/* Print Day Sheet Statement Modal */}
      <PrintDaySheetModal
        entry={printedDaySheet}
        settings={settings}
        lang={lang}
        onClose={() => setPrintedDaySheet(null)}
      />

      {/* Add / Edit Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => {
          setIsAddStaffOpen(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveStaff}
        lang={lang}
        editStaff={editingStaff}
      />

      {/* POS Checkout & Billing Modal */}
      <POSModal
        isOpen={isPOSOpen}
        onClose={() => setIsPOSOpen(false)}
        medicines={medicines}
        equipment={equipment}
        staffList={staff}
        settings={settings}
        lang={lang}
        onCompleteSale={handleCompletePOSSale}
      />

      {/* Printable Invoice & Warranty Modal */}
      <InvoicePrintModal
        sale={printedSale}
        settings={settings}
        lang={lang}
        onClose={() => setPrintedSale(null)}
      />

    </div>
  );
}
