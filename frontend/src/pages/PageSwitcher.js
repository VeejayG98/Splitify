import { useContext } from "react";
import BillInfo from "../BillInfo";
import { BillContext } from "../context/BillContext";
import ItemsPage from "../ItemsPage";

function PageSwitcher() {
  const { step } = useContext(BillContext);

  switch (step) {
    case 1:
      return <BillInfo />;
    
    case 2:
      return <ItemsPage />

    default:
      return <></>
  }
}
export default PageSwitcher;
