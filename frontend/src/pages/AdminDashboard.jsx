import React from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  LayoutDashboard, ShoppingCart, Users, CreditCard, ClipboardList, 
  BarChart2, User, Settings, LogOut, Search, Printer, Share2, 
  ChevronDown, MoreVertical, ArrowUp, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

// --- Mock Data ---

const revenueData = [
  { name: 'Jan', value: 300000 },
  { name: 'Feb', value: 350000 },
  { name: 'Mar', value: 320000 },
  { name: 'Apr', value: 450000 },
  { name: 'May', value: 380000 },
  { name: 'Jun', value: 550000 },
  { name: 'Jul', value: 480000 },
  { name: 'Aug', value: 650000 },
  { name: 'Sep', value: 580000 },
  { name: 'Oct', value: 400000 },
  { name: 'Nov', value: 520000 },
  { name: 'Dec', value: 490000 },
];

const topSellingData = [
  { name: 'Samsung S20', value: 14000, color: '#8b5cf6' },
  { name: 'Iphone 15 Pro', value: 20000, color: '#ef4444' },
  { name: 'Iphone 13', value: 10000, color: '#f59e0b' },
  { name: 'Del PC', value: 12000, color: '#10b981' },
];

const sparklineData = [
  { v: 40 }, { v: 30 }, { v: 60 }, { v: 45 }, { v: 80 }, { v: 55 }, { v: 90 }
];

const transactions = [
  { id: 'PL9W2I292HR', customer: 'Miguel Martin', email: 'Martin@gmail.com', product: 'Iphone 14 Pro', status: 'Successful' },
  { id: 'PL2837302HR', customer: 'Tonia Griffin', email: 'Tonia@gmail.com', product: 'Del 230 Pc', status: 'Successful' },
  { id: 'PL23454219HR', customer: 'Ademola Titi', email: 'Adeola@gmail.com', product: 'Redmi Note 13 Pro', status: 'Pending' },
  { id: 'PL69878002HR', customer: 'Yusuf Olamide', email: 'Ola@gmail.com', product: 'Macbook M1', status: 'Successful' },
  { id: 'PL874789833HR', customer: 'Gorge Kimberly', email: 'Kimber@gmail.com', product: 'Iphone 16', status: 'Failed' },
];

// --- Sub-components ---

const SidebarItem = ({ icon: Icon, label, active = false, bottom = false }) => (
  <a 
    href="#" 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-purple-50 text-purple-600 font-semibold shadow-sm shadow-purple-100' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    } ${bottom ? 'mt-auto' : ''}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
    <span className="text-sm">{label}</span>
  </a>
);

const StatCardSparkline = ({ color }) => (
  <div className="w-16 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sparklineData}>
        <Bar dataKey="v" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const StatCard = ({ label, value, change, isUp, color, icon: Icon, purpleTheme = false }) => (
  <div className={`rounded-[24px] p-6 border shadow-sm transition-all duration-300 group flex flex-col justify-between h-[180px] ${
    purpleTheme 
      ? 'bg-purple-600 border-purple-500 text-white shadow-purple-200 shadow-xl' 
      : 'bg-white border-gray-100 text-gray-900 hover:shadow-md'
  }`}>
    <div className="flex justify-between items-start">
      <div className={`p-2.5 rounded-xl ${purpleTheme ? 'bg-white/20' : 'bg-gray-50 text-gray-400'}`}>
        <Icon className={`w-5 h-5 ${purpleTheme ? 'text-white' : ''}`} />
      </div>
      <button className={purpleTheme ? 'text-white/50 hover:text-white' : 'text-gray-300 hover:text-gray-600'}>
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
    
    <div className="mt-auto space-y-1">
      <p className={`text-[11px] font-bold uppercase tracking-wider ${purpleTheme ? 'text-white/70' : 'text-gray-400'}`}>
        {label}
      </p>
      <div className="flex items-end justify-between">
        <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
        <StatCardSparkline color={purpleTheme ? '#ffffff' : color} />
      </div>
    </div>

    <div className="flex items-center gap-2 mt-3">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
        purpleTheme 
          ? 'bg-white/20 text-white' 
          : isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
      }`}>
        {change}
      </span>
      <span className={`text-[10px] font-medium ${purpleTheme ? 'text-white/60' : 'text-gray-400'}`}>
        than last month
      </span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-purple-600 text-white p-3 rounded-xl shadow-xl border border-white/20">
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-tight">July 07 - 2025</p>
        <p className="text-sm font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const StatusBadge = ({ status }) => {
  const configs = {
    Successful: { icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    Pending: { icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
    Failed: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  };

  const { icon: Icon, bg, text, border } = configs[status] || configs.Pending;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${bg} ${text} ${border}`}>
      <Icon className="w-3 h-3 opacity-70" />
      {status}
    </span>
  );
};

const AdminDashboard = () => {
  return (
    <div className="flex bg-[#fcfcfd] text-gray-900 font-sans min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen shrink-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2 shrink-0">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-purple-600">Shoplytics</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-4 shrink-0">Main Menu</p>
          <div className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={ShoppingCart} label="Orders" />
            <SidebarItem icon={Users} label="Customers" />
            <SidebarItem icon={CreditCard} label="Payments" />
            <SidebarItem icon={ClipboardList} label="Inventory Management" />
            <SidebarItem icon={BarChart2} label="Reports & Analytics" />
            <SidebarItem icon={User} label="User Profile" />
            <SidebarItem icon={Settings} label="Settings" />
          </div>
          <SidebarItem icon={LogOut} label="Log Out" bottom />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40 shrink-0">
          <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything ..." 
                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm w-72 focus:ring-2 focus:ring-purple-500/10 transition-all outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                <Printer className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-100 mx-2" />

            <div className="flex items-center gap-3">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Allen" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
              />
              <div className="text-left hidden xl:block leading-tight">
                <p className="text-sm font-bold text-gray-900">Allen Walker</p>
                <p className="text-[11px] text-gray-500">Allenwalker@gmail.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="p-8 lg:p-10 space-y-10">
          {/* Welcome Area */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back, Ola!</h2>
              <p className="text-sm text-gray-500 mt-0.5">Check what's happening with your store today.</p>
            </div>
            <button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:shadow-sm transition-all shadow-transparent">
              05 Jan - 28 June 2025
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Total Sales" value="$35,892.82" change="+16.9%" isUp 
              color="#ffffff" icon={CreditCard} purpleTheme 
            />
            <StatCard 
              label="Total Customers" value="82" change="-7.1%" isUp={false} 
              color="#ef4444" icon={Users} 
            />
            <StatCard 
              label="Total Orders Completed" value="165" change="+16.9%" isUp 
              color="#10b981" icon={CheckCircle2} 
            />
            <StatCard 
              label="Total Orders Cancelled" value="3" change="-1.9%" isUp={false} 
              color="#ef4444" icon={AlertCircle} 
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Total Revenue</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">$356,892.82</span>
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ArrowUp className="w-3 h-3" /> 16.9%
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-500 rounded-lg hover:bg-gray-100 transition-colors uppercase tracking-wider">
                  This Year <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>

              <div className="h-[350px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="100%">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="0" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dy={15}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <h3 className="text-lg font-bold text-gray-800">Top Selling Items</h3>
                <MoreVertical className="w-5 h-5 text-gray-300 cursor-pointer" />
              </div>
              
              <div className="mb-8 shrink-0">
                <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">$55,998.89</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                    <ArrowUp className="w-3 h-3" /> 16.9%
                  </span>
                  <span className="text-sm text-gray-400">Last Month</span>
                </div>
              </div>

              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSellingData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <Bar dataKey="value" radius={[14, 14, 14, 14]} barSize={45}>
                      {topSellingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-y-5 mt-10 shrink-0">
                {topSellingData.map((item) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-10">
            <div className="p-8 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Transaction History</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all">
                05 Jan - 28 June 2025
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-5 w-10">
                      <input type="checkbox" className="rounded-md border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4" />
                    </th>
                    <th className="px-6 py-5">Order ID <ChevronDown className="inline w-3 h-3 opacity-30 ml-1" /></th>
                    <th className="px-6 py-5">Customer's Name <ChevronDown className="inline w-3 h-3 opacity-30 ml-1" /></th>
                    <th className="px-6 py-5">Email <ChevronDown className="inline w-3 h-3 opacity-30 ml-1" /></th>
                    <th className="px-6 py-5">Product <ChevronDown className="inline w-3 h-3 opacity-30 ml-1" /></th>
                    <th className="px-8 py-5 text-center">Status <ChevronDown className="inline w-3 h-3 opacity-30 ml-1" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-purple-50/30 transition-all duration-300">
                      <td className="px-8 py-6">
                        <input type="checkbox" className="rounded-md border-gray-200 text-purple-600 focus:ring-purple-500 h-4 w-4" />
                      </td>
                      <td className="px-6 py-6 font-bold text-gray-900 text-sm tracking-tight">{t.id}</td>
                      <td className="px-6 py-6 font-bold text-gray-900 text-sm">{t.customer}</td>
                      <td className="px-6 py-6 font-medium text-gray-500 text-sm">{t.email}</td>
                      <td className="px-6 py-6 font-medium text-gray-600 text-sm">{t.product}</td>
                      <td className="px-8 py-6 text-center">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
