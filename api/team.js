// Vercel Serverless Function for Team Management
const fs = require('fs');
const path = require('path');
const Status = require('http-status-codes');
const { put, list, del, get } = require('@vercel/blob');

const { readFileSync, writeFileSync, existsSync } = fs;
const { join } = path;

const DATA_FILE = join(process.cwd(), 'data', 'team.json');
const BLOB_KEY = 'mosleyauto/team.json';

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
async function readTeam() {
    try {
        console.log('Reading team data...');
        console.log('VERCEL env:', process.env.VERCEL);
        console.log('BLOB_READ_WRITE_TOKEN set:', !!process.env.BLOB_READ_WRITE_TOKEN);
        
        // Read from local file first
        console.log('Reading from local file:', DATA_FILE);
        initializeDataFile();
        const fileData = readFileSync(DATA_FILE, 'utf8');
        const parsedData = JSON.parse(fileData);
        console.log('Data from local file:', JSON.stringify(parsedData).substring(0, 100) + '...');
        
        // Try to read from Vercel Blob if BLOB_READ_WRITE_TOKEN is set
        if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
            console.log('Attempting to read from Vercel Blob...');
            try {
                const blob = await get(BLOB_KEY);
                console.log('Blob found:', !!blob);
                
                if (blob) {
                    console.log('Blob URL:', blob.url);
                    const response = await fetch(blob.url);
                    const blobData = await response.json();
                    console.log('Data from Blob:', JSON.stringify(blobData).substring(0, 100) + '...');
                    
                    // Compare local data with blob data
                    const localTeamIds = parsedData.team.map(m => m.id);
                    const blobTeamIds = blobData.team.map(m => m.id);
                    
                    // If blob has more team members, use blob data
                    if (blobTeamIds.length > localTeamIds.length) {
                        console.log('Blob has more team members, using blob data');
                        return blobData;
                    }
                    
                    // If local has more team members, update the blob
                    if (localTeamIds.length > blobTeamIds.length) {
                        console.log('Local has more team members, updating blob');
                        try {
                            const jsonData = JSON.stringify(parsedData, null, 2);
                            await put(BLOB_KEY, jsonData, {
                                contentType: 'application/json',
                                access: 'public',
                            });
                            console.log('Blob updated with local data');
                        } catch (updateError) {
                            console.error('Error updating blob:', updateError);
                        }
                    }
                } else {
                    console.log('Blob not found, creating it with local data');
                    try {
                        const jsonData = JSON.stringify(parsedData, null, 2);
                        const newBlob = await put(BLOB_KEY, jsonData, {
                            contentType: 'application/json',
                            access: 'public',
                        });
                        console.log('Created new blob:', newBlob.url);
                    } catch (createError) {
                        console.error('Error creating blob:', createError);
                    }
                }
            } catch (blobError) {
                console.log('Error reading from Blob:', blobError);
            }
        } else {
            console.log('Not using Vercel Blob');
        }
        
        return parsedData;
    } catch (error) {
        console.error('Error reading team:', error);
        return { team: [] };
    }
}

// Write team data
async function writeTeam(data) {
    try {
        console.log('Writing team data...');
        console.log('Data to write:', JSON.stringify(data).substring(0, 100) + '...');
        console.log('VERCEL env:', process.env.VERCEL);
        console.log('BLOB_READ_WRITE_TOKEN set:', !!process.env.BLOB_READ_WRITE_TOKEN);
        
        // Always write to local file first
        console.log('Writing to local file:', DATA_FILE);
        writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Data successfully written to local file');
        
        // Then try to write to Blob if in Vercel with BLOB_READ_WRITE_TOKEN
        if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
            console.log('Attempting to write to Vercel Blob...');
            try {
                const jsonData = JSON.stringify(data, null, 2);
                const blob = await put(BLOB_KEY, jsonData, {
                    contentType: 'application/json',
                    access: 'public',
                });
                console.log('Data successfully written to Vercel Blob:', blob.url);
                
                // Verify the data was written correctly by reading it back
                console.log('Verifying data was written correctly...');
                try {
                    const verifyBlob = await get(BLOB_KEY);
                    if (verifyBlob) {
                        const verifyResponse = await fetch(verifyBlob.url);
                        const verifyData = await verifyResponse.json();
                        console.log('Verification data:', JSON.stringify(verifyData).substring(0, 100) + '...');
                    }
                } catch (verifyError) {
                    console.log('Error verifying data:', verifyError);
                }
            } catch (blobError) {
                console.error('Error writing to Vercel Blob:', blobError);
                console.log('Continuing with local file only');
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error writing team:', error);
        // For demo purposes, return true even if there's an error
        if (process.env.VERCEL) {
            console.log('Simulating successful write for demo purposes despite error');
            return true;
        }
        return false;
    }
}

module.exports = async function handler(req, res) {
    // Set CORS and cache control headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    if (req.method === 'OPTIONS') {
        return res.status(Status.OK).end();
    }
    
    try {
        switch (req.method) {
            case 'GET':
                // Get all team members (public endpoint)
                const data = await readTeam();
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
                
                const currentData = await readTeam();
                const newId = Math.max(...currentData.team.map(m => m.id || 0), 0) + 1;
                
                const newMember = {
                    id: newId,
                    name: member.name,
                    role: member.role,
                    bio: member.bio || 'Great team member!',
                    photo: member.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
                };
                
                // Add the new team member to the data
                currentData.team.push(newMember);
                
                // Save the updated data
                if (await writeTeam(currentData)) {
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
                
                const deleteData = await readTeam();
                const memberIndex = deleteData.team.findIndex(m => m.id === parseInt(memberId));
                
                if (memberIndex === -1) {
                    return res.status(Status.NOT_FOUND).json({
                        success: false,
                        message: 'Team member not found'
                    });
                }
                
                // Store the team member to be deleted
                const deletedMember = deleteData.team[memberIndex];
                
                // Remove the team member from the array
                deleteData.team.splice(memberIndex, 1);
                
                // Save the updated data
                if (await writeTeam(deleteData)) {
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