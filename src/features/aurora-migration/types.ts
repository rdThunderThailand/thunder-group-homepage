export const roleOptions = [
  ["coordinator", "ผู้ประสานงาน / ผู้มีอำนาจตัดสินใจ", "ดูแลโครงการหรือติดต่อกับทีม THUNDER"],
  ["user", "ผู้ใช้งาน Aurora", "ใช้งานระบบจัดการ Content และ Schedule"],
  ["inspector", "ผู้ตรวจสอบหน้างาน", "ตรวจสอบ Player และสถานะการทำงาน"],
] as const;

export const moduleOptions = ["Content", "Playlist", "Schedule", "Publish", "Screens", "Admin"] as const;

export type StepNumber = 1 | 2 | 3 | 4;

export type AuroraMigrationData = {
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  roles: string[];
  modules: string[];
  sites: string[];
};

export type TextField = Exclude<keyof AuroraMigrationData, "roles" | "modules" | "sites">;
