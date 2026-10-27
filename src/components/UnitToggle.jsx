import { useContext } from "react";
import { UnitContext } from "../context/UnitContext.js";

export default function UnitToggle() {
  // 03 · read — and change — the shared unit
  const { unit, setUnit } = useContext(UnitContext);
  const next = unit === "C" ? "F" : "C";

  return (
    <button type="button" className="secondary unit-toggle" onClick={() => setUnit(next)}>
      Show °{next}
    </button>
  );
}
