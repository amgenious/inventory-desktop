import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAuth } from "@/hooks/use-auth";
import Deleteuser from "./delete-user";

const ProfileDetails = () => {
  const { user } = useAuth();
  return (
    <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 p-5">
      <form className="py-5">
        <div className="grid gap-2 mb-5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className="mt-1 block w-full"
            value={user.name}
            required
            disabled
          />
        </div>

        <div className="grid gap-2 mb-5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            className="mt-1 block w-full"
            value={user.email}
            required
            disabled
          />
        </div>
        <div className="grid gap-2 mb-5">
          <Label htmlFor="email">Role</Label>
          <Input
            id="role"
            type="role"
            className="mt-1 block w-full"
            value={user.role}
            required
            disabled
          />
        </div>
      </form>
      <Deleteuser />
    </div>
  );
};

export default ProfileDetails;
