using System.Text.Json.Serialization;

namespace CurrencyApi;

[Serializable]
public class ExchangeRatesResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("base")]
    public string Base { get; set; } = string.Empty;

    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    [JsonPropertyName("rates")]
    public Dictionary<string, decimal> Rates { get; set; } = [];

    public decimal GetRate(string currencyCode)
    {
        return Rates.GetValueOrDefault(currencyCode, 0.0m);
    }
}