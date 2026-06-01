export async function onRequestGet({ env }) {
  const ts = await env.DB.prepare(
    "SELECT id, done, owner, updated_by AS by, updated_at AS at FROM task_state"
  ).all();
  const done = ts.results.filter(r => r.done === 1).map(r => ({ id: r.id, by: r.by, at: r.at }));
  const owners = {};
  ts.results.forEach(r => { if (r.owner !== null && r.owner !== undefined) owners[r.id] = r.owner; });

  const gs = await env.DB.prepare("SELECT id, val FROM gate_state").all();
  const gate = {};
  gs.results.forEach(r => { gate[r.id] = r.val; });

  const ks = await env.DB.prepare(
    "SELECT id, client, kw, note, primary_flag FROM keyword_state"
  ).all();
  const keywords = {};
  ks.results.forEach(r => { keywords[r.id] = { client: r.client, kw: r.kw, note: r.note, primary: r.primary_flag }; });

  return Response.json({ done, owners, gate, keywords }, { headers: { "Cache-Control": "no-store" } });
}
