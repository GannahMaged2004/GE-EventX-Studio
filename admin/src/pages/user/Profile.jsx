import { useEffect, useState } from "react";
import { getProfile } from "../../api/api";

export default function Profile() {
  const [me, setMe] = useState(null);

  useEffect(() => { (async () => {
    const { data } = await getProfile();
    setMe(data);
  })(); }, []);

  if (!me) return null;
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="space-y-2">
        <div><b>Name:</b> {me.name}</div>
        <div><b>Email:</b> {me.email}</div>
        <div><b>Role:</b> {me.role}</div>
      </div>
    </div>
  );
}
