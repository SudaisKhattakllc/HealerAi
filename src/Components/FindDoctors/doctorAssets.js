import drAhmadTariq from '../../assets/Dr Ahmad Tariq.png';
import drAsifImran from '../../assets/Dr Asif Imran.png';
import drFazleSubhan from '../../assets/Dr Fazle Subhan.png';
import drHaziqRehman from '../../assets/Dr Haziq Rehman.png';
import drInamKhan from '../../assets/Dr Inam Khan.png';
import drMudassirAlam from '../../assets/Dr Mudassir Alam.png';
import drMuhammadShafiq from '../../assets/Dr Muhammad Shafiq.png';
import drMussawirKhan from '../../assets/Dr Mussawir Khan.png';
import drNabeelaShah from '../../assets/Dr Nabeela shah.png';
import drNaeemKhan from '../../assets/Dr Naeem Khan.png';
import drSaifKalim from '../../assets/Dr Saif kalim.png';
import drZafarUllah from '../../assets/Dr Zafar ullah.png';

export const localDoctorProfiles = [
  { name: 'Dr. Ahmad Tariq', image: drAhmadTariq },
  { name: 'Dr. Asif Imran', image: drAsifImran },
  { name: 'Dr. Fazle Subhan', image: drFazleSubhan },
  { name: 'Dr. Haziq Rehman', image: drHaziqRehman },
  { name: 'Dr. Inam Khan', image: drInamKhan },
  { name: 'Dr. Mudassir Alam', image: drMudassirAlam },
  { name: 'Dr. Muhammad Shafiq', image: drMuhammadShafiq },
  { name: 'Dr. Mussawir Khan', image: drMussawirKhan },
  { name: 'Dr. Nabeela Shah', image: drNabeelaShah },
  { name: 'Dr. Naeem Khan', image: drNaeemKhan },
  { name: 'Dr. Saif Kalim', image: drSaifKalim },
  { name: 'Dr. Zafar Ullah', image: drZafarUllah },
];

function specialtyOffset(specialtyId = '') {
  return [...specialtyId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

export function enrichDoctor(doctor, index, specialtyId) {
  const profile = localDoctorProfiles[(specialtyOffset(specialtyId) + index) % localDoctorProfiles.length];
  return {
    ...doctor,
    name: profile.name,
    image: profile.image,
  };
}
