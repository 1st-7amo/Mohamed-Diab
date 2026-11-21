MOHAMED DIAB - GOLD & BLACK WEBSITE

PAGES:
- index.html = Home / player profile
- games.html = Games collection
- game.html = Individual game details, gallery and videos
- photos.html = Your personal photo gallery
- login.html = Owner login / first-time credential setup
- admin.html = Owner Dashboard

FIRST OWNER LOGIN:
On the first visit to login.html, create your own username and password (minimum 8 characters). The old visible demo credentials have been removed.
This is a front-end-only local login, not secure server-side authentication. Anyone who can access browser storage or inspect the JavaScript can bypass it. For a public secure dashboard, a backend is required.

OWNER DASHBOARD:
- Update your profile and upload a profile photo.
- Manage social accounts.
- Add games with description, category, cover, up to 8 gallery images, YouTube/direct video URLs, and up to 3 local MP4/WEBM/OGG videos (150 MB each).
- Add your own personal photos to the separate PHOTOS page; up to 12 images per upload.
- Delete games and personal gallery photos.

IMAGE STORAGE:
Images are automatically resized/compressed and stored in IndexedDB, not localStorage. Local video files are stored as Blobs in the same IndexedDB database. This avoids the previous "Could not add the game" error caused by browser localStorage limits. Game/profile/gallery metadata stays in localStorage.
The photos and changes remain in the browser/device where they were added. They do not automatically sync to visitors or other devices. Static HTML/CSS/JS alone cannot provide shared uploads; use a backend/database for that.

HOSTING:
Upload all files and folders while preserving their structure to your static host (for example GitHub Pages). Keep internet access enabled for embedded online videos.

LOCAL VIDEO NOTE:
Local videos are available only in the same browser/device where uploaded. They are not published to other visitors unless you connect a backend or upload the video files to your hosting storage.


V1.4 VISUAL UPDATE:
- Games and personal photo cards now use square 1:1 tiles.
- PUBG MOBILE uses its app icon; other games retain category/game symbols.
- Photo tiles use cover framing for consistent squares; opening a photo displays the original stored image at its available resolution without stretching.

V1.2 UPDATE:
- AUTO GAME ICONS: type the game name in the Owner Dashboard and its icon appears live in a preview. The Games page finds the icon from the name too (App Store icons first, Wikipedia as backup). Needs internet. If nothing matches, initials are shown - try the full official name.
- VISITOR COUNTER: Home page shows a shared counter that goes +1 each time the page is opened by anyone. It uses a free online counter (see counter.js). Owner visits count too.
- PLAYER ID & STATS: Owner Dashboard > PLAYER ID & STATS. Game page shows a card with a COPY button for your Player ID.

V1.3 - SUPABASE BACKEND:
All data (profile, games, photos, Player ID, visitor counter) and files now live in Supabase, so every visitor on GitHub Pages sees them. Owner login is real Supabase Auth. Follow SUPABASE-SETUP.txt.
