import { useContext } from "react";
import BillInfo from "../BillInfo";
import { BillContext } from "../context/BillContext";
import GenerateBillPage from "./GenerateBillPage";
import ItemsPage from "./ItemsPage";

function PageSwitcher() {
  const { step } = useContext(BillContext);

  switch (step) {
    case 1:
      return <BillInfo />;

    case 2:
      return <ItemsPage />;

    case 3:
      return <GenerateBillPage />;

    default:
      return <></>;
  }
}
export default PageSwitcher;
