using System.Web;

namespace CurrencyApi;

public class CurrencyExchangerHost(string baseUrl, string apiKey) : ICurrencyHost
{
    private readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri(baseUrl)
    };
    private static string WantedRates => "USD,EUR,PLN";

    private Uri CreateDesiredUri(string endpoint, params (string, string)[] parameters)
    {
        var uriBuilder = new UriBuilder($"{baseUrl}{endpoint}?access_key={apiKey}");

        foreach (var (key, parameter) in parameters)
        {
            if (string.IsNullOrEmpty(parameter))
                continue;

            uriBuilder.Query += $"&{key}={parameter}";
        }
        return uriBuilder.Uri;
    }

    public async Task<ExchangeRatesResponse> GetLatest()
    {
        const string endpoint = "latest";
        var url = CreateDesiredUri(endpoint, ("symbols", WantedRates));

        var response = await _httpClient.GetAsync(url);

        if(!response.IsSuccessStatusCode)
            throw new Exception($"Failed to fetch latest currency rates: {response.ReasonPhrase}");

        var content = await response.Content.ReadAsStringAsync();

        try
        {
            var converted = System.Text.Json.JsonSerializer.Deserialize<ExchangeRatesResponse>(content);
            if (converted is null)
                throw new Exception("Failed to deserialize response content.");

            return converted;
        }
        catch
        {
            throw new Exception("Failed to deserialize response content.");
        }
    }

    public async Task<ExchangeRatesResponse> GetHistorical(DateTime date)
    {
        var endpoint = date.ToString("yyyy-MM-dd");
        var url = CreateDesiredUri(endpoint,
            ("symbols", WantedRates), ("format", "1"));

        var response = await _httpClient.GetAsync(url);

        if(!response.IsSuccessStatusCode)
            throw new Exception($"Failed to fetch currency rates for date {date.ToShortDateString()}: {response.ReasonPhrase}");

        var content = await response.Content.ReadAsStringAsync();

        try
        {
            var converted = System.Text.Json.JsonSerializer.Deserialize<ExchangeRatesResponse>(content);
            if (converted is null)
                throw new Exception("Failed to deserialize response content.");

            return converted;
        }
        catch
        {
            throw new Exception("Failed to deserialize response content.");
        }
    }
}