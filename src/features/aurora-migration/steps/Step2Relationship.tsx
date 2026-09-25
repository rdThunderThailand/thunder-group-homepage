import { Choice, Step } from "../components/FormControls";
import { roleOptions } from "../types";

export function Step2Relationship({ selected, onToggle }: { selected: string[]; onToggle: (value: string) => void }) {
  return (
    <Step title="คุณเกี่ยวข้องกับ Aurora อย่างไร?" subtitle="เลือกได้มากกว่า 1 ข้อ">
      {roleOptions.map(([value, title, description]) => (
        <Choice key={value} checked={selected.includes(value)} title={title} description={description} onClick={() => onToggle(value)} />
      ))}
    </Step>
  );
}
