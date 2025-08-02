import React, { useEffect, useState } from "react";
import { Calendar, Clock, Edit3, ChevronLeft, ChevronRight, Plus, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientAppointView() {
  const [appointment, setAppointment] = useState({ date: null, time: null });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const date = localStorage.getItem("appointmentDate");
    const time = localStorage.getItem("appointmentTime");
    setAppointment({ date, time });
  }, []);

  const appointmentDateObj = appointment.date ? new Date(appointment.date) : null;
  const today = new Date();
  
  // Check if appointment has passed
  const isAppointmentPast = () => {
    if (!appointmentDateObj || !appointment.time) return false;
    
    const [time, period] = appointment.time.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let appointmentHours = hours;
    
    if (period === 'PM' && hours !== 12) appointmentHours += 12;
    if (period === 'AM' && hours === 12) appointmentHours = 0;
    
    const appointmentDateTime = new Date(appointmentDateObj);
    appointmentDateTime.setHours(appointmentHours, minutes, 0, 0);
    
    return appointmentDateTime < new Date();
  };
  
  const appointmentPassed = isAppointmentPast();

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const calendar = [];

    for (let i = 0; i < startDay; i++) calendar.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      calendar.push(new Date(currentYear, currentMonth, d));
    }
    return calendar;
  };

  const handleMonthChange = (dir) => {
    if (dir === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link to={"/patient-dashboard"} className="flex items-center gap-2 text-[#0A4D68] hover:text-[#083952] transition-colors mb-8 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Hero Header
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#0A4D68] to-[#083952] rounded-2xl mb-6 shadow-lg">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0A4D68] mb-4">
            Your Appointments
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            View and manage your scheduled appointments
          </p>
        </div> */}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar Card - Now First */}
          <div className="lg:col-span-2 lg:order-1 order-2">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#0A4D68] flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  Calendar View
                </h2>
                
                {/* Month Navigation */}
                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                  <button 
                    onClick={() => handleMonthChange("prev")}
                    className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <span className="text-lg font-semibold text-[#0A4D68] min-w-[140px] text-center">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  
                  <button 
                    onClick={() => handleMonthChange("next")}
                    className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-gray-50 rounded-2xl p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-500 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {generateCalendar().map((date, idx) => {
                    const isAppointmentDate = date && appointmentDateObj && 
                      date.toDateString() === appointmentDateObj.toDateString();
                    const isToday = date && date.toDateString() === today.toDateString();
                    const isPastDate = date && date < today && !isToday;

                    return (
                      <div key={idx} className="relative">
                        {date ? (
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200 cursor-pointer
                                ${isAppointmentDate 
                                  ? "bg-gradient-to-r from-[#0A4D68] to-[#083952] text-white shadow-lg transform scale-105" 
                                  : isToday
                                  ? "bg-gray-200 text-[#0A4D68] border-2 border-[#0A4D68]"
                                  : isPastDate
                                  ? "text-gray-400 bg-gray-100 cursor-not-allowed opacity-60"
                                  : "hover:bg-gray-200 text-gray-700 hover:text-[#0A4D68]"
                                }`}
                            >
                              {date.getDate()}
                            </div>
                            {isAppointmentDate && (
                              <div className={`mt-2 text-white text-xs px-2 py-1 rounded-full shadow-sm ${
                                appointmentPassed 
                                  ? "bg-gray-500" 
                                  : "bg-[#0A4D68]"
                              }`}>
                                {appointment.time}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-12 h-12" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Sidebar - Now Second */}
          <div className="space-y-6 lg:order-2 order-1">
            {/* Appointment Status Card */}
            {appointment.date && appointment.time ? (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    appointmentPassed 
                      ? "bg-gray-100" 
                      : "bg-green-100"
                  }`}>
                    <CheckCircle className={`w-6 h-6 ${
                      appointmentPassed 
                        ? "text-gray-500" 
                        : "text-green-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${
                      appointmentPassed 
                        ? "text-gray-600" 
                        : "text-[#0A4D68]"
                    }`}>
                      {appointmentPassed ? "Completed Appointment" : "Active Appointment"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {appointmentPassed ? "This appointment has ended" : "Your next scheduled visit"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className={`flex items-center gap-4 p-4 rounded-xl ${
                    appointmentPassed 
                      ? "bg-gray-100" 
                      : "bg-gray-50"
                  }`}>
                    <Calendar className="w-5 h-5 text-[#0A4D68]" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Date</p>
                      <p className={`text-lg font-semibold ${
                        appointmentPassed 
                          ? "text-gray-600" 
                          : "text-gray-800"
                      }`}>
                        {appointment.date}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-4 p-4 rounded-xl ${
                    appointmentPassed 
                      ? "bg-gray-100" 
                      : "bg-gray-50"
                  }`}>
                    <Clock className="w-5 h-5 text-[#0A4D68]" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Time</p>
                      <p className={`text-lg font-semibold ${
                        appointmentPassed 
                          ? "text-gray-600" 
                          : "text-gray-800"
                      }`}>
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                </div>

                {appointmentPassed ? (
                  <div className="w-full bg-gray-300 text-gray-600 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-medium cursor-not-allowed">
                    <CheckCircle className="w-5 h-5" />
                    Appointment Completed
                  </div>
                ) : (
                  <button className="w-full bg-gradient-to-r from-[#0A4D68] to-[#083952] text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                    <Edit3 className="w-5 h-5" />
                    Modify Appointment
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-[#0A4D68] mb-4">No Appointments</h3>
                <p className="text-gray-500 mb-8">You don't have any upcoming appointments scheduled.</p>
                
                <button className="w-full bg-gradient-to-r from-[#0A4D68] to-[#083952] text-white py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <Plus className="w-5 h-5" />
                  Schedule Appointment
                </button>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-[#0A4D68] mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-[#0A4D68] transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">View All Appointments</p>
                    <p className="text-sm text-gray-500">See your appointment history</p>
                  </div>
                </button>
 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}