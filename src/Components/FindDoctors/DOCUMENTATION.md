# FindDoctors Component Documentation

## 📋 Overview

A scalable, production-ready healthcare platform component for finding and booking appointments with doctors. Built with React, Tailwind CSS, Framer Motion, and Tabler Icons.

---

## 🏗️ Component Architecture

```
FindDoctors/
├── FindDoctors.jsx       # Main container (state management & routing)
├── OrganGrid.jsx         # Specialty selection grid
├── DoctorList.jsx        # Filtered doctor list view
├── DoctorCard.jsx        # Individual doctor card
└── mockData.js           # Database-ready fake data
```

### Component Relationships

```
FindDoctors (Main Container)
    ├─ OrganGrid (View 1: Organ/Specialty Selection)
    │   └─ Displays 14 specialty cards with animations
    │
    └─ DoctorList (View 2: Doctor List for Selected Specialty)
        ├─ Search functionality
        ├─ Back button to OrganGrid
        └─ DoctorCard[] (Multiple doctor cards)
            └─ Individual doctor profiles with booking
```

---

## 🎯 Component Details

### 1. **FindDoctors.jsx** (Main Container)
**Purpose:** State management and view routing

**Key Features:**
- Manages `selectedSpecialty` state
- Toggles between OrganGrid and DoctorList views
- Handles appointment booking logic (extensible for future APIs)

**Props:** None (standalone)

**State:**
```javascript
const [selectedSpecialty, setSelectedSpecialty] = useState(null);
```

**Usage:**
```jsx
<FindDoctors />
```

---

### 2. **OrganGrid.jsx** (Specialty Selection)
**Purpose:** Display medical specialties as interactive organ cards

**Key Features:**
- 14 specialty cards with images and gradients
- Staggered entrance animations (Framer Motion)
- Hover effects with scale and rotation
- Responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
- Each card shows specialty name and description

**Props:**
```typescript
onSelectSpecialty: (specialty: Object) => void
```

**Specialty Object Structure:**
```javascript
{
  id: string,           // e.g., "cardiology"
  name: string,         // e.g., "Cardiology"
  icon: string,         // Image asset key
  description: string,  // e.g., "Heart & Cardiovascular"
  color: string         // Tailwind gradient class
}
```

**Example Usage:**
```jsx
<OrganGrid onSelectSpecialty={(specialty) => console.log(specialty)} />
```

---

### 3. **DoctorList.jsx** (Doctor List View)
**Purpose:** Display filtered doctors for selected specialty

**Key Features:**
- Search functionality (name & bio filtering)
- Sticky header with back button
- Specialty information display
- Grid layout with animations
- Empty state handling
- Doctor count display
- Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)

**Props:**
```typescript
selectedSpecialty: Object,           // Selected specialty object
onBack: () => void,                  // Callback for back button
onBookAppointment?: (doctor) => void // Optional booking handler
```

**Example Usage:**
```jsx
<DoctorList 
  selectedSpecialty={specialty}
  onBack={() => setSelectedSpecialty(null)}
  onBookAppointment={(doctor) => console.log("Booking:", doctor)}
/>
```

---

### 4. **DoctorCard.jsx** (Individual Doctor Profile)
**Purpose:** Display individual doctor information

**Key Features:**
- Doctor image with rating badge
- Name, specialty, and bio
- Experience and availability info
- Review count display
- "Book Appointment" button with hover animations
- Hover effects with scale and shadow

**Props:**
```typescript
doctor: {
  id: string,
  name: string,
  specialty: string,
  specialtyId: string,
  rating: number,           // 0-5
  reviews: number,          // Review count
  experience: string,       // e.g., "12+ years"
  image: string,            // Avatar URL
  bio: string,              // Short description
  availability: string      // e.g., "Mon-Fri, 9 AM - 5 PM"
},
index: number,              // For staggered animations
onBookClick?: (doctor) => void
```

**Example Usage:**
```jsx
<DoctorCard 
  doctor={doctorObject}
  index={0}
  onBookClick={(doctor) => handleBooking(doctor)}
/>
```

---

### 5. **mockData.js** (Data Layer)
**Purpose:** Centralized mock data and data utilities

**Exports:**

#### **specialties Array**
Array of 14 medical specialties with complete metadata
```javascript
export const specialties = [
  {
    id: "cardiology",
    name: "Cardiology",
    icon: "heart",
    description: "Heart & Cardiovascular",
    color: "from-red-500 to-red-600"
  },
  // ... 13 more specialties
]
```

#### **doctorsData Object**
Dictionary of doctors organized by specialty ID
```javascript
export const doctorsData = {
  cardiology: [
    {
      id: "doc-004",
      name: "Dr. Robert Johnson",
      specialty: "Cardiologist",
      // ... more fields
    },
    // ... more doctors
  ],
  // ... more specialties
}
```

#### **Helper Functions**

```javascript
// Get doctors by specialty
getDoctorsBySpecialty(specialtyId) → Doctor[]

// Get all doctors
getAllDoctors() → Doctor[]

// Search doctors by name/specialty
searchDoctors(query) → Doctor[]
```

---

## 🎨 Design System

### Colors
- **Primary:** Blue (`from-blue-500 to-blue-600`)
- **Specialty Gradients:** 14 unique colors
- **Backgrounds:** Gradient (blue-50 → white → indigo-50)
- **Text:** Gray scale (900, 700, 600, 500, 400)

### Animations (Framer Motion)
- **Grid Entrance:** Staggered (0.1s delays)
- **Card Hover:** Scale 1.08, Rotate 3°
- **Button Press:** Scale down 0.95
- **Page Transitions:** Slide in/out with opacity fade

### Responsive Breakpoints
- **Mobile:** < 640px (2 columns grid)
- **Tablet:** 640px - 1024px (3 columns grid)
- **Desktop:** > 1024px (4 columns grid)

---

## 🔄 Data Flow

```
User Action
    ↓
findDoctors.onClick → handleSelectSpecialty()
    ↓
setState(selectedSpecialty)
    ↓
Render DoctorList with selectedSpecialty
    ↓
getDoctorsBySpecialty(specialtyId) → Filter doctors
    ↓
Display DoctorCard[] with animations
    ↓
User searches/filters → State update in DoctorList
    ↓
handleBookAppointment() → Future: API call
```

---

## 🚀 Future Integrations

### Database Integration
Replace `mockData.js` with API calls:

```javascript
// BEFORE: Using mock data
const doctors = getDoctorsBySpecialty(specialtyId);

// AFTER: Using API
useEffect(() => {
  fetch(`/api/doctors?specialty=${specialtyId}`)
    .then(res => res.json())
    .then(data => setDoctors(data));
}, [specialtyId]);
```

### State Management
Scale to `useContext` or Redux:

```javascript
// Using Context API
const { selectedSpecialty, setSelectedSpecialty } = useContext(DoctorContext);
```

### Booking System
```javascript
const handleBookAppointment = async (doctor) => {
  const booking = await api.createBooking({
    doctorId: doctor.id,
    userId: currentUser.id,
    dateTime: selectedDateTime,
    // ... more fields
  });
  // Send email, show confirmation modal
};
```

### Authentication
```javascript
// Protected booking (requires login)
if (!currentUser) {
  navigate('/login');
  return;
}
```

### Payment Integration
```javascript
// Stripe, Razorpay, or similar
const processPayment = async (amount) => {
  const paymentResult = await stripe.confirmPayment({
    // ... payment details
  });
};
```

---

## 📱 Responsive Design

| Breakpoint | Grid Cols | Card Size | Typography |
|-----------|-----------|-----------|-----------|
| Mobile    | 2         | w-full    | text-sm   |
| Tablet    | 3         | w-full    | text-base |
| Desktop   | 4         | w-full    | text-lg   |

---

## ⚙️ Customization Guide

### Change Number of Specialties
Edit `specialties` array in `mockData.js`:
```javascript
export const specialties = [
  // Add or remove specialty objects
];
```

### Add New Doctor
```javascript
export const doctorsData = {
  cardiology: [
    // ... existing doctors
    {
      id: "doc-023",
      name: "Dr. Your Name",
      specialty: "Cardiologist",
      // ... other fields
    }
  ]
};
```

### Modify Colors
Update Tailwind color classes:
```javascript
color: "from-custom-500 to-custom-600"
```

### Adjust Animation Speeds
Edit transition durations in components:
```javascript
transition={{ duration: 0.3 }}  // Change duration
```

### Customize Search
Modify filter logic in `DoctorList.jsx`:
```javascript
const filteredDoctors = doctors.filter(doctor =>
  // Add custom filter logic
);
```

---

## 🧪 Testing Scenarios

### Scenario 1: View Specialties
1. Load page → OrganGrid displays
2. 14 specialty cards animate in
3. Hover cards → Scale and rotate effects

### Scenario 2: Select Specialty
1. Click specialty card
2. Transition to DoctorList
3. Doctors display for selected specialty

### Scenario 3: Search Doctors
1. Type in search box
2. Results filter in real-time
3. Empty state if no matches
4. Clear button removes search

### Scenario 4: Go Back
1. Click back button
2. Transition to OrganGrid
3. Search state resets

### Scenario 5: Book Appointment
1. Click "Book Appointment"
2. Alert shows (ready for modal/form)
3. Callback executes with doctor data

---

## 🐛 Troubleshooting

### Issue: Images not loading
**Solution:** Verify image paths in `OrganGrid.jsx` imports match asset locations

### Issue: Animations not smooth
**Solution:** Check if `motion` package is installed: `npm install motion`

### Issue: Search not working
**Solution:** Ensure doctor objects have `name` and `bio` fields

### Issue: Layout breaks on mobile
**Solution:** Check Tailwind classes are responsive (md:, lg: prefixes)

---

## 📦 Dependencies

```json
{
  "motion": "^12.23.24",
  "@tabler/icons-react": "^3.35.0",
  "tailwindcss": "^4.1.17",
  "react": "^19.1.1"
}
```

---

## 📝 Code Quality

- ✅ ESLint compliant
- ✅ Responsive design tested
- ✅ Accessibility ready (semantic HTML, ARIA labels)
- ✅ Performance optimized (component memoization ready)
- ✅ Type hints in comments
- ✅ Modular and reusable

---

## 🤝 Contributing

To add new features:
1. Keep components focused and single-responsibility
2. Use Tailwind for styling (no CSS modules)
3. Add Framer Motion for animations
4. Update this documentation
5. Test responsive behavior

---

## 📄 License

Part of FYP Healthcare Web Application

---

## 🔗 Related Components

- `Navbar.jsx` - Navigation menu
- `Footer.jsx` - Page footer
- `ContactUS.jsx` - Contact section

---

## 💡 Next Steps

1. **Create Booking Modal** - Replace alert with styled modal form
2. **Implement API Integration** - Connect to backend for real doctors data
3. **Add Filtering** - Rating, availability, distance-based filters
4. **Payment Gateway** - Integrate Stripe/Razorpay
5. **User Reviews** - Display patient testimonials
6. **Appointment History** - Show user's past/upcoming appointments
7. **Doctor Profiles** - Detailed doctor pages with qualifications
8. **SMS/Email Notifications** - Confirmation and reminders
