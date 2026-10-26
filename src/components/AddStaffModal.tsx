import React, { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { Language, StaffMember, StaffRole, StaffShift, StaffDutyStatus } from '../types/pharmacy';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: StaffMember) => void;
  lang: Language;
  editStaff?: StaffMember | null;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
  editStaff,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('sales_assistant');
  const [roleTitleBn, setRoleTitleBn] = useState('কাউন্টার সেলস এক্সিকিউটিভ');
  const [roleTitleEn, setRoleTitleEn] = useState('Counter Sales Executive');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState<StaffShift>('morning');
  const [shiftTiming, setShiftTiming] = useState('সকাল ০৮:০০ - বিকাল ০৪:০০ (08:00 AM - 04:00 PM)');
  const [dutyStatus, setDutyStatus] = useState<StaffDutyStatus>('on_duty');
  const [salary, setSalary] = useState<number>(20000);
  const [joinDate, setJoinDate] = useState('2024-01-01');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editStaff) {
      setName(editStaff.name);
      setRole(editStaff.role);
      setRoleTitleBn(editStaff.roleTitleBn);
      setRoleTitleEn(editStaff.roleTitleEn);
      setPhone(editStaff.phone);
      setEmail(editStaff.email || '');
      setShift(editStaff.shift);
      setShiftTiming(editStaff.shiftTiming);
      setDutyStatus(editStaff.dutyStatus);
      setSalary(editStaff.salary);
      setJoinDate(editStaff.joinDate);
      setBloodGroup(editStaff.bloodGroup || 'O+');
      setNotes(editStaff.notes || '');
    } else {
      setName('');
      setRole('sales_assistant');
      setRoleTitleBn('কাউন্টার সেলস এক্সিকিউটিভ');
      setRoleTitleEn('Counter Sales Executive');
      setPhone('');
      setEmail('');
      setShift('morning');
      setShiftTiming('সকাল ০৮:০০ - বিকাল ০৪:০০ (08:00 AM - 04:00 PM)');
      setDutyStatus('on_duty');
      setSalary(20000);
      setJoinDate(new Date().toISOString().split('T')[0]);
      setBloodGroup('O+');
      setNotes('');
    }
  }, [editStaff, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (selectedRole: StaffRole) => {
    setRole(selectedRole);
    if (selectedRole === 'registered_pharmacist') {
      setRoleTitleBn('রেজিস্টার্ড ফার্মাসিস্ট (গ্রেড-এ)');
      setRoleTitleEn('Registered Pharmacist (Grade A)');
    } else if (selectedRole === 'sales_assistant') {
      setRoleTitleBn('ফার্মেসি বিক্রয় সহকারী ও ক্যাশিয়ার');
      setRoleTitleEn('Pharmacy Sales Assistant & Cashier');
    } else if (selectedRole === 'inventory_manager') {
      setRoleTitleBn('মেডিসিন ও ইকুইপমেন্ট স্টক ইনচার্জ');
      setRoleTitleEn('Inventory & Stock Manager');
    } else if (selectedRole === 'support_delivery') {
      setRoleTitleBn('জরুরি হোম ডেলিভারি ও সাপোর্ট সহকারী');
      setRoleTitleEn('Emergency Delivery & Support Staff');
    }
  };

  const handleShiftChange = (selectedShift: StaffShift) => {
    setShift(selectedShift);
    if (selectedShift === 'morning') {
      setShiftTiming('সকাল ০৮:০০ - বিকাল ০৪:০০ (08:00 AM - 04:00 PM)');
    } else if (selectedShift === 'evening') {
      setShiftTiming('বিকাল ০৪:০০ - রাত ১২:০০ (04:00 PM - 12:00 AM)');
    } else if (selectedShift === 'night') {
      setShiftTiming('রাত ১২:০০ - সকাল ০৮:০০ (12:00 AM - 08:00 AM)');
    } else if (selectedShift === 'full_day') {
      setShiftTiming('সকাল ০৯:০০ - সন্ধ্যা ০৬:০০ (09:00 AM - 06:00 PM)');
    } else {
      setShiftTiming('ফ্লেক্সিবল অন-কল ডিউটি (Flexible On-Call)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const staffMember: StaffMember = {
      id: editStaff ? editStaff.id : `staff-${Date.now()}`,
      name: name.trim(),
      role,
      roleTitleBn: roleTitleBn.trim(),
      roleTitleEn: roleTitleEn.trim(),
      phone: phone.trim() || 'N/A',
      email: email.trim(),
      shift,
      shiftTiming,
      dutyStatus,
      salary: Number(salary) || 0,
      joinDate,
      bloodGroup,
      notes: notes.trim(),
    };

    onSave(staffMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 my-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {editStaff 
                ? (lang === 'bn' ? 'স্টাফ তথ্য ও দায়িত্ব আপডেট' : 'Edit Staff Details') 
                : (lang === 'bn' ? 'নতুন ফার্মেসি কর্মী যুক্ত করুন' : 'Add New Pharmacy Staff')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'কর্মীর পূর্ণ নাম *' : 'Full Name *'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. মোঃ আরিফুর রহমান"
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'পদবি ও ভূমিকা (Role)' : 'Role'}
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              >
                <option value="registered_pharmacist">Registered Pharmacist (ফার্মাসিস্ট)</option>
                <option value="sales_assistant">Counter Sales & Cashier (বিক্রয়)</option>
                <option value="inventory_manager">Inventory Manager (স্টক ম্যানেজার)</option>
                <option value="support_delivery">Emergency Delivery & Helper (ডেলিভারি)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'শিফট নির্বাচন' : 'Assigned Shift'}
              </label>
              <select
                value={shift}
                onChange={(e) => handleShiftChange(e.target.value as StaffShift)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              >
                <option value="morning">Morning Shift (সকাল ০৮:০০ - বিকাল ০৪:০০)</option>
                <option value="evening">Evening Shift (বিকাল ০৪:০০ - রাত ১২:০০)</option>
                <option value="night">Night Shift (রাত ১২:০০ - সকাল ০৮:০০)</option>
                <option value="full_day">Day Shift (সকাল ০৯:০০ - সন্ধ্যা ০৬:০০)</option>
                <option value="flexible">Flexible On-Call (প্রয়োজনভিত্তিক)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {lang === 'bn' ? 'বর্তমান স্ট্যাটাস' : 'Duty Status'}
              </label>
              <select
                value={dutyStatus}
                onChange={(e) => setDutyStatus(e.target.value as StaffDutyStatus)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded"
              >
                <option value="on_duty">On Duty (বর্তমানে দায়িত্বে উপস্থিত)</option>
                <option value="off_duty">Off Duty (শিফটের বাইরে)</option>
                <option value="on_leave">On Leave (ছুটিতে আছেন)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'মাসিক বেতন (টাকা)' : 'Monthly Salary'}
              </label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'যোগদান তারিখ' : 'Join Date'}
              </label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {lang === 'bn' ? 'নোট / বিশেষ দায়িত্ব' : 'Notes / Special Duties'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Pharmacy council licensed pharmacist, night on-call support"
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
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
