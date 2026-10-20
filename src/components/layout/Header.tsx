import { Logo } from "../Logo";
import { HeaderShell } from "./HeaderShell";

export function Header() {
  return <HeaderShell logo={<Logo size={78} priority />} />;
}
