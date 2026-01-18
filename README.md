# SkillInheritance

SkillInheritance is a platform that empowers users to **turn ancestral family skills into modern enterprises**. It allows users to **sell traditional products**, **teach inherited skills**, **connect with other skill inheritors**, and **scale their legacy through branding and partnerships**. The platform is designed to preserve cultural knowledge while creating economic opportunities, especially for youth.

---

## 🚀 Project Overview

SkillInheritance provides a simple, user-friendly interface for different types of users:

- **Sellers** – List products and classes for sale or booking.
- **Buyers** – Browse products and book classes.
- **Admins/Users** – View order history, manage transactions, and track interactions.

The app is accessible and visually appealing, with a responsive design for both desktop and mobile devices.

---

## 🎯 Features

### Core Features

1. **SELL**
   - Users can list traditional products or services.
   - Supports images, descriptions, and pricing.
   
2. **TEACH**
   - Users can offer online or offline classes to teach family skills.
   - Booking and schedule management integrated.
3.**Explore**
   - Users can explore the skills any place of there choice.
   - Currently only three states information is added.

4. **ORDERS**
   - Sellers can view orders received from buyers.
   - Buyers can track their orders and class bookings.
   - Displays detailed information: buyer/seller info, address, phone, item type, and payment/booking status.
5.**Backend & Database**
- **MongoDB** stores all dynamic data:  
  - Users and roles (buyer, seller)  
  - Products and services  
  - Orders and bookings  
- **Express API** serves data to the frontend based on user role  
- **Authentication** with tokens stored in `localStorage` for secured access


---

## 🛠 Technology Stack

- **Frontend:** HTML, CSS(internal), JavaScript  
- **Backend API:** Node.js / Express (for orders and authentication) *(if implemented locally)*  
- **Data storage:** Local JSON or mock API for demonstration 
- **Responsive Design:** Works on mobile and desktop  
- **Hosting (Optional):** GitHub Pages for frontend demo  

---
⚙ Folder Structure
SkillInheritance/

- `index.html` – Main landing page  
- `orders.html` – Orders page  
- `teach.html` – Teach module  
-`skills.html`- Includes states to explore skills(added only 3 temporarily)
-`login.html`- Login page
-`signup`- Sign up page
- `CSS (internal)` – Styling is included directly within HTML files using <style> blocks
- `backend.js` – Connects all the pages and contains backend logic
- `README.md` – Project documentation  and more

✅ Key Functionalities

Dynamic Order Management

Displays different views for seller vs. buyer

Fetches order data from API (local or backend)

Displays details like buyer/seller info, payment status, booking confirmation

Role-based UI

Page title and content change based on role stored in local storage

Guest users prompted to log in

Responsive & Accessible

Works on desktop and mobile

Clear headings, cards, and color-coded sections


💡 Future Enhancements

Integrate real backend with database (MongoDB / SQL)

Add payment gateway for product purchases

Add real-time messaging between users

Include search and filter features for products/classes

Add profile pages for sellers and buyers
💻 How to Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/Saichamili20/skill-inheritance.git
Navigate to the project folder

cd skill-inheritance
Install dependencies (if any)

npm install
Only needed if you use Node.js packages or APIs.

Start a local server (for HTML/JS frontend)

Using Python:

python -m http.server 8000
Or using VS Code Live Server

Open in a browser

http://localhost:5000


