## 📖 User Guide: How to Use All Features

This PDF Editor & Document Suite runs entirely in your browser with absolute privacy and zero backend server costs. Here is how to use every powerful feature available:

### 🌓 Global Theme Toggle

* **How to use:** Click the Light Mode / Dark Mode button in the top right corner of the navigation bar.
* **What it does:** Instantly switches the entire interface (Navbar, Sidebar, PDF Canvas, and Inspector Panel) between a sleek dark theme and a clean, high-contrast light mode.

### 📂 Opening & Uploading PDFs

* **How to use:** Click the **Open PDF** button in the top bar or drag and drop any PDF file directly into the application window.
* **What it does:** Parses and loads the document instantly into the client-side viewer without uploading it to a server.

### ✍️ Editing & Annotating

* **Select Tool:** Click elements or view standard layout.
* **Edit Text:** Click on text lines on any page to open the text editor and make inline corrections.
* **Freehand Pen & Highlighter:** Draw freely with customizable stroke widths and colors.
* **Shapes:** Add Microsoft Word-style Rectangles, Circles, Lines, and Arrows.
* **Signatures & Stamps:** Create or upload your digital signature and stamp it anywhere on the document.

### 🗂️ Organizing Pages

* **Thumbnail Sidebar:** Click the **Pages** tab on the left sidebar to access page management.
* **Reorder:** Drag and drop page cards to reorder them instantly, or use the Move Up / Down arrow buttons.
* **Rotate & Duplicate:** Click rotate (90°) or duplicate to quickly manage multi-page documents.
* **Delete:** Remove unwanted pages (the app ensures at least 1 page remains).

### 🔍 Document Inspector & Statistics

* **Right Panel:** View live document stats including total Word Count, Character Count, and estimated Reading Time.
* **Find in Document:** Search for any keyword across all pages and jump instantly to matching snippets.
* **Page Numbers:** Toggle page numbers on/off and select margin placement (Bottom Center, Bottom Right, Bottom Left).

### 🔒 Security & Passwords

* **Password Protection:** Open the Security & Password card in the right inspector panel to set or change encryption passwords for your document.

### 🗑️ Safe "Clear Edits"

* **Reset Annotations:** Click the **Clear Edits** button in the top bar.
* **Confirmation Prompt:** A secure confirmation modal will ask *"Are you sure you want to clear all the edits, drawings, shapes, and annotations you have made?"* with **No, Keep Edits** and **Yes, Clear All** options to prevent accidental data loss.

### 💾 Multi-Format Export Suite

Click **Export** to save your edited work locally as:

* Standard PDF or Compressed PDF
* Microsoft Word (`.rtf`)
* Plain Text, Markdown, or HTML
* JSON Backup


🚀 Installation & Setup
Since this application runs entirely in the browser with zero backend dependencies, setting it up locally is fast and straightforward.

Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Git

Node.js (v16.0 or higher recommended)

npm (or yarn / pnpm)

🛠️ Local Development Setup
1. Clone the repository
Open your terminal and run the following command to clone the project:

Bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2. Install dependencies
Install the required packages using your preferred package manager:

Bash
npm install
# or if using yarn: yarn install
3. Start the development server
Launch the local development environment:

Bash
npm run dev
# or if using yarn: yarn dev
The application will now be running locally. Open http://localhost:3000 (or the port specified in your terminal) in your browser to start editing PDFs.

📦 Building for Production
To create an optimized, production-ready build of the application:

Bash
npm run build
This will generate a dist or build folder containing all your static assets. Because this suite requires zero backend, you can simply upload this folder to any static hosting provider—such as Vercel, Netlify, GitHub Pages, or AWS S3—and your app will be live globally.


<img width="1057" height="813" alt="image" src="https://github.com/user-attachments/assets/5878947d-f459-4f3c-b172-8a291cb98bfb" />
