// This file contains the functions for getting user analytics and exporting it to Excel or CSV.
import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import ExcelJS from 'exceljs';
import {Parser} from 'json2csv';


// Get user analytics: total revenue, tickets sold, attendees (unique users)

export const getOverview = async (req, res) => {
    try {
    const revenueAgg = await Booking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$price" }, ticketsSold: { $sum: 1 } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const ticketsSold = revenueAgg[0]?.ticketsSold || 0;

    const attendeesCount = await Booking.aggregate([
        { $group: { _id: "$user" } },
        { $count: "attendees" }]);
        const attendees = attendeesCount[0]?.attendees || 0;

    res.json({ totalRevenue, ticketsSold, attendees });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });



    }
};

// Get user demographics: age distribution, gender distribution, interests distribution, location distribution
export const getDemographics= async (req, res) => {
    try {

      
      const users = await User.find();

    const genders={};
    const interests={};
    const locations={};
    const ageDistribution = { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 , 'unknown':0};
    users.forEach(user => {
        const age = user.age;
        if(!age) ageDistribution['unknown']++;
        else if (age >= 18 && age <= 24) ageDistribution['18-24']++;
        else if (age >= 25 && age <= 34) ageDistribution['25-34']++;
        else if (age >= 35 && age <= 44) ageDistribution['35-44']++;
        else if (age >= 45 && age <= 54) ageDistribution['45-54']++;
        else ageDistribution['55+']++;

        genders[user.gender||'unknown'] = (genders[user.gender||'unknown']||0)+1;

        if (user.interests && user.interests.length) user.interests.forEach(i => interests[i] = (interests[i] || 0) + 1);
      locations[user.location || "unknown"] = (locations[user.location || "unknown"] || 0) + 1;
    });

    res.json({ ageDistribution, genders, interests, locations });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export user analytics to Excel or CSV
export const exportReportCSV = async (req, res) => {
    try{
        const bookings = await Booking.find().populate('user event').lean();

        const data = bookings.map(b => ({
            bookingID: b._id.toString(),
            eventTitle: b.event?.title || "",
            userEmail: b.user?.email || "",
            price: b.price,
            seat:b.seatNum,
            date:b.createdAt
        }));
        const parser = new Parser();
        const csv = parser.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('user_analytics.csv');
        return res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }   
};

export const exportReportExcel = async (req, res) => {
    try{
        const bookings = await Booking.find().populate('user event').lean();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Analytics');
        worksheet.columns = [
            { header: 'Booking ID', key: 'bookingID' },
            { header: 'Event', key: 'eventTitle' },
            { header: 'User', key: 'userEmail' },
            { header: 'Price', key: 'price' },
            { header: 'Seat', key:'seat' },
            { header: 'Date', key: 'date' }
        ];

        bookings.forEach(b => {
            worksheet.addRow({
                bookingID: b._id.toString(),
                eventTitle: b.event?.title || "",
                userEmail: b.user?.email || "",
                price: b.price,
                seat:b.seatNum,
                date:b.createdAt
            });
        });
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', 'attachment; filename="user_analytics.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};