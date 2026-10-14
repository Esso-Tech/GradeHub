const defaults = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
}

function Svg({ children, size = 20, className, ...props }) {
  return (
    <svg
      {...defaults}
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconDashboard(props) {
  return (
    <Svg {...props}>
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </Svg>
  )
}

export function IconExam(props) {
  return (
    <Svg {...props}>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </Svg>
  )
}

export function IconClass(props) {
  return (
    <Svg {...props}>
      <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zm0 11.68L5.15 9 12 5.32 18.85 9 12 14.68zM4 15v6h16v-6H4zm2 2h12v2H6v-2z" />
    </Svg>
  )
}

export function IconNotice(props) {
  return (
    <Svg {...props}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </Svg>
  )
}

export function IconAccount(props) {
  return (
    <Svg {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </Svg>
  )
}

export function IconMenu(props) {
  return (
    <Svg {...props}>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </Svg>
  )
}

export function IconSearch(props) {
  return (
    <Svg {...props}>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
    </Svg>
  )
}

export function IconCap(props) {
  return (
    <Svg size={22} {...props}>
      <path d="M12 3 1 9l4 2.18V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-5.82L23 9 12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM19 15.5S15.87 17.71 12 17.71 5 15.5 5 15.5V12.27L12 15.5l7-3.23v3.23z" />
    </Svg>
  )
}

export function IconPayment(props) {
  return (
    <Svg {...props}>
      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    </Svg>
  )
}

export function IconCalendar(props) {
  return (
    <Svg {...props}>
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
    </Svg>
  )
}

export function IconDocument(props) {
  return (
    <Svg {...props}>
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </Svg>
  )
}

export function IconFolder(props) {
  return (
    <Svg {...props}>
      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </Svg>
  )
}

export function IconClipboard(props) {
  return (
    <Svg {...props}>
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 16H5V5h2v2h10V5h2v14z" />
    </Svg>
  )
}

export function IconWallet(props) {
  return (
    <Svg {...props}>
      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </Svg>
  )
}

export function IconBell(props) {
  return (
    <Svg {...props}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </Svg>
  )
}

export function IconMail(props) {
  return (
    <Svg {...props}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </Svg>
  )
}

export function IconGlobe(props) {
  return (
    <Svg {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.22.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </Svg>
  )
}

export function IconPhone(props) {
  return (
    <Svg {...props}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </Svg>
  )
}

export function IconPackage(props) {
  return (
    <Svg {...props}>
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5 1.96 2.5H17V9.5h2.5zm-1.5 8.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </Svg>
  )
}

export function IconEye(props) {
  return (
    <Svg {...props}>
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </Svg>
  )
}

export function IconChevronRight(props) {
  return (
    <Svg {...props}>
      <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </Svg>
  )
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="M7 10l5 5 5-5H7z" />
    </Svg>
  )
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </Svg>
  )
}

const NAV_ICONS = {
  dashboard: IconDashboard,
  exam: IconExam,
  class: IconClass,
  notice: IconNotice,
  account: IconAccount,
}

const METRIC_ICONS = {
  payment: IconPayment,
  calendar: IconCalendar,
  document: IconDocument,
  folder: IconFolder,
  clipboard: IconClipboard,
  wallet: IconWallet,
  phone: IconPhone,
  package: IconPackage,
}

export function NavIcon({ name, ...props }) {
  const C = NAV_ICONS[name] ?? IconDashboard
  return <C className="nav-icon" {...props} />
}

export function MetricIcon({ name, ...props }) {
  const C = METRIC_ICONS[name] ?? IconDocument
  return <C {...props} />
}
