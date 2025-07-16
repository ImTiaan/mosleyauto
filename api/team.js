// Vercel Serverless Function for Team Management
const fs = require('fs');
const path = require('path');
const Status = require('http-status-codes');

const { readFileSync, writeFileSync, existsSync } = fs;
const { join } = path;

const DATA_FILE = join(process.cwd(), 'data', 'team.json');

// Initialize data file if it doesn't exist
function initializeDataFile() {
    if (!existsSync(DATA_FILE)) {
        const initialData = {
            team: [
                {
                    id: 1,
                    name: "Big Mike Mosley",
                    role: "Owner & CEO",
                    bio: "Mike's been selling cars in Los Santos for over 20 years! He knows EVERY car on the lot and will get you the BEST DEAL possible! No one beats Big Mike's prices!",
                    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                },
                {
                    id: 2,
                    name: "Sarah 'Speed' Rodriguez",
                    role: "Sales Manager",
                    bio: "Sarah knows FAST cars! She's our sports car specialist and can tell you everything about horsepower, torque, and getting the MAXIMUM performance from your ride!",
                    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
                },
                {
                    id: 3,
                    name: "Tommy 'The Deal' Johnson",
                    role: "Finance Specialist",
                    bio: "Tommy can get ANYONE financed! Bad credit? No credit? NO PROBLEM! Tommy will work his magic and get you driving TODAY with payments you can afford!",
                    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                },
                {
                    id: 4,
                    name: "Lisa 'Luxury' Chen",
                    role: "Luxury Car Specialist",
                    bio: "Looking for something SPECIAL? Lisa handles our premium vehicles and knows how to match you with the car of your DREAMS! Only the finest for our VIP customers!",
                    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
                }
            ]
        };
        
        try {
            writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        } catch (error) {
            console.error('Error initializing team data file:', error);
        }
    }
}

// Read team data
function readTeam() {
    try {
        initializeDataFile();
        const data = readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading team:', error);
        return { team: [] };
    }
}

// Write team data
function writeTeam(data) {
    // Check if we're in Vercel production environment (read-only filesystem)
    if (process.env.READ_ONLY_FILESYSTEM === 'true') {
        console.log('Running in read-only filesystem mode. Data changes will not be persisted.');
        // In production, we'll simulate success without actually writing to the filesystem
        return true;
    }
    
    try {
        writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing team:', error);
        return false;
    }
}

module.exports = function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        return res.status(Status.OK).end();
    }
    
    try {
        switch (req.method) {
            case 'GET':
                // Get all team members (public endpoint)
                const data = readTeam();
                return res.status(Status.OK).json({
                    success: true,
                    team: data.team || []
                });
                
            case 'POST':
                // Add new team member (admin only)
                const { adminKey, member } = req.body;
                
                // Simple admin authentication
                if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'mosley2024') {
                    return res.status(Status.UNAUTHORIZED).json({
                        success: false,
                        message: 'Unauthorized access'
                    });
                }
                
                if (!member || !member.name || !member.role) {
                    return res.status(Status.BAD_REQUEST).json({
                        success: false,
                        message: 'Missing required member information (name and role)'
                    });
                }
                
                const currentData = readTeam();
                const newId = Math.max(...currentData.team.map(m => m.id || 0), 0) + 1;
                
                const newMember = {
                    id: newId,
                    name: member.name,
                    role: member.role,
                    bio: member.bio || 'Great team member!',
                    photo: member.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
                };
                
                // In production with read-only filesystem, we'll simulate adding the team member
                if (process.env.READ_ONLY_FILESYSTEM === 'true') {
                    console.log('Simulating team member addition in read-only mode:', newMember);
                    return res.status(Status.CREATED).json({
                        success: true,
                        message: 'Team member added successfully (demo mode - changes not persisted)',
                        member: newMember
                    });
                }
                
                // In development or with writable filesystem, actually save the data
                currentData.team.push(newMember);
                
                if (writeTeam(currentData)) {
                    return res.status(Status.CREATED).json({
                        success: true,
                        message: 'Team member added successfully',
                        member: newMember
                    });
                } else {
                    return res.status(Status.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to save team member'
                    });
                }
                
            case 'DELETE':
                // Delete team member (admin only)
                const { adminKey: deleteAdminKey, memberId } = req.body;
                
                if (deleteAdminKey !== process.env.ADMIN_KEY && deleteAdminKey !== 'mosley2024') {
                    return res.status(Status.UNAUTHORIZED).json({
                        success: false,
                        message: 'Unauthorized access'
                    });
                }
                
                if (!memberId) {
                    return res.status(Status.BAD_REQUEST).json({
                        success: false,
                        message: 'Member ID is required'
                    });
                }
                
                const deleteData = readTeam();
                const memberIndex = deleteData.team.findIndex(m => m.id === parseInt(memberId));
                
                if (memberIndex === -1) {
                    return res.status(Status.NOT_FOUND).json({
                        success: false,
                        message: 'Team member not found'
                    });
                }
                
                const deletedMember = deleteData.team[memberIndex];
                
                // In production with read-only filesystem, we'll simulate deleting the team member
                if (process.env.READ_ONLY_FILESYSTEM === 'true') {
                    console.log('Simulating team member deletion in read-only mode:', deletedMember);
                    return res.status(Status.OK).json({
                        success: true,
                        message: 'Team member deleted successfully (demo mode - changes not persisted)',
                        member: deletedMember
                    });
                }
                
                // In development or with writable filesystem, actually save the data
                deleteData.team.splice(memberIndex, 1);
                
                if (writeTeam(deleteData)) {
                    return res.status(Status.OK).json({
                        success: true,
                        message: 'Team member deleted successfully',
                        member: deletedMember
                    });
                } else {
                    return res.status(Status.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to delete team member'
                    });
                }
                
            default:
                return res.status(Status.METHOD_NOT_ALLOWED).json({
                    success: false,
                    message: 'Method not allowed'
                });
        }
    } catch (error) {
        console.error('Team API Error:', error);
        return res.status(Status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Internal server error'
        });
    }
}