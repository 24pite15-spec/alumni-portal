# Event Invitation Image Upload - Bug Fix

## Problem Identified
The event invitation image was failing to save to the database due to:

1. **No Dedicated Upload Endpoint**: Frontend was trying to use `/posts/upload-image` for event images
2. **Data URL Fallback Issue**: If upload failed, the code was storing the entire data URL (which can be several MB) directly in the database
3. **Silent Failures**: Upload errors weren't properly reported to the user
4. **SQL Parameter Mismatch**: The INSERT statement had 11 question marks for 10 columns

## Changes Made

### Frontend (`src/pages/Home/Events.jsx`)

**Before:**
- Used `/posts/upload-image` endpoint (shared with home feed)
- Fell back to storing raw data URL if upload failed: `invitation_image: imgPath || form.image || null`
- Minimal error handling

**After:**
- Uses dedicated `/events/upload-image` endpoint
- Proper error handling - fails the entire event creation if image upload fails
- Clear error messages shown to user
- Prevents large data URLs from being stored in database

```javascript
const handleCreate = async () => {
  // ... validation ...
  
  let imgPath = null;
  if (form.image && form.image.startsWith('data:')) {
    try {
      // Convert and upload image
      const uploadRes = await fetch(`${API_BASE_URL}/events/upload-image`, {
        method: 'POST',
        body: fd,
      });
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || 'Image upload failed');
      }
      
      const uploadData = await uploadRes.json();
      imgPath = uploadData.imagePath;
    } catch (uploadErr) {
      console.error('Image upload error:', uploadErr);
      alert(`Failed to upload image: ${uploadErr.message}`);
      return; // Stop event creation
    }
  }
  
  // Only proceed if image was successfully uploaded (or no image provided)
  const payload = {
    // ...
    invitation_image: imgPath || null, // No fallback to form.image
  };
}
```

### Backend (`server.js`)

**New Endpoint - `/events/upload-image` (POST)**
- Dedicated image upload endpoint for events
- Reuses existing multer configuration
- Returns proper `imagePath` in response
- Includes logging for debugging

```javascript
app.post("/events/upload-image", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("❌ Event image upload middleware error:", err);
      return handleMulterErrors(err, req, res, next);
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imagePath = `uploads/${req.file.filename}`;
    console.log("✅ Event image uploaded successfully:", imagePath);

    res.status(200).json({
      message: "Event image uploaded successfully",
      imagePath,
    });
  });
});
```

**Updated Event Creation Endpoint - `/events` (POST)**
- Now rejects data URLs with clear error message
- Fixed SQL statement: 11 question marks → 10 (matching column count)
- Requires images to be pre-uploaded via `/events/upload-image`
- Better logging and error handling

```javascript
// Safety check: reject data URLs
if (typeof invitation_image === 'string' && invitation_image.startsWith('data:')) {
  console.warn('⚠️  Event creation rejected data URL image');
  return res.status(400).json({ 
    message: "Image must be uploaded via /events/upload-image endpoint first" 
  });
}
```

## Testing

To verify the fix works:

1. **Create an event with image:**
   - Fill in event details
   - Upload an invitation image
   - Should see "Event image uploaded successfully" in console
   - Event should be created and image should display

2. **Error handling:**
   - If image upload fails, user sees: "Failed to upload image: [error message]"
   - Event creation is cancelled, no partial data saved

3. **Without image:**
   - Events can still be created without an invitation image
   - `invitation_image` will be NULL in database

## Database

No schema changes required. The `invitation_image` column (TEXT type) already exists in the `events` table.

## Benefits

✅ **Prevents database bloat**: No more mega-sized data URLs stored  
✅ **Better UX**: Clear error messages when uploads fail  
✅ **Cleaner code**: Dedicated endpoint for event images  
✅ **Reliable**: Fails gracefully with proper error handling  
✅ **Debuggable**: Enhanced logging for troubleshooting
