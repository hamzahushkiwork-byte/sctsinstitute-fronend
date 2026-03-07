import { Routes, Route } from 'react-router-dom';
import HeroSlidesList from './HeroSlidesList.jsx';

export default function HeroSlidesPage() {
  return (
    <Routes>
      <Route index element={<HeroSlidesList />} />
    </Routes>
  );
}



