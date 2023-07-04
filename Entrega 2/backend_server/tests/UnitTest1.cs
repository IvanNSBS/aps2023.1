namespace tests;
using System;
using webserver;

public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
        WeatherForecast w = new WeatherForecast();
        w.TemperatureC = 10;
        Console.Write($"Celsius: {w.TemperatureC} ## Farenheit: {w.TemperatureF}");

        Assert.AreEqual(10, w.TemperatureC);
    }
}