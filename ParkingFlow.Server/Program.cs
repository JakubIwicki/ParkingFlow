using System.Text;
using CurrencyApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ParkingDb.Models;
using ParkingFlow.Server.Auth;
using Raven.DependencyInjection;
using Raven.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Identity RavenDB
builder.Services
    .AddRavenDbDocStore()   // "RavenSettings"
    .AddRavenDbAsyncSession()   // Create provider
    .AddIdentity<AuthUser, IdentityRole>() // Identity system
    .AddRavenDbIdentityStores<AuthUser, IdentityRole>(); //RavenDB as store


// ExchangeRates Api
builder.Services.AddSingleton<ICurrencyHost>(_ =>
    new CurrencyExchangerHost(
        baseUrl: builder.Configuration["ExchangeRatesApi:BaseUrl"]!,
        apiKey: builder.Configuration["ExchangeRatesApi:ApiKey"]!)
);

// Authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });
builder.Services.AddSingleton<IJwtTokenService>(_ => new JwtTokenService(builder.Configuration));

// CORS localhost --> dev
const string localHostCors = "AllowLocalhost";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:52759",  // frontend
                    "https://localhost:52759"  // frontend
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    app.MapOpenApi();
}

app.UseCors(localHostCors);

app.Use(async (context, next) =>
{
    Console.WriteLine($"[REQ] {context.Request.Method} {context.Request.Path}");
    await next();
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
