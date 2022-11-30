import React, { createContext, useContext, useState } from "react";
import { MENU_TABS } from "../../constants";

export const MenuContext = createContext();

function MenuProvider({ children }) {
  const [currentTab, setCurrentTab] = useState(MENU_TABS.MEMBER);

  return (
    <MenuContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </MenuContext.Provider>
  );
}

export default MenuProvider;

export const useMenu = () => {
  return useContext(MenuContext);
};
