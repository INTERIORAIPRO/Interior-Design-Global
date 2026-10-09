Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class SpritePng {
  static void RoundRect(Graphics g, Brush brush, int x, int y, int w, int h, int r) {
    using (var path = new GraphicsPath()) {
      int d = r * 2;
      path.AddArc(x, y, d, d, 180, 90);
      path.AddArc(x + w - d, y, d, d, 270, 90);
      path.AddArc(x + w - d, y + h - d, d, d, 0, 90);
      path.AddArc(x, y + h - d, d, d, 90, 90);
      path.CloseFigure();
      g.FillPath(brush, path);
    }
  }

  static Bitmap Canvas(int w, int h) {
    var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (var g = Graphics.FromImage(bmp)) {
      g.Clear(Color.Transparent);
    }
    return bmp;
  }

  static Graphics Prep(Bitmap bmp) {
    var g = Graphics.FromImage(bmp);
    g.SmoothingMode = SmoothingMode.AntiAlias;
    g.CompositingMode = CompositingMode.SourceOver;
    g.Clear(Color.Transparent);
    return g;
  }

  public static void Sofa(string path) {
    var bmp = Canvas(1240, 632);
    using (var g = Prep(bmp))
    using (var seat = new SolidBrush(Color.FromArgb(232, 223, 210)))
    using (var back = new SolidBrush(Color.FromArgb(217, 207, 192)))
    using (var leg = new SolidBrush(Color.FromArgb(176, 137, 104))) {
      RoundRect(g, back, 0, 0, 1240, 220, 48);
      RoundRect(g, seat, 0, 180, 1240, 360, 56);
      RoundRect(g, leg, 60, 540, 56, 92, 12);
      RoundRect(g, leg, 1124, 540, 56, 92, 12);
    }
    bmp.Save(path, ImageFormat.Png);
    bmp.Dispose();
  }

  public static void Armchair(string path) {
    var bmp = Canvas(680, 604);
    using (var g = Prep(bmp))
    using (var seat = new SolidBrush(Color.FromArgb(138, 154, 132)))
    using (var back = new SolidBrush(Color.FromArgb(125, 142, 119)))
    using (var leg = new SolidBrush(Color.FromArgb(176, 137, 104))) {
      RoundRect(g, back, 40, 0, 600, 260, 80);
      RoundRect(g, seat, 0, 200, 680, 320, 72);
      RoundRect(g, leg, 80, 520, 48, 84, 12);
      RoundRect(g, leg, 552, 520, 48, 84, 12);
    }
    bmp.Save(path, ImageFormat.Png);
    bmp.Dispose();
  }

  public static void Lamp(string path) {
    var bmp = Canvas(280, 676);
    using (var g = Prep(bmp))
    using (var stem = new SolidBrush(Color.FromArgb(196, 165, 116)))
    using (var shade = new SolidBrush(Color.FromArgb(244, 239, 230))) {
      g.FillEllipse(shade, 0, 0, 280, 192);
      RoundRect(g, stem, 124, 136, 32, 500, 16);
    }
    bmp.Save(path, ImageFormat.Png);
    bmp.Dispose();
  }

  public static void Table(string path) {
    var bmp = Canvas(720, 160);
    using (var g = Prep(bmp))
    using (var top = new SolidBrush(Color.FromArgb(176, 137, 104)))
    using (var leg = new SolidBrush(Color.FromArgb(138, 115, 88))) {
      RoundRect(g, top, 0, 0, 720, 56, 12);
      RoundRect(g, leg, 32, 56, 32, 104, 8);
      RoundRect(g, leg, 656, 56, 32, 104, 8);
    }
    bmp.Save(path, ImageFormat.Png);
    bmp.Dispose();
  }

  public static void Rug(string path) {
    var bmp = Canvas(1120, 600);
    using (var g = Prep(bmp))
    using (var outer = new SolidBrush(Color.FromArgb(139, 107, 74)))
    using (var inner = new SolidBrush(Color.FromArgb(122, 92, 62))) {
      g.FillEllipse(outer, 0, 0, 1120, 600);
      g.FillEllipse(inner, 120, 80, 880, 440);
    }
    bmp.Save(path, ImageFormat.Png);
    bmp.Dispose();
  }
}
"@

$store = "C:\Users\Ana Maria\Desktop\InteriorDesignGlobal\public\partner-store"
[SpritePng]::Sofa((Join-Path $store "sofa.png"))
[SpritePng]::Armchair((Join-Path $store "armchair.png"))
[SpritePng]::Lamp((Join-Path $store "lamp.png"))
[SpritePng]::Table((Join-Path $store "table.png"))
[SpritePng]::Rug((Join-Path $store "rug.png"))
Write-Host "png sprites written"
