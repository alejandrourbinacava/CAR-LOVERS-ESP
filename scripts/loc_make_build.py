"""loc_make_build.py <video> <build_referencia.mjs>

Crea scripts/build-video.<video>.mjs = el build-video.mjs ACTUAL (lógica común) con la configuración del
vídeo <video> (PARTS/OVERLAYS/ENTITIES/SECTIONS/TAGS/CHAPTERS/CLIP_RULES) copiada de <build_referencia.mjs>,
más el soporte de DOBLAJE: con LOC=<idioma> el montaje usa
   input/loc/<video>/guion-es.txt           (las anclas siguen siendo las españolas)
   out/loc/<video>/<idioma>/narration.mp3   (voz doblada)
   out/loc/<video>/<idioma>/lines.json      (inicio/fin de cada párrafo doblado)
   input/loc/<video>/<idioma>.json          (rótulos, etiquetas, capítulos y título traducidos)
y calcula los tiempos de cada ancla por posición dentro de su párrafo (sin volver a transcribir)."""
import sys

video, ref = sys.argv[1], sys.argv[2]
cur = open("scripts/build-video.mjs", encoding="utf-8").read()
old = open(ref, encoding="utf-8").read()


def region(s, a, b):
    i = s.index(a)
    return i, s.index(b, i)


# 1) configuración del vídeo de referencia
ca, cb = region(cur, "const PARTS = [", "async function loadEnv()")
oa, ob = region(old, "const PARTS = [", "async function loadEnv()")
cur = cur[:ca] + old[oa:ob] + cur[cb:]
ma, mb = region(cur, "// Motion graphics (VÍDEO", "// Biblioteca de YouTube -> ventanas")
na, nb = region(old, "// Motion graphics (VÍDEO", "// Biblioteca de YouTube -> ventanas")
cur = cur[:ma] + old[na:nb] + cur[mb:]

# 2) soporte de doblaje
cur = cur.replace(
    'const NARRATION = path.join(ROOT, "input", "narration.mp3");\nconst GUION = path.join(ROOT, "input", "guion-completo.txt");',
    '''const LOC = process.env.LOC || "";   // idioma del doblaje (it|fr|de); vacío = español original
const LOCDIR = path.join(ROOT, "out", "loc", "%s", LOC);
const NARRATION = LOC ? path.join(LOCDIR, "narration.mp3") : path.join(ROOT, "input", "narration.mp3");
const GUION = LOC ? path.join(ROOT, "input", "loc", "%s", "guion-es.txt") : path.join(ROOT, "input", "guion-completo.txt");''' % (video, video),
)
assert "const LOC = " in cur, "no se pudo parchear NARRATION/GUION"

cur = cur.replace(
    '  const timeAt = await buildTimeAt(guion, total, path.join(ROOT, "out", "_align.json"));',
    '''  let locCfg = null;
  let timeAt;
  if (LOC) {
    locCfg = JSON.parse(await fs.readFile(path.join(ROOT, "input", "loc", "%s", LOC + ".json"), "utf-8"));
    const timing = JSON.parse(await fs.readFile(path.join(LOCDIR, "lines.json"), "utf-8"));
    // inicio/fin (en el guion español) de cada párrafo NO vacío -> tiempo del doblaje por posición dentro del párrafo
    const spans = [];
    { let p = 0; for (const ln of guion.split("\\n")) { if (ln.trim()) spans.push([p, p + ln.length]); p += ln.length + 1; } }
    if (spans.length !== timing.length) throw new Error(`párrafos del guion (${spans.length}) != tiempos del doblaje (${timing.length})`);
    timeAt = (idx) => {
      let k = spans.findIndex(([a, b]) => idx < b);
      if (k < 0) return timing[timing.length - 1].end;
      const [a, b] = spans[k];
      if (idx <= a) return timing[k].start;
      return timing[k].start + ((idx - a) / (b - a)) * (timing[k].end - timing[k].start);
    };
    // rótulos / etiquetas / capítulos traducidos (mismo orden que los arrays españoles)
    OVERLAYS.forEach((o, i) => { const t = (locCfg.overlays || [])[i]; if (!t) return; if (o.kind === "stat") { if (t.value) o.value = t.value; if (t.sub) o.sub = t.sub; } else if (t.text) o.text = t.text; });
    TAGS.forEach((g, i) => { const t = (locCfg.tags || [])[i]; if (t) { if (t.name) g.name = t.name; if (t.code) g.code = t.code; } });
    CHAPTERS.forEach((c, i) => { const t = (locCfg.chapters || [])[i]; if (t) c.label = t; });
    console.log(`     DOBLAJE ${LOC}: ${timing.length} párrafos sincronizados · ${OVERLAYS.length} rótulos`);
  } else {
    timeAt = await buildTimeAt(guion, total, path.join(ROOT, "out", "_align.json"));
  }''' % video,
)
assert "DOBLAJE" in cur, "no se pudo parchear timeAt"

cur = cur.replace(
    '  if (/^TITULO:/i.test(firstLine)) titulo = firstLine.replace(/^TITULO:/i, "").trim();',
    '  if (LOC && locCfg && locCfg.titulo) titulo = locCfg.titulo;\n  else if (/^TITULO:/i.test(firstLine)) titulo = firstLine.replace(/^TITULO:/i, "").trim();',
)
assert "locCfg.titulo" in cur, "no se pudo parchear el título"

open(f"scripts/build-video.{video}.mjs", "w", encoding="utf-8").write(cur)
print("OK -> scripts/build-video.%s.mjs" % video)
