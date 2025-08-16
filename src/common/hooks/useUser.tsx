import { useSession,signOut } from "next-auth/react";

export const useUser = () => {
  const { data: session,status } = useSession();
    const user = session?.user;
  return {
    user,
    status,
    signOut,
  };
};
