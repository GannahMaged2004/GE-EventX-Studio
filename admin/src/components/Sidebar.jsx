"use client";

import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdDashboardCustomize, MdSupportAgent } from "react-icons/md";
import { TbBellPlus } from "react-icons/tb";
import { LuSettings } from "react-icons/lu";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { FiUserPlus } from "react-icons/fi";
import { PiCalendarStarDuotone } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { GiMegaphone } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";

export default function AdminSidebar() {
  return (
      <Sidebar aria-label="Sidebar with multi-level dropdown example" className="bg-red-50">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarCollapse  label="Main Navigation">
            <SidebarItem href="/admin/Dashboard" > <MdDashboardCustomize />Dashboard</SidebarItem>
            <SidebarItem href="/admin/ManageEvents" ><PiCalendarStarDuotone />Manage Events</SidebarItem>
            <SidebarItem href="#"><IoTicketOutline />Booking & Tickets</SidebarItem>
            <SidebarItem href="/admin/AttendeeInsights"><TbDeviceAnalytics />Attendee Insights</SidebarItem>
          </SidebarCollapse>
          </SidebarItemGroup>
          <SidebarItemGroup>
            <SidebarCollapse  label="Support & Management">
            <SidebarItem href="#" > <MdSupportAgent />Contact Support</SidebarItem>
            <SidebarItem href="#" ><TbBellPlus />Notifcations</SidebarItem>
            <SidebarItem href="#"><LuSettings />Settings</SidebarItem>
          </SidebarCollapse>
          </SidebarItemGroup>
            <SidebarItemGroup>
            <SidebarCollapse  label="Additional Features">
            <SidebarItem href="#" > <GiMegaphone />Marketing</SidebarItem>
            <SidebarItem href="#" ><AiOutlineFolderOpen  />Event Categories</SidebarItem>
          </SidebarCollapse>
          </SidebarItemGroup>

            <SidebarItemGroup>
            <SidebarCollapse  label="Account Management">
            <SidebarItem href="#" > <FiUserPlus />Manage Users</SidebarItem>
            <SidebarItem href="#" ><IoIosLogOut />Logout</SidebarItem>
          </SidebarCollapse>
          </SidebarItemGroup>



      </SidebarItems>
    </Sidebar>

  );
}
