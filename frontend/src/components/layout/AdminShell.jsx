import DashboardShell from './DashboardShell'
import { SHELL_ADMIN } from './shell-config'

export default function AdminShell() {
  return <DashboardShell shell={SHELL_ADMIN} />
}
