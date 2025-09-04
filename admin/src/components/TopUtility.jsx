// The Top part of the dashboard.
import { Button, Dropdown, TextInput } from "flowbite-react";
import { FiFilter, FiSearch, FiCalendar } from "react-icons/fi";

const Dot = ({ color }) => (
  <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: color }} />
);

export default function TopUtility() {
  return (
    <div className="space-y-4">
  
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Event Management Section</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button color="gray" className="!rounded-xl">
            <FiFilter className="mr-2" /> Filter
          </Button>
          <div className="w-64">
            <TextInput icon={FiSearch} placeholder="Search..." className="!rounded-xl" />
          </div>
          <Dropdown label="Sort By" dismissOnClick={true}>
            <Dropdown.Item>Date</Dropdown.Item>
            <Dropdown.Item>Status</Dropdown.Item>
            <Dropdown.Item>Venue</Dropdown.Item>
          </Dropdown>
          <Dropdown label="Status">
            <Dropdown.Item>Upcoming</Dropdown.Item>
            <Dropdown.Item>Pending</Dropdown.Item>
            <Dropdown.Item>Closed</Dropdown.Item>
          </Dropdown>
          <Button color="gray" className="!rounded-xl">
            <FiCalendar className="mr-2" /> Pick Date
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Dot color="#3B82F6" /> Up-Coming Events
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Dot color="#F59E0B" /> Pending Events
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Dot color="#EF4444" /> Closed Events
        </div>
      </div>
    </div>
  );
}
