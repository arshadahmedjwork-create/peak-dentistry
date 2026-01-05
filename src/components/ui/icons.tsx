
import { Calendar, ArrowLeft, Info, FileText } from "lucide-react"

// Creating a custom tooth icon since Tooth is not available in lucide-react
const Tooth = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2C6.5 2 4 6 4 10c0 3 1.5 5 4 8 1.5 1.5 2.5 3 4 3s2.5-1.5 4-3c2.5-3 4-5 4-8 0-4-2.5-8-8-8Z" />
  </svg>
);

export const Icons = {
  Tooth,
  Calendar,
  ArrowLeft,
  Info,
  FileText
}
