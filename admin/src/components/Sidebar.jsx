// Admin Sidebar Component
// This component is used to display the sidebar for the admin dashboard.
import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; 
import { MdDashboardCustomize, MdSupportAgent } from "react-icons/md";
import { PiCalendarStarDuotone } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { TbDeviceAnalytics, TbBellPlus } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { GiMegaphone } from "react-icons/gi";
import { AiOutlineFolderOpen, AiOutlineBarChart } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const doLogout = () => {
    logout();
    navigate("/auth/login");
  };


  return (
    <aside className="flex-col w-[248px] min-h-screen bg-[#111315] text-white rounded ">
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => navigate("/admin/event-form")}
          className="w-9 h-9 rounded-xl bg-[#00ff5e] grid place-items-center font-extrabold hover:bg-[#00e85a] transition-colors"
          title="Add Quick Event" aria-label="Add Quick Event"
        >
          +
        </button>
        <div className="ml-3 leading-tight">
          <div className="text-sm font-semibold">Add Quick Event</div>
          <div className="text-[11px] text-gray-400">Events</div>
        </div>
      </div>

      <Sidebar aria-label="Admin sidebar" className="!bg-transparent">
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarCollapse label="Main Navigation" open>
              <SidebarItem href="#" onClick={(e)=>{e.preventDefault();navigate("/admin/dashboard");}}>
                <MdDashboardCustomize className="mr-3" /> Dashboard
              </SidebarItem>
              <SidebarItem href="#" onClick={(e)=>{e.preventDefault();navigate("/admin/manage-events");}}>
                <PiCalendarStarDuotone className="mr-3" /> Manage Events
              </SidebarItem>
              <SidebarItem href="#" onClick={(e)=>{e.preventDefault();navigate("/admin/tickets");}}>
                <IoTicketOutline className="mr-3" /> Booking & Tickets
              </SidebarItem>
              <SidebarItem href="#" onClick={(e)=>{e.preventDefault();navigate("/admin/attendees");}}>
                <TbDeviceAnalytics className="mr-3" /> Attendee Insights
              </SidebarItem>
              <SidebarItem href="#" onClick={(e)=>{e.preventDefault();navigate("/admin/reports");}}>
                <AiOutlineBarChart className="mr-3" /> Analytics & Reports
              </SidebarItem>
            </SidebarCollapse>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarCollapse label="Support & Management" open>
              <SidebarItem href="#"><MdSupportAgent className="mr-3" /> Contact Support</SidebarItem>
              <SidebarItem href="#"><TbBellPlus className="mr-3" /> Notifications</SidebarItem>
              <SidebarItem href="#"><LuSettings className="mr-3" /> Settings</SidebarItem>
            </SidebarCollapse>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarCollapse label="Additional Features" open>
              <SidebarItem href="#"><GiMegaphone className="mr-3" /> Marketing</SidebarItem>
              <SidebarItem href="#"><AiOutlineFolderOpen className="mr-3" /> Event Categories</SidebarItem>
            </SidebarCollapse>
          </SidebarItemGroup>

          <SidebarItemGroup>
            <SidebarCollapse label="Account Management" open>
              <SidebarItem href="#"><FiUserPlus className="mr-3" /> Manage Users</SidebarItem>
              <SidebarItem href="#" onClick={(e)=>{ e.preventDefault(); doLogout(); }}>
                <IoIosLogOut className="mr-3" /> Logout
              </SidebarItem>
            </SidebarCollapse>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>
    </aside>
  );
}
