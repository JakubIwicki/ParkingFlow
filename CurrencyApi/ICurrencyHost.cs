namespace CurrencyApi;

public interface ICurrencyHost
{
    Task<ExchangeRatesResponse> GetLatest();
    Task<ExchangeRatesResponse> GetHistorical(DateTime date);
}