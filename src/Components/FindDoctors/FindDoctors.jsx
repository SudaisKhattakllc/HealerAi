import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import OrganGrid from "./OrganGrid";
import DoctorList from "./DoctorList";
import { specialties } from "./mockData";


/**
 * FindDoctors - Main Page Component
 *
 * Component Architecture:
 * - FindDoctors.jsx: Main container managing state and view switching
 * - OrganGrid.jsx: Displays organ specialty cards
 * - DoctorList.jsx: Displays filtered doctors for selected specialty
 * - DoctorCard.jsx: Individual doctor card component
 * - mockData.js: Fake data (ready for MongoDB/Firebase integration)
 *
 * State Management:
 * - selectedSpecialty: Tracks which specialty is selected (null = grid view)
 * - This is kept simple for scalability with useContext or Redux later
 */

const FindDoctors = () => {
  const location = useLocation();
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const preselect = useMemo(() => {
    const specialtyId = location?.state?.specialtyId || null;
    const fromAI = !!location?.state?.fromAI;
    const diseaseLabel = location?.state?.diseaseLabel || null;
    const confidence = location?.state?.confidence ?? null;
    const symptoms = location?.state?.symptoms || '';
    return { specialtyId, fromAI, diseaseLabel, confidence, symptoms };
  }, [location]);

  useEffect(() => {
    if (!preselect.specialtyId) return;
    const match = specialties.find((s) => s.id === preselect.specialtyId);
    if (match) setSelectedSpecialty(match);
  }, [preselect.specialtyId]);

  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleBackToGrid = () => {
    setSelectedSpecialty(null);
  };

  const handleBookAppointment = (doctor) => {
    console.log("Booking appointment for:", doctor);
  };

  return (
    <div>
      {!selectedSpecialty ? (
        <OrganGrid onSelectSpecialty={handleSelectSpecialty} />
      ) : (
        <DoctorList
          selectedSpecialty={selectedSpecialty}
          onBack={handleBackToGrid}
          onBookAppointment={handleBookAppointment}
          initialSortBy={preselect.fromAI ? 'rating_desc' : 'default'}
          aiContext={{
            fromAI: preselect.fromAI,
            diseaseLabel: preselect.diseaseLabel,
            confidence: preselect.confidence,
            symptoms: preselect.symptoms,
          }}
        />
      )}
    </div>
  );
};

export default FindDoctors;