import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { getOfflineErrorMessage } from "@/lib/network-error"

describe("getOfflineErrorMessage", () => {
  const originalNavigator = globalThis.navigator

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
    })
  })

  it("returns offline message when navigator.onLine is false", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: false },
      writable: true,
    })
    expect(getOfflineErrorMessage(new Error("something"))).toBe("لا يوجد اتصال بالإنترنت")
  })

  it("returns offline message for TypeError with fetch in message", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: true },
      writable: true,
    })
    expect(getOfflineErrorMessage(new TypeError("Failed to fetch"))).toBe("لا يوجد اتصال بالإنترنت")
  })

  it("returns offline message for TypeError with network in message", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: true },
      writable: true,
    })
    expect(getOfflineErrorMessage(new TypeError("network error"))).toBe("لا يوجد اتصال بالإنترنت")
  })

  it("returns offline message for generic Error with network-like message", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: true },
      writable: true,
    })
    expect(getOfflineErrorMessage(new Error("Failed to fetch data"))).toBe("لا يوجد اتصال بالإنترنت")
  })

  it("returns null when online and error is unrelated", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: true },
      writable: true,
    })
    expect(getOfflineErrorMessage(new Error("some other error"))).toBeNull()
  })

  it("returns null for non-Error values when online", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { onLine: true },
      writable: true,
    })
    expect(getOfflineErrorMessage("string error")).toBeNull()
  })
})
