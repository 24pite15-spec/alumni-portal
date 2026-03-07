# Photo Storage Fix - Frontend Changes

## Issue
The photo is not being persisted in the database because:
1. Photo uploads successfully to disk
2. Backend stores the path in DB via `/profile/upload-photo`
3. But the frontend's `/profile/save` call happens **without** including the photoPath
4. The backend `/profile/save` endpoint didn't include `profile_photo` in its update query (NOW FIXED ✅)

## Frontend Fix Required

In `AboutMe.jsx`, update the `handleSave` function to capture and use the photoPath:

### BEFORE (Current Code - ❌ Broken):
```javascript
// 1️⃣ Upload photo (if selected)
if (form.profilePhoto?.file) {
  const photoFormData = new FormData();
  photoFormData.append("photo", form.profilePhoto.file);
  photoFormData.append("email", loggedInEmail);

  const photoResponse = await fetch("http://localhost:5000/profile/upload-photo", {
    method: "POST",
    body: photoFormData,
  });

  if (!photoResponse.ok) {
    const errorData = await photoResponse.json();
    setSnack({
      open: true,
      severity: "error",
      message: errorData.message || "Photo upload failed",
    });
    return;
  }
  // ❌ photoPath is never captured!
}

// 2️⃣ Save profile data
const { profilePhoto, ...formDataToSend } = form; // ❌ excludes profilePhoto
```

### AFTER (Fixed Code - ✅ Works):
```javascript
// 1️⃣ Upload photo (if selected) & capture photoPath
let photoPath = form.profilePhoto; // If already in DB, preserve it

if (form.profilePhoto?.file) {
  const photoFormData = new FormData();
  photoFormData.append("photo", form.profilePhoto.file);
  photoFormData.append("email", loggedInEmail);

  const photoResponse = await fetch("http://localhost:5000/profile/upload-photo", {
    method: "POST",
    body: photoFormData,
  });

  if (!photoResponse.ok) {
    const errorData = await photoResponse.json();
    setSnack({
      open: true,
      severity: "error",
      message: errorData.message || "Photo upload failed",
    });
    return;
  }

  // ✅ Capture the photoPath from response
  const photoData = await photoResponse.json();
  photoPath = photoData.photoPath;
}

// 2️⃣ Save profile data WITH photoPath included
const body = {
  fullName: form.fullName,
  email: loggedInEmail,
  phone: form.phone,
  dob: form.dob,
  linkedinProfile: form.linkedinProfile,
  batchYear: form.batchYear,
  currentAddress: form.currentAddress,
  status: form.status,
  companyName: form.companyName,
  jobRole: form.jobRole,
  workLocation: form.workLocation,
  studyLevel: form.studyLevel,
  studyLevelOther: form.studyLevelOther,
  courseName: form.courseName,
  institution: form.institution,
  institutionLocation: form.institutionLocation,
  otherText: form.otherText,
  preferNotToSay: form.preferNotToSay,
  achievements: form.achievements,
  profilePhoto: photoPath, // ✅ Include photoPath here
};
```

## Summary of Changes

1. **Backend**: Added `profile_photo: data.profilePhoto` to the `allowed` object in `/profile/save` ✅ DONE
2. **Frontend**: Need to:
   - Capture `photoPath` from the `/profile/upload-photo` response
   - Include it in the `/profile/save` request body
   - Send both old and new files without excluding profilePhoto
