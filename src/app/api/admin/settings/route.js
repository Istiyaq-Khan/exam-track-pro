// app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// In-memory settings store (in production, use a database)
let siteSettings = {
  siteName: 'SSC Exam Tracker',
  siteDescription: 'Your comprehensive platform for SSC exam preparation',
  maintenanceMode: false,
  registrationEnabled: true,
  maxUploadSize: 10, // MB
  allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
  emailNotifications: true,
  autoBackup: true,
  maxUsersPerTeacher: 50,
  examReminderDays: 3,
  studyStreakRewards: true,
  version: '1.0.0',
  lastUpdated: new Date(),
  features: {
    blogging: true,
    examTracking: true,
    studyMaterials: true,
    teacherStudentConnect: true,
    messaging: true,
    analytics: true
  }
};

// GET - Retrieve current settings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // Optional category filter
    
    // You could fetch settings from database here
    // const settings = await SettingsModel.findOne();
    
    let responseData = siteSettings;
    
    if (category) {
      switch (category) {
        case 'general':
          responseData = {
            siteName: siteSettings.siteName,
            siteDescription: siteSettings.siteDescription,
            maintenanceMode: siteSettings.maintenanceMode,
            version: siteSettings.version
          };
          break;
        case 'user':
          responseData = {
            registrationEnabled: siteSettings.registrationEnabled,
            maxUsersPerTeacher: siteSettings.maxUsersPerTeacher,
            studyStreakRewards: siteSettings.studyStreakRewards
          };
          break;
        case 'upload':
          responseData = {
            maxUploadSize: siteSettings.maxUploadSize,
            allowedFileTypes: siteSettings.allowedFileTypes
          };
          break;
        case 'features':
          responseData = {
            features: siteSettings.features
          };
          break;
        default:
          responseData = siteSettings;
      }
    }
    
    return NextResponse.json({
      success: true,
      settings: responseData
    });
    
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve settings' },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request) {
  try {
    await dbConnect();
    
    const updates = await request.json();
    const { adminId, ...settingsUpdates } = updates;
    
    // Verify admin permissions
    if (adminId) {
      const admin = await User.findOne({ uid: adminId });
      if (!admin || !admin.isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
    }
    
    // Validate settings
    const validationErrors = validateSettings(settingsUpdates);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }
    
    // Update settings (in production, save to database)
    siteSettings = {
      ...siteSettings,
      ...settingsUpdates,
      lastUpdated: new Date()
    };
    
    // Log the settings change
    console.log(`Settings updated by admin ${adminId}:`, settingsUpdates);
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: siteSettings
    });
    
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// POST - Reset settings to default
export async function POST(request) {
  try {
    await dbConnect();
    
    const { action, adminId } = await request.json();
    
    // Verify admin permissions
    if (adminId) {
      const admin = await User.findOne({ uid: adminId });
      if (!admin || !admin.isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
    }
    
    if (action === 'reset') {
      // Reset to default settings
      siteSettings = {
        siteName: 'SSC Exam Tracker',
        siteDescription: 'Your comprehensive platform for SSC exam preparation',
        maintenanceMode: false,
        registrationEnabled: true,
        maxUploadSize: 10,
        allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
        emailNotifications: true,
        autoBackup: true,
        maxUsersPerTeacher: 50,
        examReminderDays: 3,
        studyStreakRewards: true,
        version: '1.0.0',
        lastUpdated: new Date(),
        features: {
          blogging: true,
          examTracking: true,
          studyMaterials: true,
          teacherStudentConnect: true,
          messaging: true,
          analytics: true
        }
      };
      
      return NextResponse.json({
        success: true,
        message: 'Settings reset to default',
        settings: siteSettings
      });
    }
    
    if (action === 'backup') {
      // Create settings backup
      const backup = {
        timestamp: new Date(),
        settings: { ...siteSettings },
        adminId: adminId
      };
      
      // In production, save backup to database or file storage
      console.log('Settings backup created:', backup);
      
      return NextResponse.json({
        success: true,
        message: 'Settings backup created',
        backup: backup
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Settings action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific setting or reset category
export async function DELETE(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const settingKey = searchParams.get('key');
    const category = searchParams.get('category');
    const adminId = searchParams.get('adminId');
    
    // Verify admin permissions
    if (adminId) {
      const admin = await User.findOne({ uid: adminId });
      if (!admin || !admin.isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
    }
    
    if (settingKey) {
      // Delete specific setting (reset to default)
      const defaultSettings = {
        siteName: 'SSC Exam Tracker',
        maintenanceMode: false,
        registrationEnabled: true,
        maxUploadSize: 10
      };
      
      if (defaultSettings.hasOwnProperty(settingKey)) {
        siteSettings[settingKey] = defaultSettings[settingKey];
        siteSettings.lastUpdated = new Date();
        
        return NextResponse.json({
          success: true,
          message: `Setting '${settingKey}' reset to default`,
          settings: siteSettings
        });
      }
      
      return NextResponse.json(
        { error: 'Invalid setting key' },
        { status: 400 }
      );
    }
    
    if (category) {
      // Reset category to defaults
      switch (category) {
        case 'upload':
          siteSettings.maxUploadSize = 10;
          siteSettings.allowedFileTypes = ['pdf', 'doc', 'docx'];
          break;
        case 'features':
          siteSettings.features = {
            blogging: true,
            examTracking: true,
            studyMaterials: true,
            teacherStudentConnect: true,
            messaging: true,
            analytics: true
          };
          break;
        default:
          return NextResponse.json(
            { error: 'Invalid category' },
            { status: 400 }
          );
      }
      
      siteSettings.lastUpdated = new Date();
      
      return NextResponse.json({
        success: true,
        message: `Category '${category}' reset to defaults`,
        settings: siteSettings
      });
    }
    
    return NextResponse.json(
      { error: 'Missing key or category parameter' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Delete settings error:', error);
    return NextResponse.json(
      { error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
}

// Helper function to validate settings
function validateSettings(settings) {
  const errors = [];
  
  if (settings.siteName && settings.siteName.length > 100) {
    errors.push('Site name must be less than 100 characters');
  }
  
  if (settings.maxUploadSize && (settings.maxUploadSize < 1 || settings.maxUploadSize > 100)) {
    errors.push('Max upload size must be between 1 and 100 MB');
  }
  
  if (settings.maxUsersPerTeacher && (settings.maxUsersPerTeacher < 1 || settings.maxUsersPerTeacher > 500)) {
    errors.push('Max users per teacher must be between 1 and 500');
  }
  
  if (settings.examReminderDays && (settings.examReminderDays < 0 || settings.examReminderDays > 30)) {
    errors.push('Exam reminder days must be between 0 and 30');
  }
  
  if (settings.allowedFileTypes && !Array.isArray(settings.allowedFileTypes)) {
    errors.push('Allowed file types must be an array');
  }
  
  return errors;
} 