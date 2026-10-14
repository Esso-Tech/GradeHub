import { Children, useEffect, useId, useMemo, useRef, useState } from 'react'
import { IconChevronDown } from '@/components/ui/Icons'

function parseOptions(children) {
  return Children.toArray(children)
    .filter((child) => child?.props?.value !== undefined)
    .map((child) => ({
      value: String(child.props.value),
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }))
}

export default function Select({
  id,
  value,
  onChange,
  required,
  disabled,
  className = '',
  children,
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()
  const options = useMemo(() => parseOptions(children), [children])

  const stringValue = value == null ? '' : String(value)
  const selected = options.find((o) => o.value === stringValue)
  const emptyOption = options.find((o) => o.value === '')
  const placeholder = emptyOption?.label ?? 'Choisir…'
  const displayLabel =
    selected && selected.value !== '' ? selected.label : placeholder

  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(opt) {
    if (opt.disabled) return
    onChange({ target: { value: opt.value } })
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`select-wrap ${open ? 'select-wrap--open' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        id={id}
        className="select-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span
          className={
            !selected || selected.value === '' ? 'select-trigger__placeholder' : undefined
          }
        >
          {displayLabel}
        </span>
        <IconChevronDown className="select-trigger__chevron" size={20} aria-hidden />
      </button>

      {open && (
        <ul className="select-menu" id={listId} role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value === '' ? '__placeholder' : opt.value}
              role="option"
              aria-selected={stringValue === opt.value}
              aria-disabled={opt.disabled || undefined}
              className={[
                'select-menu__item',
                stringValue === opt.value ? 'is-selected' : '',
                opt.disabled ? 'is-disabled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => pick(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Validation HTML5 des formulaires */}
      <select
        className="select-native-fallback"
        tabIndex={-1}
        aria-hidden="true"
        value={stringValue}
        required={required}
        disabled={disabled}
        onChange={onChange}
        {...rest}
      >
        {children}
      </select>
    </div>
  )
}
