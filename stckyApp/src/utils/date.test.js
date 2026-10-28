import { describe, expect, it } from 'vitest'
import { addDays, formatDate, todayLocal } from './date'

describe('todayLocal', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('addDays', () => {
  it('adds positive days within the same month', () => {
    expect(addDays('2026-01-10', 5)).toBe('2026-01-15')
  })

  it('subtracts days with a negative amount', () => {
    expect(addDays('2026-01-10', -5)).toBe('2026-01-05')
  })

  it('rolls over to the next month', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('rolls over to the previous month', () => {
    expect(addDays('2026-02-01', -1)).toBe('2026-01-31')
  })

  it('rolls over across a year boundary', () => {
    expect(addDays('2025-12-31', 1)).toBe('2026-01-01')
  })

  it('handles leap-day rollover', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })
})

describe('formatDate', () => {
  it('formats a date string into a short weekday/month/day label', () => {
    const formatted = formatDate('2026-03-05')
    expect(formatted).toMatch(/\w+, \w+ \d{1,2}/)
  })
})
