import { 
  Pill, 
  Stethoscope, 
  Users, 
  Clock, 
  LayoutDashboard, 
  ShoppingCart, 
  Languages, 
  PhoneCall,
  BookOpen
} from 'lucide-react';
import { Language, PharmacySettings } from '../types/pharmacy';
import { checkPharmacyOpenStatus } from '../utils/pharmacyUtils';

interface NavbarProps {
  activeTab: 'dashboard' | 'medicines' | 'equipment' | 'daily_ledger' | 'staff' | 'schedule';
  setActiveTab: (tab: 'dashboard' | 'medicines' | 'equipment' | 'daily_ledger' | 'staff' | 'schedule') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  settings: PharmacySettings;
  onOpenPOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  settings,
  onOpenPOS,
}) => {
  const openStatus = checkPharmacyOpenStatus(settings.schedules);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Wordmark / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                  {lang === 'bn' ? settings.storeNameBn : settings.storeNameEn}
                </span>
                <span className="text-xs text-slate-500 font-mono tracking-wide hidden sm:block">
                  {openStatus.isOpenNow ? (
                    <span className="text-emerald-700 font-medium">
                      ● {lang === 'bn' ? 'খোলা আছে' : 'Open Now'} · {openStatus.currentDaySchedule?.openTime} - {openStatus.currentDaySchedule?.closeTime}
                    </span>
                  ) : (
                    <span className="text-amber-700 font-medium">
                      ○ {lang === 'bn' ? 'এখন বন্ধ' : 'Closed Now'}
                    </span>
                  )}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single line, quiet text links) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
            </button>

            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'medicines'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'ঔষধ ও স্টক হিসাব' : 'Medicine Inventory'}</span>
            </button>

            <button
              onClick={() => setActiveTab('equipment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'equipment'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'মেডিকেল ইকুইপমেন্ট ও বিক্রয়' : 'Equipment Sales'}</span>
            </button>

            <button
              onClick={() => setActiveTab('daily_ledger')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'daily_ledger'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'দৈনিক বিক্রয় খাতা' : 'Daily Sales Khata'}</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'staff'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'স্টাফ তালিকা ও ডিউটি' : 'Staff Directory'}</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === 'schedule'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{lang === 'bn' ? 'খোলার সময়সূচী' : 'Operating Hours'}</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Language Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            >
              <Languages className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Emergency Hotline Quick Access */}
            <a
              href={`tel:${settings.emergencyPhone}`}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-md transition-colors whitespace-nowrap"
              title="24/7 Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-mono">{settings.emergencyPhone.split(' ')[0]}</span>
            </a>

            {/* Primary Action Button: POS / Quick Sale */}
            <button
              onClick={onOpenPOS}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{lang === 'bn' ? '+ নতুন বিক্রয় (POS)' : '+ New Sale (POS)'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'medicines' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'ঔষধ স্টক' : 'Medicines'}
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'equipment' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'ইকুইপমেন্ট বিক্রি' : 'Equipment'}
          </button>
          <button
            onClick={() => setActiveTab('daily_ledger')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'daily_ledger' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'দৈনিক খাতা' : 'Daily Khata'}
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'staff' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'স্টাফ' : 'Staff'}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap ${
              activeTab === 'schedule' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            {lang === 'bn' ? 'সময়সূচী' : 'Hours'}
          </button>
        </div>
      </div>
    </header>
  );
};
