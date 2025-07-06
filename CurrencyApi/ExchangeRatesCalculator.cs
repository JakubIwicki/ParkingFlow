namespace CurrencyApi;

public static class ExchangeRatesCalculator
{
    public const int RoundTo = 2;
    public static Dictionary<string, decimal> ConvertAmountToCurrencies
        (decimal amount, ExchangeRatesResponse exchangeRatesResponse)
    {
        var result = new Dictionary<string, decimal>();

        if (exchangeRatesResponse.Success != true || exchangeRatesResponse.Rates == null)
            throw new ArgumentException("Invalid or unsuccessful exchange rates response.");

        foreach (var (currency, rate) in exchangeRatesResponse.Rates)
            result[currency] = Math.Round(amount * rate, RoundTo);

        return result;
    }

    public static decimal Calculate(
        decimal baseRate, decimal rate,
        decimal totalHours, decimal discountFactor)
    {
        var total = Math.Round(
            d: baseRate * rate * totalHours * discountFactor,
            decimals: RoundTo);

        return total;
    }

}