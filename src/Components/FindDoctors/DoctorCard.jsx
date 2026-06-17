import { motion } from "framer-motion";
import {
  IconStarFilled,
  IconBriefcase,
  IconCalendarClock,
  IconStethoscope
} from "@tabler/icons-react";

const DoctorCard = ({ doctor, index, onBookClick }) => {
  const handleBookClick = () => {
    if (onBookClick) onBookClick(doctor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative h-full"
    >
      <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-sky-200/80 via-white/40 to-sky-300/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative h-full flex flex-col rounded-[1.75rem] border border-white/70 bg-white/55 backdrop-blur-2xl shadow-[0_8px_32px_rgba(14,116,144,0.08)] overflow-hidden">
        <div className="relative h-[17.5rem] bg-gradient-to-b from-sky-50/90 via-white to-sky-100/40 px-4 pt-5 pb-2">
          <div className="absolute inset-x-4 top-4 bottom-2 rounded-2xl bg-white/30 border border-white/60 backdrop-blur-sm" />
          <img
            src={doctor.image}
            alt={doctor.name}
            className="relative z-10 w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-white/80 bg-white/85 backdrop-blur-md px-2.5 py-1 shadow-sm">
            <IconStarFilled size={14} className="text-amber-400" />
            <span className="text-sm font-semibold text-sky-950">{doctor.rating}</span>
            <span className="text-xs text-sky-600">({doctor.reviews})</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4 border-t border-white/60 bg-white/35">
          <h3 className="text-lg font-bold text-sky-950 tracking-tight line-clamp-1">
            {doctor.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-sky-700">
            <IconStethoscope size={15} className="shrink-0" />
            <span className="text-sm font-medium">{doctor.specialty}</span>
          </div>

          <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
            {doctor.bio}
          </p>

          <div className="mt-4 space-y-2.5 rounded-2xl border border-sky-100/80 bg-white/50 p-3.5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <IconBriefcase size={15} />
              </div>
              <span className="truncate font-medium">{doctor.experience}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                <IconCalendarClock size={15} />
              </div>
              <span className="truncate font-medium">{doctor.availability}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleBookClick}
            className="mt-5 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(14,165,233,0.22)] transition-colors hover:bg-sky-600"
          >
            Book Appointment
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
