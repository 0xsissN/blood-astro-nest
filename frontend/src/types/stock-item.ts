export interface StockItem {
  color: "green" | "orange" | "red";
  urgent: boolean;
  icon: "check_circle" | "warning" | "priority_high";
  type: string;
  units: number;
  status: "Normal" | "Bajo" | "Crítico";
}
