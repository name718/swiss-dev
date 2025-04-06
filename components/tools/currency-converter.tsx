"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowUpDown } from "lucide-react"

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [result, setResult] = useState<string>("")
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Mock exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.82, CNY: 7.23, CAD: 1.37, AUD: 1.52, INR: 83.12 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.85, CNY: 7.86, CAD: 1.49, AUD: 1.65, INR: 90.35 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.36, CNY: 9.14, CAD: 1.73, AUD: 1.92, INR: 105.06 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CNY: 0.048, CAD: 0.0091, AUD: 0.01, INR: 0.55 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.72, CAD: 0.19, AUD: 0.21, INR: 11.5 },
    CAD: { USD: 0.73, EUR: 0.67, GBP: 0.58, JPY: 109.36, CNY: 5.28, AUD: 1.11, INR: 60.67 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.57, CNY: 4.76, CAD: 0.9, INR: 54.69 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, CNY: 0.087, CAD: 0.016, AUD: 0.018 },
  }

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ]

  // Update exchange rate when currencies change
  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1)
    } else {
      // In a real app, this would fetch from an API
      const rate =
        exchangeRates[fromCurrency as keyof typeof exchangeRates][
          toCurrency as keyof (typeof exchangeRates)[typeof fromCurrency]
        ]
      setExchangeRate(rate)
    }

    // Set last updated time
    const now = new Date()
    setLastUpdated(now.toLocaleString())
  }, [fromCurrency, toCurrency])

  // Calculate conversion when amount, from currency, or to currency changes
  useEffect(() => {
    if (exchangeRate !== null && amount !== "") {
      const numericAmount = Number.parseFloat(amount)
      if (!isNaN(numericAmount)) {
        const convertedAmount = numericAmount * exchangeRate
        setResult(convertedAmount.toFixed(2))
      } else {
        setResult("")
      }
    } else {
      setResult("")
    }
  }, [amount, exchangeRate])

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="neumorphic-card p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4 text-neutral-800 dark:text-neutral-100">Currency Converter</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Amount
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-2">
              <label
                htmlFor="from-currency"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              >
                From
              </label>
              <select
                id="from-currency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="neumorphic-button p-3 rounded-lg"
                aria-label="Swap currencies"
              >
                <ArrowUpDown size={20} />
              </button>
            </div>

            <div className="col-span-2">
              <label
                htmlFor="to-currency"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              >
                To
              </label>
              <select
                id="to-currency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="neumorphic-display p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Result</span>
                <p className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                  {result ? `${result} ${toCurrency}` : "—"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Exchange Rate</span>
                <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
                  1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 text-right">Last updated: {lastUpdated}</p>
        </div>
      </div>
    </div>
  )
}

