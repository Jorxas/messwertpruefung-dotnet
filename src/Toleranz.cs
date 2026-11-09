public sealed record Messwert(string Kennung, decimal Wert, string Einheit);

public static class Toleranz
{
    public static bool IstGueltig(Messwert messwert, decimal untergrenze, decimal obergrenze)
    {
        if (untergrenze > obergrenze)
            throw new ArgumentException("Die Untergrenze darf nicht über der Obergrenze liegen.");
        if (messwert.Einheit != "mm")
            throw new ArgumentException("Die Toleranzprüfung erwartet die Einheit mm.");

        return messwert.Wert >= untergrenze && messwert.Wert <= obergrenze;
    }
}
