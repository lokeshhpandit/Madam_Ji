import { Routes, Route } from "react-router-dom";

import IntroPage from "../pages/IntroPage/IntroPage";
import BirthdayWish from "../pages/BirthdayWish/BirthdayWish";
import Surprise from "../pages/Surprise/Surprise";
import CatchHeart from "../pages/CatchHeart/CatchHeart";
import Cake from "../pages/Cake/Cake";
import Gift from "../pages/Gift/Gift";
import GiftOne from "../pages/Gift/GiftOne";
import GiftTwo from "../pages/Gift/GiftTwo";
import GiftThree from "../pages/Gift/GiftThree";
import GiftFour from "../pages/Gift/GiftFour";
import LastThing from "../pages/LastThing/LastThing";
import Letter from "../pages/Letter/Letter";
import Love from "../pages/Love/Love";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<IntroPage />} />

      <Route path="/birthday" element={<BirthdayWish />} />

      <Route path="/surprise" element={<Surprise />} />

      <Route path="/catch-heart" element={<CatchHeart />} />

      <Route path="/cake" element={<Cake />} />

      <Route path="/gift" element={<Gift />} />

      <Route path="/gift/1" element={<GiftOne />} />

      <Route path="/gift/2" element={<GiftTwo />} />

      <Route path="/gift/3" element={<GiftThree />} />

      <Route path="/gift/4" element={<GiftFour />} />

      <Route path="/last-thing" element={<LastThing />} />

      <Route path="/letter" element={<Letter />} />

      <Route path="/love" element={<Love />} />

    </Routes>
  );
}

export default AppRoutes;