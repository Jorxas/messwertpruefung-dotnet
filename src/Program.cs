// Konsoleneinstieg; CSV-Leser und WPF folgen in den vorgesehenen Tickets.
Console.WriteLine("P05 initialisiert; Toleranzpruefung und Ansicht noch offen.");

public sealed record Messwert(string Kennung, decimal Wert, string Einheit);
public static class Toleranz
{
    public static bool IstGueltig(Messwert messwert, decimal untergrenze, decimal obergrenze) =>
        throw new NotImplementedException("P05-T02: Toleranzregel noch umzusetzen");
}
