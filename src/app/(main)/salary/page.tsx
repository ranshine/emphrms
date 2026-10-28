import type { Metadata } from "next";
import SalaryView from "@/features/salary/components/SalaryView";

export const metadata: Metadata = {
  title: "Salary",
};

export default function SalaryPage() {
  return <SalaryView />;
}
