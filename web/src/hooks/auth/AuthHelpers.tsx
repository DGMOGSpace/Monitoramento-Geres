import UserInterface from "../../interfaces/User";

export const saveAuthData = (user: UserInterface, token: string) => {
  localStorage.setItem("@Auth:token", token);
  localStorage.setItem("@Auth:user", JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem("@Auth:token");
  localStorage.removeItem("@Auth:user");
};

export const getAuthData = () => {
  const user = localStorage.getItem("@Auth:user");
  const token = localStorage.getItem("@Auth:token");
  return {
    user: user ? JSON.parse(user) : (null as UserInterface | null),
    token,
  };
};
