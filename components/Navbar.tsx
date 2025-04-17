import { Bell, CircleAlert, Keyboard, Settings, User } from "lucide-react";
export default function Navbar() {
  return (
    <>
      <div className="flex flex-row justify-between items-center text-white px-16 pt-9">
        <div className="flex gap-6 cursor-pointer items-center">
          <h1 className="font-bold text-3xl">TYPETING</h1>
          <Keyboard />
          <CircleAlert />
          <Settings />
        </div>
        <div className="flex gap-6 cursor-pointer items-center">
          <Bell />
          <User />
        </div>
      </div>
    </>
  );
}
